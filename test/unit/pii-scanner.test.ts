/**
 * Unit tests for the PII scanner module.
 *
 * Covers:
 *   - All severity tiers detect their expected patterns
 *   - Common documented placeholders don't false-positive
 *   - Allowlist functions (private IPs, placeholder emails, fictional phones)
 *   - Summary aggregation and CI block verdict
 *   - Stable ordering of findings
 */

import { describe, it, expect } from '@jest/globals';
import { scanContent, summarize } from '../../src/scanners/pii-scanner.js';

function findIds(content: string): string[] {
  const r = scanContent('inline', content);
  return r.findings.map((f) => f.patternId);
}

describe('pii-scanner', () => {
  // ------------------------------------------------------------------------
  //  CRITICAL
  // ------------------------------------------------------------------------
  describe('critical patterns', () => {
    it('detects AWS access key id', () => {
      const ids = findIds('aws key: AKIAIOSFODNN7EXAMPLE');
      expect(ids).toContain('aws-access-key-id');
    });

    it('detects AWS secret access key in assignment context', () => {
      const ids = findIds('aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"');
      expect(ids).toContain('aws-secret-access-key');
    });

    it('does not flag random 40-char base64 strings outside assignment context', () => {
      // Without the "secret_access_key =" prefix, this should pass through
      const ids = findIds('hash: wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEYY1');
      expect(ids).not.toContain('aws-secret-access-key');
    });

    it('detects GitHub PAT', () => {
      const ids = findIds('token: ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789');
      expect(ids).toContain('github-pat');
    });

    it('detects all GitHub token prefixes', () => {
      const prefixes = ['ghp', 'gho', 'ghs', 'ghu', 'ghr'];
      for (const prefix of prefixes) {
        const ids = findIds(`x: ${prefix}_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789`);
        expect(ids).toContain('github-pat');
      }
    });

    it('detects private key blocks', () => {
      const ids = findIds('-----BEGIN RSA PRIVATE KEY-----\nMIIE...');
      expect(ids).toContain('private-key-block');
    });

    it('detects OpenSSH and PGP private key variants', () => {
      expect(findIds('-----BEGIN OPENSSH PRIVATE KEY-----')).toContain('private-key-block');
      expect(findIds('-----BEGIN PGP PRIVATE KEY BLOCK-----')).toContain('private-key-block');
      expect(findIds('-----BEGIN PRIVATE KEY-----')).toContain('private-key-block');
    });

    it('detects Slack bot token', () => {
      // String-concatenate to keep the literal token out of git, otherwise
      // GitHub push protection (the meta-version of what this very scanner
      // does) will block the commit.
      const ids = findIds('SLACK_TOKEN=' + 'xox' + 'b-1234567890-abcdefghijklmnopqrstuvwx');
      expect(ids).toContain('slack-token');
    });

    it('detects Stripe live key', () => {
      const ids = findIds('STRIPE=' + 'sk_' + 'live_4eC39HqLyjWDarjtT1zdp7dc');
      expect(ids).toContain('stripe-live-key');
    });

    it('does not flag Stripe TEST keys', () => {
      const ids = findIds('STRIPE=' + 'sk_' + 'test_4eC39HqLyjWDarjtT1zdp7dc');
      expect(ids).not.toContain('stripe-live-key');
    });

    it('detects API key in assignment, ignores placeholder values', () => {
      expect(findIds('apiKey="abc123def456ghi789jklmno"')).toContain('generic-api-key-assignment');
      expect(findIds('apiKey="YOUR_API_KEY_HERE"')).not.toContain('generic-api-key-assignment');
      expect(findIds('apiKey="xxxxxxxxxxxxxxxx"')).not.toContain('generic-api-key-assignment');
      expect(findIds('apiKey="placeholder-api-key"')).not.toContain('generic-api-key-assignment');
    });

    it('detects hardcoded password, ignores placeholders', () => {
      expect(findIds('password="actualSecret123"')).toContain('password-assignment');
      expect(findIds('password="YOUR_PASSWORD"')).not.toContain('password-assignment');
      expect(findIds('password="changeme"')).not.toContain('password-assignment');
    });

    it('detects JWT', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      expect(findIds(`token: ${jwt}`)).toContain('jwt-token');
    });

    it('detects bearer token', () => {
      expect(findIds('Authorization: Bearer abc123def456ghi789jklmno')).toContain('bearer-token');
    });
  });

  // ------------------------------------------------------------------------
  //  HIGH
  // ------------------------------------------------------------------------
  describe('high patterns', () => {
    it('detects real email', () => {
      expect(findIds('contact: jane.doe@gmail.com')).toContain('email-address');
    });

    it('does not flag documented placeholder emails', () => {
      expect(findIds('user@example.com')).not.toContain('email-address');
      expect(findIds('test@example.org')).not.toContain('email-address');
      expect(findIds('noreply@anything.com')).not.toContain('email-address');
      expect(findIds('admin@somecorp.com')).not.toContain('email-address');
      expect(findIds('184286+mickdarling@users.noreply.github.com')).not.toContain('email-address');
      expect(findIds('noreply@anthropic.com')).not.toContain('email-address');
    });

    it('detects US phone numbers in real formats', () => {
      expect(findIds('Call (212) 555-1234 today')).toContain('us-phone-number');
      expect(findIds('+1-415-867-5309')).toContain('us-phone-number');
      expect(findIds('212.867.5309')).toContain('us-phone-number');
    });

    it('does not flag the reserved-fictional 555-01XX range', () => {
      expect(findIds('Hotline: (555) 0123')).not.toContain('us-phone-number');
      expect(findIds('test 555-0199')).not.toContain('us-phone-number');
    });

    it('detects SSN format', () => {
      expect(findIds('SSN: 123-45-6789')).toContain('ssn');
    });

    it('detects credit-card-shaped numbers (16-digit and 4-4-4-4)', () => {
      expect(findIds('4111111111111111')).toContain('credit-card-shaped');
      expect(findIds('4111-1111-1111-1112')).toContain('credit-card-shaped');
      expect(findIds('5555 5555 5555 4445')).toContain('credit-card-shaped');
    });

    it('does not match a 12-digit UUID tail as credit card', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(findIds(`UUID: ${uuid}`)).not.toContain('credit-card-shaped');
    });

    it('does not flag well-known Stripe test card numbers', () => {
      expect(findIds('Test: 4242424242424242')).not.toContain('credit-card-shaped');
    });
  });

  // ------------------------------------------------------------------------
  //  MEDIUM
  // ------------------------------------------------------------------------
  describe('medium patterns', () => {
    it('detects Unix user paths', () => {
      expect(findIds('/Users/janedoe/projects')).toContain('unix-user-path');
      expect(findIds('/home/alice/.ssh/config')).toContain('unix-user-path');
    });

    it('does not flag documented placeholder paths', () => {
      expect(findIds('/Users/<USER>/projects')).not.toContain('unix-user-path');
      expect(findIds('/home/{username}/data')).not.toContain('unix-user-path');
      expect(findIds('/Users/yourname/code')).not.toContain('unix-user-path');
    });

    it('detects Windows user paths', () => {
      expect(findIds('C:\\Users\\janedoe\\Documents')).toContain('windows-user-path');
    });

    it('does not flag Windows placeholder paths', () => {
      expect(findIds('C:\\Users\\USER\\Documents')).not.toContain('windows-user-path');
    });

    it('detects public IPv4', () => {
      expect(findIds('upstream: 8.8.8.8')).toContain('public-ipv4');
    });

    it('does not flag private/loopback/test IPv4', () => {
      const safe = ['127.0.0.1', '10.0.0.1', '192.168.1.1', '172.16.0.1', '192.0.2.1', '198.51.100.5', '169.254.0.1'];
      for (const ip of safe) {
        expect(findIds(`bind: ${ip}`)).not.toContain('public-ipv4');
      }
    });

    it('detects MAC addresses', () => {
      expect(findIds('mac: 01:23:45:67:89:AB')).toContain('mac-address');
    });
  });

  // ------------------------------------------------------------------------
  //  LOW
  // ------------------------------------------------------------------------
  describe('low patterns', () => {
    it('detects UUIDs', () => {
      expect(findIds('id: 550e8400-e29b-41d4-a716-446655440000')).toContain('uuid');
    });

    it('detects SHA-1 and SHA-256 hashes', () => {
      const sha1 = 'a'.repeat(40);
      const sha256 = 'b'.repeat(64);
      expect(findIds(`commit: ${sha1}`)).toContain('sha-hash');
      expect(findIds(`hash: ${sha256}`)).toContain('sha-hash');
    });
  });

  // ------------------------------------------------------------------------
  //  Summary + CI verdict
  // ------------------------------------------------------------------------
  describe('summarize', () => {
    it('counts findings by severity', () => {
      const r1 = scanContent('a', 'AKIAIOSFODNN7EXAMPLE and jane@gmail.com and 8.8.8.8');
      const r2 = scanContent('b', '/Users/bob/x.txt');
      const summary = summarize([r1, r2]);
      expect(summary.critical).toBe(1);
      expect(summary.high).toBe(1);
      expect(summary.medium).toBe(2); // public IP + path
      expect(summary.totalFindings).toBe(4);
      expect(summary.shouldBlock).toBe(true);
    });

    it('shouldBlock false when only medium/low findings', () => {
      const r = scanContent('a', '/Users/bob/x.txt and 8.8.8.8 and 550e8400-e29b-41d4-a716-446655440000');
      const summary = summarize([r]);
      expect(summary.critical).toBe(0);
      expect(summary.high).toBe(0);
      expect(summary.shouldBlock).toBe(false);
    });

    it('clean files report zero findings and do not block', () => {
      const r = scanContent('a', '# Just a normal markdown file\n\nNo PII here.');
      const summary = summarize([r]);
      expect(summary.totalFindings).toBe(0);
      expect(summary.shouldBlock).toBe(false);
    });
  });

  // ------------------------------------------------------------------------
  //  Stable ordering
  // ------------------------------------------------------------------------
  describe('finding ordering', () => {
    it('sorts critical first, then by line/column', () => {
      const text = [
        '/Users/bob/x.txt', // line 1, medium
        'AKIAIOSFODNN7EXAMPLE', // line 2, critical
        'jane@gmail.com', // line 3, high
      ].join('\n');
      const r = scanContent('a', text);
      expect(r.findings[0].severity).toBe('critical');
      expect(r.findings[1].severity).toBe('high');
      expect(r.findings[2].severity).toBe('medium');
    });
  });
});
