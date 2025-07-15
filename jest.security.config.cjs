const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: 'Security Tests',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  
  // Test matching patterns
  testMatch: [
    '<rootDir>/test/security/**/*.test.ts',
    '<rootDir>/test/security/**/*.spec.ts'
  ],
  
  // Ignore other test types
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/unit/',
    '/test/integration/',
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
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  
  // Timeouts and workers
  testTimeout: 15000, // Security tests may take longer
  maxWorkers: '50%',
  
  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    'src/validators/**/*.ts',
    'src/utils/security.ts',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'test/coverage/security',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  verbose: true,
  
  // Bail on first failure for critical security tests
  bail: 1
};