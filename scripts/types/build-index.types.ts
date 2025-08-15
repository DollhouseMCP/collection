/**
 * TypeScript type definitions for the Collection Index Builder
 * 
 * This file provides comprehensive type safety for the build-collection-index.js
 * refactor to TypeScript. All types are designed to be strict (no 'any' types)
 * and compatible with existing collection types.
 * 
 * @version 1.0.0
 * @author DollhouseMCP Collection Team
 */

// NOTE: ContentMetadata import is ready for future integration if needed
// import { ContentMetadata } from '../../src/types/index.js';

// ============================================================================
// ELEMENT TYPES & VALIDATION
// ============================================================================

/**
 * Valid element types based on library directory structure
 * This enum ensures type safety when categorizing collection elements
 */
export enum ElementType {
  PERSONAS = 'personas',
  AGENTS = 'agents',
  SKILLS = 'skills',
  TEMPLATES = 'templates',
  MEMORIES = 'memories',
  ENSEMBLES = 'ensembles',
  PROMPTS = 'prompts',
  TOOLS = 'tools',
  OTHER = 'other'
}

/**
 * Field length limits for security and consistency
 * Prevents content bloat and potential security issues
 */
export interface FieldLimits {
  readonly name: number;
  readonly description: number;
  readonly author: number;
  readonly version: number;
  readonly tag: number;
  readonly keyword: number;
}

// ============================================================================
// CORE INDEX STRUCTURES
// ============================================================================

/**
 * Individual element in the collection index
 * Represents a single parsed collection element with all metadata
 */
export interface IndexedElement {
  /** Relative path from project root to the element file */
  readonly path: string;
  
  /** Element type (personas, agents, skills, etc.) */
  readonly type: ElementType | string;
  
  /** Display name of the element */
  readonly name: string;
  
  /** Description of the element's purpose and functionality */
  readonly description: string;
  
  /** Version string (semver recommended) */
  readonly version: string;
  
  /** Author or creator name */
  readonly author: string;
  
  /** Array of tags for categorization and search */
  readonly tags: readonly string[];
  
  /** Short SHA-256 hash for change detection (16 chars) */
  readonly sha: string;
  
  // Optional fields that may be present in frontmatter
  /** Keywords for enhanced search capabilities */
  readonly keywords?: readonly string[];
  
  /** Category classification (if specified in frontmatter) */
  readonly category?: string;
  
  /** Creation date (ISO string or custom format) */
  readonly created?: string;
  
  /** License information */
  readonly license?: string;
}

/**
 * Build process metadata and statistics
 * Tracks build performance and provides diagnostic information
 */
export interface BuildMetadata {
  /** Total build time in milliseconds */
  readonly build_time_ms: number;
  
  /** Total number of files processed */
  readonly file_count: number;
  
  /** Number of files that failed to parse */
  readonly skipped_files: number;
  
  /** Number of categories found in the collection */
  readonly categories: number;
  
  /** Node.js version used during build */
  readonly nodejs_version: string;
  
  /** Builder script version */
  readonly builder_version: string;
  
  // Optional diagnostic fields
  /** List of skipped files (limited to first 10) */
  readonly skipped_files_list?: readonly string[];
  
  /** Count of additional skipped files beyond the list */
  readonly additional_skipped?: number;
}

/**
 * Complete collection index structure
 * The main output format for the collection index JSON file
 */
export interface CollectionIndex {
  /** Index format version */
  readonly version: string;
  
  /** ISO timestamp when index was generated */
  readonly generated: string;
  
  /** Total number of elements in the collection */
  readonly total_elements: number;
  
  /** Elements organized by type/category */
  readonly index: CollectionIndexMap;
  
  /** Build metadata and statistics */
  readonly metadata: BuildMetadata;
}

/**
 * Map of element types to their respective elements
 * Allows for both known types and unknown 'other' category
 */
