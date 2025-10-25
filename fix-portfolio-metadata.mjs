#!/usr/bin/env node
/**
 * Portfolio Metadata Fixer for DollhouseMCP
 *
 * Fixes metadata validation issues in portfolio files to match collection schema requirements.
 *
 * Requirements from collection schema:
 * 1. unique_id: Must match /^[a-z0-9-_]+$/ (lowercase only, no colons or special chars)
 *    Format: {type}_{name}_{author}_{YYYYMMDD-HHMMSS}
 * 2. version: Must match /^\d+\.\d+\.\d+$/ (semantic versioning)
 * 3. type: Must be singular form (persona, skill, agent, prompt, template, tool, ensemble, memory)
 * 4. author: Required field (string)
 * 5. Type-specific fields:
 *    - Skills need: capabilities (array)
 *    - Templates need: format (string) and category
 *    - Agents need: capabilities (array)
 *
 * Usage:
 *   node fix-portfolio-metadata.mjs [--dry-run] [--backup] [--type <type>]
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Portfolio base path
const PORTFOLIO_PATH = path.join(process.env.HOME, '.dollhouse', 'portfolio');

// Valid content types (singular form required)
const VALID_TYPES = ['persona', 'skill', 'agent', 'prompt', 'template', 'tool', 'ensemble', 'memory'];

// Plural to singular mapping
const TYPE_MAPPING = {
  'personas': 'persona',
  'skills': 'skill',
  'agents': 'agent',
  'prompts': 'prompt',
  'templates': 'template',
  'tools': 'tool',
  'ensembles': 'ensemble',
  'memories': 'memory'
};

// Stats tracking
const stats = {
  filesScanned: 0,
  filesFixed: 0,
  filesSkipped: 0,
  filesErrored: 0,
  issuesFound: {
    unique_id: 0,
    version: 0,
    type: 0,
    author: 0,
    capabilities: 0,
    format: 0,
    category: 0
  },
  issuesFixed: {
    unique_id: 0,
    version: 0,
    type: 0,
    author: 0,
    capabilities: 0,
    format: 0,
    category: 0
  }
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    backup: args.includes('--backup'),
    type: null
  };

  const typeIndex = args.indexOf('--type');
  if (typeIndex !== -1 && args[typeIndex + 1]) {
    options.type = args[typeIndex + 1];
  }

  return options;
}

/**
 * Generate a valid unique_id from metadata
 */
function generateUniqueId(metadata, originalId) {
  // Try to preserve existing valid IDs
  if (originalId && /^[a-z0-9-_]+$/.test(originalId) && !originalId.includes(':')) {
    return originalId;
  }

  const type = metadata.type || 'unknown';
  const name = (metadata.name || 'unnamed')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const author = (metadata.author || 'anonymous')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Extract or generate timestamp
  let timestamp;
  if (originalId) {
    // Try to extract timestamp from existing ID
    const timeMatch = originalId.match(/(\d{8}[-_]\d{6})/);
    if (timeMatch) {
      timestamp = timeMatch[1].replace('_', '-');
    }
  }

  if (!timestamp) {
    const created = metadata.created || metadata.created_date;
    if (created) {
      const date = new Date(created);
      if (!isNaN(date.getTime())) {
        const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
        const hhmmss = date.toISOString().slice(11, 19).replace(/:/g, '');
        timestamp = `${yyyymmdd}-${hhmmss}`;
      }
    }
  }

  if (!timestamp) {
    // Use current time as fallback
    const now = new Date();
    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const hhmmss = now.toISOString().slice(11, 19).replace(/:/g, '');
    timestamp = `${yyyymmdd}-${hhmmss}`;
  }

  return `${type}_${name}_${author}_${timestamp}`;
}

/**
 * Fix version format to semantic versioning
 */
