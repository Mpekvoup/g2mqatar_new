import { createServer } from 'node:http';
import { readFile, access, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import serveHandler from 'serve-handler';
import { createContactHandler } from './contact.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const distPath = path.join(root, 'dist');
const config = JSON.parse(await readFile(new URL('../serve.json', import.meta.url), 'utf8'));
const contact = createContactHandler({ token: process.env.TELEGRAM_BOT_TOKEN, chatId: process.env.TELEGRAM_CHAT_ID });

/** Security headers for HTML responses (from serve.json) */
const HTML_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
};

/**
 * Known prerender routes. Only these paths will be served from prerendered HTML.
 * Unknown paths fall through to serve-handler for assets or SPA fallback.
 */
const PRERENDER_ROUTES = new Set([
  '/',
  '/case-studies',
  '/privacy',
  '/terms',
  '/services/b2b-lead-generation',
  '/services/business-intelligence',
  '/services/incorporation',
  '/services/business-matchmaking',
  '/services/fundraising',
  '/case-studies/caring-hands',
  '/case-studies/sidr-technology',
  '/case-studies/qalan',
]);

/**
 * Normalize pathname: remove trailing slash (except for root).
 * Returns normalized path or null if path contains suspicious patterns.
 */
function normalizePath(pathname) {
  // Reject paths with directory traversal or null bytes
  if (pathname.includes('..') || pathname.includes('\0')) {
    return null;
  }
  // Remove trailing slash (except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/**
 * Try to serve a pre-rendered HTML file for the given pathname.
 * Only serves known prerender routes. Supports GET and HEAD methods.
 * Returns true if response was handled, false otherwise.
 */
async function tryServePrerenderHtml(req, res, pathname) {
  // Only handle GET and HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return false;
  }

  // Normalize path
  const normalizedPath = normalizePath(pathname);
  if (!normalizedPath) {
    return false; // Suspicious path
  }

  // Only serve known prerender routes
  if (!PRERENDER_ROUTES.has(normalizedPath)) {
    return false;
  }

  // Determine the pre-rendered file path
  const htmlPath = normalizedPath === '/'
    ? path.join(distPath, 'index.html')
    : path.join(distPath, normalizedPath.slice(1), 'index.html');

  // Verify path is within dist (defense in depth)
  const resolvedPath = path.resolve(htmlPath);
  if (!resolvedPath.startsWith(distPath)) {
    return false;
  }

  try {
    // Verify file exists and is a file
    const fileStat = await stat(resolvedPath);
    if (!fileStat.isFile()) {
      return false;
    }

    // Build headers
    const headers = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      ...HTML_SECURITY_HEADERS,
    };

    // For HEAD, return headers only
    if (req.method === 'HEAD') {
      headers['Content-Length'] = fileStat.size;
      res.writeHead(200, headers);
      res.end();
      return true;
    }

    // For GET, read and send file
    const html = await readFile(resolvedPath, 'utf-8');
    headers['Content-Length'] = Buffer.byteLength(html, 'utf-8');
    res.writeHead(200, headers);
    res.end(html);
    return true;
  } catch (err) {
    // File read error - do NOT silently fallback to homepage
    // Log error and return false to let serve-handler handle it
    // (which may return SPA fallback for unknown routes)
    if (err.code !== 'ENOENT') {
      console.error(`Error reading prerender file ${resolvedPath}:`, err.message);
    }
    return false;
  }
}

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  try {
    // API routes
    if (pathname === '/api/contact') {
      return await contact(req, res);
    }
    if (pathname.startsWith('/api/')) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Not found' }));
    }

    // Handle trailing slash redirect for non-root paths
    const normalizedPath = normalizePath(pathname);
    if (normalizedPath && normalizedPath !== pathname) {
      res.writeHead(301, { 'Location': normalizedPath });
      return res.end();
    }

    // Try to serve pre-rendered HTML first
    if (await tryServePrerenderHtml(req, res, pathname)) {
      return;
    }

    // Fall back to serve-handler for static assets and SPA fallback
    await serveHandler(req, res, { ...config, public: distPath });
  } catch (err) {
    console.error('Server error:', err.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    }
    res.end(JSON.stringify({ error: 'Service unavailable' }));
  }
});

server.requestTimeout = 15_000;
server.listen(Number(process.env.PORT || 3002), '0.0.0.0', () => {
  console.log('Web and contact server started');
});