export interface CollectionIndexMap {
  readonly [ElementType.PERSONAS]?: readonly IndexedElement[];
  readonly [ElementType.AGENTS]?: readonly IndexedElement[];
  readonly [ElementType.SKILLS]?: readonly IndexedElement[];
  readonly [ElementType.TEMPLATES]?: readonly IndexedElement[];
  readonly [ElementType.MEMORIES]?: readonly IndexedElement[];
  readonly [ElementType.ENSEMBLES]?: readonly IndexedElement[];
  readonly [ElementType.PROMPTS]?: readonly IndexedElement[];
  readonly [ElementType.TOOLS]?: readonly IndexedElement[];
  readonly [ElementType.OTHER]?: readonly IndexedElement[];
  /** Allow for dynamic categories that might be added */
  readonly [key: string]: readonly IndexedElement[] | undefined;
}

// ============================================================================
// PARSING & PROCESSING TYPES
// ============================================================================

/**
 * Result of parsing a single element file
 * Used internally during the build process
 */
export interface ParseResult {
  /** Successfully parsed element, or null if parsing failed */
  readonly element: IndexedElement | null;
  
  /** File path that was processed */
  readonly filePath: string;
  
  /** Error message if parsing failed */
  readonly error?: string;
}

/**
 * Raw frontmatter data extracted from markdown files
 * Represents the YAML frontmatter before sanitization and validation
 */
export interface RawFrontmatter {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly version?: unknown;
  readonly author?: unknown;
  readonly tags?: unknown;
  readonly keywords?: unknown;
  readonly category?: unknown;
  readonly created?: unknown;
  readonly created_date?: unknown;
  readonly license?: unknown;
  /** Allow for any additional frontmatter fields */
  readonly [key: string]: unknown;
}

/**
 * Batch processing result for performance tracking
 * Used when processing files in batches for memory management
 */
export interface BatchProcessResult {
  /** Successfully processed elements */
  readonly elements: readonly IndexedElement[];
  
  /** Files that failed to process */
  readonly skippedFiles: readonly string[];
  
  /** Processing time for this batch in milliseconds */
  readonly processingTime: number;
  
  /** Batch number (1-indexed) */
  readonly batchNumber: number;
}

// ============================================================================
// VALIDATION & SECURITY TYPES
// ============================================================================

/**
 * Sanitization configuration for HTML/text cleaning
 */
export interface SanitizationConfig {
  /** Maximum allowed length for the field */
  readonly maxLength: number;
  
  /** Whether to allow HTML tags (default: false) */
  readonly allowHtml?: boolean;
  
  /** Custom allowed HTML tags if allowHtml is true */
  readonly allowedTags?: readonly string[];
  
  /** Custom allowed attributes if allowHtml is true */
  readonly allowedAttributes?: Record<string, readonly string[]>;
}

/**
 * File system information for processed files
 */
export interface FileInfo {
  /** Absolute path to the file */
  readonly absolutePath: string;
  
  /** Path relative to project root */
  readonly relativePath: string;
  
  /** File size in bytes */
  readonly size: number;
  
  /** Last modified timestamp */
  readonly lastModified: Date;
  
