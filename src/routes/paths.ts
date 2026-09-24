/**
 * Centralized route path definitions.
 * Used by React Router and route manifest.
 */

/** Route patterns for React Router */
export const PATHS = {
  home: '/',
  caseStudies: '/case-studies',
  caseStudyDetail: '/case-studies/:slug',
  serviceDetail: '/services/:slug',
  privacy: '/privacy',
  terms: '/terms',
} as const;

/** Helper to build a case study URL from slug */
export function buildCaseStudyPath(slug: string): string {
  return `/case-studies/${slug}`;
}

/** Helper to build a service URL from slug */
export function buildServicePath(slug: string): string {
  return `/services/${slug}`;
}
