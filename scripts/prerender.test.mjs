/**
 * Unit tests for prerender metadata injection logic.
 * Tests the actual functions from metadata.mjs module.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  getCanonicalUrl,
  injectMetadata,
  COMPANY_NAME,
} from './metadata.mjs';

// ============================================================================
// Minimal HTML template for testing
// ============================================================================

const TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <title>Original Title</title>
  <meta name="description" content="Original description" />
  <link rel="canonical" href="https://example.com/original" />
  <meta property="og:url" content="https://example.com/original" />
  <meta property="og:title" content="Original OG Title" />
  <meta property="og:description" content="Original OG description" />
  <meta name="twitter:title" content="Original Twitter Title" />
  <meta name="twitter:description" content="Original Twitter description" />
</head>
<body></body>
</html>`;

// ============================================================================
// Tests
// ============================================================================

describe('escapeHtml', () => {
  test('escapes ampersand', () => {
    assert.equal(escapeHtml('Tom & Jerry'), 'Tom &amp; Jerry');
  });

  test('escapes less than', () => {
    assert.equal(escapeHtml('a < b'), 'a &lt; b');
  });

  test('escapes greater than', () => {
    assert.equal(escapeHtml('a > b'), 'a &gt; b');
  });

  test('escapes double quotes', () => {
    assert.equal(escapeHtml('say "hello"'), 'say &quot;hello&quot;');
  });

  test('escapes single quotes', () => {
    assert.equal(escapeHtml("it's fine"), 'it&#39;s fine');
  });

  test('escapes multiple special characters', () => {
    assert.equal(
      escapeHtml('<script>alert("XSS & more")</script>'),
      '&lt;script&gt;alert(&quot;XSS &amp; more&quot;)&lt;/script&gt;'
    );
  });

  test('returns empty string for empty input', () => {
    assert.equal(escapeHtml(''), '');
  });

  test('does not double-escape already escaped content', () => {
    // If input already has &amp;, it becomes &amp;amp;
    assert.equal(escapeHtml('&amp;'), '&amp;amp;');
  });
});

describe('injectMetadata', () => {
  test('replaces all meta tags with new values', () => {
    const meta = {
      title: 'New Page Title',
      description: 'New page description for SEO.',
    };
    const result = injectMetadata(TEMPLATE, '/new-page', meta);

    assert.ok(result.includes('<title>New Page Title | G2M International</title>'));
    assert.ok(result.includes('content="New page description for SEO."'));
    assert.ok(result.includes('href="https://go2market.qa/new-page"'));
    assert.ok(result.includes('content="https://go2market.qa/new-page"'));
  });

  test('identical value replacement succeeds (no false error)', () => {
    // This tests the fix for the homepage issue where description was identical
    const templateWithSameValue = `<!DOCTYPE html>
<html>
<head>
  <title>Same Title | G2M International</title>
  <meta name="description" content="Same description" />
  <link rel="canonical" href="https://go2market.qa/" />
  <meta property="og:url" content="https://go2market.qa/" />
  <meta property="og:title" content="Same Title | G2M International" />
  <meta property="og:description" content="Same description" />
  <meta name="twitter:title" content="Same Title | G2M International" />
  <meta name="twitter:description" content="Same description" />
</head>
<body></body>
</html>`;

    const meta = {
      title: 'Same Title | G2M International',
      description: 'Same description',
    };

    // Should NOT throw even though values are identical
    assert.doesNotThrow(() => {
      injectMetadata(templateWithSameValue, '/', meta);
    });
  });

  test('throws when title tag is missing', () => {
    const htmlWithoutTitle = TEMPLATE.replace(/<title>[^<]*<\/title>/, '');
    const meta = { title: 'Test', description: 'Test desc' };

    assert.throws(
      () => injectMetadata(htmlWithoutTitle, '/test', meta),
      /title tag - pattern not found/
    );
  });

  test('throws when meta description is missing', () => {
    const htmlWithoutDesc = TEMPLATE.replace(/<meta name="description" content="[^"]*" \/>/, '');
    const meta = { title: 'Test', description: 'Test desc' };

    assert.throws(
      () => injectMetadata(htmlWithoutDesc, '/test', meta),
      /meta description tag - pattern not found/
    );
  });

  test('throws when canonical is missing', () => {
    const htmlWithoutCanonical = TEMPLATE.replace(/<link rel="canonical" href="[^"]*" \/>/, '');
    const meta = { title: 'Test', description: 'Test desc' };

    assert.throws(
      () => injectMetadata(htmlWithoutCanonical, '/test', meta),
      /canonical tag - pattern not found/
    );
  });

  test('throws when title tag is duplicated', () => {
    const htmlWithDuplicateTitle = TEMPLATE.replace(
      '</head>',
      '<title>Duplicate Title</title></head>'
    );
    const meta = { title: 'Test', description: 'Test desc' };

    assert.throws(
      () => injectMetadata(htmlWithDuplicateTitle, '/test', meta),
      /title tag - pattern found 2 times/
    );
  });

  test('throws when canonical is duplicated', () => {
    const htmlWithDuplicateCanonical = TEMPLATE.replace(
      '</head>',
      '<link rel="canonical" href="https://duplicate.com/" /></head>'
    );
    const meta = { title: 'Test', description: 'Test desc' };

    assert.throws(
      () => injectMetadata(htmlWithDuplicateCanonical, '/test', meta),
      /canonical tag - pattern found 2 times/
    );
  });

  test('escapes special characters in title', () => {
    const meta = {
      title: 'Tom & Jerry\'s "Adventure"',
      description: 'Normal description',
    };
    const result = injectMetadata(TEMPLATE, '/test', meta);

    assert.ok(result.includes('Tom &amp; Jerry&#39;s &quot;Adventure&quot;'));
  });

  test('escapes special characters in description', () => {
    const meta = {
      title: 'Normal Title',
      description: 'Contains <script> & "quotes"',
    };
    const result = injectMetadata(TEMPLATE, '/test', meta);

    assert.ok(result.includes('&lt;script&gt; &amp; &quot;quotes&quot;'));
  });

  test('handles root path canonical correctly', () => {
    const meta = { title: 'Homepage', description: 'Home desc' };
    const result = injectMetadata(TEMPLATE, '/', meta);

    // Root should have trailing slash
    assert.ok(result.includes('href="https://go2market.qa/"'));
    assert.ok(result.includes('content="https://go2market.qa/"'));
  });

  test('handles nested path canonical correctly', () => {
    const meta = { title: 'Deep Page', description: 'Deep desc' };
    const result = injectMetadata(TEMPLATE, '/services/incorporation', meta);

    // Non-root should NOT have trailing slash
    assert.ok(result.includes('href="https://go2market.qa/services/incorporation"'));
    assert.ok(!result.includes('href="https://go2market.qa/services/incorporation/"'));
  });

  test('title with company name is not double-suffixed', () => {
    const meta = {
      title: 'Page Title | G2M International',
      description: 'Description',
    };
    const result = injectMetadata(TEMPLATE, '/test', meta);

    // Should appear exactly once, not "| G2M International | G2M International"
    assert.ok(result.includes('<title>Page Title | G2M International</title>'));
    assert.ok(!result.includes('G2M International | G2M International'));
  });

  test('title without company name gets suffix added', () => {
    const meta = {
      title: 'Just a Page',
      description: 'Description',
    };
    const result = injectMetadata(TEMPLATE, '/test', meta);

    assert.ok(result.includes('<title>Just a Page | G2M International</title>'));
  });
});

describe('getCanonicalUrl', () => {
  test('root path gets trailing slash', () => {
    assert.equal(getCanonicalUrl('/'), 'https://go2market.qa/');
  });

  test('non-root path has no trailing slash', () => {
    assert.equal(getCanonicalUrl('/privacy'), 'https://go2market.qa/privacy');
  });

  test('nested path has no trailing slash', () => {
    assert.equal(
      getCanonicalUrl('/services/incorporation'),
      'https://go2market.qa/services/incorporation'
    );
  });
});

describe('module exports verification', () => {
  test('COMPANY_NAME is exported correctly', () => {
    assert.equal(COMPANY_NAME, 'G2M International');
  });

  test('escapeHtml is a function', () => {
    assert.equal(typeof escapeHtml, 'function');
  });

  test('getCanonicalUrl is a function', () => {
    assert.equal(typeof getCanonicalUrl, 'function');
  });

  test('injectMetadata is a function', () => {
    assert.equal(typeof injectMetadata, 'function');
  });
});
