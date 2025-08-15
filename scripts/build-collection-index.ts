#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Collection Index Builder
 * 
 * Automatically builds a comprehensive index of all collection elements
 * by scanning the library directory and parsing YAML frontmatter.
 * 
 * Performance targets:
 * - Handle 10,000+ files efficiently
 * - Build time < 5 seconds for 1000 files
 * - Minified JSON output
 */

import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { dirname, join, relative, basename, sep } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import matter from 'gray-matter';
import { glob } from 'glob';
import sanitizeHtml from 'sanitize-html';

// Import type definitions
import type { 
  CollectionIndex, 
  IndexedElement, 
  BuildMetadata,
  ElementType,
  CollectionIndexMap,
  RawFrontmatter,
  FieldLimits
} from './types/build-index.types.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
// Find root directory by looking for package.json (works from both scripts/ and dist/scripts/)
const findRootDir = async (): Promise<string> => {
  let currentDir = __dirname;
  while (currentDir !== dirname(currentDir)) {
    try {
      // Check if package.json exists in current directory
      const packageJsonPath = join(currentDir, 'package.json');
      await access(packageJsonPath);
      return currentDir;
    } catch {
      currentDir = dirname(currentDir);
    }
  }
  throw new Error('Could not find project root (package.json not found)');
};

// These will be initialized in main()
let ROOT_DIR: string;
let LIBRARY_DIR: string;
let OUTPUT_FILE: string;

// Security: Field length limits to prevent bloat
const FIELD_LIMITS: FieldLimits = {
  name: 200,
  description: 500,
  author: 100,
  version: 20,
  tag: 50,
  keyword: 50
} as const;

// Valid element types based on library structure
const VALID_TYPES: readonly string[] = [
  'personas', 'agents', 'skills', 'templates', 
  'memories', 'ensembles', 'prompts', 'tools'
] as const;

/**
 * Sanitize and validate string fields
 * 
 * SECURITY FIX (PR #123): Using industry-standard HTML sanitization library
 * Previously: Custom regex patterns were vulnerable to bypass attacks
 * Now: Using sanitize-html library as recommended by GitHub Copilot autofix
 * 
 * CodeQL Alert #14 Resolution: Following security best practices by using
 * a well-tested, maintained library that handles all edge cases and attack vectors.
 * This is the recommended approach for production applications.
 */
function sanitizeField(value: unknown, limit: number): string {
  if (typeof value !== 'string') {
    return '';
  }
  
  // CRITICAL SECURITY FIX: Use sanitize-html library for proper sanitization
  // As recommended by GitHub Copilot autofix for CodeQL Alert #14
  // This library handles all edge cases including:
  // - Nested tags: <<script>alert(1)</script>
  // - Incomplete tags: <scrip<script>t>
  // - Event handlers: <img onerror="alert(1)">
  // - And many other attack vectors
  
  // Remove ALL HTML tags and attributes - we want plain text only
  const sanitized: string = sanitizeHtml(value, {
    allowedTags: [],        // No HTML tags allowed
    allowedAttributes: {},  // No attributes allowed
    disallowedTagsMode: 'recursiveEscape'  // Escape any HTML found
  }).trim();
  
  // Apply length limit
  return sanitized.length > limit ? sanitized.slice(0, limit) : sanitized;
}

/**
 * Validate and sanitize array fields (tags, keywords)
 */
function sanitizeArrayField(value: unknown, itemLimit: number): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  
  return value
    .filter((item: unknown): item is string => typeof item === 'string')
    .map((item: string) => sanitizeField(item, itemLimit))
    .filter((item: string) => item.length > 0)
    .slice(0, 20); // Max 20 items per array
}

/**
 * Calculate SHA-256 hash of file content for change detection
 */
