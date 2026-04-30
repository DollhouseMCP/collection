#!/usr/bin/env node
/**
 * CLI entry point for the PII scanner.
 *
 *   node dist/src/cli/scan-pii.js [options] <file-or-glob> [file-or-glob...]
 *
 * Options:
 *   --json            Emit machine-readable JSON instead of human report
 *   --quiet           Suppress per-finding output, just print summary line
 *   --severity=LEVEL  Treat LEVEL or higher as a CI-blocking finding.
 *                     Values: critical | high | medium | low (default: high)
 *
 * Exit codes:
 *   0  no blocking findings
 *   1  blocking findings (severity ≥ threshold)
 *   2  usage / I/O error
 */

import { glob } from 'glob';
import {
  formatHumanReadable,
  formatSummaryLine,
  scanFile,
  summarize,
  FileScanResult,
} from '../scanners/pii-scanner.js';
import { PIISeverity } from '../scanners/pii-patterns.js';

interface CliOptions {
  json: boolean;
  quiet: boolean;
  blockSeverity: PIISeverity;
  patterns: string[];
}

const SEVERITY_RANK: Record<PIISeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function printUsage(stream: { write(chunk: string): unknown } = process.stderr): void {
  stream.write(
    'Usage: scan-pii [options] <file-or-glob> [file-or-glob...]\n' +
    '\n' +
    'Options:\n' +
    '  --json              Emit JSON instead of human-readable report\n' +
    '  --quiet             Print summary line only, no per-finding details\n' +
    '  --severity=LEVEL    Block (exit 1) on this severity or higher.\n' +
    '                      One of: critical | high | medium | low (default: high)\n' +
    '  -h, --help          Show this message\n'
  );
}

function parseArgs(argv: string[]): CliOptions | null {
  const opts: CliOptions = {
    json: false,
    quiet: false,
    blockSeverity: 'high',
    patterns: [],
  };
  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') {
      return null;
    }
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--quiet') {
      opts.quiet = true;
      continue;
    }
    if (arg.startsWith('--severity=')) {
      const v = arg.slice('--severity='.length) as PIISeverity;
      if (v !== 'critical' && v !== 'high' && v !== 'medium' && v !== 'low') {
        process.stderr.write(`Invalid --severity value: ${v}\n`);
        return null;
      }
      opts.blockSeverity = v;
      continue;
    }
    if (arg.startsWith('--')) {
      process.stderr.write(`Unknown option: ${arg}\n`);
      return null;
    }
    opts.patterns.push(arg);
  }
  return opts;
}

async function expandPatterns(patterns: string[]): Promise<string[]> {
  const expanded = new Set<string>();
  for (const p of patterns) {
    // Comma-separated lists: support `a.md,b.md` for parity with the other scanners
    const parts = p.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      // If it has a glob char, expand. Otherwise treat as literal path.
      if (/[*?[\]{}]/.test(part)) {
        const files = await glob(part, { nodir: true });
        for (const f of files) {expanded.add(f);}
      } else {
        expanded.add(part);
      }
    }
  }
  return [...expanded].sort((a, b) => a.localeCompare(b));
}

async function scanAll(files: string[]): Promise<FileScanResult[] | null> {
  const results: FileScanResult[] = [];
  for (const f of files) {
    try {
      results.push(await scanFile(f));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Failed to scan ${f}: ${msg}\n`);
      return null;
    }
  }
  return results;
}

function emitOutput(opts: CliOptions, results: FileScanResult[], summary: ReturnType<typeof summarize>): void {
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ summary, results }, null, 2)}\n`);
    return;
  }
  if (!opts.quiet) {
    const report = formatHumanReadable(results);
    if (report) {
      process.stdout.write(`${report}\n\n`);
    }
  }
  process.stdout.write(`${formatSummaryLine(summary)}\n`);
}

function computeExitCode(opts: CliOptions, summary: ReturnType<typeof summarize>): number {
  const threshold = SEVERITY_RANK[opts.blockSeverity];
  let blocking = 0;
  if (threshold >= SEVERITY_RANK.critical) {blocking += summary.critical;}
  if (threshold >= SEVERITY_RANK.high) {blocking += summary.high;}
  if (threshold >= SEVERITY_RANK.medium) {blocking += summary.medium;}
  if (threshold >= SEVERITY_RANK.low) {blocking += summary.low;}
  return blocking > 0 ? 1 : 0;
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  const opts = parseArgs(argv);
  if (!opts) {
    printUsage(process.stdout);
    return 2;
  }
  if (opts.patterns.length === 0) {
    printUsage();
    return 2;
  }

  const files = await expandPatterns(opts.patterns);
  if (files.length === 0) {
    process.stderr.write('No files matched the given patterns.\n');
    return 2;
  }

  const results = await scanAll(files);
  if (results === null) {
    return 2;
  }

  const summary = summarize(results);
  emitOutput(opts, results, summary);
  return computeExitCode(opts, summary);
}

// When invoked directly as a script, run main(). When imported (tests), don't.
const isDirectInvocation =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('scan-pii.js');

if (isDirectInvocation) {
  try {
    const code = await main();
    process.exit(code);
  } catch (err) {
    process.stderr.write(`scan-pii: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(2);
  }
}
