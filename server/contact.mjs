import { telegramErrorCode } from './telegram-error.mjs';
import { isValidContact, normalizeContact } from '../src/contact-validation.mjs';

/** Human-readable labels for lead types */
const LEAD_TYPE_LABELS = {
  general: 'General Enquiry',
  company_formation: 'Company Formation',
  reach_clients: 'Reach Your Clients',
  investment_qatar: 'Invest in Qatar',
};

/** Remove control characters including \r \n \t and null byte */
function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/** Validate sourcePage is a local pathname (no URL, query, hash, control chars) */
function isValidSourcePage(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  // Must start with /
  if (!trimmed.startsWith('/')) return false;
  // Must not contain protocol, query, hash, or control characters
  if (/[:\?#]/.test(trimmed)) return false;
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  // Must not be protocol-relative URL
  if (trimmed.startsWith('//')) return false;
  // Length check
  if (trimmed.length > 200) return false;
  return true;
}

/** Validate serviceSlug matches safe slug format */
function isValidServiceSlug(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed);
}

/** Validate referrer is a valid hostname */
function isValidReferrer(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return false;
  // Must be just a hostname (no protocol, path, query, hash)
  if (/[\/:\?#@]/.test(trimmed)) return false;
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  // Basic hostname validation
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i.test(trimmed);
}

/** Validate UTM field (no control chars, reasonable length) */
function isValidUtmField(value, maxLen = 200) {
  if (typeof value !== 'string') return false;
  if (value.length > maxLen) return false;
  if (/[\x00-\x1F\x7F]/.test(value)) return false;
  return true;
}

export function createContactHandler({ token, chatId, fetchImpl = fetch, now = Date.now, logError = code => console.error('[contact-delivery]', code) }) {
  token = token?.trim();
  chatId = chatId?.trim();
  const attempts = new Map();
  return async (req, res) => {
    const reply = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(405, { error: 'Method not allowed' });
    }
    if (!token || !chatId) return reply(503, { error: 'Contact service is not configured' });
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
      return reply(415, { error: 'Expected application/json' });
    }
    // Use the socket address, not a visitor-controlled X-Forwarded-For header.
    // Shared across requests in this process; a global cap also protects Telegram.
    const time = now();
    for (const [key, entry] of attempts) if (entry.until <= time) attempts.delete(key);
    const ip = req.socket.remoteAddress || 'unknown';
    for (const [key, limit] of [[ip, 10], ['global', 100]]) {
      if ((attempts.get(key)?.count || 0) >= limit) {
        res.setHeader('Retry-After', '60');
        return reply(429, { error: 'Too many requests. Please try again later.' });
      }
    }
    for (const key of [ip, 'global']) {
      const entry = attempts.get(key) || { count: 0, until: time + 60_000 };
      entry.count++;
      attempts.set(key, entry);
    }
    let data;
    try {
      const chunks = [];
      let bytes = 0;
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 16_384) { reply(413, { error: 'Request too large' }); return; }
        chunks.push(Buffer.from(chunk));
      }
      data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return reply(400, { error: 'Invalid JSON' }); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, { error: 'Invalid request' });
    const limits = { name: 120, contact: 254, region: 80, message: 2500 };
    const fields = {};
    for (const [key, max] of Object.entries(limits)) {
      if (typeof data[key] !== 'string' || !data[key].trim() || data[key].trim().length > max) {
        return reply(400, { error: `Invalid ${key}` });
      }
      fields[key] = data[key].trim();
    }
    fields.contact = normalizeContact(fields.contact);
    if (!isValidContact(fields.contact)) {
      return reply(400, { error: 'Enter a valid phone number or email' });
    }

    // Validate optional context
    const VALID_LEAD_TYPES = ['general', 'company_formation', 'reach_clients', 'investment_qatar'];
    const VALID_LANGUAGES = ['en', 'ru'];
    let context = null;

    // If context is provided, it must be a plain object (not string, array, or other)
    if (data.context !== undefined) {
      if (typeof data.context !== 'object' || data.context === null || Array.isArray(data.context)) {
        return reply(400, { error: 'Invalid context' });
      }

      const ctx = data.context;

      // Validate leadType
      if (!ctx.leadType || !VALID_LEAD_TYPES.includes(ctx.leadType)) {
        return reply(400, { error: 'Invalid context.leadType' });
      }

      // Validate language
      if (!ctx.language || !VALID_LANGUAGES.includes(ctx.language)) {
        return reply(400, { error: 'Invalid context.language' });
      }

      // Validate sourcePage - must be local pathname
      if (!isValidSourcePage(ctx.sourcePage)) {
        return reply(400, { error: 'Invalid context.sourcePage' });
      }

      context = {
        leadType: ctx.leadType,
        language: ctx.language,
        sourcePage: sanitizeString(ctx.sourcePage).slice(0, 200),
      };

      // Validate optional serviceSlug
      if (ctx.serviceSlug !== undefined) {
        if (!isValidServiceSlug(ctx.serviceSlug)) {
          return reply(400, { error: 'Invalid context.serviceSlug' });
        }
        context.serviceSlug = sanitizeString(ctx.serviceSlug);
      }

      // Validate optional referrer
      if (ctx.referrer !== undefined) {
        if (!isValidReferrer(ctx.referrer)) {
          return reply(400, { error: 'Invalid context.referrer' });
        }
        context.referrer = sanitizeString(ctx.referrer);
      }

      // Validate optional UTM fields
      const utmFields = ['utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent'];
      for (const field of utmFields) {
        if (ctx[field] !== undefined) {
          if (!isValidUtmField(ctx[field], 200)) {
            return reply(400, { error: `Invalid context.${field}` });
          }
          const sanitized = sanitizeString(ctx[field]);
          if (sanitized) context[field] = sanitized;
        }
      }
    }

    const source = data.source === 'Invest in Qatar Form' ? 'Investment enquiry' : 'Contact form';

    // Build Telegram message
    const lines = [
      'New enquiry — go2market.qa',
      `Source: ${source}`,
      `Name: ${fields.name}`,
      `Contact: ${fields.contact}`,
      `Region: ${fields.region}`,
    ];
    if (context) {
      // Use human-readable label instead of technical code
      const leadTypeLabel = LEAD_TYPE_LABELS[context.leadType] || context.leadType;
      lines.push(`Direction: ${leadTypeLabel}`);
      lines.push(`Page: ${context.sourcePage}`);
      lines.push(`Language: ${context.language}`);
      if (context.serviceSlug) lines.push(`Service: ${context.serviceSlug}`);
      if (context.referrer) lines.push(`Referrer: ${context.referrer}`);
      const utmParts = [];
      if (context.utmSource) utmParts.push(`src=${context.utmSource}`);
      if (context.utmMedium) utmParts.push(`med=${context.utmMedium}`);
      if (context.utmCampaign) utmParts.push(`cmp=${context.utmCampaign}`);
      if (context.utmTerm) utmParts.push(`trm=${context.utmTerm}`);
      if (context.utmContent) utmParts.push(`cnt=${context.utmContent}`);
      if (utmParts.length) lines.push(`UTM: ${utmParts.join(' | ')}`);
    }
    lines.push('', fields.message);
    const text = lines.join('\n');
    try {
      const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: AbortSignal.timeout(10_000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        const code = telegramErrorCode(response.status, result);
        logError(code);
        return reply(502, { error: 'Could not deliver your enquiry. Please try again later.', code });
      }
      return reply(200, { ok: true });
    } catch (error) {
      const code = error?.name === 'TimeoutError' || error?.name === 'AbortError' ? 'TG_TIMEOUT' : 'TG_NETWORK_OR_RESPONSE';
      logError(code);
      // Never expose upstream URLs, tokens, messages or Telegram responses.
      return reply(502, { error: 'Could not deliver your enquiry. Please try again later.', code });
    }
  };
}
