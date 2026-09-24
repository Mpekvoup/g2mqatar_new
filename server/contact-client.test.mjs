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

// === postContact error handling tests ===
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

// === resolveLeadType tests ===
test('resolveLeadType returns general for /', async t => {
  const { resolveLeadType } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode).toString('base64')}`);
  assert.equal(resolveLeadType('/'), 'general');
});

test('resolveLeadType returns company_formation for /services/incorporation', async t => {
  const { resolveLeadType } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//2').toString('base64')}`);
  assert.equal(resolveLeadType('/services/incorporation'), 'company_formation');
});

test('resolveLeadType returns reach_clients for /services/b2b-lead-generation', async t => {
  const { resolveLeadType } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//3').toString('base64')}`);
  assert.equal(resolveLeadType('/services/b2b-lead-generation'), 'reach_clients');
});

test('resolveLeadType returns reach_clients for /services/business-matchmaking', async t => {
  const { resolveLeadType } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//4').toString('base64')}`);
  assert.equal(resolveLeadType('/services/business-matchmaking'), 'reach_clients');
});

test('resolveLeadType returns general for unknown paths', async t => {
  const { resolveLeadType } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//5').toString('base64')}`);
  assert.equal(resolveLeadType('/case-studies'), 'general');
  assert.equal(resolveLeadType('/privacy'), 'general');
});

// === resolveServiceSlug tests ===
test('resolveServiceSlug returns slug for service pages', async t => {
  const { resolveServiceSlug } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//6').toString('base64')}`);
  assert.equal(resolveServiceSlug('/services/incorporation'), 'incorporation');
  assert.equal(resolveServiceSlug('/services/b2b-lead-generation'), 'b2b-lead-generation');
  assert.equal(resolveServiceSlug('/services/business-matchmaking'), 'business-matchmaking');
});

test('resolveServiceSlug returns undefined for non-service pages', async t => {
  const { resolveServiceSlug } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//7').toString('base64')}`);
  assert.equal(resolveServiceSlug('/'), undefined);
  assert.equal(resolveServiceSlug('/case-studies'), undefined);
});

// === collectLeadContext without browser APIs ===
test('collectLeadContext returns minimal context without browser APIs', async t => {
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(leadContextCode + '\n//8').toString('base64')}`);
  const ctx = collectLeadContext({ language: 'en' });
  assert.equal(ctx.leadType, 'general');
  assert.equal(ctx.language, 'en');
  assert.equal(ctx.sourcePage, '/');
  assert.equal(ctx.referrer, undefined);
  assert.equal(ctx.utmSource, undefined);
  assert.equal(ctx.serviceSlug, undefined);
});

// === UTM collection and persistence ===
test('collectLeadContext collects UTM params from URL and saves to sessionStorage', async t => {
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
  t.after(() => {
    delete globalThis.window;
    delete globalThis.sessionStorage;
  });

  const freshCode = leadContextCode + `\n//utm-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const ctx = collectLeadContext({ language: 'ru' });

  // Auto-detected leadType and serviceSlug
  assert.equal(ctx.leadType, 'company_formation');
  assert.equal(ctx.serviceSlug, 'incorporation');
  assert.equal(ctx.language, 'ru');
  assert.equal(ctx.sourcePage, '/services/incorporation');
  assert.equal(ctx.utmSource, 'google');
  assert.equal(ctx.utmMedium, 'cpc');
  assert.equal(ctx.utmCampaign, 'spring');

  // Verify UTM was saved to sessionStorage
  const stored = JSON.parse(mockStorage.get('g2m_utm'));
  assert.equal(stored.utmSource, 'google');
});