  /** File extension */
  readonly extension: string;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid ElementType
 * @param value - Value to check
 * @returns True if value is a valid ElementType
 */
export function isElementType(value: unknown): value is ElementType {
  if (typeof value !== 'string') {
    return false;
  }
  return Object.values(ElementType).includes(value as ElementType);
}

/**
 * Type guard to check if an object is a valid IndexedElement
 * @param obj - Object to validate
 * @returns True if object conforms to IndexedElement interface
 */
export function isIndexedElement(obj: unknown): obj is IndexedElement {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const element = obj as Record<string, unknown>;
  
  return (
    typeof element.path === 'string' &&
    typeof element.type === 'string' &&
    typeof element.name === 'string' &&
    typeof element.description === 'string' &&
    typeof element.version === 'string' &&
    typeof element.author === 'string' &&
    Array.isArray(element.tags) &&
    element.tags.every(tag => typeof tag === 'string') &&
    typeof element.sha === 'string'
  );
}

/**
 * Type guard to check if an object is a valid CollectionIndex
 * @param obj - Object to validate
 * @returns True if object conforms to CollectionIndex interface
 */
export function isCollectionIndex(obj: unknown): obj is CollectionIndex {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const index = obj as Record<string, unknown>;
  
  return (
    typeof index.version === 'string' &&
    typeof index.generated === 'string' &&
    typeof index.total_elements === 'number' &&
    typeof index.index === 'object' &&
    index.index !== null &&
    typeof index.metadata === 'object' &&
    index.metadata !== null
  );
}

/**
 * Type guard to check if an object is valid RawFrontmatter
 * @param obj - Object to validate  
 * @returns True if object could be frontmatter data
 */
export function isRawFrontmatter(obj: unknown): obj is RawFrontmatter {
  return obj !== null && typeof obj === 'object';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Configuration for the build process
 */
export interface BuildConfig {
  /** Root directory of the project */
  readonly rootDir: string;
  
  /** Library directory containing collection elements */
  readonly libraryDir: string;
  
  /** Output file path for the generated index */
  readonly outputFile: string;
  
  /** Batch size for processing files */
  readonly batchSize: number;
  
  /** Field limits for sanitization */
  readonly fieldLimits: FieldLimits;
  
  /** Valid element types to recognize */
  readonly validTypes: readonly string[];
  
  /** Whether to include diagnostic information */
  readonly includeDiagnostics: boolean;
  
  /** Maximum number of skipped files to list in metadata */
  readonly maxSkippedFilesList: number;
}

/**
 * Runtime statistics for monitoring build performance
 */
export interface BuildStats {
  /** Start time of the build process */
  readonly startTime: number;
  
  /** End time of the build process */
  readonly endTime: number;
  
  /** Total files found */
  readonly totalFiles: number;
  
  /** Files successfully processed */
  readonly processedFiles: number;
  
  /** Files skipped due to errors */
  readonly skippedFiles: number;
  
  /** Elements per second processing rate */
  readonly elementsPerSecond: number;
  
  /** Peak memory usage during build (if available) */
  readonly peakMemoryUsage?: number;
}

/**
 * Error information for failed file processing
 */
export interface ProcessingError {
  /** File path that failed to process */
  readonly filePath: string;
  
  /** Error message */
  readonly message: string;
  
  /** Error code if available */
  readonly code?: string;
  
  /** Stack trace if available */
  readonly stack?: string;
  
  /** Timestamp when error occurred */
  readonly timestamp: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default field limits for content sanitization
 * These values match the limits defined in the JavaScript implementation
 */
export const DEFAULT_FIELD_LIMITS: FieldLimits = {
  name: 200,
  description: 500,
  author: 100,
  version: 20,
  tag: 50,
  keyword: 50
} as const;

/**
 * Valid element types array for runtime validation
 * Derived from ElementType enum
 */
export const VALID_ELEMENT_TYPES: readonly string[] = [
  ElementType.PERSONAS,
  ElementType.AGENTS, 
  ElementType.SKILLS,
  ElementType.TEMPLATES,
  ElementType.MEMORIES,
  ElementType.ENSEMBLES,
  ElementType.PROMPTS,
  ElementType.TOOLS
] as const;

/**
 * Default build configuration values
 */
export const DEFAULT_BUILD_CONFIG = {
  batchSize: 100,
  maxSkippedFilesList: 10,
  includeDiagnostics: true,
  builderVersion: '1.0.0'
} as const;

// ============================================================================
// EXTENDED TYPES FOR FUTURE COMPATIBILITY
// ============================================================================

/**
 * Extended metadata that may be added in future versions
 * Allows for backward-compatible expansion of element data
 */
export interface ExtendedIndexedElement extends IndexedElement {
  /** Future: Element complexity score */
  readonly complexity?: number;
  
  /** Future: Compatibility rating */
  readonly compatibility?: string;
  
  /** Future: Usage statistics */
  readonly usage_stats?: {
    readonly downloads: number;
    readonly rating: number;
    readonly reviews: number;
  };
  
  /** Future: Dependencies on other elements */
  readonly dependencies?: readonly string[];
  
  /** Future: Related elements */
  readonly related?: readonly string[];
}

/**
 * Advanced build configuration for future features
 */
export interface AdvancedBuildConfig extends BuildConfig {
  /** Enable parallel processing */
  readonly parallelProcessing?: boolean;
  
  /** Number of worker threads to use */
  readonly workerThreads?: number;
  
  /** Enable caching for faster rebuilds */
  readonly enableCaching?: boolean;
  
  /** Cache directory path */
  readonly cacheDir?: string;
  
  /** Enable incremental builds */
  readonly incrementalBuild?: boolean;
  
  /** Custom validation rules */
  readonly customValidation?: readonly string[];
}