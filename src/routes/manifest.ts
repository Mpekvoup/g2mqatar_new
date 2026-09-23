/**
 * Route manifest for prerender and sitemap generation.
 * Automatically derives routes from data files.
 */

import { SERVICES_DETAIL } from '../../servicesData';
import { CASE_STUDIES } from '../../caseStudiesData';
import { PATHS, buildServicePath, buildCaseStudyPath } from './paths';

export type SitemapChangeFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface RouteManifestEntry {
  path: string;
  prerender: boolean;
  sitemap: boolean;
  priority?: number;
  changefreq?: SitemapChangeFrequency;
}

/** Static routes that don't depend on data */
const STATIC_ROUTES: RouteManifestEntry[] = [
  { path: PATHS.home, prerender: true, sitemap: true, priority: 1.0, changefreq: 'weekly' },
  { path: PATHS.businessConsultation, prerender: true, sitemap: true, priority: 0.9, changefreq: 'monthly' },
  { path: PATHS.companyRegistration, prerender: true, sitemap: true, priority: 0.9, changefreq: 'monthly' },
  { path: PATHS.caseStudies, prerender: true, sitemap: true, priority: 0.8, changefreq: 'monthly' },
  { path: PATHS.privacy, prerender: true, sitemap: true, priority: 0.3, changefreq: 'yearly' },
  { path: PATHS.terms, prerender: true, sitemap: true, priority: 0.3, changefreq: 'yearly' },
];

/** Validate a single manifest entry */
function validateEntry(entry: RouteManifestEntry, index: number): void {
  const { path, prerender, sitemap, priority } = entry;

  if (!path.startsWith('/')) {
    throw new Error(`Route ${index}: path must start with '/' (got "${path}")`);
  }
  if (path.includes(':slug')) {
    throw new Error(`Route ${index}: path contains unresolved :slug pattern (got "${path}")`);
  }
  if (path.includes('?')) {
    throw new Error(`Route ${index}: path contains query string (got "${path}")`);
  }
  if (path.includes('://')) {
    throw new Error(`Route ${index}: path contains hostname (got "${path}")`);
  }
  if (path === '*') {
    throw new Error(`Route ${index}: fallback '*' should not be in manifest`);
  }
  if (sitemap && !prerender) {
    throw new Error(`Route ${index}: sitemap entry must be prerendered (path "${path}")`);
  }
  if (priority !== undefined && (priority < 0 || priority > 1)) {
    throw new Error(`Route ${index}: priority must be between 0.0 and 1.0 (got ${priority})`);
  }
}

/** Build and validate the complete route manifest */
function buildManifest(): RouteManifestEntry[] {
  const entries: RouteManifestEntry[] = [...STATIC_ROUTES];

  // Add service routes from data
  for (const service of SERVICES_DETAIL) {
    if (!service.slug || typeof service.slug !== 'string' || !service.slug.trim()) {
      throw new Error(`Invalid service slug: "${service.slug}"`);
    }
    entries.push({
      path: buildServicePath(service.slug),
      prerender: true,
      sitemap: true,
      priority: 0.9,
      changefreq: 'monthly',
    });
  }

  // Add case study routes from data
  for (const caseStudy of CASE_STUDIES) {
    if (!caseStudy.slug || typeof caseStudy.slug !== 'string' || !caseStudy.slug.trim()) {
      throw new Error(`Invalid case study slug: "${caseStudy.slug}"`);
    }
    entries.push({
      path: buildCaseStudyPath(caseStudy.slug),
      prerender: true,
      sitemap: true,
      priority: 0.7,
      changefreq: 'monthly',
    });
  }

  // Validate all entries
  entries.forEach((entry, index) => validateEntry(entry, index));

  // Check for duplicates
  const paths = entries.map(e => e.path);
  const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate routes found: ${duplicates.join(', ')}`);
  }

  return entries;
}

/** The validated route manifest */
export const ROUTE_MANIFEST: RouteManifestEntry[] = buildManifest();

/** Get routes that should be prerendered */
export function getPrerenderRoutes(): string[] {
  return ROUTE_MANIFEST.filter(r => r.prerender).map(r => r.path);
}

/** Get the full manifest for sitemap generation */
export function getRouteManifest(): RouteManifestEntry[] {
  return ROUTE_MANIFEST;
}

/** Get routes that should be in sitemap */
export function getSitemapRoutes(): RouteManifestEntry[] {
  return ROUTE_MANIFEST.filter(r => r.sitemap);
}
