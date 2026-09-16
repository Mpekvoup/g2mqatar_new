import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import serveHandler from 'serve-handler';
import { createContactHandler } from './contact.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(new URL('../serve.json', import.meta.url), 'utf8'));
const contact = createContactHandler({ token: process.env.TELEGRAM_BOT_TOKEN, chatId: process.env.TELEGRAM_CHAT_ID });
const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const pathname = new URL(req.url, 'http://localhost').pathname;
  try {
    if (pathname === '/api/contact') return await contact(req, res);
    if (pathname.startsWith('/api/')) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Not found' }));
    }
    await serveHandler(req, res, { ...config, public: `${root}dist` });
  } catch {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});
server.requestTimeout = 15_000;
server.listen(Number(process.env.PORT || 3002), '0.0.0.0', () => console.log('Web and contact server started'));