function fixVersion(version) {
  if (!version) return '1.0.0';

  const versionStr = String(version);

  // Already valid
  if (/^\d+\.\d+\.\d+$/.test(versionStr)) {
    return versionStr;
  }

  // Convert common formats
  if (/^\d+\.\d+$/.test(versionStr)) {
    return `${versionStr}.0`;
  }

  if (/^\d+$/.test(versionStr)) {
    return `${versionStr}.0.0`;
  }

  // Extract numbers from string
  const numbers = versionStr.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const major = numbers[0] || '1';
    const minor = numbers[1] || '0';
    const patch = numbers[2] || '0';
    return `${major}.${minor}.${patch}`;
  }

  // Default fallback
  return '1.0.0';
}

/**
 * Fix type field to singular form
 */
function fixType(type) {
  if (!type) return null;

  const typeStr = String(type).toLowerCase();

  // Already valid
  if (VALID_TYPES.includes(typeStr)) {
    return typeStr;
  }

  // Map plural to singular
  if (TYPE_MAPPING[typeStr]) {
    return TYPE_MAPPING[typeStr];
  }

  return null;
}

/**
 * Validate and fix metadata
 */
function fixMetadata(metadata, filePath) {
  const issues = [];
  const fixes = {};
  let needsFix = false;

  // Fix unique_id
  if (!metadata.unique_id || !/^[a-z0-9-_]+$/.test(metadata.unique_id) || metadata.unique_id.includes(':')) {
    issues.push('unique_id format invalid (contains uppercase, colons, or special chars)');
    stats.issuesFound.unique_id++;
    const newId = generateUniqueId(metadata, metadata.unique_id);
    fixes.unique_id = newId;
    needsFix = true;
  }

  // Fix version
  if (!metadata.version || !/^\d+\.\d+\.\d+$/.test(String(metadata.version))) {
    issues.push(`version format invalid (${metadata.version || 'missing'})`);
    stats.issuesFound.version++;
    fixes.version = fixVersion(metadata.version);
    needsFix = true;
  }

  // Fix type
  if (!metadata.type || !VALID_TYPES.includes(String(metadata.type).toLowerCase())) {
    const originalType = metadata.type;
    const fixedType = fixType(metadata.type);
    if (!fixedType) {
      // Try to infer from file path
      const pathType = path.basename(path.dirname(filePath));
      fixes.type = fixType(pathType) || 'persona';
    } else {
      fixes.type = fixedType;
    }
    issues.push(`type invalid or plural (${originalType} -> ${fixes.type})`);
    stats.issuesFound.type++;
    needsFix = true;
  }

  // Ensure author exists
  if (!metadata.author || metadata.author === 'anonymous' || String(metadata.author).trim() === '') {
    issues.push('author missing or anonymous');
    stats.issuesFound.author++;
    fixes.author = 'DollhouseMCP';
    needsFix = true;
  }

  // Type-specific fixes
  const contentType = fixes.type || metadata.type;

  if (contentType === 'skill') {
    if (!metadata.capabilities || !Array.isArray(metadata.capabilities) || metadata.capabilities.length === 0) {
      issues.push('skill missing capabilities array');
      stats.issuesFound.capabilities++;
      fixes.capabilities = ['general-purpose'];
      needsFix = true;
    }
  }

  if (contentType === 'agent') {
    if (!metadata.capabilities || !Array.isArray(metadata.capabilities) || metadata.capabilities.length === 0) {
      issues.push('agent missing capabilities array');
      stats.issuesFound.capabilities++;
      fixes.capabilities = ['autonomous-task-execution'];
      needsFix = true;
    }
  }

  if (contentType === 'template') {
    if (!metadata.format) {
      issues.push('template missing format field');
      stats.issuesFound.format++;
      fixes.format = 'markdown';
      needsFix = true;
    }
    if (!metadata.category || !['creative', 'educational', 'gaming', 'personal', 'professional'].includes(metadata.category)) {
      issues.push(`template missing or invalid category (${metadata.category || 'missing'})`);
      stats.issuesFound.category++;
      fixes.category = 'professional';
      needsFix = true;
    }
  }

  return { issues, fixes, needsFix };
}

/**
 * Process a single file
 */
