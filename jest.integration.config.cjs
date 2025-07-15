const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: 'Integration Tests',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  
  // Test matching patterns
  testMatch: [
    '<rootDir>/test/integration/**/*.test.ts',
    '<rootDir>/test/integration/**/*.spec.ts'
  ],
  
  // Ignore other test types
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/unit/',
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
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  
  // Setup and teardown
  globalSetup: '<rootDir>/test/integration/setup.ts',
  globalTeardown: '<rootDir>/test/integration/teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  
  // Timeouts and workers - longer for integration tests
  testTimeout: 30000,
  maxWorkers: 1, // Sequential execution for integration tests
  
  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/cli/**/*'
  ],
  coverageDirectory: 'test/coverage/integration',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  verbose: true,
  
  // Force exit after tests complete
  forceExit: true
};