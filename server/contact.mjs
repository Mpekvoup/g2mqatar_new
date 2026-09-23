import { telegramErrorCode } from './telegram-error.mjs';
import { isValidContact, normalizeContact } from '../src/contact-validation.mjs';

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
    if (data.context && typeof data.context === 'object' && !Array.isArray(data.context)) {
      const ctx = data.context;
      // Validate leadType
      if (!ctx.leadType || !VALID_LEAD_TYPES.includes(ctx.leadType)) {
        return reply(400, { error: 'Invalid context.leadType' });
      }
      // Validate language
      if (!ctx.language || !VALID_LANGUAGES.includes(ctx.language)) {
        return reply(400, { error: 'Invalid context.language' });
      }
      // Validate sourcePage
      if (typeof ctx.sourcePage !== 'string' || !ctx.sourcePage.trim() || ctx.sourcePage.length > 200) {
        return reply(400, { error: 'Invalid context.sourcePage' });
      }
      context = {
        leadType: ctx.leadType,
        language: ctx.language,
        sourcePage: ctx.sourcePage.trim().slice(0, 200),
      };
      // Optional fields with length limits
      const optionalStringFields = [
        ['serviceSlug', 100],
        ['referrer', 200],
        ['utmSource', 200],
        ['utmMedium', 200],
        ['utmCampaign', 200],
        ['utmTerm', 200],
        ['utmContent', 200],
      ];
      for (const [field, max] of optionalStringFields) {
        if (ctx[field] !== undefined) {
          if (typeof ctx[field] !== 'string' || ctx[field].length > max) {
            return reply(400, { error: `Invalid context.${field}` });
          }
          const trimmed = ctx[field].trim();
          if (trimmed) context[field] = trimmed;
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
      lines.push(`Lead type: ${context.leadType}`);
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
