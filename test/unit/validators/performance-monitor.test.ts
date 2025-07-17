/**
 * Unit tests for Performance Monitor
 */

import { 
  PerformanceMonitor, 
  globalMonitor,
  benchmarkComparison 
} from '../../../src/validators/performance-monitor.js';
import type { ScanMetrics } from '../../../src/validators/security-scanner-optimized.js';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  
  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });
  
  describe('addMetric', () => {
    it('should add metrics to the monitor', () => {
      const metric: ScanMetrics = {
        totalTime: 10,
        patternTime: 8,
        lineDetectionTime: 1.5,
        patternsChecked: 48,
        contentLength: 1000,
        issueCount: 2
      };
      
      monitor.addMetric(metric);
      const report = monitor.generateReport();
      
      expect(report).not.toBeNull();
      expect(report!.samples).toBe(1);
    });
    
    it('should maintain max samples limit', () => {
      const monitor = new PerformanceMonitor(5); // Small limit for testing
      
      for (let i = 0; i < 10; i++) {
        monitor.addMetric({
          totalTime: i,
          patternTime: i * 0.8,
          lineDetectionTime: i * 0.1,
          patternsChecked: 48,
          contentLength: 1000,
          issueCount: 1
        });
      }
      
      const report = monitor.generateReport();
      expect(report!.samples).toBe(5);
    });
  });
  
  describe('generateReport', () => {
    it('should return null for empty metrics', () => {
      const report = monitor.generateReport();
      expect(report).toBeNull();
    });
    
    it('should calculate correct summary statistics', () => {
      const metrics: ScanMetrics[] = [
        { totalTime: 10, patternTime: 8, lineDetectionTime: 1, patternsChecked: 48, contentLength: 1000, issueCount: 1 },
        { totalTime: 20, patternTime: 16, lineDetectionTime: 2, patternsChecked: 48, contentLength: 2000, issueCount: 2 },
        { totalTime: 30, patternTime: 24, lineDetectionTime: 3, patternsChecked: 48, contentLength: 3000, issueCount: 3 }
      ];
      
      metrics.forEach(m => monitor.addMetric(m));
      const report = monitor.generateReport();
      
      expect(report).not.toBeNull();
      expect(report!.summary.averageTime).toBe(20);
      expect(report!.summary.minTime).toBe(10);
      expect(report!.summary.maxTime).toBe(30);
      expect(report!.summary.medianTime).toBe(20);
    });
    
    it('should handle zero total time gracefully', () => {
      monitor.addMetric({
        totalTime: 0,
        patternTime: 0,
        lineDetectionTime: 0,
        patternsChecked: 0,
        contentLength: 0,
        issueCount: 0
      });
      
      const report = monitor.generateReport();
      
      expect(report).not.toBeNull();
      expect(report!.throughput.charactersPerMs).toBe(0);
      expect(report!.throughput.patternsPerMs).toBe(0);
      expect(report!.throughput.issuesPerMs).toBe(0);
      expect(report!.breakdown.patternMatchingPercent).toBe(0);
    });
    
    it('should calculate throughput correctly', () => {
      monitor.addMetric({
        totalTime: 10,
        patternTime: 8,
        lineDetectionTime: 1,
        patternsChecked: 48,
        contentLength: 1000,
        issueCount: 2
      });
      
      const report = monitor.generateReport();
      
      expect(report!.throughput.charactersPerMs).toBe(100); // 1000/10
      expect(report!.throughput.patternsPerMs).toBe(4.8);   // 48/10
      expect(report!.throughput.issuesPerMs).toBe(0.2);     // 2/10
    });
    
    it('should calculate time breakdown percentages', () => {
      monitor.addMetric({
        totalTime: 10,
        patternTime: 8,
        lineDetectionTime: 1,
        patternsChecked: 48,
        contentLength: 1000,
        issueCount: 2
      });
      
      const report = monitor.generateReport();
      
      expect(report!.breakdown.patternMatchingPercent).toBe(80);  // 8/10 * 100
      expect(report!.breakdown.lineDetectionPercent).toBe(10);    // 1/10 * 100
      expect(report!.breakdown.overheadPercent).toBe(10);         // (10-8-1)/10 * 100
    });
  });
  
  describe('checkThresholds', () => {
    beforeEach(() => {
      // Add some test metrics
      monitor.addMetric({
        totalTime: 10,
        patternTime: 8,
        lineDetectionTime: 1,
        patternsChecked: 48,
        contentLength: 1000,
        issueCount: 2
      });
    });
    
    it('should pass when all thresholds are met', () => {
      const result = monitor.checkThresholds({
        maxAverageTime: 20,
        maxP95Time: 30,
        maxP99Time: 40,
        minThroughput: 50
      });
      
      expect(result.passed).toBe(true);
      expect(result.failures).toHaveLength(0);
    });
    
    it('should fail when average time exceeds threshold', () => {
      const result = monitor.checkThresholds({
        maxAverageTime: 5
      });
      
      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]).toContain('Average time');
      expect(result.failures[0]).toContain('quickScan');
    });
    
    it('should fail when throughput is below threshold', () => {
      const result = monitor.checkThresholds({
        minThroughput: 200
      });
      
      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]).toContain('Throughput');
      expect(result.failures[0]).toContain('parallel processing');
    });
    
    it('should report multiple failures', () => {
      const result = monitor.checkThresholds({
        maxAverageTime: 5,
        minThroughput: 200
      });
      
      expect(result.passed).toBe(false);
      expect(result.failures).toHaveLength(2);
    });
    
    it('should handle empty monitor gracefully', () => {
      const emptyMonitor = new PerformanceMonitor();
      const result = emptyMonitor.checkThresholds({
        maxAverageTime: 10
      });
      
      expect(result.passed).toBe(true);
      expect(result.failures).toHaveLength(0);
    });
  });
  
  describe('clear', () => {
    it('should clear all metrics', () => {
      monitor.addMetric({
        totalTime: 10,
        patternTime: 8,
        lineDetectionTime: 1,
        patternsChecked: 48,
        contentLength: 1000,
        issueCount: 2
      });
      
      expect(monitor.generateReport()).not.toBeNull();
      
      monitor.clear();
      
      expect(monitor.generateReport()).toBeNull();
    });
  });
  
  describe('formatReport', () => {
    it('should format report as readable string', () => {
      monitor.addMetric({
        totalTime: 10,
        patternTime: 8,
        lineDetectionTime: 1,
        patternsChecked: 48,
        contentLength: 1000,
        issueCount: 2
      });
      
      const report = monitor.generateReport()!;
      const formatted = monitor.formatReport(report);
      
      expect(formatted).toContain('Performance Report');
      expect(formatted).toContain('Average: 10.00ms');
      expect(formatted).toContain('100 chars/ms');
      expect(formatted).toContain('Pattern Matching: 80.0%');
    });
  });
  
  describe('globalMonitor', () => {
    it('should be a singleton instance', () => {
      expect(globalMonitor).toBeInstanceOf(PerformanceMonitor);
      expect(globalMonitor).toBe(globalMonitor); // Same reference
    });
  });
  
  describe('benchmarkComparison', () => {
    it('should compare multiple scanner implementations', async () => {
      const scanners = [
        {
          name: 'Scanner A',
          fn: (content: string) => ({
            issues: [],
            metrics: {
              totalTime: 10,
              patternTime: 8,
              lineDetectionTime: 1,
              patternsChecked: 48,
              contentLength: content.length,
              issueCount: 0
            }
          })
        },
        {
          name: 'Scanner B',
          fn: (_content: string) => ({
            issues: [{
              pattern: 'test',
              severity: 'low' as const,
              line: 1,
              category: 'test',
              description: 'test'
            }]
          })
        }
      ];
      
      const testContent = ['test content 1', 'test content 2'];
      const results = await benchmarkComparison(scanners, testContent, 5);
      
      expect(results.size).toBe(2);
      expect(results.has('Scanner A')).toBe(true);
      expect(results.has('Scanner B')).toBe(true);
      
      const reportA = results.get('Scanner A')!;
      expect(reportA.samples).toBe(5);
      expect(reportA.summary.averageTime).toBeGreaterThan(0);
    });
    
    it('should handle scanners returning arrays', async () => {
      const scanners = [
        {
          name: 'Array Scanner',
          fn: (_content: string) => [
            {
              pattern: 'test',
              severity: 'low' as const,
              line: 1,
              category: 'test',
              description: 'test'
            }
          ]
        }
      ];
      
      const results = await benchmarkComparison(scanners, ['test'], 1);
      
      expect(results.size).toBe(1);
      const report = results.get('Array Scanner')!;
      expect(report.throughput.issuesPerMs).toBeGreaterThan(0);
    });
  });
});