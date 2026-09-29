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

// === Telegram error codes ===
test('TG_ACCESS on HTTP 403', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: false, status: 403, json: async () => ({ ok: false, error_code: 403 }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_ACCESS');
  assert.deepEqual(loggedArgs, [['TG_ACCESS']]);
});

test('TG_RATE_LIMIT on HTTP 429', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: false, status: 429, json: async () => ({ ok: false, error_code: 429 }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_RATE_LIMIT');
  assert.deepEqual(loggedArgs, [['TG_RATE_LIMIT']]);
});

test('TG_CHAT_NOT_FOUND on 400 with chat not found', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: false, status: 400, json: async () => ({ ok: false, error_code: 400, description: 'Bad Request: chat not found' }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_CHAT_NOT_FOUND');
  assert.deepEqual(loggedArgs, [['TG_CHAT_NOT_FOUND']]);
});

test('TG_CHAT_MIGRATED when migrate_to_chat_id present', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: false, status: 400, json: async () => ({ ok: false, parameters: { migrate_to_chat_id: -123456 } }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_CHAT_MIGRATED');
  assert.deepEqual(loggedArgs, [['TG_CHAT_MIGRATED']]);
});

test('TG_TOKEN_FORMAT on HTTP 404', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: false, status: 404, json: async () => ({ ok: false, error_code: 404 }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_TOKEN_FORMAT');
  assert.deepEqual(loggedArgs, [['TG_TOKEN_FORMAT']]);
});

test('TG_REJECTED as fallback for unknown Telegram error', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: false, status: 418, json: async () => ({ ok: false, error_code: 418 }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_REJECTED');
  assert.deepEqual(loggedArgs, [['TG_REJECTED']]);
});

// === Invalid JSON, empty body, JSON null ===
test('handles invalid JSON response from Telegram', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => { throw new SyntaxError('Unexpected token'); } }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_REJECTED');
  assert.deepEqual(loggedArgs, [['TG_REJECTED']]);
});

test('handles empty response body from Telegram', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => { throw new SyntaxError('Unexpected end of JSON input'); } }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_REJECTED');
  assert.deepEqual(loggedArgs, [['TG_REJECTED']]);
});

test('handles JSON null from Telegram', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => null }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_REJECTED');
  assert.deepEqual(loggedArgs, [['TG_REJECTED']]);
});

// === Timeout/network errors on fetch and body read ===
test('TG_TIMEOUT on TimeoutError', async t => {
  const loggedArgs = [];
  const timeoutError = new Error('timeout'); timeoutError.name = 'TimeoutError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => { throw timeoutError; } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_TIMEOUT');
  assert.deepEqual(loggedArgs, [['TG_TIMEOUT']]);
});

test('TG_NETWORK_OR_RESPONSE on AbortError when signal not aborted', async t => {
  const loggedArgs = [];
  const abortError = new Error('aborted'); abortError.name = 'AbortError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => { throw abortError; } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_NETWORK_OR_RESPONSE');
  assert.deepEqual(loggedArgs, [['TG_NETWORK_OR_RESPONSE']]);
});

test('TG_TIMEOUT on AbortError when timeout signal is aborted with TimeoutError reason', async t => {
  const loggedArgs = [];
  const originalTimeout = AbortSignal.timeout;
  const abortedSignal = AbortSignal.abort(new DOMException('Test timeout', 'TimeoutError'));
  t.after(() => { AbortSignal.timeout = originalTimeout; });
  AbortSignal.timeout = () => abortedSignal;
  const abortError = new Error('aborted'); abortError.name = 'AbortError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => { throw abortError; } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_TIMEOUT');
  assert.deepEqual(loggedArgs, [['TG_TIMEOUT']]);
});

test('TG_NETWORK_OR_RESPONSE on AbortError when signal aborted with non-timeout reason', async t => {
  const loggedArgs = [];
  const originalTimeout = AbortSignal.timeout;
  const abortedSignal = AbortSignal.abort(new Error('Manual abort'));
  t.after(() => { AbortSignal.timeout = originalTimeout; });
  AbortSignal.timeout = () => abortedSignal;
  const abortError = new Error('aborted'); abortError.name = 'AbortError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => { throw abortError; } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_NETWORK_OR_RESPONSE');
  assert.deepEqual(loggedArgs, [['TG_NETWORK_OR_RESPONSE']]);
});

test('TG_NETWORK_OR_RESPONSE on DNS/network failure', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => { throw new TypeError('fetch failed'); } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_NETWORK_OR_RESPONSE');
  assert.deepEqual(loggedArgs, [['TG_NETWORK_OR_RESPONSE']]);
});

// === response.json() errors ===
test('TG_TIMEOUT when response.json() throws TimeoutError', async t => {
  const loggedArgs = [];
  const timeoutError = new Error('timeout'); timeoutError.name = 'TimeoutError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => { throw timeoutError; } }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_TIMEOUT');
  assert.deepEqual(loggedArgs, [['TG_TIMEOUT']]);
});

test('TG_NETWORK_OR_RESPONSE when response.json() throws AbortError without signal aborted', async t => {
  const loggedArgs = [];
  const abortError = new Error('aborted'); abortError.name = 'AbortError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => { throw abortError; } }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_NETWORK_OR_RESPONSE');
  assert.deepEqual(loggedArgs, [['TG_NETWORK_OR_RESPONSE']]);
});

