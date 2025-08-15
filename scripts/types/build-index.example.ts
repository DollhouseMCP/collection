/**
 * Example usage of build-index.types.ts
 * 
 * This file demonstrates how the type definitions would be used
 * in the refactored TypeScript version of build-collection-index.js
 * 
 * @example Usage in the main builder
 */

/* eslint-disable no-console */

import {
  CollectionIndex,
  IndexedElement,
  BuildMetadata,
  ParseResult,
  ElementType,
  // FieldLimits, // Commented for now to avoid TS6133 warning
  DEFAULT_FIELD_LIMITS,
  VALID_ELEMENT_TYPES,
  isElementType,
  isIndexedElement,
  isCollectionIndex,
  RawFrontmatter,
  BuildConfig,
  ProcessingError
} from './build-index.types.js';

// ============================================================================
// EXAMPLE USAGE IN REFACTORED TYPESCRIPT CODE
// ============================================================================

/**
 * Example: Sanitize and validate a field with type safety
 */
function sanitizeField(value: unknown, limit: number): string {
  if (typeof value !== 'string') {
    return '';
  }
  
  // Sanitization logic here...
  const sanitized = value.trim();
  
  return sanitized.length > limit ? sanitized.slice(0, limit) : sanitized;
}

/**
 * Example: Parse element file with full type safety
 */
async function parseElementFile(filePath: string): Promise<IndexedElement | null> {
  try {
    // File reading and parsing logic...
    const frontmatter: RawFrontmatter = {}; // Would be parsed from file
    
    // Type-safe element construction
    const element: IndexedElement = {
      path: filePath,
      type: ElementType.PERSONAS, // Type-safe enum usage
      name: sanitizeField(frontmatter.name, DEFAULT_FIELD_LIMITS.name),
      description: sanitizeField(frontmatter.description, DEFAULT_FIELD_LIMITS.description),
      version: sanitizeField(frontmatter.version, DEFAULT_FIELD_LIMITS.version),
      author: sanitizeField(frontmatter.author, DEFAULT_FIELD_LIMITS.author),
      tags: [], // Would be sanitized array
      sha: 'computed-hash'
    };
    
    // Validate before returning
    if (!isIndexedElement(element)) {
      throw new Error('Invalid element structure');
    }
    
    return element;
    
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
    return null;
  }
}

/**
 * Example: Build collection index with type safety
 */
async function buildCollectionIndex(): Promise<CollectionIndex> {
  const startTime = Date.now();
  
  // Type-safe configuration
  const config: BuildConfig = {
    rootDir: process.cwd(),
    libraryDir: './library',
    outputFile: './public/collection-index.json',
    batchSize: 100,
    fieldLimits: DEFAULT_FIELD_LIMITS,
    validTypes: VALID_ELEMENT_TYPES,
    includeDiagnostics: true,
    maxSkippedFilesList: 10
  };
  
  // Process files with type safety
  console.log(`Processing with config for ${config.libraryDir}`);
  const elements: IndexedElement[] = [];
  const skippedFiles: string[] = [];
  
  // Build index map with type safety
  const indexMap: Record<string, IndexedElement[]> = {};
  
  // Initialize with known types
  VALID_ELEMENT_TYPES.forEach(type => {
    indexMap[type] = [];
  });
  indexMap[ElementType.OTHER] = [];
  
  // Categorize elements
  elements.forEach(element => {
    const type = isElementType(element.type) ? element.type : ElementType.OTHER;
    if (!indexMap[type]) {
      indexMap[type] = [];
    }
    indexMap[type].push(element);
  });
  
  // Build metadata with type safety
  const metadata: BuildMetadata = {
    build_time_ms: Date.now() - startTime,
    file_count: 0, // Would be actual count
    skipped_files: skippedFiles.length,
    categories: Object.keys(indexMap).length,
    nodejs_version: process.version,
    builder_version: '1.0.0'
  };
  
  // Create final index
  const collectionIndex: CollectionIndex = {
    version: '2.0.0',
    generated: new Date().toISOString(),
    total_elements: elements.length,
    index: indexMap,
    metadata
  };
  
  // Validate before returning
  if (!isCollectionIndex(collectionIndex)) {
    throw new Error('Invalid collection index structure');
  }
  
  return collectionIndex;
}

/**
 * Example: Error handling with typed errors
 */
function handleProcessingError(filePath: string, error: Error): ProcessingError {
  return {
    filePath,
    message: error.message,
    code: 'code' in error ? String(error.code) : undefined,
    stack: error.stack,
    timestamp: new Date()
  };
}

/**
 * Example: Type-safe batch processing
 */
async function processBatch(files: string[]): Promise<ParseResult[]> {
  const results: ParseResult[] = [];
  
  for (const filePath of files) {
    try {
      const element = await parseElementFile(filePath);
      results.push({
        element,
        filePath,
        error: element === null ? 'Parsing failed' : undefined
      });
    } catch (error) {
      results.push({
        element: null,
        filePath,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

// ============================================================================
// EXAMPLE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Example: Validate collection index completeness
 */
function validateCollectionIndex(index: CollectionIndex): boolean {
  if (!isCollectionIndex(index)) {
    return false;
  }
  
  // Check that total_elements matches actual count
  const actualTotal = Object.values(index.index)
    .reduce((sum, elements) => sum + (elements?.length || 0), 0);
  
  if (index.total_elements !== actualTotal) {
    console.error('Total elements mismatch');
    return false;
  }
  
  // Validate all elements
  for (const [type, elements] of Object.entries(index.index)) {
    if (!elements) {
      continue;
    }
    
    for (const element of elements) {
      if (!isIndexedElement(element)) {
        console.error(`Invalid element in ${type}:`, element);
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Example: Type-safe configuration validation
 */
function validateBuildConfig(config: Partial<BuildConfig>): config is BuildConfig {
  return (
    typeof config.rootDir === 'string' &&
    typeof config.libraryDir === 'string' &&
    typeof config.outputFile === 'string' &&
    typeof config.batchSize === 'number' &&
    config.batchSize > 0 &&
    typeof config.fieldLimits === 'object' &&
    config.fieldLimits !== null &&
    Array.isArray(config.validTypes) &&
    typeof config.includeDiagnostics === 'boolean' &&
    typeof config.maxSkippedFilesList === 'number'
  );
}

export {
  parseElementFile,
  buildCollectionIndex,
  validateCollectionIndex,
  validateBuildConfig,
  handleProcessingError,
  processBatch
};