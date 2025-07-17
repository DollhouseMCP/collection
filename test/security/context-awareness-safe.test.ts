/**
 * Tests for Context Awareness Security Patterns - Safe Version
 * Uses placeholder patterns exclusively to avoid triggering security systems
 */

import { 
  getTestCases, 
  createMockScanner,
  validateTestResult,
  generateTestReport,
  TestResult
} from './helpers/safe-test-helpers.js';

describe('Context Awareness Pattern Detection (Safe)', () => {
  const contextTestCases = getTestCases('context_awareness');
  const mockScanner = createMockScanner();

  describe('Mock Scanner Tests', () => {
    it('should detect all context awareness placeholders', () => {
      const results: TestResult[] = [];
      
      contextTestCases.forEach(testCase => {
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
      contextTestCases.forEach(testCase => {
        const content = `Content with ${testCase.placeholder} inside`;
        const issues = mockScanner.scan(content);
        
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe(testCase.expectedCategory);
        expect(issues[0].severity).toBe(testCase.expectedSeverity);
      });
    });

    it('should handle multiple placeholders in content', () => {
      const placeholders = contextTestCases.slice(0, 3).map(tc => tc.placeholder);
      const content = placeholders.join(' and ');
      
      const issues = mockScanner.scan(content);
      expect(issues.length).toBe(3);
    });
  });

  describe('Pattern Coverage Validation', () => {
    it('should have all required test cases', () => {
      const requiredIds = [
        'CA001', 'CA002', 'CA003', 'CA004', 
        'CA005', 'CA006', 'CA007', 'CA008'
      ];
      
      const actualIds = contextTestCases.map(tc => tc.id);
      requiredIds.forEach(id => {
        expect(actualIds).toContain(id);
      });
    });

    it('should have valid severity levels', () => {
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      
      contextTestCases.forEach(testCase => {
        expect(validSeverities).toContain(testCase.expectedSeverity);
      });
    });

    it('should have appropriate categories', () => {
      contextTestCases.forEach(testCase => {
        expect(testCase.expectedCategory).toBe('context_awareness');
      });
    });

    it('should prioritize critical patterns', () => {
      const criticalPatterns = contextTestCases.filter(tc => 
        tc.expectedSeverity === 'critical'
      );
      
      // Should have at least some critical patterns
      expect(criticalPatterns.length).toBeGreaterThan(0);
      
      // Critical patterns should be context manipulation or training data extraction
      criticalPatterns.forEach(pattern => {
        expect(['CA004', 'CA008']).toContain(pattern.id);
      });
    });
  });
});