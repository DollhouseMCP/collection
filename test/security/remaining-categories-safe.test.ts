/**
 * Safe Tests for Remaining Security Pattern Categories
 * Uses placeholder patterns exclusively to avoid triggering security systems
 */

import { 
  getTestCases, 
  createMockScanner,
  validateTestResult,
  generateTestReport,
  TestResult,
  getAllTestCases
} from './helpers/safe-test-helpers.js';

describe('Remaining Categories Pattern Detection (Safe)', () => {
  const mockScanner = createMockScanner();

  describe('Comprehensive Placeholder Tests', () => {
    it('should detect all obfuscation placeholders', () => {
      const obfuscationCases = getTestCases('obfuscation');
      const results: TestResult[] = [];
      
      obfuscationCases.forEach(testCase => {
        const content = `Content with ${testCase.placeholder} pattern`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const report = generateTestReport(results);
      console.log('\nObfuscation Test Report:\n', report);
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });

    it('should detect all YAML security placeholders', () => {
      const yamlCases = getTestCases('yaml_security');
      const results: TestResult[] = [];
      
      yamlCases.forEach(testCase => {
        const content = `YAML content: ${testCase.placeholder}`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });

    it('should detect all resource exhaustion placeholders', () => {
      const resourceCases = getTestCases('resource_exhaustion');
      const results: TestResult[] = [];
      
      resourceCases.forEach(testCase => {
        const content = `Resource test: ${testCase.placeholder}`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });

    it('should detect all role/privilege placeholders', () => {
      const roleCases = getTestCases('role_privilege');
      const results: TestResult[] = [];
      
      roleCases.forEach(testCase => {
        const content = `Role test: ${testCase.placeholder}`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });

    it('should detect all miscellaneous security placeholders', () => {
      const miscCases = getTestCases('misc_security');
      const results: TestResult[] = [];
      
      miscCases.forEach(testCase => {
        const content = `Misc test: ${testCase.placeholder}`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });
  });

  describe('Category Validation', () => {
    it('should have valid severity levels for all categories', () => {
      const categories = [
        'obfuscation',
        'yaml_security',
        'resource_exhaustion',
        'role_privilege',
        'misc_security'
      ];
      
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      
      categories.forEach(category => {
        const testCases = getTestCases(category);
        testCases.forEach(testCase => {
          expect(validSeverities).toContain(testCase.expectedSeverity);
        });
      });
    });

    it('should have appropriate severity assignments', () => {
      const criticalPatterns = ['YS002', 'MS001', 'MS002'];
      const highPatterns = ['RP001', 'RP002', 'RP003', 'RP004', 'MS003'];
      const mediumPatterns = ['OB001', 'OB003', 'YS001'];
      const lowPatterns = ['OB002', 'RE001', 'RE002'];
      
      const allCases = getAllTestCases();
      
      allCases.forEach(({ testCase }) => {
        if (criticalPatterns.includes(testCase.id)) {
          expect(testCase.expectedSeverity).toBe('critical');
        } else if (highPatterns.includes(testCase.id)) {
          expect(testCase.expectedSeverity).toBe('high');
        } else if (mediumPatterns.includes(testCase.id)) {
          expect(testCase.expectedSeverity).toBe('medium');
        } else if (lowPatterns.includes(testCase.id)) {
          expect(testCase.expectedSeverity).toBe('low');
        }
      });
    });
  });

  describe('Pattern Completeness', () => {
    it('should have complete coverage for all security categories', () => {
      const expectedCategories = [
        'prompt_injection',
        'jailbreaking',
        'command_execution',
        'data_exfiltration',
        'context_awareness',
        'obfuscation',
        'yaml_security',
        'resource_exhaustion',
        'role_privilege',
        'misc_security'
      ];
      
      const actualCategories = new Set<string>();
      getAllTestCases().forEach(({ category }) => {
        actualCategories.add(category);
      });
      
      expectedCategories.forEach(category => {
        expect(actualCategories.has(category)).toBe(true);
      });
    });

    it('should have consistent test case counts', () => {
      const categoryCounts: Record<string, number> = {
        'obfuscation': 3,
        'yaml_security': 2,
        'resource_exhaustion': 2,
        'role_privilege': 4,
        'misc_security': 3
      };
      
      Object.entries(categoryCounts).forEach(([category, expectedCount]) => {
        const testCases = getTestCases(category);
        expect(testCases.length).toBe(expectedCount);
      });
    });
  });

  describe('Mock Scanner Comprehensive Test', () => {
    it('should generate comprehensive report for all categories', () => {
      const allResults: TestResult[] = [];
      const categories = [
        'obfuscation',
        'yaml_security',
        'resource_exhaustion',
        'role_privilege',
        'misc_security'
      ];
      
      categories.forEach(category => {
        const testCases = getTestCases(category);
        testCases.forEach(testCase => {
          const content = `Testing ${testCase.placeholder}`;
          const issues = mockScanner.scan(content);
          const result = validateTestResult(testCase, issues);
          allResults.push(result);
        });
      });
      
      const report = generateTestReport(allResults);
      console.log('\nComprehensive Test Report:\n', report);
      
      const passedCount = allResults.filter(r => r.passed).length;
      expect(passedCount).toBe(allResults.length);
    });
  });
});