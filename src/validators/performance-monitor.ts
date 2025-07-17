/**
 * Performance Monitoring Utilities for Security Scanner
 * 
 * Provides tools for measuring, analyzing, and reporting
 * security scanner performance metrics.
 */

import { ScanMetrics } from './security-scanner-optimized.js';

export interface PerformanceReport {
  summary: {
    averageTime: number;
    medianTime: number;
    p95Time: number;
    p99Time: number;
    minTime: number;
    maxTime: number;
  };
  throughput: {
    charactersPerMs: number;
    patternsPerMs: number;
    issuesPerMs: number;
  };
  breakdown: {
    patternMatchingPercent: number;
    lineDetectionPercent: number;
    overheadPercent: number;
  };
  samples: number;
}

export interface PerformanceThresholds {
  maxAverageTime?: number;
  maxP95Time?: number;
  maxP99Time?: number;
  minThroughput?: number;
}

/**
 * Collects and analyzes performance metrics
 */
export class PerformanceMonitor {
  private metrics: ScanMetrics[] = [];
  private readonly maxSamples: number;
  
  constructor(maxSamples: number = 1000) {
    this.maxSamples = maxSamples;
  }
  
  /**
   * Add a metric sample
   */
  addMetric(metric: ScanMetrics): void {
    this.metrics.push(metric);
    
    // Keep only the most recent samples
    if (this.metrics.length > this.maxSamples) {
      this.metrics.shift();
    }
  }
  
  /**
   * Clear all collected metrics
   */
  clear(): void {
    this.metrics = [];
  }
  
  /**
   * Generate a performance report
   */
  generateReport(): PerformanceReport | null {
    if (this.metrics.length === 0) {
      return null;
    }
    
    const times = this.metrics.map(m => m.totalTime).sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);
    
    // Calculate percentiles
    const percentile = (p: number): number => {
      const index = Math.ceil((p / 100) * times.length) - 1;
      return times[Math.max(0, index)];
    };
    
    // Calculate throughput metrics
    const totalChars = this.metrics.reduce((sum, m) => sum + m.contentLength, 0);
    const totalPatterns = this.metrics.reduce((sum, m) => sum + m.patternsChecked, 0);
    const totalIssues = this.metrics.reduce((sum, m) => sum + m.issueCount, 0);
    const totalTime = this.metrics.reduce((sum, m) => sum + m.totalTime, 0);
    
    // Calculate breakdown percentages
    const totalPatternTime = this.metrics.reduce((sum, m) => sum + m.patternTime, 0);
    const totalLineTime = this.metrics.reduce((sum, m) => sum + m.lineDetectionTime, 0);
    const totalOverhead = totalTime - totalPatternTime - totalLineTime;
    
