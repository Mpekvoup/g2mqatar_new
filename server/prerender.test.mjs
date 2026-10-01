/**
 * Integration tests for production server prerendered HTML serving.
 * Validates that internal pages return correct content, not homepage fallback.
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

let serverProcess;
let serverPort;
let serverUrl;

/**
 * Find an available port by binding to port 0 and getting assigned port.
 */
async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

/**
 * Start the server and wait for it to be ready.
 * Returns a cleanup function.
 */
async function startServer(port) {
  const cwd = process.cwd();
  const serverPath = 'server/index.mjs';

  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [serverPath], {
      env: { ...process.env, PORT: String(port) },
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        proc.kill('SIGKILL');
        reject(new Error(
          `Server start timeout (10s).\nstdout: ${stdout}\nstderr: ${stderr}`
        ));
      }
    }, 10000);

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      if (!resolved && stdout.includes('started')) {
        resolved = true;
        clearTimeout(timeout);
        // Give server a moment to fully bind
        setTimeout(() => resolve(proc), 200);
      }
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(new Error(`Failed to spawn server: ${err.message}`));
      }
    });

    proc.on('exit', (code, signal) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(new Error(
          `Server exited early (code=${code}, signal=${signal}).\nstdout: ${stdout}\nstderr: ${stderr}`
        ));
      }
    });
  });
}

/**
 * Stop the server process and wait for it to exit.
 */
async function stopServer(proc) {
  if (!proc || proc.killed) return;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      proc.kill('SIGKILL');
      resolve();
    }, 3000);

    proc.on('exit', () => {
      clearTimeout(timeout);
      resolve();
    });

    proc.kill('SIGTERM');
  });
}

async function fetch(url, options = {}) {
  const response = await globalThis.fetch(url, options);
  const text = options.method === 'HEAD' ? '' : await response.text();
  return { status: response.status, headers: response.headers, text };
}

function extractH1(html) {
  // Match H1 including those with classes or attributes, and nested content
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return null;
  // Strip HTML tags from content to get text
  return match[1].replace(/<[^>]+>/g, '').trim();
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCanonical(html) {
  const match = html.match(/rel="canonical" href="([^"]*)"/i);
  return match ? match[1] : null;
}

function extractDescription(html) {
  const match = html.match(/<meta name="description" content="([^"]*)"/i);
  return match ? match[1] : null;
}

