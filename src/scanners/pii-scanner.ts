/**
 * PII scanner — single source of truth for the collection's contributor
 * pre-submission and CI safety net.
 *
 * Consumers:
 *   - scripts/pr-validation/pii-scanner.mjs (CLI / CI gate)
 *   - npm run scan-pii (local invocation by contributors)
 *   - planned: PII anonymizer Dollhouse skill (#292)
 *   - planned: MCP server scan_for_pii tool (#293)
 *
 * See issue #245 for the full design and severity model.
 */

import { readFile } from 'node:fs/promises';
import { PIIPattern, PIISeverity, PII_PATTERNS } from './pii-patterns.js';

// ============================================================================
//  Types
// ============================================================================

export interface PIIFinding {
  /** Path of the file the match was found in (caller-provided, not normalized). */
  file: string;
  /** 1-based line number of the start of the match. */
  line: number;
  /** 1-based column of the start of the match within its line. */
  column: number;
  /** Pattern that matched. */
  patternId: string;
  /** Severity of the matching pattern. */
  severity: PIISeverity;
  /** Category key (`credential`, `email`, `path`, etc.). */
  category: string;
  /** Pattern description shown in PR comments and CLI output. */
  description: string;
  /** Suggested redaction text. */
  suggestion: string;
  /** The exact text that matched. */
  matchedText: string;
  /** The full line of source containing the match (helpful for review context). */
  contextLine: string;
}

export interface FileScanResult {
  file: string;
  findings: PIIFinding[];
}

export interface ScanSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  totalFindings: number;
  filesScanned: number;
  filesWithFindings: number;
  /** True when at least one critical or high finding exists — i.e. CI should block. */
  shouldBlock: boolean;
}

// ============================================================================
//  Internals
// ============================================================================

/**
 * Compute the 1-based line/column for a character offset into a source string.
 * Linear scan — fine for the file sizes we care about (a few MB tops).
 */
function offsetToLineColumn(content: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < offset; i++) {
    if (content.codePointAt(i) === 10 /* '\n' */) {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: offset - lastNewline };
}

function extractContextLine(content: string, offset: number): string {
  const start = content.lastIndexOf('\n', offset - 1) + 1;
  let end = content.indexOf('\n', offset);
  if (end === -1) {end = content.length;}
  return content.slice(start, end);
}

function findAllMatches(content: string, pattern: PIIPattern): PIIFinding[] {
  // Rebuild the regex to ensure global + we don't share state across calls
  const flags = pattern.pattern.flags.includes('g') ? pattern.pattern.flags : `${pattern.pattern.flags}g`;
  const regex = new RegExp(pattern.pattern.source, flags);

  const findings: PIIFinding[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    const matched = m[0];
    if (pattern.isFalsePositive?.(matched)) {
      continue;
    }
    const { line, column } = offsetToLineColumn(content, m.index);
    findings.push({
      file: '',
      line,
      column,
      patternId: pattern.id,
      severity: pattern.severity,
      category: pattern.category,
      description: pattern.description,
      suggestion: pattern.suggestion,
      matchedText: matched,
      contextLine: extractContextLine(content, m.index),
    });
    // Defensive: if the pattern ever produces a zero-width match, advance manually
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }
  return findings;
}

// ============================================================================
//  Public API
// ============================================================================

/**
 * Scan a single file's content (already-loaded). The `filePath` is recorded
 * on findings but no I/O is performed.
 */
export function scanContent(filePath: string, content: string): FileScanResult {
  const findings: PIIFinding[] = [];
  for (const pattern of PII_PATTERNS) {
    for (const finding of findAllMatches(content, pattern)) {
      finding.file = filePath;
      findings.push(finding);
    }
  }
  // Stable ordering: severity (critical first), then line, then column
  const order: Record<PIISeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => {
    const s = order[a.severity] - order[b.severity];
    if (s !== 0) {return s;}
    if (a.line !== b.line) {return a.line - b.line;}
    return a.column - b.column;
  });
  return { file: filePath, findings };
}

/** Read a file from disk and scan it. */
export async function scanFile(filePath: string): Promise<FileScanResult> {
  const content = await readFile(filePath, 'utf-8');
  return scanContent(filePath, content);
}

/** Scan many files concurrently. */
export async function scanFiles(filePaths: string[]): Promise<FileScanResult[]> {
  return Promise.all(filePaths.map((p) => scanFile(p)));
}

/** Aggregate counts and CI verdict across results. */
export function summarize(results: FileScanResult[]): ScanSummary {
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;
  let filesWithFindings = 0;
  for (const r of results) {
    if (r.findings.length > 0) {filesWithFindings++;}
    for (const f of r.findings) {
      if (f.severity === 'critical') {critical++;}
      else if (f.severity === 'high') {high++;}
      else if (f.severity === 'medium') {medium++;}
      else if (f.severity === 'low') {low++;}
    }
  }
  const totalFindings = critical + high + medium + low;
  return {
    critical,
    high,
    medium,
    low,
    totalFindings,
    filesScanned: results.length,
    filesWithFindings,
    shouldBlock: critical > 0 || high > 0,
  };
}

// ============================================================================
//  Output helpers (used by CLI and CI)
// ============================================================================

const SEVERITY_ICON: Record<PIISeverity, string> = {
  critical: '🛑',
  high: '⚠️',
  medium: '🔶',
  low: 'ℹ️',
};

/** Single-line summary for CLI/CI logs. */
export function formatSummaryLine(summary: ScanSummary): string {
  return `PII scan: ${summary.totalFindings} finding(s) across ${summary.filesWithFindings}/${summary.filesScanned} file(s) — ` +
    `${SEVERITY_ICON.critical} ${summary.critical} critical, ` +
    `${SEVERITY_ICON.high} ${summary.high} high, ` +
    `${SEVERITY_ICON.medium} ${summary.medium} medium, ` +
    `${SEVERITY_ICON.low} ${summary.low} low`;
}

/** Multi-line human-readable report (for CLI stdout and PR comment bodies). */
export function formatHumanReadable(results: FileScanResult[]): string {
  const lines: string[] = [];
  for (const r of results) {
    if (r.findings.length === 0) {continue;}
    lines.push(`\n${r.file}`);
    for (const f of r.findings) {
      lines.push(
        `  ${SEVERITY_ICON[f.severity]} ${f.severity.toUpperCase()} ` +
          `${f.file}:${f.line}:${f.column}  ${f.description} [${f.patternId}]`,
        `     match: ${truncate(f.matchedText, 80)}`,
        `     context: ${truncate(f.contextLine.trim(), 100)}`,
        `     suggestion: redact to e.g. ${f.suggestion}`,
      );
    }
  }
  return lines.join('\n').trim();
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}
