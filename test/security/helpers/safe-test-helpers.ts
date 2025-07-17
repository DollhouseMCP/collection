/**
 * Safe test helpers for security pattern testing
 * Uses placeholder patterns to avoid triggering security systems
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SecurityIssue } from '../../../src/validators/security-patterns.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load test patterns from JSON file
const testPatternsPath = join(__dirname, '../test-data/security-test-patterns.json');
const testPatterns = JSON.parse(readFileSync(testPatternsPath, 'utf-8'));

export interface TestCase {
  id: string;
  description: string;
  placeholder: string;
  realPattern: string;
  expectedCategory: string;
  expectedSeverity: string;
}

export interface TestResult {
  testCase: TestCase;
  issues: SecurityIssue[];
  passed: boolean;
  message?: string;
}

/**
 * Get test cases for a specific category
 */
export function getTestCases(category: string): TestCase[] {
  return testPatterns.categories[category]?.testCases || [];
}

/**
 * Get all test cases across all categories
 */
export function getAllTestCases(): { category: string; testCase: TestCase }[] {
  const allCases: { category: string; testCase: TestCase }[] = [];
  
  Object.entries(testPatterns.categories).forEach(([category, data]: [string, any]) => {
    data.testCases.forEach((testCase: TestCase) => {
      allCases.push({ category, testCase });
    });
  });
  
  return allCases;
}

/**
 * Create a mock security scanner for testing
 * This allows us to test the test infrastructure without real patterns
 */
export function createMockScanner() {
  const mockPatterns = new Map<string, { category: string; severity: string }>();
  
  // Register mock patterns
  getAllTestCases().forEach(({ testCase }) => {
    mockPatterns.set(testCase.placeholder, {
      category: testCase.expectedCategory,
      severity: testCase.expectedSeverity
    });
  });
  
  return {
    scan: (content: string): SecurityIssue[] => {
      const issues: SecurityIssue[] = [];
      const lines = content.split('\n');
      
      mockPatterns.forEach((pattern, placeholder) => {
        lines.forEach((line, index) => {
          if (line.includes(placeholder)) {
            issues.push({
              pattern: placeholder.toLowerCase(),
              severity: pattern.severity as any,
              line: index + 1,
              category: pattern.category,
              description: `Mock detection of ${placeholder}`
            });
          }
        });
      });
      
      return issues;
    }
  };
}

/**
 * Validate test results against expectations
 */
export function validateTestResult(
  testCase: TestCase,
  issues: SecurityIssue[]
): TestResult {
  const relevantIssues = issues.filter(
    issue => issue.category === testCase.expectedCategory
  );
  
  if (relevantIssues.length === 0) {
    return {
      testCase,
      issues,
      passed: false,
      message: `Expected category '${testCase.expectedCategory}' not found`
    };
  }
  
  const severityMatch = relevantIssues.some(
    issue => issue.severity === testCase.expectedSeverity
  );
  
  if (!severityMatch) {
    return {
      testCase,
      issues,
      passed: false,
      message: `Expected severity '${testCase.expectedSeverity}' not found`
    };
  }
  
  return {
    testCase,
    issues: relevantIssues,
    passed: true
  };
}

/**
 * Generate a test report
 */
export function generateTestReport(results: TestResult[]): string {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  let report = `Security Pattern Test Report\n`;
  report += `============================\n\n`;
  report += `Total Tests: ${total}\n`;
  report += `Passed: ${passed}\n`;
  report += `Failed: ${failed}\n\n`;
  
  if (failed > 0) {
    report += `Failed Tests:\n`;
    report += `-------------\n`;
    results.filter(r => !r.passed).forEach(result => {
      report += `- ${result.testCase.id}: ${result.testCase.description}\n`;
      report += `  ${result.message}\n`;
    });
  }
  
  return report;
}