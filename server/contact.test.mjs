import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createContactHandler } from './contact.mjs';

const valid = { name: 'Тест <b>name</b>', contact: 'test@example.com', region: 'qatar', message: 'Проверка <tag> & text' };
test('accepts formatted and pasted phones without accepting arbitrary text', async t => {
  const f = await fixture(t);
  for (const contact of ['+7 (777) 123-45-67', '+7 (777) 123–45–67', '\u200e+974 1234 5678\u200f', '+٩٧٤ ١٢٣٤ ٥٦٧٨', ' name@example.com ']) {
    assert.equal((await f.request({ ...valid, contact })).status, 200, contact);
  }
  for (const contact of ['abc', '123', '@username']) assert.equal((await f.request({ ...valid, contact })).status, 400);
});
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