async function calculateFileSHA(filePath: string): Promise<string> {
  try {
    const content: Buffer = await readFile(filePath);
    return createHash('sha256').update(content).digest('hex').slice(0, 16); // Short hash
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: Could not calculate SHA for ${filePath}:`, errorMessage);
    return 'unknown';
  }
}

/**
 * Determine element type from file path
 */
function getElementType(filePath: string): ElementType | null {
  const relativePath: string = relative(LIBRARY_DIR, filePath);
  const pathParts: string[] = relativePath.split(sep);
  
  if (pathParts.length >= 2) {
    const type: string = pathParts[0];
    return VALID_TYPES.includes(type) ? (type as ElementType) : 'other' as ElementType;
  }
  
  return 'other' as ElementType;
}

/**
 * Parse and extract metadata from a markdown file
 */
async function parseElementFile(filePath: string): Promise<IndexedElement | null> {
  try {
    const content: string = await readFile(filePath, 'utf-8');
    const { data: frontmatter }: { data: RawFrontmatter } = matter(content);
    
    // Calculate file hash for change detection
    const sha: string = await calculateFileSHA(filePath);
    
    // Determine element type
    const type: ElementType | null = getElementType(filePath);
    
    // Extract and sanitize core metadata
    const baseElement = {
      path: relative(ROOT_DIR, filePath),
      type: type || 'other',
      name: sanitizeField(frontmatter.name || basename(filePath, '.md'), FIELD_LIMITS.name),
      description: sanitizeField(frontmatter.description || '', FIELD_LIMITS.description),
      version: sanitizeField(frontmatter.version || '1.0.0', FIELD_LIMITS.version),
      author: sanitizeField(frontmatter.author || 'unknown', FIELD_LIMITS.author),
      tags: sanitizeArrayField(frontmatter.tags || [], FIELD_LIMITS.tag),
      sha: sha
    };
    
    // Build final element with optional fields
    const elementData: Record<string, unknown> = { ...baseElement };
    
    if (frontmatter.keywords) {
      elementData.keywords = sanitizeArrayField(frontmatter.keywords, FIELD_LIMITS.keyword);
    }
    
    if (frontmatter.category) {
      elementData.category = sanitizeField(frontmatter.category, 50);
    }
    
    if (frontmatter.created || frontmatter.created_date) {
      const dateStr = frontmatter.created || frontmatter.created_date;
      elementData.created = typeof dateStr === 'string' ? dateStr : String(dateStr);
    }
    
    if (frontmatter.license) {
      elementData.license = sanitizeField(frontmatter.license, 30);
    }
    
    return elementData as unknown as IndexedElement;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: Failed to parse ${filePath}:`, errorMessage);
    return null;
  }
}

/**
 * Scan library directory and build index
 */
