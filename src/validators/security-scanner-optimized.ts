/**
 * Optimized Security Scanner with Performance Enhancements
 * 
 * This module provides an optimized version of the security scanner with:
 * - Pattern ordering by frequency and criticality
 * - Early exit strategies for performance
 * - Caching and memoization
 * - Performance monitoring capabilities
 */

import { SecurityIssue, SECURITY_PATTERNS } from './security-patterns.js';

export interface ScanOptions {
  /** Maximum number of issues to find before stopping (early exit) */
  maxIssues?: number;
  /** Skip line number detection for performance */
  skipLineNumbers?: boolean;
  /** Only scan for critical/high severity patterns */
  criticalOnly?: boolean;
  /** Enable performance metrics collection */
  collectMetrics?: boolean;
}

export interface ScanMetrics {
  totalTime: number;
  patternTime: number;
  lineDetectionTime: number;
  patternsChecked: number;
  contentLength: number;
  issueCount: number;
}

// Define priority scores for different categories
const categoryPriority: Record<string, number> = {
  'command_execution': 100,
  'code_execution': 95,
  'prompt_injection': 90,
  'file_system': 85,
  'data_exfiltration': 80,
  'privilege_escalation': 75,
  'role_hijacking': 70,
  'context_awareness': 65,
  'jailbreak': 60,
  'network_access': 55,
  'yaml_security': 50,
  'sensitive_data': 45,
  'obfuscation': 40,
  'resource_exhaustion': 30
};

// Severity order for sorting
const severityOrder: Record<string, number> = { 
  critical: 4, 
  high: 3, 
  medium: 2, 
  low: 1 
};

/**
 * Get optimized pattern order
 * Lazy initialization to avoid circular dependency issues
 */
let ORDERED_PATTERN_INDICES: number[] | null = null;

function getOrderedPatternIndices(): number[] {
  if (ORDERED_PATTERN_INDICES === null) {
    const patterns = SECURITY_PATTERNS.map((p, i) => ({ pattern: p, index: i }));
    
    // Sort patterns by priority
    patterns.sort((a, b) => {
      // First by severity
      const severityDiff = severityOrder[b.pattern.severity] - severityOrder[a.pattern.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // Then by category priority
      const aPriority = categoryPriority[a.pattern.category] || 0;
      const bPriority = categoryPriority[b.pattern.category] || 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // Finally by pattern complexity (simpler first)
      const aComplexity = a.pattern.pattern.source.length;
      const bComplexity = b.pattern.pattern.source.length;
      return aComplexity - bComplexity;
    });
    
    ORDERED_PATTERN_INDICES = patterns.map(p => p.index);
  }
  
  return ORDERED_PATTERN_INDICES;
}

/**
 * Cache for split lines to avoid repeated splitting
 * Using Map instead of WeakMap since strings are primitives
 */
const lineCache = new Map<string, string[]>();

// Limit cache size to prevent memory issues
const MAX_CACHE_SIZE = 100;

/**
 * Get lines from content with caching
 */
function getLines(content: string): string[] {
  let lines = lineCache.get(content);
  if (!lines) {
    lines = content.split('\n');
    // Manage cache size
    if (lineCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry (first in map)
      const firstKey = lineCache.keys().next().value;
      if (firstKey) lineCache.delete(firstKey);
    }
    lineCache.set(content, lines);
  }
  return lines;
}

/**
 * Optimized security pattern scanner
 */
export function scanForSecurityPatternsOptimized(
  content: string,
  options: ScanOptions = {}
): { issues: SecurityIssue[], metrics?: ScanMetrics } {
  const startTime = options.collectMetrics ? performance.now() : 0;
  let patternTime = 0;
  let lineDetectionTime = 0;
  let patternsChecked = 0;
  
  // Early exit for empty content
  if (!content || content.trim() === '') {
    return {
      issues: [],
      metrics: options.collectMetrics ? {
        totalTime: 0,
        patternTime: 0,
        lineDetectionTime: 0,
        patternsChecked: 0,
        contentLength: 0,
        issueCount: 0
      } : undefined
    };
  }
  
  const issues: SecurityIssue[] = [];
  const { maxIssues, skipLineNumbers, criticalOnly } = options;
  
  // Pre-split lines only if needed
  const lines = skipLineNumbers ? [] : getLines(content);
  
  // Iterate through patterns in optimized order
  for (const patternIndex of getOrderedPatternIndices()) {
    const pattern = SECURITY_PATTERNS[patternIndex];
    
    // Skip non-critical patterns if requested
    if (criticalOnly && pattern.severity !== 'critical' && pattern.severity !== 'high') {
      continue;
    }
    
    patternsChecked++;
    
    // Pattern matching with timing
    const patternStart = options.collectMetrics ? performance.now() : 0;
    const matches = pattern.pattern.test(content);
    if (options.collectMetrics) {
      patternTime += performance.now() - patternStart;
    }
    
    if (matches) {
      let lineNumber = 1;
      
      // Line number detection with timing
      if (!skipLineNumbers && lines.length > 0) {
        const lineStart = options.collectMetrics ? performance.now() : 0;
        
        // Optimized line search: start from middle for better average case
        const midPoint = Math.floor(lines.length / 2);
        let found = false;
        
        // Check middle outward for better cache locality
        for (let offset = 0; offset < lines.length && !found; offset++) {
          const indices = offset === 0 ? [midPoint] : [midPoint + offset, midPoint - offset];
          
          for (const i of indices) {
            if (i >= 0 && i < lines.length && pattern.pattern.test(lines[i])) {
              lineNumber = i + 1;
              found = true;
              break;
            }
          }
        }
        
        if (options.collectMetrics) {
          lineDetectionTime += performance.now() - lineStart;
        }
      }
      
      issues.push({
        pattern: pattern.name,
        severity: pattern.severity,
        line: lineNumber,
        category: pattern.category,
        description: pattern.description
      });
      
      // Early exit if max issues reached
      if (maxIssues && issues.length >= maxIssues) {
        break;
      }
    }
  }
  
  // Collect final metrics
  const metrics: ScanMetrics | undefined = options.collectMetrics ? {
    totalTime: performance.now() - startTime,
    patternTime,
    lineDetectionTime,
    patternsChecked,
    contentLength: content.length,
    issueCount: issues.length
  } : undefined;
  
  return { issues, metrics };
}

/**
 * Create a scanner with pre-configured options for specific use cases
 */
export function createOptimizedScanner(defaultOptions: ScanOptions) {
  return (content: string, overrides?: ScanOptions) => {
    return scanForSecurityPatternsOptimized(content, { ...defaultOptions, ...overrides });
  };
}

/**
 * Pre-configured scanners for common use cases
 */
export const quickScan = createOptimizedScanner({
  maxIssues: 1,
  skipLineNumbers: true,
  criticalOnly: true
});

export const fullScan = createOptimizedScanner({
  collectMetrics: false
});

export const metricsScan = createOptimizedScanner({
  collectMetrics: true
});