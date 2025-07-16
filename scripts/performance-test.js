#!/usr/bin/env node

/**
 * Cross-platform performance test script
 */

import { performance } from 'perf_hooks';
import { ContentValidator } from '../dist/src/validators/content-validator.js';
import { scanForSecurityPatterns } from '../dist/src/validators/security-patterns.js';
import fs from 'fs';

async function runBenchmarks() {
  const results = {
    platform: process.platform,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    benchmarks: {}
  };
  
  // Benchmark 1: Content validation
  const validator = new ContentValidator();
  const validationStart = performance.now();
  for (let i = 0; i < 100; i++) {
    await validator.validateContent('./library/personas/helpful-assistant.md');
  }
  const validationEnd = performance.now();
  results.benchmarks.contentValidation = {
    iterations: 100,
    totalTime: validationEnd - validationStart,
    avgTime: (validationEnd - validationStart) / 100
  };
  
  // Benchmark 2: Security pattern scanning
  const testContent = 'Test content '.repeat(1000);
  const scanStart = performance.now();
  for (let i = 0; i < 1000; i++) {
    scanForSecurityPatterns(testContent);
  }
  const scanEnd = performance.now();
  results.benchmarks.securityScanning = {
    iterations: 1000,
    totalTime: scanEnd - scanStart,
    avgTime: (scanEnd - scanStart) / 1000
  };
  
  // Benchmark 3: Startup time (simplified for now)
  // TODO: Implement actual startup time measurement
  results.benchmarks.startupTime = {
    note: 'Startup time measurement not yet implemented'
  };
  
  // Write results to file
  fs.writeFileSync('performance-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

runBenchmarks().catch(console.error);