async function buildCollectionIndex(): Promise<void> {
  const startTime: number = Date.now();
  
  console.log('🔍 Scanning library directory...');
  
  try {
    // Find all markdown files in library
    const pattern: string = join(LIBRARY_DIR, '**', '*.md').replace(/\\/g, '/');
    const files: string[] = await glob(pattern, { 
      ignore: ['**/node_modules/**', '**/.*'],
      absolute: true
    });
    
    console.log(`📄 Found ${files.length} markdown files`);
    
    if (files.length === 0) {
      console.warn('⚠️  No markdown files found in library directory');
      return;
    }
    
    // Process files in batches for better memory management
    const BATCH_SIZE: number = 100;
    const elements: IndexedElement[] = [];
    const skippedFiles: string[] = [];
    
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch: string[] = files.slice(i, i + BATCH_SIZE);
      console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)}`);
      
      const batchPromises: Promise<IndexedElement | null>[] = batch.map(async (filePath: string) => {
        try {
          return await parseElementFile(filePath);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.warn(`⚠️  Skipping ${filePath}: ${errorMessage}`);
          skippedFiles.push(relative(ROOT_DIR, filePath));
          return null;
        }
      });
      
      const batchResults: (IndexedElement | null)[] = await Promise.all(batchPromises);
      elements.push(...batchResults.filter((element): element is IndexedElement => element !== null));
    }
    
    // Group elements by type
    const index: Record<string, IndexedElement[]> = {};
    VALID_TYPES.forEach((type: string) => {
      index[type] = [];
    });
    
    // Add 'other' category for unrecognized types
    index.other = [];
    
    elements.forEach((element: IndexedElement) => {
      const type: string = element.type || 'other';
      if (index[type]) {
        index[type].push(element);
      } else {
        index.other.push(element);
      }
    });
    
    // Sort each category by name for consistent ordering
    Object.keys(index).forEach((type: string) => {
      index[type].sort((a: IndexedElement, b: IndexedElement) => a.name.localeCompare(b.name));
    });
    
    // Remove empty categories
    Object.keys(index).forEach((type: string) => {
      if (index[type].length === 0) {
        delete index[type];
      }
    });
    
    const buildTime: number = Date.now() - startTime;
    
    // Build final index structure
    // TYPESCRIPT FIX (PR #123): Define metadata with optional properties upfront
    // Previously: Dynamic property addition caused type errors
    // Now: Proper metadata type with all possible properties
    const metadata: BuildMetadata = {
      build_time_ms: buildTime,
      file_count: files.length,
      skipped_files: skippedFiles.length,
      categories: Object.keys(index).length,
      nodejs_version: process.version,
      builder_version: '1.0.0',
      // Optional properties for warnings
      ...(skippedFiles.length > 0 && {
        skipped_files_list: skippedFiles.slice(0, 10),
        ...(skippedFiles.length > 10 && {
          additional_skipped: skippedFiles.length - 10
        })
      })
    };
    
    const collectionIndex: CollectionIndex = {
      version: '2.0.0',
      generated: new Date().toISOString(),
      total_elements: elements.length,
      index: index as CollectionIndexMap,
      metadata: metadata
    };
    
    // Write to output file (minified JSON for bandwidth efficiency)
    await writeFile(OUTPUT_FILE, JSON.stringify(collectionIndex), 'utf-8');
    
    // Log summary
    console.log('\n✅ Collection index built successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   • Total elements: ${elements.length}`);
    console.log(`   • Categories: ${Object.keys(index).length}`);
    console.log(`   • Build time: ${buildTime}ms`);
    console.log(`   • Skipped files: ${skippedFiles.length}`);
    console.log(`   • Output file: ${relative(ROOT_DIR, OUTPUT_FILE)}`);
    
    // Category breakdown
    console.log(`\n📋 Category breakdown:`);
    Object.entries(index).forEach(([category, items]: [string, IndexedElement[]]) => {
      console.log(`   • ${category}: ${items.length} items`);
    });
    
    // Performance check
    const elementsPerSecond: number = Math.round((elements.length / buildTime) * 1000);
    console.log(`\n⚡ Performance: ${elementsPerSecond} elements/second`);
    
    if (buildTime > 10000) { // Warn if build takes more than 10 seconds
      console.warn(`⚠️  Build time exceeded 10 seconds (${buildTime}ms). Consider optimization.`);
    }
    
    if (skippedFiles.length > 0) {
      console.warn(`⚠️  ${skippedFiles.length} files were skipped due to parsing errors.`);
      if (skippedFiles.length <= 5) {
        console.warn('Skipped files:', skippedFiles.join(', '));
      }
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to build collection index:', errorMessage);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🤖 Collection Index Builder v1.0.0');
  console.log('=====================================\n');
  
  // Initialize paths
  ROOT_DIR = await findRootDir();
  LIBRARY_DIR = join(ROOT_DIR, 'library');
  OUTPUT_FILE = join(ROOT_DIR, 'public', 'collection-index.json');
  
  // Verify library directory exists
  try {
    await access(LIBRARY_DIR);
  } catch {
    console.error(`❌ Library directory not found: ${LIBRARY_DIR}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  const outputDir: string = dirname(OUTPUT_FILE);
  try {
    await mkdir(outputDir, { recursive: true });
  } catch {
    console.error(`❌ Failed to create output directory: ${outputDir}`);
    process.exit(1);
  }
  
  await buildCollectionIndex();
}

// Handle uncaught errors gracefully
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
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