async function processFile(filePath, options) {
  stats.filesScanned++;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);

    // Validate and get fixes
    const { issues, fixes, needsFix } = fixMetadata(parsed.data, filePath);

    if (!needsFix) {
      console.log(`✓ ${path.relative(PORTFOLIO_PATH, filePath)} - Already valid`);
      stats.filesSkipped++;
      return;
    }

    // Report issues
    console.log(`\n${'='.repeat(80)}`);
    console.log(`File: ${path.relative(PORTFOLIO_PATH, filePath)}`);
    console.log(`Issues found (${issues.length}):`);
    issues.forEach(issue => console.log(`  - ${issue}`));

    if (Object.keys(fixes).length > 0) {
      console.log('\nFixes to apply:');
      Object.entries(fixes).forEach(([key, value]) => {
        console.log(`  ${key}: ${JSON.stringify(parsed.data[key])} -> ${JSON.stringify(value)}`);
      });
    }

    if (options.dryRun) {
      console.log('\n[DRY RUN] Would fix this file');
      stats.filesFixed++;
      Object.keys(fixes).forEach(key => {
        stats.issuesFixed[key]++;
      });
      return;
    }

    // Apply fixes
    const newMetadata = { ...parsed.data, ...fixes };

    // Create backup if requested
    if (options.backup) {
      const backupPath = `${filePath}.backup`;
      fs.copyFileSync(filePath, backupPath);
      console.log(`Created backup: ${path.basename(backupPath)}`);
    }

    // Write fixed content
    const newContent = matter.stringify(parsed.content, newMetadata);
    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log('✓ Fixed successfully');
    stats.filesFixed++;
    Object.keys(fixes).forEach(key => {
      stats.issuesFixed[key]++;
    });

  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    stats.filesErrored++;
  }
}

/**
 * Scan directory for markdown files
 */
function scanDirectory(dirPath, options) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return files;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Skip hidden directories and backups
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...scanDirectory(fullPath, options));
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.endsWith('.backup.md')) {
      // Filter by type if specified
      if (options.type) {
        const parentDir = path.basename(path.dirname(fullPath));
        if (parentDir === options.type || parentDir === options.type + 's') {
          files.push(fullPath);
        }
      } else {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Print summary report
 */
function printSummary(options) {
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`\nFiles scanned: ${stats.filesScanned}`);
  console.log(`Files fixed: ${stats.filesFixed}`);
  console.log(`Files skipped (already valid): ${stats.filesSkipped}`);
  console.log(`Files with errors: ${stats.filesErrored}`);

  console.log('\n--- Issues Found ---');
  Object.entries(stats.issuesFound).forEach(([issue, count]) => {
    if (count > 0) {
      console.log(`  ${issue}: ${count}`);
    }
  });

  console.log('\n--- Issues Fixed ---');
  Object.entries(stats.issuesFixed).forEach(([issue, count]) => {
    if (count > 0) {
      console.log(`  ${issue}: ${count}`);
    }
  });

  if (options.dryRun) {
    console.log('\n*** DRY RUN MODE - No files were modified ***');
    console.log('Run without --dry-run to apply fixes');
  } else {
    console.log('\n✓ All fixes applied successfully');
    if (options.backup) {
      console.log('Backups created with .backup extension');
    }
  }
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs();

  console.log('DollhouseMCP Portfolio Metadata Fixer');
  console.log('=====================================\n');
  console.log(`Portfolio path: ${PORTFOLIO_PATH}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Backup: ${options.backup ? 'Enabled' : 'Disabled'}`);
  if (options.type) {
    console.log(`Type filter: ${options.type}`);
  }
  console.log('');

  // Scan for files
  const files = scanDirectory(PORTFOLIO_PATH, options);

  if (files.length === 0) {
    console.log('No markdown files found in portfolio.');
    return;
  }

  console.log(`Found ${files.length} files to process\n`);

  // Process each file
  for (const file of files) {
    await processFile(file, options);
  }

  // Print summary
  printSummary(options);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
