/**
 * Tests for Data Exfiltration Security Patterns - Safe Version
 * Uses placeholder patterns exclusively to avoid triggering security systems
 */

import { 
  getTestCases, 
  createMockScanner,
  validateTestResult,
  generateTestReport,
  TestResult
} from './helpers/safe-test-helpers.js';

describe('Data Exfiltration Pattern Detection (Safe)', () => {
  const exfiltrationTestCases = getTestCases('data_exfiltration');
  const mockScanner = createMockScanner();

  describe('Mock Scanner Tests', () => {
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

    it('should correctly categorize each placeholder', () => {
      exfiltrationTestCases.forEach(testCase => {
        const content = `Content with ${testCase.placeholder} inside`;
        const issues = mockScanner.scan(content);
        
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe(testCase.expectedCategory);
        expect(issues[0].severity).toBe(testCase.expectedSeverity);
      });
    });

    it('should handle multiple placeholders in one content', () => {
      const placeholders = exfiltrationTestCases.slice(0, 3).map(tc => tc.placeholder);
      const content = placeholders.join(' and ');
      
      const issues = mockScanner.scan(content);
      expect(issues.length).toBe(3);
    });
  });

  describe('Pattern Coverage Validation', () => {
    it('should have all required test cases', () => {
      const requiredIds = [
        'DE001', 'DE002', 'DE003', 'DE004', 'DE005',
        'DE006', 'DE007', 'DE008', 'DE009'
      ];
      
      const actualIds = exfiltrationTestCases.map(tc => tc.id);
      
      // Debug output for CI
      if (actualIds.length === 0) {
        console.error('No test cases loaded for data_exfiltration category');
      } else if (actualIds.length < requiredIds.length) {
        console.error(`Only ${actualIds.length} test cases loaded: ${actualIds.join(', ')}`);
      }
      
      requiredIds.forEach(id => {
        expect(actualIds).toContain(id);
      });
    });

    it('should have valid severity levels', () => {
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      
      exfiltrationTestCases.forEach(testCase => {
        expect(validSeverities).toContain(testCase.expectedSeverity);
      });
    });

    it('should have appropriate categories', () => {
      const exfiltrationCategories = [
        'data_exfiltration',
        'credential_phishing', 
        'sensitive_data',
        'network_access'
      ];
      
      exfiltrationTestCases.forEach(testCase => {
        expect(exfiltrationCategories).toContain(testCase.expectedCategory);
      });
    });
  });
});