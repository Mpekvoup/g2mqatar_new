/**
 * Lead attribution context for contact forms.
 * Collects UTM parameters, referrer, and page context.
 */

import type { Language } from '../types';

export type LeadType =
  | 'general'
  | 'company_formation'
  | 'reach_clients'
  | 'investment_qatar';

export interface LeadContext {
  leadType: LeadType;
  sourcePage: string;
  language: Language;
  serviceSlug?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

const UTM_STORAGE_KEY = 'g2m_utm';
const MAX_STRING_LENGTH = 200;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Sanitize string: trim, limit length, remove control characters */
function sanitize(value: string | null | undefined, maxLen = MAX_STRING_LENGTH): string | undefined {
  if (!value) return undefined;
  const cleaned = value
    .trim()
    .slice(0, maxLen)
    // Remove control characters including \r \n \t and null byte
    .replace(/[\x00-\x1F\x7F]/g, '');
  return cleaned || undefined;
}

/** Extract hostname from referrer, return undefined for same-origin or invalid */
function sanitizeReferrer(referrer: string | null | undefined): string | undefined {
  if (!referrer) return undefined;
  try {
    const url = new URL(referrer);
    // Skip same-origin referrers
    if (typeof window !== 'undefined' && url.hostname === window.location.hostname) {
      return undefined;
    }
    // Skip go2market.qa
    if (url.hostname === 'go2market.qa' || url.hostname.endsWith('.go2market.qa')) {
      return undefined;
    }
    // Return only hostname (no pathname, query, hash, credentials)
    return sanitize(url.hostname);
  } catch {
    return undefined;
  }
}

/**
 * Resolve lead type based on pathname.
 * Pure function for easy testing.
 */
export function resolveLeadType(pathname: string): LeadType {
  const normalized = pathname.toLowerCase();

  // Company formation paths
  if (normalized === '/company-registration' || normalized === '/services/incorporation') {
    return 'company_formation';
  }

  // Reach clients paths
  if (normalized === '/services/b2b-lead-generation' || normalized === '/services/business-matchmaking') {
    return 'reach_clients';
  }

  // All other paths including /, /business-consultation, etc.
  return 'general';
}

/**
 * Extract service slug from pathname.
 * Returns undefined if not a service page.
 * Pure function for easy testing.
 */
export function resolveServiceSlug(pathname: string): string | undefined {
  const match = pathname.match(/^\/services\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
  if (!match) return undefined;
  const slug = match[1].toLowerCase();
  // Validate slug format
  if (!SLUG_REGEX.test(slug)) return undefined;
  return slug;
}

interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

/** Read UTM params from URL and persist to sessionStorage */
function collectUtmParams(): UtmParams {
  // SSR guard
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = sanitize(params.get('utm_source'));
  const utmMedium = sanitize(params.get('utm_medium'));
  const utmCampaign = sanitize(params.get('utm_campaign'));
  const utmTerm = sanitize(params.get('utm_term'));
  const utmContent = sanitize(params.get('utm_content'));

  const hasNewUtm = utmSource || utmMedium || utmCampaign || utmTerm || utmContent;

  // If URL has UTM params, save them (replaces any existing)
  if (hasNewUtm) {
    const utmData: UtmParams = {};
    if (utmSource) utmData.utmSource = utmSource;
    if (utmMedium) utmData.utmMedium = utmMedium;
    if (utmCampaign) utmData.utmCampaign = utmCampaign;
    if (utmTerm) utmData.utmTerm = utmTerm;
    if (utmContent) utmData.utmContent = utmContent;

    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
    } catch {
      // sessionStorage not available
    }
    return utmData;
  }

  // Otherwise, try to load from sessionStorage
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UtmParams;
      return {
        utmSource: sanitize(parsed.utmSource),
        utmMedium: sanitize(parsed.utmMedium),
        utmCampaign: sanitize(parsed.utmCampaign),
        utmTerm: sanitize(parsed.utmTerm),
        utmContent: sanitize(parsed.utmContent),
      };
    }
  } catch {
    // Invalid JSON or sessionStorage not available
  }

  return {};
}

export interface CollectContextOptions {
  /** Override automatic leadType detection. Use for InvestModal. */
  leadType?: LeadType;
  language: Language;
}

/** Collect full lead context for form submission */
export function collectLeadContext(options: CollectContextOptions): LeadContext {
  const { language } = options;

  // SSR guard for browser APIs
  const pathname = typeof window !== 'undefined'
    ? window.location.pathname
    : '/';

  const sourcePage = sanitize(pathname) || '/';

  // Use provided leadType or auto-detect from pathname
  const leadType = options.leadType ?? resolveLeadType(pathname);

  // Auto-detect serviceSlug from pathname
  const serviceSlug = resolveServiceSlug(pathname);

  const referrer = typeof document !== 'undefined'
    ? sanitizeReferrer(document.referrer)
    : undefined;

  const utmParams = collectUtmParams();

  const context: LeadContext = {
    leadType,
    sourcePage,
    language,
  };

  if (serviceSlug) context.serviceSlug = serviceSlug;
  if (referrer) context.referrer = referrer;
  if (utmParams.utmSource) context.utmSource = utmParams.utmSource;
  if (utmParams.utmMedium) context.utmMedium = utmParams.utmMedium;
  if (utmParams.utmCampaign) context.utmCampaign = utmParams.utmCampaign;
  if (utmParams.utmTerm) context.utmTerm = utmParams.utmTerm;
  if (utmParams.utmContent) context.utmContent = utmParams.utmContent;

  return context;
}
