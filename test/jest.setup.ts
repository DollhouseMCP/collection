/**
 * Jest Global Setup
 * 
 * This file runs before all tests and configures the global test environment.
 * Based on DollhouseMCP/mcp-server patterns.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.TEST_MODE = 'true';

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Create mock functions without jest.fn()
const createMockFn = () => {
  const mockFn = (..._args: any[]) => {};
  return mockFn;
};

beforeEach(() => {
  // Reset console methods before each test
  console.log = createMockFn();
  console.error = createMockFn();
  console.warn = createMockFn();
});

afterEach(() => {
  // Restore console methods after each test
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Test utilities interface
interface TestUtils {
  restoreConsole: () => void;
  suppressConsole: () => void;
  createMockFileContent: (metadata: Record<string, unknown>, content?: string) => string;
  createTestFixture: (type: string, data: Record<string, unknown>) => Record<string, unknown>;
  createMockValidationResult: (passed: boolean, issues?: unknown[]) => {
    passed: boolean;
    issues: unknown[];
    summary: Record<string, unknown>;
  };
  extractIssuesByType: (issues: unknown[], type: string) => unknown[];
}

// Global test utilities
(global as typeof global & { testUtils: TestUtils }).testUtils = {
  // Helper to restore console for debugging specific tests
  restoreConsole: () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  },
  
  // Helper to suppress console for specific tests
  suppressConsole: () => {
    console.log = createMockFn();
    console.error = createMockFn();
    console.warn = createMockFn();
  },
  
  // Helper to create mock file content
  createMockFileContent: (metadata: Record<string, unknown>, content = '') => {
    const frontmatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n');
    
    return `---\n${frontmatter}\n---\n\n${content}`;
  },
  
  // Helper to create test fixtures
  createTestFixture: (type: string, data: Record<string, unknown>) => {
    const baseMetadata = {
      unique_id: `test-${type}-${Date.now()}`,
      name: `Test ${type}`,
      description: `Test ${type} for unit testing`,
      type,
      version: '1.0.0',
      tags: ['test']
    };
    
    return { ...baseMetadata, ...data };
  }
};

// Types for Jest custom matchers
interface ValidationResult {
  isValid: boolean;
  issues: Array<{ severity: string; type: string; details: string }>;
}

interface CustomMatchers<R = unknown> {
  toBeValidationResult(): R;
  toHaveSecurityIssue(severity: string): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

// Extend Jest matchers for better assertions
expect.extend({
  // Custom matcher for validation results
  toBeValidationResult(received: unknown) {
    const isValidationResult = (obj: unknown): obj is ValidationResult => {
      return obj !== null && 
        typeof obj === 'object' &&
        'isValid' in obj &&
        'issues' in obj &&
        typeof (obj as ValidationResult).isValid === 'boolean' &&
        Array.isArray((obj as ValidationResult).issues);
    };
    
    const pass = isValidationResult(received);
    
    if (pass) {
      return {
        message: () => `expected ${String(received)} not to be a validation result`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${String(received)} to be a validation result with isValid and issues properties`,
        pass: false,
      };
    }
  },
  
  // Custom matcher for security issues
  toHaveSecurityIssue(received: unknown, severity: string) {
    if (!received || typeof received !== 'object' || !('issues' in received)) {
      return {
        message: () => 'received value is not a validation result with issues',
        pass: false,
      };
    }
    
    const issues = (received as ValidationResult).issues;
    const hasIssue = issues.some(issue => 
      issue.severity === severity && issue.type && issue.details
    );
    
    if (hasIssue) {
      return {
        message: () => `expected validation result not to have ${severity} security issue`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected validation result to have ${severity} security issue`,
        pass: false,
      };
    }
  }
});

// Extend global namespace
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidationResult(): R;
      toHaveSecurityIssue(severity: string): R;
    }
  }
  
  var testUtils: {
    restoreConsole: () => void;
    suppressConsole: () => void;
    createMockFileContent: (metadata: Record<string, any>, content?: string) => string;
    createTestFixture: (type: string, data: Record<string, any>) => Record<string, any>;
  };
}

// This export makes the file a module and enables global declarations
export const _setupComplete = true;