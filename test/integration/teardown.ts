/**
 * Integration Test Global Teardown
 * 
 * Cleans up the test environment after integration tests.
 * Based on DollhouseMCP/mcp-server patterns.
 */

import { rm } from 'fs/promises';

export default async function globalTeardown() {
  console.log('🧹 Cleaning up integration test environment...');
  
  try {
    // Remove test directories
    const testDir = '.test-tmp';
    await rm(testDir, { recursive: true, force: true });
    
    // Clean up environment variables
    delete process.env.TEST_MODE;
    delete process.env.TEST_CONTENT_DIR;
    delete process.env.TEST_LIBRARY_DIR;
    delete process.env.SUPPRESS_LOGS;
    
    console.log('✅ Integration test cleanup complete');
    
  } catch (error) {
    console.error('⚠️  Warning: Failed to cleanup integration test environment:', error);
    // Don't throw - cleanup failures shouldn't fail the test suite
  }
}