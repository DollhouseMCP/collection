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

// Global test utilities
(global as any).testUtils = {
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
  createMockFileContent: (metadata: Record<string, any>, content: string = '') => {
    const frontmatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n');
    
    return `---\n${frontmatter}\n---\n\n${content}`;
  },
  
  // Helper to create test fixtures
  createTestFixture: (type: string, data: Record<string, any>) => {
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

// Extend Jest matchers for better assertions
expect.extend({
  // Custom matcher for validation results
  toBeValidationResult(received: any) {
    const pass = received && 
      typeof received.isValid === 'boolean' &&
      Array.isArray(received.issues);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a validation result`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a validation result with isValid and issues properties`,
        pass: false,
      };
    }
  },
  
  // Custom matcher for security issues
  toHaveSecurityIssue(received: any, severity: string) {
    const issues = received.issues || [];
    const hasIssue = issues.some((issue: any) => 
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