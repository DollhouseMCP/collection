#!/usr/bin/env node

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

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import matter from 'gray-matter';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LIBRARY_DIR = path.join(ROOT_DIR, 'library');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'collection-index.json');

// Security: Field length limits to prevent bloat
const FIELD_LIMITS = {
  name: 200,
  description: 500,
  author: 100,
  version: 20,
  tag: 50,
  keyword: 50
};

// Valid element types based on library structure
const VALID_TYPES = [
  'personas', 'agents', 'skills', 'templates', 
  'memories', 'ensembles', 'prompts', 'tools'
];

/**
 * Sanitize and validate string fields
 */
function sanitizeField(value, limit) {
  if (typeof value !== 'string') return '';
  
  // Remove potential HTML/script content
  const sanitized = value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, '') // Remove dangerous characters
    .trim();
    
  return sanitized.length > limit ? sanitized.slice(0, limit) : sanitized;
}

/**
 * Validate and sanitize array fields (tags, keywords)
 */
function sanitizeArrayField(value, itemLimit) {
  if (!Array.isArray(value)) return [];
  
  return value
    .filter(item => typeof item === 'string')
    .map(item => sanitizeField(item, itemLimit))
    .filter(item => item.length > 0)
    .slice(0, 20); // Max 20 items per array
}

/**
 * Calculate SHA-256 hash of file content for change detection
 */
async function calculateFileSHA(filePath) {
  try {
    const content = await fs.readFile(filePath);
    return createHash('sha256').update(content).digest('hex').slice(0, 16); // Short hash
  } catch (error) {
    console.warn(`Warning: Could not calculate SHA for ${filePath}:`, error.message);
    return 'unknown';
  }
}

/**
 * Determine element type from file path
 */
function getElementType(filePath) {
  const relativePath = path.relative(LIBRARY_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  
  if (pathParts.length >= 2) {
    const type = pathParts[0];
    return VALID_TYPES.includes(type) ? type : 'other';
  }
  
  return 'other';
}

/**
 * Parse and extract metadata from a markdown file
 */
async function parseElementFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter } = matter(content);
    
    // Calculate file hash for change detection
    const sha = await calculateFileSHA(filePath);
    
    // Determine element type
    const type = getElementType(filePath);
    
    // Extract and sanitize core metadata
    const element = {
      path: path.relative(ROOT_DIR, filePath),
      type: type,
      name: sanitizeField(frontmatter.name || path.basename(filePath, '.md'), FIELD_LIMITS.name),
      description: sanitizeField(frontmatter.description || '', FIELD_LIMITS.description),
      version: sanitizeField(frontmatter.version || '1.0.0', FIELD_LIMITS.version),
      author: sanitizeField(frontmatter.author || 'unknown', FIELD_LIMITS.author),
      tags: sanitizeArrayField(frontmatter.tags || [], FIELD_LIMITS.tag),
      sha: sha
    };
    
    // Add optional fields if present
    if (frontmatter.keywords) {
      element.keywords = sanitizeArrayField(frontmatter.keywords, FIELD_LIMITS.keyword);
    }
    
    if (frontmatter.category) {
      element.category = sanitizeField(frontmatter.category, 50);
    }
    
    if (frontmatter.created || frontmatter.created_date) {
      const dateStr = frontmatter.created || frontmatter.created_date;
      element.created = typeof dateStr === 'string' ? dateStr : String(dateStr);
    }
    
    if (frontmatter.license) {
      element.license = sanitizeField(frontmatter.license, 30);
    }
    
    return element;
    
  } catch (error) {
    console.warn(`Warning: Failed to parse ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Scan library directory and build index
 */
async function buildCollectionIndex() {
  const startTime = Date.now();
  
  console.log('🔍 Scanning library directory...');
  
  try {
    // Find all markdown files in library
    const pattern = path.join(LIBRARY_DIR, '**', '*.md').replace(/\\/g, '/');
    const files = await glob(pattern, { 
      ignore: ['**/node_modules/**', '**/.*'],
      absolute: true
    });
    
    console.log(`📄 Found ${files.length} markdown files`);
    
    if (files.length === 0) {
      console.warn('⚠️  No markdown files found in library directory');
      return;
    }
    
    // Process files in batches for better memory management
    const BATCH_SIZE = 100;
    const elements = [];
    const skippedFiles = [];
    
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)}`);
      
      const batchPromises = batch.map(async (filePath) => {
        try {
          return await parseElementFile(filePath);
        } catch (error) {
          console.warn(`⚠️  Skipping ${filePath}: ${error.message}`);
          skippedFiles.push(path.relative(ROOT_DIR, filePath));
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      elements.push(...batchResults.filter(element => element !== null));
    }
    
    // Group elements by type
    const index = {};
    VALID_TYPES.forEach(type => {
      index[type] = [];
    });
    
    // Add 'other' category for unrecognized types
    index.other = [];
    
    elements.forEach(element => {
      const type = element.type || 'other';
      if (index[type]) {
        index[type].push(element);
      } else {
        index.other.push(element);
      }
    });
    
    // Sort each category by name for consistent ordering
    Object.keys(index).forEach(type => {
      index[type].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    // Remove empty categories
    Object.keys(index).forEach(type => {
      if (index[type].length === 0) {
        delete index[type];
      }
    });
    
    const buildTime = Date.now() - startTime;
    
    // Build final index structure
    const collectionIndex = {
      version: '2.0.0',
      generated: new Date().toISOString(),
      total_elements: elements.length,
      index: index,
      metadata: {
        build_time_ms: buildTime,
        file_count: files.length,
        skipped_files: skippedFiles.length,
        categories: Object.keys(index).length,
        nodejs_version: process.version,
        builder_version: '1.0.0'
      }
    };
    
    // Add warnings if any files were skipped
    if (skippedFiles.length > 0) {
      collectionIndex.metadata.skipped_files_list = skippedFiles.slice(0, 10); // Only show first 10
      if (skippedFiles.length > 10) {
        collectionIndex.metadata.additional_skipped = skippedFiles.length - 10;
      }
    }
    
    // Write to output file (minified JSON for bandwidth efficiency)
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(collectionIndex), 'utf-8');
    
    // Log summary
    console.log('\n✅ Collection index built successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   • Total elements: ${elements.length}`);
    console.log(`   • Categories: ${Object.keys(index).length}`);
    console.log(`   • Build time: ${buildTime}ms`);
    console.log(`   • Skipped files: ${skippedFiles.length}`);
    console.log(`   • Output file: ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
    
    // Category breakdown
    console.log(`\n📋 Category breakdown:`);
    Object.entries(index).forEach(([category, items]) => {
      console.log(`   • ${category}: ${items.length} items`);
    });
    
    // Performance check
    const elementsPerSecond = Math.round((elements.length / buildTime) * 1000);
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
    console.error('❌ Failed to build collection index:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🤖 Collection Index Builder v1.0.0');
  console.log('=====================================\n');
  
  // Verify library directory exists
  try {
    await fs.access(LIBRARY_DIR);
  } catch {
    console.error(`❌ Library directory not found: ${LIBRARY_DIR}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch {
    console.error(`❌ Failed to create output directory: ${outputDir}`);
    process.exit(1);
  }
  
  await buildCollectionIndex();
}

// Handle uncaught errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}