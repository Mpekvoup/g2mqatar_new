import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createContactHandler } from './contact.mjs';

const valid = { name: 'Тест <b>name</b>', contact: 'test@example.com', region: 'qatar', message: 'Проверка <tag> & text' };

async function fixture(t, overrides = {}) {
  const sent = [];
  const handler = createContactHandler({ token: 'test-secret', chatId: 'test-chat', fetchImpl: async (url, options) => {
    sent.push({ url, body: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ ok: true, result: { private: 'never returned' } }) };
  }, ...overrides });
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;
  return { sent, request: (data = valid, options = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), ...options }) };
}

test('accepts formatted and pasted phones without accepting arbitrary text', async t => {
  const f = await fixture(t);
  for (const contact of ['+7 (777) 123-45-67', '+7 (777) 123–45–67', '\u200e+974 1234 5678\u200f', '+٩٧٤ ١٢٣٤ ٥٦٧٨', ' name@example.com ']) {
    assert.equal((await f.request({ ...valid, contact })).status, 200, contact);
  }
  for (const contact of ['abc', '123', '@username']) assert.equal((await f.request({ ...valid, contact })).status, 400);
});

test('delivers Unicode as plain text and returns only success', async t => {
  const f = await fixture(t);
  const r = await f.request();
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true });
  assert.match(f.sent[0].body.text, /Проверка <tag> & text/);
  assert.equal(f.sent[0].body.parse_mode, undefined);
});

test('rejects malformed contacts, whitespace, long fields and invalid JSON', async t => {
  const f = await fixture(t);
  for (const data of [{ ...valid, contact: 'abc' }, { ...valid, name: '  ' }, { ...valid, message: 'x'.repeat(2501) }, null]) {
    assert.equal((await f.request(data)).status, 400);
  }
  assert.equal((await f.request(valid, { body: '{' })).status, 400);
  assert.equal((await f.request(valid, { body: 'x'.repeat(17000) })).status, 413);
  assert.equal(f.sent.length, 0);
});

test('rejects missing configuration and unsupported methods', async t => {
  const f = await fixture(t, { token: '' });
  assert.equal((await f.request()).status, 503);
  assert.equal((await f.request(valid, { method: 'GET', body: undefined })).status, 405);
});

test('hides upstream failures and secrets', async t => {
  const f = await fixture(t, { fetchImpl: async () => { throw new Error('test-secret'); } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.doesNotMatch(await r.text(), /test-secret/);
});

test('rejects Telegram ok:false even with HTTP 200', async t => {
  const f = await fixture(t, { fetchImpl: async () => ({ ok: true, json: async () => ({ ok: false }) }) });
  assert.equal((await f.request()).status, 502);
});

test('reports safe authentication failure without exposing upstream details', async t => {
  const logs = [];
  const f = await fixture(t, { logError: code => logs.push(code), fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ ok: false, error_code: 401, description: 'private upstream details test-secret' }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  const body = await r.json();
  assert.equal(body.code, 'TG_AUTH');
  assert.deepEqual(logs, ['TG_AUTH']);
  assert.doesNotMatch(JSON.stringify(body), /test-secret|private upstream/);
});

test('rate limits requests without trusting forwarded headers', async t => {
  const f = await fixture(t);
  for (let i = 0; i < 10; i++) assert.equal((await f.request()).status, 200);
  assert.equal((await f.request(valid, { headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': 'different' } })).status, 429);
  assert.equal(f.sent.length, 10);
});

// === Old payload without context still works ===
test('accepts old payload without context', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid });
  assert.equal(r.status, 200);
  const text = f.sent[0].body.text;
  assert.match(text, /Name: Тест/);
  assert.doesNotMatch(text, /Direction:/);
});

// === Valid context tests ===
test('accepts valid context and shows human-readable direction', async t => {
  const f = await fixture(t);
  const context = {
    leadType: 'investment_qatar',
    language: 'ru',
    sourcePage: '/',
    serviceSlug: 'incorporation',
    referrer: 'google.com',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'spring2026'
  };
  const r = await f.request({ ...valid, context });
  assert.equal(r.status, 200);
  const text = f.sent[0].body.text;
  // Human-readable label
  assert.match(text, /Direction: Invest in Qatar/);
  assert.match(text, /Page: \//);
  assert.match(text, /Language: ru/);
  assert.match(text, /Service: incorporation/);
  assert.match(text, /Referrer: google\.com/);
  assert.match(text, /UTM: src=google \| med=cpc \| cmp=spring2026/);
  // Plain text, no parse_mode
  assert.equal(f.sent[0].body.parse_mode, undefined);
});

test('shows correct labels for all lead types', async t => {
  const f = await fixture(t);
  const types = [
    ['general', 'General Enquiry'],
    ['company_formation', 'Company Formation'],
    ['reach_clients', 'Reach Your Clients'],
    ['investment_qatar', 'Invest in Qatar'],
  ];
  for (const [type, label] of types) {
    const r = await f.request({ ...valid, context: { leadType: type, language: 'en', sourcePage: '/' } });
    assert.equal(r.status, 200, type);
    assert.match(f.sent.at(-1).body.text, new RegExp(`Direction: ${label}`), type);
  }
});

// === Invalid leadType ===
test('rejects invalid context.leadType', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'invalid', language: 'en', sourcePage: '/' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.leadType' });
});

// === Invalid language ===
test('rejects invalid context.language', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'de', sourcePage: '/' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.language' });
});

// === sourcePage validation ===
test('rejects absolute URL in sourcePage', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: 'https://evil.com' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.sourcePage' });
});

test('rejects protocol-relative URL in sourcePage', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '//evil.com' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.sourcePage' });
});

test('rejects query string in sourcePage', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/page?secret=value' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.sourcePage' });
});

