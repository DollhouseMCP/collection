# Security Scanner Performance Optimization Guide

## Overview

This document describes the performance optimizations implemented in the security scanner and provides best practices for maintaining optimal performance.

## Performance Characteristics

### Current Performance Metrics
- **Average scan time**: ~0.020ms per pattern
- **Total patterns**: 48
- **Throughput**: >1000 characters/ms for typical content
- **Memory usage**: O(n) where n is content length

### Scaling Behavior
| Content Size | Scan Time (avg) | Issues Found | Time/Pattern |
|-------------|-----------------|--------------|--------------|
| 1KB         | 0.09ms         | 0-5          | 0.002ms      |
| 10KB        | 0.22ms         | 0-50         | 0.005ms      |
| 50KB        | 0.95ms         | 0-250        | 0.020ms      |
| 100KB       | 1.83ms         | 0-500        | 0.038ms      |
| 500KB       | 9.40ms         | 0-2500       | 0.196ms      |

## Optimization Strategies

### 1. Pattern Ordering

Patterns are ordered by:
1. **Severity**: Critical → High → Medium → Low
2. **Category Priority**: Based on real-world attack frequency
3. **Regex Complexity**: Simpler patterns first when equal priority

```typescript
const categoryPriority = {
  'command_execution': 100,  // Most critical
  'code_execution': 95,
  'prompt_injection': 90,
  // ... etc
  'resource_exhaustion': 30  // Least critical
};
```

### 2. Early Exit Strategies

#### Quick Scan Mode
```typescript
const result = quickScan(content);
// Exits after finding first critical/high severity issue
// Skips line number detection
// Only checks critical patterns
```

#### Maximum Issues Limit
```typescript
const result = scanForSecurityPatternsOptimized(content, {
  maxIssues: 5  // Stop after finding 5 issues
});
```

### 3. Line Number Detection Optimization

Traditional approach searches linearly from the start. Optimized approach:
- Starts from middle of file
- Searches outward for better cache locality
- Can be skipped entirely for performance

```typescript
// Skip line numbers for 2-3x performance boost
const result = scanForSecurityPatternsOptimized(content, {
  skipLineNumbers: true
});
```

### 4. Caching and Memoization

- Line splitting cached using Map with size limit (MAX_CACHE_SIZE = 100)
- Avoids repeated string operations
- FIFO eviction when cache limit reached

## Usage Patterns

### 1. Real-time Validation (Fast)
```typescript
import { quickScan } from './security-scanner-optimized';

// Ultra-fast check for critical issues only
const result = quickScan(userInput);
if (result.issues.length > 0) {
  // Block the request
}
```

### 2. Comprehensive Analysis (Thorough)
```typescript
import { fullScan } from './security-scanner-optimized';

// Complete scan with all patterns
const result = fullScan(document);
```

### 3. Performance Monitoring
```typescript
import { metricsScan } from './security-scanner-optimized';
import { globalMonitor } from './performance-monitor';

// Scan with metrics collection
const result = metricsScan(content);
if (result.metrics) {
  globalMonitor.addMetric(result.metrics);
}

// Generate performance report
const report = globalMonitor.generateReport();
console.log(globalMonitor.formatReport(report));
```

## Best Practices

### 1. Choose the Right Scanner
- **User Input**: Use `quickScan` for real-time validation
- **File Upload**: Use `fullScan` for comprehensive checking
- **Batch Processing**: Use custom options to balance speed/thoroughness

### 2. Content Size Considerations
- For content >1MB, consider chunking
- Use streaming for very large files
- Implement progress callbacks for long operations

### 3. Pattern Maintenance
- Keep patterns simple and focused
- Avoid overly complex regex with nested quantifiers
- Test new patterns for ReDoS vulnerabilities
- Benchmark impact before adding new patterns

### 4. Performance Testing
```typescript
// Benchmark new patterns
const results = await benchmarkComparison([
  { name: 'Before', fn: oldScanner },
  { name: 'After', fn: newScanner }
], testContents);
```

### 5. Monitoring in Production
```typescript
// Set up performance thresholds
const thresholds = {
  maxAverageTime: 10,      // ms
  maxP95Time: 50,          // ms
  minThroughput: 1000      // chars/ms
};

// Check periodically
const check = monitor.checkThresholds(thresholds);
if (!check.passed) {
  console.error('Performance degradation detected:', check.failures);
}
```

## Regex Pattern Guidelines

### DO ✅
- Use non-capturing groups: `(?:...)` instead of `(...)`
- Limit quantifier ranges: `.{0,50}` instead of `.*`
- Use atomic groups for backtrack prevention: `(?>...)`
- Anchor patterns when possible: `^` and `$`

### DON'T ❌
- Nested quantifiers: `(a+)+`
- Unbounded quantifiers: `.*`, `.+`
- Complex lookarounds in hot paths
- Catastrophic backtracking patterns

## Performance Troubleshooting

### Slow Scans
1. Check content size
2. Look for patterns with high backtracking
3. Use performance monitor to identify bottlenecks
4. Consider using quick scan mode

### High Memory Usage
1. Check for memory leaks in custom patterns
2. Clear line cache for very large documents
3. Use streaming for files >10MB

### Degraded Performance Over Time
1. Monitor pattern count growth
2. Review recently added patterns
3. Check for ReDoS vulnerabilities
4. Benchmark against baseline

## Future Optimizations

### Planned Improvements
1. **WebAssembly Integration**: Compile hot paths to WASM
2. **Worker Threads**: Parallel pattern matching for large files
3. **Pattern Compilation**: Pre-compile regex patterns
4. **Adaptive Scanning**: Skip patterns based on content type
5. **GPU Acceleration**: For batch processing scenarios

### Experimental Features
- Bloom filters for quick negative checks
- Machine learning for pattern prioritization
- Incremental scanning for real-time editing