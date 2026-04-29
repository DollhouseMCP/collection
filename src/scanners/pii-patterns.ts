/**
 * PII pattern definitions for the collection submission pipeline.
 *
 * Companion to src/validators/security-patterns.ts. The security-patterns
 * file detects AI/LLM threats (prompt injection, jailbreaking, etc.) — this
 * file detects personally-identifiable information (PII) and credentials.
 *
 * Severity tiers and CI behavior:
 *   - critical : credentials, API keys, private keys → block PR merge
 *   - high     : emails, phones, SSN, credit-card-shaped → block PR merge
 *   - medium   : user file paths, public IPs, MAC addresses → comment, allow
 *   - low      : UUIDs, hashes, long base64 → informational only
 *
 * See issue #245 for the full design.
 */

export type PIISeverity = 'critical' | 'high' | 'medium' | 'low';

export interface PIIPattern {
  /** kebab-case stable identifier for this pattern */
  id: string;
  /** must include the global flag so the scanner can iterate matches */
  pattern: RegExp;
  severity: PIISeverity;
  /** category key (e.g. `credential`, `email`, `path`) */
  category: string;
  /** human-readable description shown in PR comments */
  description: string;
  /** short example of an acceptable redaction the contributor can use */
  suggestion: string;
  /**
   * Optional false-positive filter applied to each match.
   * Returns true if the match should NOT be flagged.
   */
  isFalsePositive?: (match: string) => boolean;
}

// ============================================================================
//  Allowlist helpers
// ============================================================================

/** Email addresses we tolerate as documented placeholders. */
function isPlaceholderEmail(match: string): boolean {
  const lower = match.toLowerCase();
  const at = lower.indexOf('@');
  if (at < 0) {return false;}
  const local = lower.slice(0, at);
  const domain = lower.slice(at + 1);

  // Common documented placeholder domains (RFC2606 + community conventions)
  const placeholderDomains = [
    'example.com', 'example.org', 'example.net', 'example.io', 'example.test', 'example.local', 'example',
    'test.com', 'test.org', 'test.net', 'test.io', 'test.test', 'test.local',
    'invalid.com', 'invalid.org', 'invalid.net', 'invalid.io', 'invalid.test', 'invalid.local',
    'localhost.com', 'localhost.org', 'localhost.net', 'localhost.io', 'localhost.test', 'localhost.local',
  ];
  if (placeholderDomains.includes(domain)) {return true;}

  // GitHub-Actions / CI synthetic addresses
  if (domain === 'users.noreply.github.com') {return true;}
  // Anthropic Claude attribution
  if (lower === 'noreply@anthropic.com') {return true;}

  // Common no-reply / system addresses are not personal PII
  const systemLocals = ['noreply', 'no-reply', 'donotreply', 'do-not-reply'];
  if (systemLocals.includes(local)) {return true;}
  // Org-scoped non-personal accounts
  const roleLocals = ['admin', 'info', 'support', 'hello', 'contact', 'hi'];
  if (roleLocals.includes(local)) {return true;}

  // Obvious placeholders by literal substring
  if (lower.includes('your-email') || lower.includes('your.email') || lower.includes('placeholder')) {return true;}
  return false;
}

/** IPs that are documentation-safe (private / loopback / reserved / test ranges). */
function isSafeIPv4(match: string): boolean {
  // Loopback
  if (match.startsWith('127.')) {return true;}
  // RFC1918 private
  if (match.startsWith('10.')) {return true;}
  if (match.startsWith('192.168.')) {return true;}
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(match)) {return true;}
  // Unspecified / broadcast / multicast
  if (match === '0.0.0.0') {return true;}
  if (match.startsWith('255.')) {return true;}
  // RFC5737 documentation ranges
  if (match.startsWith('192.0.2.')) {return true;}
  if (match.startsWith('198.51.100.')) {return true;}
  if (match.startsWith('203.0.113.')) {return true;}
  // Link-local
  if (match.startsWith('169.254.')) {return true;}
  return false;
}

/**
 * Universally-known Stripe test card numbers — exact matches only.
 * Real cards that happen to share a prefix (e.g. real Mastercards starting
 * 5555, real Visas starting 4000) still get flagged.
 */
const STRIPE_TEST_CARDS: ReadonlySet<string> = new Set([
  '4242424242424242', // Visa
  '4000056655665556', // Visa (debit)
  '4000000000000002', // Visa - generic decline
  '5555555555554444', // Mastercard
  '5200828282828210', // Mastercard (debit)
  '378282246310005',  // Amex (15 digits, won't hit our 16-digit regex anyway)
  '6011111111111117', // Discover
]);

function isStripeTestCard(match: string): boolean {
  return STRIPE_TEST_CARDS.has(match.replace(/\D/g, ''));
}