    return {
      summary: {
        averageTime: sum / times.length,
        medianTime: percentile(50),
        p95Time: percentile(95),
        p99Time: percentile(99),
        minTime: times[0],
        maxTime: times[times.length - 1]
      },
      throughput: {
        charactersPerMs: totalTime > 0 ? totalChars / totalTime : 0,
        patternsPerMs: totalTime > 0 ? totalPatterns / totalTime : 0,
        issuesPerMs: totalTime > 0 ? totalIssues / totalTime : 0
      },
      breakdown: {
        patternMatchingPercent: totalTime > 0 ? (totalPatternTime / totalTime) * 100 : 0,
        lineDetectionPercent: totalTime > 0 ? (totalLineTime / totalTime) * 100 : 0,
        overheadPercent: totalTime > 0 ? (totalOverhead / totalTime) * 100 : 0
      },
      samples: this.metrics.length
    };
  }
  
  /**
   * Check if performance meets thresholds
   */
  checkThresholds(thresholds: PerformanceThresholds): { 
    passed: boolean; 
    failures: string[] 
  } {
    const report = this.generateReport();
    if (!report) {
      return { passed: true, failures: [] };
    }
    
    const failures: string[] = [];
    
    if (thresholds.maxAverageTime && report.summary.averageTime > thresholds.maxAverageTime) {
      failures.push(
        `Average time ${report.summary.averageTime.toFixed(2)}ms exceeds threshold ${thresholds.maxAverageTime}ms. ` +
        `Consider using quickScan for real-time validation or reducing pattern count.`
      );
    }
    
    if (thresholds.maxP95Time && report.summary.p95Time > thresholds.maxP95Time) {
      failures.push(
        `P95 time ${report.summary.p95Time.toFixed(2)}ms exceeds threshold ${thresholds.maxP95Time}ms. ` +
        `Check for complex patterns or consider skipLineNumbers option.`
      );
    }
    
    if (thresholds.maxP99Time && report.summary.p99Time > thresholds.maxP99Time) {
      failures.push(
        `P99 time ${report.summary.p99Time.toFixed(2)}ms exceeds threshold ${thresholds.maxP99Time}ms. ` +
        `Investigate outliers - possible ReDoS patterns or very large content.`
      );
    }
    
    if (thresholds.minThroughput && report.throughput.charactersPerMs < thresholds.minThroughput) {
      failures.push(
        `Throughput ${report.throughput.charactersPerMs.toFixed(2)} chars/ms below threshold ${thresholds.minThroughput} chars/ms. ` +
        `Consider pattern optimization or parallel processing for large files.`
      );
    }
    
    return {
      passed: failures.length === 0,
      failures
    };
  }
  
  /**
   * Format report as string for console output
   */
  formatReport(report: PerformanceReport): string {
    return `
Performance Report (${report.samples} samples)
================================================
Summary:
  Average: ${report.summary.averageTime.toFixed(2)}ms
  Median:  ${report.summary.medianTime.toFixed(2)}ms
  P95:     ${report.summary.p95Time.toFixed(2)}ms
  P99:     ${report.summary.p99Time.toFixed(2)}ms
  Min:     ${report.summary.minTime.toFixed(2)}ms
  Max:     ${report.summary.maxTime.toFixed(2)}ms

Throughput:
  ${report.throughput.charactersPerMs.toFixed(0)} chars/ms
  ${report.throughput.patternsPerMs.toFixed(1)} patterns/ms
  ${report.throughput.issuesPerMs.toFixed(2)} issues/ms

Time Breakdown:
  Pattern Matching: ${report.breakdown.patternMatchingPercent.toFixed(1)}%
  Line Detection:   ${report.breakdown.lineDetectionPercent.toFixed(1)}%
  Overhead:         ${report.breakdown.overheadPercent.toFixed(1)}%
================================================
`;
  }
}

/**
 * Singleton instance for global performance monitoring
 */
export const globalMonitor = new PerformanceMonitor();

/**
 * Benchmark utility for comparing scanner implementations
 */
export async function benchmarkComparison(
  scanners: Array<{ name: string; fn: (content: string) => any }>,
  testContent: string[],
  iterations: number = 100
): Promise<Map<string, PerformanceReport>> {
  const results = new Map<string, PerformanceReport>();
  
  for (const scanner of scanners) {
    const monitor = new PerformanceMonitor();
    
    // Warm up
    for (let i = 0; i < 10; i++) {
      scanner.fn(testContent[i % testContent.length]);
    }
    
    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const content = testContent[i % testContent.length];
      const start = performance.now();
      const result = scanner.fn(content);
      const end = performance.now();
      
      // Create synthetic metrics if scanner doesn't return them
      const metrics: ScanMetrics = result.metrics || {
        totalTime: end - start,
        patternTime: (end - start) * 0.8, // Estimate
        lineDetectionTime: (end - start) * 0.15, // Estimate
        patternsChecked: 48, // Default pattern count
        contentLength: content.length,
        issueCount: result.issues?.length || result.length || 0
      };
      
      monitor.addMetric(metrics);
    }
    
    const report = monitor.generateReport();
    if (report) {
      results.set(scanner.name, report);
    }
  }
  
  return results;
}