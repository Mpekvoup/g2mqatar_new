/**
 * Integration tests for HTTP 404 handling (Task 10C.4)
 * Tests that unknown routes return HTTP 404 with proper content.
 */
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Find available port
function findPort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

// Start server and wait for ready
function startServer(port) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['server/index.mjs'], {
      cwd: root,
      env: { ...process.env, PORT: port },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        proc.kill();
        reject(new Error('Server start timeout'));
      }
    }, 10000);

    proc.stdout.on('data', (data) => {
      if (data.toString().includes('server started') && !started) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    });

    proc.stderr.on('data', (data) => {
      console.error('Server stderr:', data.toString());
    });

    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (!started) {
        clearTimeout(timeout);
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
}

// Make HTTP request
function request(port, pathname, method = 'GET', headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: pathname,
      method,
      headers,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function runTests() {
  const port = await findPort();
  console.log(`Starting server on port ${port}...`);

  const proc = await startServer(port);
  const results = [];

  try {
    // Test 1: Unknown route returns 404
    const unknown = await request(port, '/this-route-does-not-exist');
    results.push({
      test: 'Unknown route /this-route-does-not-exist',
      expected: 404,
      actual: unknown.status,
      pass: unknown.status === 404,
    });

    // Test 2: Unknown service returns 404
    const unknownService = await request(port, '/services/fake-service');
    results.push({
      test: 'Unknown service /services/fake-service',
      expected: 404,
      actual: unknownService.status,
      pass: unknownService.status === 404,
    });

    // Test 3: Unknown case study returns 404
    const unknownCase = await request(port, '/case-studies/fake-company');
    results.push({
      test: 'Unknown case study /case-studies/fake-company',
      expected: 404,
      actual: unknownCase.status,
      pass: unknownCase.status === 404,
    });

    // Test 4: Missing static asset returns 404
    const missingAsset = await request(port, '/assets/js/nonexistent.js');
    results.push({
      test: 'Missing asset /assets/js/nonexistent.js',
      expected: 404,
      actual: missingAsset.status,
      pass: missingAsset.status === 404,
    });

    // Test 5: Valid route returns 200
    const validRoute = await request(port, '/');
    results.push({
      test: 'Valid route /',
      expected: 200,
      actual: validRoute.status,
      pass: validRoute.status === 200,
    });

    // Test 6: Valid prerendered route returns 200
    const privacy = await request(port, '/privacy');
    results.push({
      test: 'Valid route /privacy',
      expected: 200,
      actual: privacy.status,
      pass: privacy.status === 200,
    });

    // Test 7: 404 response includes noindex
    results.push({
      test: '404 response includes noindex',
      expected: true,
      actual: unknown.body.includes('noindex'),
      pass: unknown.body.includes('noindex'),
    });

    // Test 8: 404 response includes Page Not Found
    results.push({
      test: '404 response includes "Page Not Found" or "404"',
      expected: true,
      actual: unknown.body.includes('Page not found') || unknown.body.includes('404'),
      pass: unknown.body.includes('Page not found') || unknown.body.includes('404'),
    });

    // Test 9: HEAD request for 404 returns 404 with no body
    const head404 = await request(port, '/unknown-route', 'HEAD');
    results.push({
      test: 'HEAD /unknown-route returns 404',
      expected: 404,
      actual: head404.status,
      pass: head404.status === 404,
    });
    results.push({
      test: 'HEAD 404 has no body',
      expected: 0,
      actual: head404.body.length,
      pass: head404.body.length === 0,
    });

    // Test 10: HEAD request for valid route returns 200 with no body
    const headValid = await request(port, '/privacy', 'HEAD');
    results.push({
      test: 'HEAD /privacy returns 200',
      expected: 200,
      actual: headValid.status,
      pass: headValid.status === 200,
    });
    results.push({
      test: 'HEAD /privacy has no body',
      expected: 0,
      actual: headValid.body.length,
      pass: headValid.body.length === 0,
    });

    // Test 11: Trailing slash redirects to non-trailing slash
    const trailingSlash = await request(port, '/privacy/');
    results.push({
      test: '/privacy/ redirects with 301',
      expected: 301,
      actual: trailingSlash.status,
      pass: trailingSlash.status === 301,
    });
    results.push({
      test: '/privacy/ redirects to /privacy',
      expected: '/privacy',
      actual: trailingSlash.headers.location,
      pass: trailingSlash.headers.location === '/privacy',
    });

    // Print results
    console.log('\n=== MAIN Server 404 Tests ===\n');
    for (const r of results) {
      const status = r.pass ? '✓' : '✗';
      console.log(`${status} ${r.test}: expected=${r.expected}, actual=${r.actual}`);
    }

    const passed = results.filter(r => r.pass).length;
    const total = results.length;
    console.log(`\n${passed}/${total} tests passed\n`);

    if (passed !== total) {
      process.exitCode = 1;
    }
  } finally {
    proc.kill();
  }
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exitCode = 1;
});