test('TG_TIMEOUT when response.json() throws AbortError with signal aborted and TimeoutError reason', async t => {
  const loggedArgs = [];
  const originalTimeout = AbortSignal.timeout;
  const abortedSignal = AbortSignal.abort(new DOMException('Test timeout', 'TimeoutError'));
  t.after(() => { AbortSignal.timeout = originalTimeout; });
  AbortSignal.timeout = () => abortedSignal;
  const abortError = new Error('aborted'); abortError.name = 'AbortError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => { throw abortError; } }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_TIMEOUT');
  assert.deepEqual(loggedArgs, [['TG_TIMEOUT']]);
});

test('TG_NETWORK_OR_RESPONSE when response.json() throws AbortError with signal aborted but non-timeout reason', async t => {
  const loggedArgs = [];
  const originalTimeout = AbortSignal.timeout;
  const abortedSignal = AbortSignal.abort(new Error('Manual abort'));
  t.after(() => { AbortSignal.timeout = originalTimeout; });
  AbortSignal.timeout = () => abortedSignal;
  const abortError = new Error('aborted'); abortError.name = 'AbortError';
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => ({ ok: true, json: async () => { throw abortError; } }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.equal((await r.json()).code, 'TG_NETWORK_OR_RESPONSE');
  assert.deepEqual(loggedArgs, [['TG_NETWORK_OR_RESPONSE']]);
});

// === logError isolation ===
test('logError throwing synchronously does not break response', async t => {
  const f = await fixture(t, { logError: () => { throw new Error('sync log failure'); }, fetchImpl: async () => ({ ok: false, status: 500, json: async () => ({ ok: false }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.ok((await r.json()).code);
});

test('logError returning rejected Promise does not break response', async t => {
  const f = await fixture(t, { logError: async () => { throw new Error('async log failure'); }, fetchImpl: async () => ({ ok: false, status: 500, json: async () => ({ ok: false }) }) });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.ok((await r.json()).code);
});

test('logError failure in catch block does not break response', async t => {
  const f = await fixture(t, { logError: () => { throw new Error('sync log failure'); }, fetchImpl: async () => { throw new Error('network'); } });
  const r = await f.request();
  assert.equal(r.status, 502);
  assert.ok((await r.json()).code);
});

// === No leakage of private data ===
test('no token/chatId/message leakage in response or logs', async t => {
  const loggedArgs = [];
  const f = await fixture(t, { logError: (...args) => loggedArgs.push(args), fetchImpl: async () => { throw new Error('test-secret test-chat private'); } });
  const r = await f.request();
  assert.equal(r.status, 502);
  const body = await r.json();
  assert.doesNotMatch(JSON.stringify(body), /test-secret|test-chat|private/);
  assert.doesNotMatch(JSON.stringify(loggedArgs), /test-secret|test-chat|private/);
  assert.deepEqual(loggedArgs, [['TG_NETWORK_OR_RESPONSE']]);
});

// === Trim token and chatId ===
test('trims whitespace from token and chatId', async t => {
  const sent = [];
  const handler = (await import('./contact.mjs')).createContactHandler({
    token: '  trimmed-token  ',
    chatId: '  trimmed-chat  ',
    fetchImpl: async (url, options) => {
      sent.push({ url, body: JSON.parse(options.body) });
      return { ok: true, json: async () => ({ ok: true }) };
    }
  });
  const server = (await import('node:http')).createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid) });
  assert.equal(r.status, 200);
  assert.match(sent[0].url, /trimmed-token/);
  assert.doesNotMatch(sent[0].url, /\s/);
  assert.equal(sent[0].body.chat_id, 'trimmed-chat');
});

// === telegramErrorCode edge cases ===
import { telegramErrorCode } from './telegram-error.mjs';

test('telegramErrorCode handles null and undefined result', async t => {
  assert.equal(telegramErrorCode(500, null), 'TG_REJECTED');
  assert.equal(telegramErrorCode(500, undefined), 'TG_REJECTED');
});

test('telegramErrorCode handles primitives as result', async t => {
  assert.equal(telegramErrorCode(500, 'string'), 'TG_REJECTED');
  assert.equal(telegramErrorCode(500, 123), 'TG_REJECTED');
  assert.equal(telegramErrorCode(500, true), 'TG_REJECTED');
});

test('telegramErrorCode handles arrays as result', async t => {
  assert.equal(telegramErrorCode(500, []), 'TG_REJECTED');
  assert.equal(telegramErrorCode(500, [{ ok: false }]), 'TG_REJECTED');
});

test('telegramErrorCode handles description of wrong type', async t => {
  assert.equal(telegramErrorCode(400, { ok: false, description: 123 }), 'TG_REJECTED');
  assert.equal(telegramErrorCode(400, { ok: false, description: null }), 'TG_REJECTED');
  assert.equal(telegramErrorCode(400, { ok: false, description: { text: 'chat not found' } }), 'TG_REJECTED');
});

test('telegramErrorCode priority: error_code overrides HTTP status', async t => {
  // HTTP 200 but error_code 401 -> TG_AUTH
  assert.equal(telegramErrorCode(200, { ok: false, error_code: 401 }), 'TG_AUTH');
  // HTTP 500 but error_code 429 -> TG_RATE_LIMIT
  assert.equal(telegramErrorCode(500, { ok: false, error_code: 429 }), 'TG_RATE_LIMIT');
});

test('telegramErrorCode: conflicting HTTP status and error_code', async t => {
  // HTTP 401 but error_code 403 -> TG_ACCESS (error_code wins)
  assert.equal(telegramErrorCode(401, { ok: false, error_code: 403 }), 'TG_ACCESS');
  // HTTP 403 but error_code 401 -> TG_AUTH (error_code wins)
  assert.equal(telegramErrorCode(403, { ok: false, error_code: 401 }), 'TG_AUTH');
});
