/**
 * Tests for the safe pattern testing infrastructure
 * This ensures our test helpers work correctly without using real malicious patterns
 */

import { 
  getTestCases, 
  getAllTestCases, 
  createMockScanner,
  validateTestResult,
  generateTestReport 
} from './helpers/safe-test-helpers.js';

describe('Safe Pattern Testing Infrastructure', () => {
  describe('Test Data Loading', () => {
    it('should load test patterns from JSON file', () => {
      const promptInjectionCases = getTestCases('prompt_injection');
      expect(promptInjectionCases.length).toBeGreaterThan(0);
      expect(promptInjectionCases[0]).toHaveProperty('id');
      expect(promptInjectionCases[0]).toHaveProperty('placeholder');
      expect(promptInjectionCases[0]).toHaveProperty('expectedCategory');
    });

    it('should load all test cases across categories', () => {
      const allCases = getAllTestCases();
      expect(allCases.length).toBeGreaterThan(0);
      
      // Should have cases from multiple categories
      const categories = new Set(allCases.map(c => c.category));
      expect(categories.size).toBeGreaterThan(1);
      expect(categories).toContain('prompt_injection');
      expect(categories).toContain('jailbreaking');
      expect(categories).toContain('command_execution');
      expect(categories).toContain('data_exfiltration');
    });

    it('should return empty array for non-existent category', () => {
      const cases = getTestCases('non_existent_category');
      expect(cases).toEqual([]);
    });
  });

  describe('Mock Scanner', () => {
    const mockScanner = createMockScanner();

    it('should detect placeholder patterns', () => {
      const content = 'This contains OVERRIDE_PREVIOUS_INSTRUCTIONS pattern';
      const issues = mockScanner.scan(content);
      
      expect(issues.length).toBe(1);
      expect(issues[0].category).toBe('prompt_injection');
      expect(issues[0].severity).toBe('critical');
      expect(issues[0].line).toBe(1);
    });

    it('should detect multiple patterns', () => {
      const content = `Line 1: OVERRIDE_PREVIOUS_INSTRUCTIONS
Line 2: Normal content
Line 3: EXECUTE_SHELL_COMMAND`;
      
      const issues = mockScanner.scan(content);
      expect(issues.length).toBe(2);
      
      const categories = issues.map(i => i.category);
      expect(categories).toContain('prompt_injection');
      expect(categories).toContain('command_execution');
      
      // Check line numbers
      expect(issues[0].line).toBe(1);
      expect(issues[1].line).toBe(3);
    });

    it('should return empty array for clean content', () => {
      const content = 'This is completely safe content with no patterns';
      const issues = mockScanner.scan(content);
      expect(issues).toEqual([]);
    });
  });

  describe('Test Result Validation', () => {
    const mockScanner = createMockScanner();

    it('should validate successful detection', () => {
      const testCase = getTestCases('prompt_injection')[0];
      const content = `Text with ${testCase.placeholder} in it`;
      const issues = mockScanner.scan(content);
      
      const result = validateTestResult(testCase, issues);
      expect(result.passed).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should fail validation when pattern not detected', () => {
      const testCase = getTestCases('prompt_injection')[0];
      const content = 'Clean content without patterns';
      const issues = mockScanner.scan(content);
      
      const result = validateTestResult(testCase, issues);
      expect(result.passed).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should fail validation on category mismatch', () => {
      const testCase = getTestCases('prompt_injection')[0];
      // Use a different pattern that has wrong category
      const content = 'Text with EXECUTE_SHELL_COMMAND pattern';
      const issues = mockScanner.scan(content);
      
      const result = validateTestResult(testCase, issues);
      expect(result.passed).toBe(false);
      expect(result.message).toContain('category');
    });
  });

  describe('Test Report Generation', () => {
    it('should generate a comprehensive test report', () => {
      const mockScanner = createMockScanner();
      const results: ReturnType<typeof validateTestResult>[] = [];
      
      // Run all test cases
      getAllTestCases().forEach(({ testCase }) => {
        const content = `Testing ${testCase.placeholder}`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const report = generateTestReport(results);
      
      expect(report).toContain('Security Pattern Test Report');
      expect(report).toContain('Total Tests:');
      expect(report).toContain('Passed:');
      expect(report).toContain('Failed:');
    });

    it('should include failure details in report', () => {
      const testCase = getTestCases('prompt_injection')[0];
      const results = [{
        testCase,
        issues: [],
        passed: false,
        message: 'Pattern not detected'
      }];
      
      const report = generateTestReport(results);
      
      expect(report).toContain('Failed Tests:');
      expect(report).toContain(testCase.id);
      expect(report).toContain('Pattern not detected');
    });
  });

  describe('Pattern Documentation', () => {
    it('should have redacted real patterns in test data', () => {
      getAllTestCases().forEach(({ testCase }) => {
        expect(testCase.realPattern).toContain('[REDACTED');
        expect(testCase.placeholder).not.toContain(' ');
        expect(testCase.placeholder).toMatch(/^[A-Z_]+$/);
      });
    });

    it('should have consistent naming convention', () => {
      const prefixMap: Record<string, string> = {
        'prompt_injection': 'PI',
        'jailbreaking': 'JB',
        'command_execution': 'CE',
        'data_exfiltration': 'DE',
        'context_awareness': 'CA'
      };
      
      getAllTestCases().forEach(({ category, testCase }) => {
        const expectedPrefix = prefixMap[category];
        expect(testCase.id).toMatch(new RegExp(`^${expectedPrefix}\\d{3}$`));
      });
    });
  });
});