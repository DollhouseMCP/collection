#!/usr/bin/env node

/**
 * Build Verification Script
 * 
 * Tests both TypeScript direct execution and compiled JavaScript execution
 * to ensure the build system works correctly in all scenarios.
 */

import { readFile } from 'fs/promises';
import { execSync } from 'child_process';
import { resolve, join } from 'path';

const ROOT_DIR = resolve(process.cwd());
const OUTPUT_FILE = join(ROOT_DIR, 'public', 'collection-index.json');

interface TestResult {
  method: string;
  success: boolean;
  duration: number;
  error?: string;
  elementCount?: number;
}

interface CollectionIndexData {
  total_elements?: unknown;
  version?: unknown;
  [key: string]: unknown;
}

/**
 * Verify that the output file exists and is valid JSON
 */
async function verifyOutput(): Promise<{ valid: boolean; elementCount: number; error?: string }> {
  try {
    const content = await readFile(OUTPUT_FILE, 'utf-8');
    const data = JSON.parse(content) as CollectionIndexData;
    
    if (!data.total_elements || typeof data.total_elements !== 'number') {
      return { valid: false, elementCount: 0, error: 'Invalid index structure' };
    }
    
    return { valid: true, elementCount: data.total_elements };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { valid: false, elementCount: 0, error: errorMessage };
  }
}

/**
 * Execute a command and measure execution time
 */
async function runCommand(command: string): Promise<{ success: boolean; duration: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    execSync(command, { 
      stdio: 'pipe',
      cwd: ROOT_DIR,
      timeout: 30000 // 30 second timeout
    });
    
    const duration = Date.now() - startTime;
    return { success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, duration, error: errorMessage };
  }
}

/**
 * Test TypeScript direct execution
 */
async function testTypeScriptExecution(): Promise<TestResult> {
  console.log('Testing TypeScript direct execution...');
  const result = await runCommand('npm run build:index:dev');
  
  if (result.success) {
    const output = await verifyOutput();
    return {
      method: 'TypeScript (tsx)',
      success: output.valid,
      duration: result.duration,
      elementCount: output.elementCount,
      error: output.error
    };
  }
  
  return {
    method: 'TypeScript (tsx)',
    success: false,
    duration: result.duration,
    error: result.error
  };
}

/**
 * Test compiled JavaScript execution
 */
async function testCompiledExecution(): Promise<TestResult> {
  console.log('Testing compiled JavaScript execution...');
  
  // First compile TypeScript
  const compileResult = await runCommand('npm run build');
  if (!compileResult.success) {
    return {
      method: 'Compiled JS',
      success: false,
      duration: compileResult.duration,
      error: `Compilation failed: ${compileResult.error}`
    };
  }
  
  // Then run the compiled version
  const runResult = await runCommand('node dist/scripts/build-collection-index.js');
  
  if (runResult.success) {
    const output = await verifyOutput();
    return {
      method: 'Compiled JS',
      success: output.valid,
      duration: compileResult.duration + runResult.duration,
      elementCount: output.elementCount,
      error: output.error
    };
  }
  
  return {
    method: 'Compiled JS',
    success: false,
    duration: compileResult.duration + runResult.duration,
    error: runResult.error
  };
}

/**
 * Main verification process
 */
async function main(): Promise<void> {
  console.log('🔍 Build System Verification');
  console.log('==============================\n');
  
  const results: TestResult[] = [];
  
  // Test TypeScript execution
  try {
    const tsResult = await testTypeScriptExecution();
    results.push(tsResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({
      method: 'TypeScript (tsx)',
      success: false,
      duration: 0,
      error: `Test execution failed: ${errorMessage}`
    });
  }
  
  // Test compiled execution
  try {
    const jsResult = await testCompiledExecution();
    results.push(jsResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({
      method: 'Compiled JS',
      success: false,
      duration: 0,
      error: `Test execution failed: ${errorMessage}`
    });
  }
  
  // Report results
  console.log('\n📊 Verification Results:');
  console.log('========================\n');
  
  let allPassed = true;
  
  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    const duration = result.duration ? `${result.duration}ms` : 'N/A';
    const elements = result.elementCount ? `${result.elementCount} elements` : '';
    
    console.log(`${status} ${result.method}`);
    console.log(`   Duration: ${duration}`);
    if (elements) {console.log(`   Output: ${elements}`);}
    if (result.error) {console.log(`   Error: ${result.error}`);}
    console.log('');
    
    if (!result.success) {allPassed = false;}
  }
  
  // Performance comparison
  if (results.length === 2 && results[0].success && results[1].success) {
    const tsTime = results[0].duration;
    const jsTime = results[1].duration;
    const faster = tsTime < jsTime ? 'TypeScript (tsx)' : 'Compiled JS';
    const difference = Math.abs(tsTime - jsTime);
    
    console.log(`⚡ Performance: ${faster} is ${difference}ms faster`);
    
    // Check for consistency
    if (results[0].elementCount === results[1].elementCount) {
      console.log(`✅ Output consistency: Both methods produced ${results[0].elementCount} elements`);
    } else {
      console.log(`❌ Output inconsistency: TS=${results[0].elementCount}, JS=${results[1].elementCount}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All build methods working correctly!');
    console.log('\nRecommended usage:');
    console.log('• Development: npm run build:index (or build:index:dev)');
    console.log('• Production: npm run build:index:prod');
    console.log('• CI/CD: npm run build:index (fastest)');
  } else {
    console.log('❌ Build system verification failed!');
    console.log('Some methods are not working correctly.');
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (reason: unknown) => {
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}