/** Common path prefixes that aren't PII even though they match the user-path shape. */
function isSafeUserPath(match: string): boolean {
  // Documentation patterns where <user> or {user} is the placeholder
  if (/<[a-z_-]+>/i.test(match)) {return true;}
  if (/\{[a-z_-]+\}/i.test(match)) {return true;}
  // Generic placeholder names. Match end-of-string because the scanner regex
  // strips the trailing path separator.
  if (/\/(?:Users|home)\/(?:USER|user|username|name|YOUR_USER|yourname|youruser)$/i.test(match)) {return true;}
  if (/^C:\\Users\\(?:USER|user|username|name|YOUR_USER|yourname|youruser)$/i.test(match)) {return true;}
  // Tilde expansion documentation
  if (match.startsWith('~/')) {return true;}
  return false;
}

// ============================================================================
//  Pattern set
// ============================================================================

export const PII_PATTERNS: PIIPattern[] = [
  // -------------------------------------------------------------------------
  //  CRITICAL — credentials, keys, tokens
  // -------------------------------------------------------------------------
  {
    id: 'aws-access-key-id',
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    severity: 'critical',
    category: 'credential',
    description: 'AWS access key ID',
    suggestion: 'AKIAIOSFODNN7EXAMPLE',
  },
  {
    id: 'aws-secret-access-key',
    // Only flag in clear "secret access key" context — the bare regex would
    // false-positive constantly on any 40-char base64 string.
    pattern: /\b(?:aws[_-]?)?secret[_-]?access[_-]?key\s*[:=]\s*["']?([A-Za-z0-9+/=]{40})["']?/gi,
    severity: 'critical',
    category: 'credential',
    description: 'AWS secret access key (in assignment context)',
    suggestion: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
  {
    id: 'github-pat',
    pattern: /\bgh[opsur]_[A-Za-z0-9]{36,}\b/g,
    severity: 'critical',
    category: 'credential',
    description: 'GitHub personal access token / OAuth token',
    suggestion: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  {
    id: 'private-key-block',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/g,
    severity: 'critical',
    category: 'credential',
    description: 'Private key block',
    suggestion: '<redacted private key>',
  },
  {
    id: 'slack-token',
    pattern: /\bxox[baprs]-[0-9]{10,}-[0-9a-zA-Z-]{24,}\b/g,
    severity: 'critical',
    category: 'credential',
    description: 'Slack API token',
    suggestion: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx',
  },
  {
    id: 'stripe-live-key',
    pattern: /\b(?:sk|pk|rk)_live_[0-9a-zA-Z]{24,}\b/g,
    severity: 'critical',
    category: 'credential',
    description: 'Stripe live API key',
    suggestion: '<redacted — use a test-mode key from your Stripe dashboard>',
  },
  {
    id: 'generic-api-key-assignment',
    pattern: /\b(?:api[_-]?(?:key|secret)|(?:access|auth)[_-]?token)\s*[:=]\s*["']([\w./+=-]{16,})["']/gi,
    severity: 'critical',
    category: 'credential',
    description: 'API key / token in assignment context',
    suggestion: 'YOUR_API_KEY_HERE',
    isFalsePositive: (match) => {
      // Allow obvious placeholder values
      const lower = match.toLowerCase();
      return lower.includes('your_') || lower.includes('your-') || lower.includes('xxxxx') ||
             lower.includes('example') || lower.includes('placeholder') || lower.includes('changeme') ||
             lower.includes('todo');
    },
  },
  {
    id: 'password-assignment',
    pattern: /\bpassword\s*[:=]\s*["']([^"'\s]{6,})["']/gi,
    severity: 'critical',
    category: 'credential',
    description: 'Hardcoded password assignment',
    suggestion: 'password: "$ENV_PASSWORD"',
    isFalsePositive: (match) => {
      const lower = match.toLowerCase();
      return lower.includes('your_') || lower.includes('your-') || lower.includes('xxxxx') ||
             lower.includes('example') || lower.includes('placeholder') || lower.includes('changeme') ||
             lower.includes('hunter2') /* xkcd reference */;
    },
  },
  {
    id: 'jwt-token',
    // header.payload.signature, base64url-ish segments
    pattern: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{8,}\b/g,
    severity: 'critical',
    category: 'credential',
    description: 'JWT token',
    suggestion: 'eyJhbGciOi...REDACTED',
  },
  {
    id: 'bearer-token',
    pattern: /\bbearer\s+([\w./+=-]{20,})\b/gi,
    severity: 'critical',
    category: 'credential',
    description: 'Bearer token in code',
    suggestion: 'Bearer YOUR_TOKEN_HERE',
    isFalsePositive: (match) => {
      const lower = match.toLowerCase();
      return lower.includes('your_') || lower.includes('xxxxx') || lower.includes('example') ||
             lower.includes('placeholder') || lower.includes('todo');
    },
  },

  // -------------------------------------------------------------------------
  //  HIGH — directly-personal identifiers
  // -------------------------------------------------------------------------
  {
    id: 'email-address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g,
    severity: 'high',
    category: 'email',
    description: 'Email address (real-looking, not a documented placeholder)',
    suggestion: 'user@example.com',
    isFalsePositive: isPlaceholderEmail,
  },
  {
    id: 'us-phone-number',
    // (xxx) xxx-xxxx, xxx-xxx-xxxx, xxx.xxx.xxxx, +1 xxx xxx xxxx, 10-digit
    pattern: /(?<!\d)(?:\+?1[-\s.]?)?\(?[2-9]\d{2}\)?[-\s.]?[2-9]\d{2}[-\s.]?\d{4}(?!\d)/g,
    severity: 'high',
    category: 'phone',
    description: 'US-format phone number',
    suggestion: '(555) 555-5555',
    isFalsePositive: (match) => {
      // Only the 555-0100 .. 555-0199 range is officially reserved for
      // fictional use (NANP). Other 555-* numbers may be real
      // (e.g. 555-1212 directory assistance). Be conservative.
      return /\b555[-.\s]?01\d{2}\b/.test(match);
    },
  },
  {
    id: 'ssn',
    pattern: /(?<!\d)\d{3}-\d{2}-\d{4}(?!\d)/g,
    severity: 'high',
    category: 'pii',
    description: 'US Social Security Number format',
    suggestion: 'XXX-XX-XXXX',
  },
  {
    // 16-digit contiguous form. Split from the 4-4-4-4 separator form to
    // keep each pattern below Sonar's 20-complexity threshold.
    id: 'credit-card-shaped-solid',
    pattern: /\b(?:4\d{3}|5[1-5]\d{2}|6(?:011|5\d{2})|3[47]\d{2})\d{12}\b/g,
    severity: 'high',
    category: 'pii',
    description: 'Credit-card-shaped number (16-digit)',
    suggestion: '4242 4242 4242 4242',
    isFalsePositive: isStripeTestCard,
  },
  {
    id: 'credit-card-shaped-grouped',
    pattern: /\b(?:4\d{3}|5[1-5]\d{2}|6(?:011|5\d{2})|3[47]\d{2})[-\s]\d{4}[-\s]\d{4}[-\s]\d{4}\b/g,
    severity: 'high',
    category: 'pii',
    description: 'Credit-card-shaped number (4-4-4-4 grouped)',
    suggestion: '4242 4242 4242 4242',
    isFalsePositive: isStripeTestCard,
  },

  // -------------------------------------------------------------------------
  //  MEDIUM — context-personal but lower risk
  // -------------------------------------------------------------------------
  {
    id: 'unix-user-path',
    pattern: /\/(?:Users|home)\/[A-Za-z][A-Za-z0-9._-]{1,30}(?=\/|\s|$|"|'|`)/g,
    severity: 'medium',
    category: 'path',
    description: 'Unix-style user home path (real username)',
    suggestion: '/Users/<USER>/ or /home/<USER>/',
    isFalsePositive: isSafeUserPath,
  },
  {
    id: 'windows-user-path',
    pattern: /\bC:\\Users\\[A-Za-z][A-Za-z0-9._-]{1,30}(?=\\|\s|$|"|'|`)/g,
    severity: 'medium',
    category: 'path',
    description: 'Windows user profile path (real username)',
    suggestion: 'C:\\Users\\<USER>\\',
    isFalsePositive: isSafeUserPath,
  },
  {
    id: 'public-ipv4',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    severity: 'medium',
    category: 'network',
    description: 'Public IPv4 address',
    suggestion: '192.0.2.1 (RFC5737 TEST-NET-1)',
    isFalsePositive: isSafeIPv4,
  },
  {
    id: 'mac-address',
    pattern: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g,
    severity: 'medium',
    category: 'network',
    description: 'MAC address',
    suggestion: '00:00:5E:00:53:00 (RFC7042 documentation MAC)',
  },

  // -------------------------------------------------------------------------
  //  LOW — informational only
  // -------------------------------------------------------------------------
  {
    id: 'uuid',
    pattern: /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g,
    severity: 'low',
    category: 'identifier',
    description: 'UUID — verify this is not a real session/user/resource ID',
    suggestion: '00000000-0000-0000-0000-000000000000',
  },
  {
    id: 'sha-hash',
    // 40-hex (SHA-1) or 64-hex (SHA-256). Anchored to word boundaries.
    pattern: /\b(?:[a-f0-9]{40}|[a-f0-9]{64})\b/g,
    severity: 'low',
    category: 'identifier',
    description: 'SHA-1 or SHA-256 hash — verify this is not a real commit/file/secret hash',
    suggestion: '(verify intent)',
  },
];