test('rejects hash in sourcePage', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/page#section' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.sourcePage' });
});

test('rejects empty sourcePage', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.sourcePage' });
});

// === serviceSlug validation ===
test('rejects invalid serviceSlug format', async t => {
  const f = await fixture(t);
  for (const slug of ['UPPERCASE', 'with spaces', 'with_underscore', '../path', 'a'.repeat(101)]) {
    const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/', serviceSlug: slug } });
    assert.equal(r.status, 400, slug);
    assert.deepEqual(await r.json(), { error: 'Invalid context.serviceSlug' }, slug);
  }
});

test('accepts valid serviceSlug', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/', serviceSlug: 'b2b-lead-generation' } });
  assert.equal(r.status, 200);
  assert.match(f.sent[0].body.text, /Service: b2b-lead-generation/);
});

// === Oversized fields ===
test('rejects oversized context fields', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/', utmSource: 'x'.repeat(201) } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.utmSource' });
});

// === Control characters ===
test('rejects control characters in UTM fields', async t => {
  const f = await fixture(t);
  for (const field of ['utmSource', 'utmMedium', 'utmCampaign']) {
    const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/', [field]: 'value\ninjected' } });
    assert.equal(r.status, 400, field);
    assert.deepEqual(await r.json(), { error: `Invalid context.${field}` }, field);
  }
});

test('rejects control characters in sourcePage', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/page\r\ninjected' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.sourcePage' });
});

// === Context type validation ===
test('rejects string context', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: 'not an object' });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context' });
});

test('rejects array context', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: ['array'] });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context' });
});

test('rejects null context', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: null });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context' });
});

// === referrer validation ===
test('rejects referrer with path', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/', referrer: 'google.com/path' } });
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'Invalid context.referrer' });
});

test('accepts valid hostname referrer', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/', referrer: 'facebook.com' } });
  assert.equal(r.status, 200);
  assert.match(f.sent[0].body.text, /Referrer: facebook\.com/);
});

// === Missing optional fields don't show as undefined ===
test('does not show undefined or null for missing optional fields', async t => {
  const f = await fixture(t);
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/' } });
  assert.equal(r.status, 200);
  const text = f.sent[0].body.text;
  assert.doesNotMatch(text, /undefined/);
  assert.doesNotMatch(text, /null/);
  assert.doesNotMatch(text, /Service:/);
  assert.doesNotMatch(text, /Referrer:/);
  assert.doesNotMatch(text, /UTM:/);
});

// === Telegram errors don't leak ===
test('does not expose Telegram errors to client', async t => {
  const f = await fixture(t, { fetchImpl: async () => ({ ok: false, status: 500, json: async () => ({ ok: false, description: 'internal secret' }) }) });
  const r = await f.request({ ...valid, context: { leadType: 'general', language: 'en', sourcePage: '/' } });
  assert.equal(r.status, 502);
  const body = await r.json();
  assert.doesNotMatch(JSON.stringify(body), /internal secret/);
});
