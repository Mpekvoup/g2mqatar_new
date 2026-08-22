import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distClient = path.resolve(root, 'dist');
const distServer = path.resolve(root, 'dist-server');

const ROUTES = [
  '/',
  '/case-studies',
  '/case-studies/caring-hands',
  '/case-studies/sidr-technology',
  '/case-studies/qalan',
  '/services/business-intelligence',
  '/services/incorporation',
  '/services/business-matchmaking',
  '/services/fundraising',
  '/privacy',
  '/terms',
];

async function prerender() {
  const serverEntryPath = pathToFileURL(path.join(distServer, 'entry-server.js')).href;
  const { render } = await import(serverEntryPath);
  const template = await fs.readFile(path.join(distClient, 'index.html'), 'utf-8');

  for (const route of ROUTES) {
    try {
      const appHtml = render(route);
      const html = template.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      const filePath =
        route === '/'
          ? path.join(distClient, 'index.html')
          : path.join(distClient, route.slice(1), 'index.html');

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html, 'utf-8');
      console.log(`✓  ${route}`);
    } catch (err) {
      console.error(`✗  ${route}:`, err.message);
    }
  }

  await fs.rm(distServer, { recursive: true, force: true });
  console.log('\nPre-rendering complete.');
}

prerender();
