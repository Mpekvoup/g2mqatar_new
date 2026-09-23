import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { contactApiPlugin } from './vite-contact.mjs';

// Transpile lead-context module
const leadContextSource = await readFile(new URL('../src/lead-context.ts', import.meta.url), 'utf8');
const leadContextCode = ts.transpileModule(leadContextSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace(/from ['"]\.\.\/types['"];?/, 'from "data:text/javascript,export {}";'); // Mock types import

const source = await readFile(new URL('../src/contact-client.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { postContact } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
for (const [label, status, body, expected] of [
  ['empty proxy error', 500, '', /HTTP 500/],
  ['HTML response', 200, '<html>fallback</html>', /HTTP 200/],
  ['missing config', 503, '{"error":"Contact service is not configured"}', /temporarily unavailable/],
  ['invalid contact', 400, '{"error":"Invalid contact"}', /valid phone/],
  ['null JSON', 200, 'null', /HTTP 200/],
]) {
  test(label, async t => {
    t.mock.method(globalThis, 'fetch', async () => new Response(body, { status }));
    await assert.rejects(postContact({}, 'en'), expected);
  });
}
test('accepts explicit server success', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"ok":true}'));
  assert.deepEqual(await postContact({}, 'en'), { ok: true });
});
test('Vite mounts the API without a standalone server', async () => {
  let middleware;
  contactApiPlugin({}).configureServer({ middlewares: { use(handler) { middleware = handler; } } });
  const response = { writeHead(status, headers) { this.status = status; this.headers = headers; }, end(body) { this.body = body; } };
  middleware({ url: '/api/contact', method: 'POST' }, response, () => assert.fail('API fell through to HTML'));
  assert.equal(response.status, 503);
  assert.match(response.headers['Content-Type'], /json/);
  assert.equal(JSON.parse(response.body).error, 'Contact service is not configured');
});

// Lead context tests with mocked browser APIs
test('collectLeadContext returns minimal context without browser APIs', async () => {
  // Without window/document, it returns defaults
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode).toString('base64')}`);
  const ctx = collectLeadContext({ leadType: 'general', language: 'en' });
  assert.equal(ctx.leadType, 'general');
  assert.equal(ctx.language, 'en');
  assert.equal(ctx.sourcePage, '/');
  assert.equal(ctx.referrer, undefined);
  assert.equal(ctx.utmSource, undefined);
});

test('collectLeadContext collects UTM params from URL', async () => {
  // Mock window and sessionStorage
  const mockStorage = new Map();
  globalThis.window = {
    location: {
      pathname: '/services/incorporation',
      search: '?utm_source=google&utm_medium=cpc&utm_campaign=spring',
      hostname: 'go2market.qa'
    }
  };
  globalThis.sessionStorage = {
    getItem: k => mockStorage.get(k),
    setItem: (k, v) => mockStorage.set(k, v)
  };

  // Re-import to pick up mocked globals
  const freshCode = leadContextCode + `\n//refresh-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const ctx = collectLeadContext({ leadType: 'company_formation', language: 'ru', serviceSlug: 'incorporation' });

  assert.equal(ctx.leadType, 'company_formation');
  assert.equal(ctx.language, 'ru');
  assert.equal(ctx.sourcePage, '/services/incorporation');
  assert.equal(ctx.serviceSlug, 'incorporation');
  assert.equal(ctx.utmSource, 'google');
  assert.equal(ctx.utmMedium, 'cpc');
  assert.equal(ctx.utmCampaign, 'spring');

  // Verify UTM was saved to sessionStorage
  const stored = JSON.parse(mockStorage.get('g2m_utm'));
  assert.equal(stored.utmSource, 'google');

  // Cleanup
  delete globalThis.window;
  delete globalThis.sessionStorage;
});
