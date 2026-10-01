/**
 * Shared metadata processing functions for prerendering.
 * Pure functions without side effects - safe to import in tests.
 */

export const SITE_ORIGIN = 'https://go2market.qa';
export const COMPANY_NAME = 'G2M International';

/**
 * Escape HTML special characters for safe insertion into HTML attributes and text.
 */
export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape XML special characters for sitemap.
 */
export function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build full canonical URL for a route.
 */
export function getCanonicalUrl(routePath) {
  if (routePath === '/') {
    return `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${routePath}`;
}

/**
 * Inject route-specific metadata into HTML template.
 * Throws if any tag is missing or duplicated.
 */
export function injectMetadata(html, routePath, meta) {
  const canonical = getCanonicalUrl(routePath);
  const fullTitle = meta.title.includes(COMPANY_NAME)
    ? meta.title
    : `${meta.title} | ${COMPANY_NAME}`;

  const safeTitle = escapeHtml(fullTitle);
  const safeDescription = escapeHtml(meta.description);
  const safeCanonical = escapeHtml(canonical);

  const replacements = [
    {
      name: 'title',
      pattern: /<title>[^<]*<\/title>/,
      replacement: `<title>${safeTitle}</title>`,
    },
    {
      name: 'meta description',
      pattern: /<meta name="description" content="[^"]*" \/>/,
      replacement: `<meta name="description" content="${safeDescription}" />`,
    },
    {
      name: 'canonical',
      pattern: /<link rel="canonical" href="[^"]*" \/>/,
      replacement: `<link rel="canonical" href="${safeCanonical}" />`,
    },
    {
      name: 'og:url',
      pattern: /<meta property="og:url" content="[^"]*" \/>/,
      replacement: `<meta property="og:url" content="${safeCanonical}" />`,
    },
    {
      name: 'og:title',
      pattern: /<meta property="og:title" content="[^"]*" \/>/,
      replacement: `<meta property="og:title" content="${safeTitle}" />`,
    },
    {
      name: 'og:description',
      pattern: /<meta property="og:description" content="[^"]*" \/>/,
      replacement: `<meta property="og:description" content="${safeDescription}" />`,
    },
    {
      name: 'twitter:title',
      pattern: /<meta name="twitter:title" content="[^"]*" \/>/,
      replacement: `<meta name="twitter:title" content="${safeTitle}" />`,
    },
    {
      name: 'twitter:description',
      pattern: /<meta name="twitter:description" content="[^"]*" \/>/,
      replacement: `<meta name="twitter:description" content="${safeDescription}" />`,
    },
  ];

  let result = html;
  for (const { name, pattern, replacement } of replacements) {
    // Check pattern exists exactly once (not zero, not multiple)
    const matches = result.match(new RegExp(pattern.source, 'g'));
    if (!matches) {
      throw new Error(`Failed to replace ${name} tag - pattern not found in template`);
    }
    if (matches.length > 1) {
      throw new Error(`Failed to replace ${name} tag - pattern found ${matches.length} times (expected 1)`);
    }
    // Replace the single occurrence (identical value is allowed)
    result = result.replace(pattern, replacement);
  }

  return result;
}