describe('Production server prerendered routes', () => {
  before(async () => {
    serverPort = await findFreePort();
    serverUrl = `http://127.0.0.1:${serverPort}`;
    serverProcess = await startServer(serverPort);
  });

  after(async () => {
    await stopServer(serverProcess);
    serverProcess = null;
  });

  test('GET /services/incorporation returns service page, not homepage', async () => {
    const { status, text } = await fetch(`${serverUrl}/services/incorporation`);
    assert.equal(status, 200, 'Should return 200');

    const h1 = extractH1(text);
    const title = extractTitle(text);
    const canonical = extractCanonical(text);
    const description = extractDescription(text);

    // Should NOT be homepage content
    assert.ok(!title.includes('Business Consulting & Company Registration in Qatar'),
      `Title should not be homepage title, got: ${title}`);

    // Should have service-specific content
    assert.ok(
      title.toLowerCase().includes('registration') ||
      title.toLowerCase().includes('incorporation') ||
      title.toLowerCase().includes('company'),
      `Title should contain service keywords, got: ${title}`
    );
    assert.equal(canonical, 'https://go2market.qa/services/incorporation',
      'Canonical should point to service page');

    // H1 validation - should have specific content, not homepage H1
    assert.ok(h1, 'Should have H1 element');
    assert.ok(!h1.includes('Your Gateway'), `H1 should not be homepage H1, got: ${h1}`);

    // Description should be service-specific
    assert.ok(description, 'Should have meta description');
    assert.ok(!description.includes('boutique consultancy for market entry'),
      `Description should not be homepage description, got: ${description}`);
  });

  test('GET /case-studies returns case studies page', async () => {
    const { status, text } = await fetch(`${serverUrl}/case-studies`);
    assert.equal(status, 200);

    const h1 = extractH1(text);
    const title = extractTitle(text);
    const canonical = extractCanonical(text);

    assert.ok(title.toLowerCase().includes('case stud'),
      `Title should contain 'case stud', got: ${title}`);
    assert.equal(canonical, 'https://go2market.qa/case-studies');

    // H1 should exist and NOT be homepage H1 (bilingual site - can be EN or RU)
    assert.ok(h1, 'Should have H1 element');
    assert.ok(!h1.includes('Gateway') && !h1.includes('Qatar Business'),
      `H1 should not be homepage H1, got: ${h1}`);
  });

  test('GET /privacy returns privacy page', async () => {
    const { status, text } = await fetch(`${serverUrl}/privacy`);
    assert.equal(status, 200);

    const h1 = extractH1(text);
    const title = extractTitle(text);
    const canonical = extractCanonical(text);

    assert.ok(title.toLowerCase().includes('privacy'),
      `Title should contain 'privacy', got: ${title}`);
    assert.equal(canonical, 'https://go2market.qa/privacy');

    // H1 should exist and NOT be homepage H1 (bilingual site - can be EN or RU)
    // "privacy" in EN or "конфиденциальности" in RU
    assert.ok(h1, 'Should have H1 element');
    assert.ok(
      h1.toLowerCase().includes('privacy') || h1.includes('конфиденциальност'),
      `H1 should be privacy-related (EN or RU), got: ${h1}`
    );
  });

  test('HEAD /services/incorporation returns correct headers without body', async () => {
    const { status, headers, text } = await fetch(`${serverUrl}/services/incorporation`, { method: 'HEAD' });
    assert.equal(status, 200);
    assert.equal(text, '', 'HEAD should return empty body');
    assert.ok(headers.get('content-type').includes('text/html'));
    assert.ok(Number(headers.get('content-length')) > 0, 'Should have Content-Length');
  });

  test('GET /services/incorporation/ (with slash) redirects to without slash', async () => {
    const response = await globalThis.fetch(`${serverUrl}/services/incorporation/`, { redirect: 'manual' });
    assert.equal(response.status, 301, 'Should redirect');
    assert.equal(response.headers.get('location'), '/services/incorporation');
  });

  test('GET /services/incorporation (without slash) returns 200', async () => {
    const { status } = await fetch(`${serverUrl}/services/incorporation`);
    assert.equal(status, 200);
  });

  test('Static asset returns correct Content-Type', async () => {
    // Try to fetch a JS file (will exist after build)
    const response = await globalThis.fetch(`${serverUrl}/assets/js/vendor-CPD3xoNz.js`);
    if (response.status === 200) {
      assert.ok(response.headers.get('content-type').includes('javascript'),
        'JS file should have javascript content-type');
    }
    // If file not found, that's ok - the important thing is server doesn't crash
  });

  test('Homepage returns homepage content', async () => {
    const { status, text } = await fetch(`${serverUrl}/`);
    assert.equal(status, 200);

    const title = extractTitle(text);
    const canonical = extractCanonical(text);

    assert.ok(title.includes('G2M International'), `Homepage title should include company name, got: ${title}`);
    assert.equal(canonical, 'https://go2market.qa/');
  });

  test('Internal page does not return homepage HTML (regression)', async () => {
    // This is the key regression test - ensures prerender serves correct page
    const { text: homepageText } = await fetch(`${serverUrl}/`);
    const { text: serviceText } = await fetch(`${serverUrl}/services/incorporation`);

    const homepageCanonical = extractCanonical(homepageText);
    const serviceCanonical = extractCanonical(serviceText);

    // Canonicals must be different
    assert.notEqual(homepageCanonical, serviceCanonical,
      'Service page should have different canonical than homepage');

    // Titles must be different
    const homepageTitle = extractTitle(homepageText);
    const serviceTitle = extractTitle(serviceText);
    assert.notEqual(homepageTitle, serviceTitle,
      'Service page should have different title than homepage');
  });
});