test('collectLeadContext uses stored UTM when URL has no UTM params', async t => {
  const mockStorage = new Map();
  mockStorage.set('g2m_utm', JSON.stringify({ utmSource: 'stored-source', utmMedium: 'stored-medium' }));
  globalThis.window = {
    location: {
      pathname: '/',
      search: '',
      hostname: 'go2market.qa'
    }
  };
  globalThis.sessionStorage = {
    getItem: k => mockStorage.get(k),
    setItem: (k, v) => mockStorage.set(k, v)
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.sessionStorage;
  });

  const freshCode = leadContextCode + `\n//stored-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const ctx = collectLeadContext({ language: 'en' });

  assert.equal(ctx.utmSource, 'stored-source');
  assert.equal(ctx.utmMedium, 'stored-medium');
});

test('new UTM params replace stored values', async t => {
  const mockStorage = new Map();
  mockStorage.set('g2m_utm', JSON.stringify({ utmSource: 'old-source' }));
  globalThis.window = {
    location: {
      pathname: '/',
      search: '?utm_source=new-source',
      hostname: 'go2market.qa'
    }
  };
  globalThis.sessionStorage = {
    getItem: k => mockStorage.get(k),
    setItem: (k, v) => mockStorage.set(k, v)
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.sessionStorage;
  });

  const freshCode = leadContextCode + `\n//replace-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const ctx = collectLeadContext({ language: 'en' });

  assert.equal(ctx.utmSource, 'new-source');
  const stored = JSON.parse(mockStorage.get('g2m_utm'));
  assert.equal(stored.utmSource, 'new-source');
});

// === Referrer handling ===
test('internal referrer is not sent', async t => {
  globalThis.window = {
    location: {
      pathname: '/',
      search: '',
      hostname: 'go2market.qa'
    }
  };
  globalThis.document = {
    referrer: 'https://go2market.qa/services/incorporation'
  };
  globalThis.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
  });

  const freshCode = leadContextCode + `\n//internal-ref-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const ctx = collectLeadContext({ language: 'en' });

  assert.equal(ctx.referrer, undefined);
});

test('external referrer is sent as hostname only', async t => {
  globalThis.window = {
    location: {
      pathname: '/',
      search: '',
      hostname: 'go2market.qa'
    }
  };
  globalThis.document = {
    referrer: 'https://google.com/search?q=qatar+business'
  };
  globalThis.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
  });

  const freshCode = leadContextCode + `\n//external-ref-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const ctx = collectLeadContext({ language: 'en' });

  assert.equal(ctx.referrer, 'google.com');
});

// === Explicit leadType override ===
test('explicit leadType overrides auto-detection', async t => {
  globalThis.window = {
    location: {
      pathname: '/services/incorporation',
      search: '',
      hostname: 'go2market.qa'
    }
  };
  globalThis.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
  };
  t.after(() => {
    delete globalThis.window;
    delete globalThis.sessionStorage;
  });

  const freshCode = leadContextCode + `\n//override-${Date.now()}`;
  const { collectLeadContext } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);

  // Without override: auto-detected
  const ctx1 = collectLeadContext({ language: 'en' });
  assert.equal(ctx1.leadType, 'company_formation');

  // With override: explicit
  const ctx2 = collectLeadContext({ leadType: 'investment_qatar', language: 'en' });
  assert.equal(ctx2.leadType, 'investment_qatar');
});

// === Old payload without context still sends ===
test('postContact can send payload without context', async t => {
  let sentBody;
  t.mock.method(globalThis, 'fetch', async (url, opts) => {
    sentBody = JSON.parse(opts.body);
    return new Response('{"ok":true}');
  });

  await postContact({ name: 'Test', contact: 'test@test.com', region: 'qatar', message: 'Hello' }, 'en');

  assert.equal(sentBody.name, 'Test');
  assert.equal(sentBody.context, undefined);
});

// === getAttributionQueryString tests ===
test('getAttributionQueryString returns empty string without params', async t => {
  const freshCode = leadContextCode + `\n//attr-empty-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  assert.equal(getAttributionQueryString(''), '');
  assert.equal(getAttributionQueryString('?foo=bar'), '');
});

test('getAttributionQueryString forwards single UTM param', async t => {
  const freshCode = leadContextCode + `\n//attr-single-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  assert.equal(getAttributionQueryString('?utm_source=google'), '?utm_source=google');
});

