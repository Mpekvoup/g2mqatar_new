import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distClient = path.resolve(root, 'dist');
const distServer = path.resolve(root, 'dist-server');

const SITE_ORIGIN = 'https://go2market.qa';

/** Escape XML special characters */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Generate sitemap XML from manifest entries */
function generateSitemap(entries) {
  const urls = entries
    .filter(e => e.sitemap)
    .map(entry => {
      const loc = entry.path === '/'
        ? `${SITE_ORIGIN}/`
        : `${SITE_ORIGIN}${entry.path}`;

      let url = `  <url>\n    <loc>${escapeXml(loc)}</loc>`;
      if (entry.changefreq) {
        url += `\n    <changefreq>${entry.changefreq}</changefreq>`;
      }
      if (entry.priority !== undefined) {
        url += `\n    <priority>${entry.priority.toFixed(1)}</priority>`;
      }
      url += '\n  </url>';
      return url;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function prerender() {
  const serverEntryPath = pathToFileURL(path.join(distServer, 'entry-server.js')).href;
  const { render, getRouteManifest, getPrerenderRoutes } = await import(serverEntryPath);

  // Get routes from manifest
  const manifest = getRouteManifest();
  const prerenderRoutes = getPrerenderRoutes();

  // Validate manifest
  if (!manifest || manifest.length === 0) {
    console.error('Error: Route manifest is empty');
    process.exitCode = 1;
    return;
  }

  const prerenderCount = manifest.filter(r => r.prerender).length;
  if (prerenderCount !== prerenderRoutes.length) {
    console.error(`Error: Manifest prerender count (${prerenderCount}) does not match routes (${prerenderRoutes.length})`);
    process.exitCode = 1;
    return;
  }

  console.log(`Found ${prerenderRoutes.length} routes to prerender from manifest\n`);

  const template = await fs.readFile(path.join(distClient, 'index.html'), 'utf-8');
  const rendered = new Set();

  for (const route of prerenderRoutes) {
    // Ensure each route is rendered only once
    if (rendered.has(route)) {
      console.error(`Error: Duplicate route "${route}" in prerender list`);
      process.exitCode = 1;
      continue;
    }
    rendered.add(route);

    try {
      const appHtml = await render(route);
      if (appHtml.includes('<!--$!-->') || !appHtml.includes('<h1')) {
        throw new Error('Incomplete pre-rendered page');
      }
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
      process.exitCode = 1;
      console.error(`✗  ${route}:`, err.message);
    }
  }

  // Generate sitemap
  const sitemapEntries = manifest.filter(r => r.sitemap);
  const sitemapXml = generateSitemap(manifest);
  const sitemapPath = path.join(distClient, 'sitemap.xml');
  await fs.writeFile(sitemapPath, sitemapXml, 'utf-8');
  console.log(`\n✓  Generated sitemap.xml with ${sitemapEntries.length} URLs`);

  await fs.rm(distServer, { recursive: true, force: true });
  console.log('\nPre-rendering complete.');
}

prerender();
