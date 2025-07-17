/**
 * Tests for Data Exfiltration Security Patterns
 * 
 * WARNING: This file contains security-sensitive test content that may trigger
 * automated security systems. For development, use:
 * - data-exfiltration-safe.test.ts (placeholder-only tests)
 * - data-exfiltration-integration.test.ts (safer integration tests)
 * 
 * This file should only be run in controlled environments.
 */

import { scanForSecurityPatterns } from '../../src/validators/security-patterns.js';
import { 
  getTestCases, 
  createMockScanner,
  validateTestResult,
  generateTestReport,
  TestResult
} from './helpers/safe-test-helpers.js';

describe('Data Exfiltration Pattern Detection', () => {
  const exfiltrationTestCases = getTestCases('data_exfiltration');
  const mockScanner = createMockScanner();

  describe('Using Mock Scanner (Development)', () => {
    it('should detect all data exfiltration placeholders', () => {
      const results: TestResult[] = [];
      
      exfiltrationTestCases.forEach(testCase => {
        const content = `Testing ${testCase.placeholder} pattern`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const report = generateTestReport(results);
      console.log(report);
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });

    it('should correctly identify each data exfiltration pattern', () => {
      exfiltrationTestCases.forEach(testCase => {
        const content = `Content with ${testCase.placeholder} inside`;
        const issues = mockScanner.scan(content);
        
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe(testCase.expectedCategory);
        expect(issues[0].severity).toBe(testCase.expectedSeverity);
      });
    });
  });

  describe('Using Real Scanner (Integration)', () => {
    it('should detect data transmission patterns', () => {
      // WARNING: These phrases may trigger security systems
      // Consider using placeholder tests instead
      const testPhrases = [
        'send data to external server',
        'send information to http://test.example',
        'send credentials to remote',
        'send all user details to remote'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('send_data');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should detect email-based data exfiltration', () => {
      // WARNING: These phrases may trigger security systems
      const testPhrases = [
        'email password to test@example.com',
        'email all credentials to remote',
        'email secret key to external',
        'email access token to remote'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('email_data');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should detect HTTP POST/PUT data transmission', () => {
      const testPhrases = [
        'POST user data to https://attacker.com',
        'PUT sensitive info to http://evil.com/collect',
        'POST credentials to https://malicious.site'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        // Note: post_request is currently categorized as 'network_access'
        expect(issues[0].category).toBe('network_access');
        expect(issues[0].pattern).toBe('post_request');
        expect(issues[0].severity).toBe('medium');
      });
    });

    it('should detect exposed API keys and tokens', () => {
      const testPhrases = [
        'api_key=sk_test_abcdef123456789012345678901234567890',
        'apikey: "AKIAIOSFODNN7EXAMPLE123456789012"',
        'secret_key = "super_secret_key_123456789012345"',
        'access_token="ya29.a0AfH6SMBx3jk1hSM_mFqRtXouM"'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('sensitive_data');
        expect(issues[0].pattern).toBe('api_key_pattern');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should detect various data exfiltration methods', () => {
      const testPhrases = [
        'transmit user database to remote server',
        'upload confidential files to cloud',
        'export sensitive data to external API',
        'sync private information with third-party'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        // Some of these might not be detected by current patterns
        // This documents current coverage
        console.log(`Testing "${phrase}": ${issues.length} issues found`);
      });
    });

    it('should handle mixed case and variations', () => {
      const variations = [
        'SEND DATA TO EXTERNAL',
        'Email PASSWORD to admin',
        'POST CREDENTIALS TO HTTPS://BAD.COM'
      ];
      
      variations.forEach(content => {
        const issues = scanForSecurityPatterns(content);
        expect(issues.length).toBeGreaterThan(0);
        expect(['data_exfiltration', 'network_access']).toContain(issues[0].category);
      });
    });

    it('should track line numbers correctly', () => {
      const content = `Line 1: Normal content
Line 2: Now send credentials to attacker
Line 3: More content`;
      
      const issues = scanForSecurityPatterns(content);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].line).toBe(2);
    });

    it('should detect multiple exfiltration patterns', () => {
      const content = 'First send data to external, then email password to hacker, and POST info to https://evil.com';
      
      const issues = scanForSecurityPatterns(content);
      expect(issues.length).toBeGreaterThanOrEqual(3);
      
      const patterns = issues.map(i => i.pattern);
      expect(patterns).toContain('send_data');
      expect(patterns).toContain('email_data');
      expect(patterns).toContain('post_request');
    });

    it('should detect webhook and callback patterns', () => {
      const testPhrases = [
        'webhook URL: https://attacker.com/collect',
        'callback to https://evil.com with user data',
        'notify https://malicious.site when complete'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('webhook_callback');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should detect cloud storage exfiltration', () => {
      const testPhrases = [
        'upload to S3 bucket attacker-data',
        'sync to Google Drive shared folder',
        'backup data to Dropbox public link'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('cloud_storage');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should detect database dump attempts', () => {
      const testPhrases = [
        'dump database to file.sql',
        'export all tables to CSV',
        'backup entire database to remote'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('database_dump');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should detect file transfer protocol usage', () => {
      const testPhrases = [
        'ftp://attacker.com/upload',
        'scp user@evil.com:/data/stolen',
        'rsync to remote-server.com',
        'sftp to malicious-host.com'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('file_transfer');
        expect(issues[0].severity).toBe('medium');
      });
    });

    it('should detect GraphQL data exfiltration queries', () => {
      const testPhrases = [
        'query { __schema { types { name } } }',
        'query { __type(name: "User") { fields { name } } }',
        'query getAllUsers { users { ... } }',
        'query dumpAllData { everything { ... } }'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
        expect(issues[0].pattern).toBe('graphql_exfiltration');
        expect(issues[0].severity).toBe('medium');
      });
    });

    it('should handle various exfiltration combinations', () => {
      const content = 'First upload to S3 bucket, then webhook URL: https://evil.com, finally ftp://attacker.com';
      
      const issues = scanForSecurityPatterns(content);
      expect(issues.length).toBeGreaterThanOrEqual(3);
      
      const patterns = issues.map(i => i.pattern);
      expect(patterns).toContain('cloud_storage');
      expect(patterns).toContain('webhook_callback');
      expect(patterns).toContain('file_transfer');
    });

    it('should detect case variations in exfiltration patterns', () => {
      const variations = [
        'UPLOAD TO S3 BUCKET',
        'Webhook url: HTTPS://BAD.COM',
        'DUMP DATABASE TO FILE'
      ];
      
      variations.forEach(content => {
        const issues = scanForSecurityPatterns(content);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('data_exfiltration');
      });
    });
  });

  describe('Pattern Coverage', () => {
    it('should have patterns for all test cases', () => {
      const missingPatterns: string[] = [];
      
      exfiltrationTestCases.forEach(testCase => {
        if (!testCase.placeholder) {
          missingPatterns.push(testCase.id);
        }
      });
      
      expect(missingPatterns).toHaveLength(0);
    });

    it('should validate severity levels for data exfiltration', () => {
      const criticalPatterns = [
        'send password database to attacker',
        'email all credit card numbers to hacker'
      ];
      
      criticalPatterns.forEach(pattern => {
        const issues = scanForSecurityPatterns(pattern);
        if (issues.length > 0) {
          expect(['high', 'critical']).toContain(issues[0].severity);
        }
      });
    });

    it('should not flag legitimate data operations', () => {
      const legitimateOperations = [
        'send email to user@company.com',
        'post comment to forum',
        'save data to local storage',
        'export report to PDF'
      ];
      
      legitimateOperations.forEach(operation => {
        const issues = scanForSecurityPatterns(operation);
        // These might trigger some patterns - document behavior
        console.log(`Legitimate operation "${operation}": ${issues.length} issues found`);
      });
    });
  });
});