test('getAttributionQueryString forwards all allowed params', async t => {
  const freshCode = leadContextCode + `\n//attr-all-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const result = getAttributionQueryString('?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_content=hero&utm_term=qatar&gclid=abc123&fbclid=fb456');
  const params = new URLSearchParams(result);
  assert.equal(params.get('utm_source'), 'google');
  assert.equal(params.get('utm_medium'), 'cpc');
  assert.equal(params.get('utm_campaign'), 'spring');
  assert.equal(params.get('utm_content'), 'hero');
  assert.equal(params.get('utm_term'), 'qatar');
  assert.equal(params.get('gclid'), 'abc123');
  assert.equal(params.get('fbclid'), 'fb456');
});

test('getAttributionQueryString filters out disallowed params', async t => {
  const freshCode = leadContextCode + `\n//attr-filter-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const result = getAttributionQueryString('?utm_source=google&secret=password&token=abc&utm_medium=cpc');
  const params = new URLSearchParams(result);
  assert.equal(params.get('utm_source'), 'google');
  assert.equal(params.get('utm_medium'), 'cpc');
  assert.equal(params.has('secret'), false);
  assert.equal(params.has('token'), false);
});

test('getAttributionQueryString encodes special characters', async t => {
  const freshCode = leadContextCode + `\n//attr-encode-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const result = getAttributionQueryString('?utm_source=google%20ads&utm_campaign=spring%26summer');
  const params = new URLSearchParams(result);
  assert.equal(params.get('utm_source'), 'google ads');
  assert.equal(params.get('utm_campaign'), 'spring&summer');
});

test('getAttributionQueryString skips empty values', async t => {
  const freshCode = leadContextCode + `\n//attr-empty-val-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const result = getAttributionQueryString('?utm_source=&utm_medium=cpc&utm_campaign=');
  assert.equal(result, '?utm_medium=cpc');
});

test('getAttributionQueryString is SSR-safe without window', async t => {
  const freshCode = leadContextCode + `\n//attr-ssr-${Date.now()}`;
  const { getAttributionQueryString } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  // Without window, should return empty string
  assert.equal(getAttributionQueryString(), '');
  // With explicit search param, should work
  assert.equal(getAttributionQueryString('?utm_source=test'), '?utm_source=test');
});

// === buildUrlWithAttribution tests ===
test('buildUrlWithAttribution returns base URL without params', async t => {
  const freshCode = leadContextCode + `\n//build-empty-${Date.now()}`;
  const { buildUrlWithAttribution } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  assert.equal(buildUrlWithAttribution('https://example.com/', ''), 'https://example.com/');
});

test('buildUrlWithAttribution appends attribution params', async t => {
  const freshCode = leadContextCode + `\n//build-append-${Date.now()}`;
  const { buildUrlWithAttribution } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const result = buildUrlWithAttribution('https://registration.go2market.qa/', '?utm_source=google&utm_campaign=spring');
  assert.equal(result, 'https://registration.go2market.qa/?utm_source=google&utm_campaign=spring');
});

test('buildUrlWithAttribution preserves existing query params in base URL', async t => {
  const freshCode = leadContextCode + `\n//build-preserve-${Date.now()}`;
  const { buildUrlWithAttribution } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  const result = buildUrlWithAttribution('https://example.com/?existing=value', '?utm_source=google');
  const url = new URL(result);
  assert.equal(url.searchParams.get('existing'), 'value');
  assert.equal(url.searchParams.get('utm_source'), 'google');
});

test('buildUrlWithAttribution does not overwrite existing params with same name', async t => {
  const freshCode = leadContextCode + `\n//build-no-overwrite-${Date.now()}`;
  const { buildUrlWithAttribution } = await import(`data:text/javascript;base64,${Buffer.from(freshCode).toString('base64')}`);
  // If base URL already has utm_source, attribution should not overwrite it
  const result = buildUrlWithAttribution('https://example.com/?utm_source=original', '?utm_source=new&utm_medium=cpc');
  const url = new URL(result);
  assert.equal(url.searchParams.get('utm_source'), 'original');
  assert.equal(url.searchParams.get('utm_medium'), 'cpc');
});
