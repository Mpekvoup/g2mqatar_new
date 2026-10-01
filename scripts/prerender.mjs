import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  escapeHtml,
  escapeXml,
  getCanonicalUrl,
  injectMetadata,
  SITE_ORIGIN,
  COMPANY_NAME,
} from './metadata.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distClient = path.resolve(root, 'dist');
const distServer = path.resolve(root, 'dist-server');

/** Static route metadata - uses neutral descriptions without promotional claims */
const STATIC_ROUTE_META = {
  '/': {
    title: 'G2M International | Business Consulting & Company Registration in Qatar',
    description: 'G2M International — boutique consultancy for market entry, company formation, business consulting and fundraising in Qatar. Expert guidance for entrepreneurs expanding to the Gulf.',
  },
  '/case-studies': {
    title: 'Case Studies',
    description: 'Client success stories from G2M International Consulting in Qatar.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Privacy policy for G2M International Consulting services.',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Terms of service for G2M International Consulting.',
  },
};

/**
 * Build metadata for a route using SSR-exported data.
 * Returns { title, description } or null if route is unknown.
 */
function buildRouteMeta(routePath, servicesData, caseStudiesData) {
  // Static routes
  if (STATIC_ROUTE_META[routePath]) {
    return STATIC_ROUTE_META[routePath];
  }

  // Service routes - use title and subtitle from servicesData.ts
  const serviceMatch = routePath.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const slug = serviceMatch[1];
    const service = servicesData.find(s => s.slug === slug);
    if (service) {
      return {
        title: service.title.en,
        description: service.subtitle.en,
      };
    }
    return null; // Service not found
  }

  // Case study routes - use company name and subtitle from caseStudiesData.ts
  const caseStudyMatch = routePath.match(/^\/case-studies\/([^/]+)$/);
  if (caseStudyMatch) {
    const slug = caseStudyMatch[1];
    const caseStudy = caseStudiesData.find(cs => cs.slug === slug);
    if (caseStudy) {
      return {
        title: `${caseStudy.company.en} Case Study`,
        description: `${caseStudy.company.en}: ${caseStudy.subtitle.en}`,
      };
    }
    return null; // Case study not found
  }

  return null; // Unknown route
}

/**
 * Validate that HTML contains exactly one of each required meta tag with correct values.
 */
function validateMetadata(html, routePath, meta) {
  const canonical = getCanonicalUrl(routePath);
  const fullTitle = meta.title.includes(COMPANY_NAME)
    ? meta.title
    : `${meta.title} | ${COMPANY_NAME}`;

  const checks = [
    { name: 'title', pattern: /<title>([^<]*)<\/title>/g, expected: fullTitle },
    { name: 'canonical', pattern: /rel="canonical" href="([^"]*)"/g, expected: canonical },
    { name: 'og:url', pattern: /property="og:url" content="([^"]*)"/g, expected: canonical },
  ];

  for (const { name, pattern, expected } of checks) {
    const matches = [...html.matchAll(pattern)];
    if (matches.length === 0) {
      throw new Error(`Validation failed: ${name} tag not found`);
    }
    if (matches.length > 1) {
      throw new Error(`Validation failed: multiple ${name} tags found (${matches.length})`);
    }
    const actual = matches[0][1];
    // Compare unescaped for title (browser will decode)
    const actualDecoded = actual.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    if (actualDecoded !== expected && actual !== expected) {
      throw new Error(`Validation failed: ${name} mismatch. Expected "${expected}", got "${actual}"`);
    }
  }
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
  const {
    render,
    getRouteManifest,
    getPrerenderRoutes,
    getServicesData,
    getCaseStudiesData,
  } = await import(serverEntryPath);

  // Get data from SSR exports
  const servicesData = getServicesData();
  const caseStudiesData = getCaseStudiesData();

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
  let hasErrors = false;

  for (const route of prerenderRoutes) {
    // Ensure each route is rendered only once
    if (rendered.has(route)) {
      console.error(`Error: Duplicate route "${route}" in prerender list`);
      process.exitCode = 1;
      hasErrors = true;
      continue;
    }
    rendered.add(route);

    // Build metadata from data sources - fail if not found
    const meta = buildRouteMeta(route, servicesData, caseStudiesData);
    if (!meta) {
      console.error(`✗  ${route}: No metadata defined for this route`);
      process.exitCode = 1;
      hasErrors = true;
      continue;
    }

    try {
      const appHtml = await render(route);
      if (appHtml.includes('<!--$!-->') || !appHtml.includes('<h1')) {
        throw new Error('Incomplete pre-rendered page');
      }

      let html = template.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      // Inject and validate metadata
      html = injectMetadata(html, route, meta);
      validateMetadata(html, route, meta);

      const filePath =
        route === '/'
          ? path.join(distClient, 'index.html')
          : path.join(distClient, route.slice(1), 'index.html');

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html, 'utf-8');
      console.log(`✓  ${route}`);
    } catch (err) {
      process.exitCode = 1;
      hasErrors = true;
      console.error(`✗  ${route}:`, err.message);
    }
  }

  if (hasErrors) {
    console.error('\nPre-rendering completed with errors.');
    return;
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
