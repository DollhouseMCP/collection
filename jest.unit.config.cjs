const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: 'Unit Tests',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  
  // Test matching patterns
  testMatch: [
    '<rootDir>/test/unit/**/*.test.ts',
    '<rootDir>/test/unit/**/*.spec.ts'
  ],
  
  // Ignore integration and security tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/integration/',
    '/test/security/',
    '/dist/',
    '/coverage/'
  ],
  
  // TypeScript configuration
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      useESM: true,
      tsconfig: 'tsconfig.test.json'
    }]
  },
  
  // Module resolution
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/'
    }),
    // Handle .js extensions in imports
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  
  // Timeouts and workers
  testTimeout: 10000,
  maxWorkers: '50%',
  
  // Coverage configuration
  collectCoverage: false, // Enable via CLI flag
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/cli/**/*',
    '!src/index.ts'
  ],
  coverageDirectory: 'test/coverage/unit',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  verbose: true
};