# Collection Index Builder - Type Definitions

This directory contains comprehensive TypeScript type definitions for the Collection Index Builder, supporting the refactor from JavaScript to TypeScript.

## Files

- **`build-index.types.ts`** - Complete type definitions for the index builder
- **`build-index.example.ts`** - Usage examples and patterns
- **`README.md`** - This documentation

## Type Safety Requirements

The project has strict TypeScript requirements:
- **Zero `any` types allowed** - CI fails on this
- All types must be explicitly defined
- Runtime type guards for validation
- Full compatibility with existing types in `src/types/index.ts`

## Key Type Categories

### Core Index Types
- `CollectionIndex` - Main output structure
- `IndexedElement` - Individual collection element
- `BuildMetadata` - Build statistics and diagnostics
- `CollectionIndexMap` - Type-safe element categorization

### Processing Types
- `ParseResult` - File parsing results
- `RawFrontmatter` - Unvalidated YAML frontmatter
- `BatchProcessResult` - Batch processing statistics
- `ProcessingError` - Typed error handling

### Configuration Types
- `BuildConfig` - Build process configuration
- `FieldLimits` - Content sanitization limits
- `SanitizationConfig` - HTML/text cleaning settings

### Validation Types
- `ElementType` - Enum of valid element types
- Type guards: `isElementType`, `isIndexedElement`, `isCollectionIndex`
- Runtime validation functions

## Usage Example

```typescript
import {
  CollectionIndex,
  IndexedElement,
  ElementType,
  DEFAULT_FIELD_LIMITS,
  isIndexedElement
} from './build-index.types.js';

// Type-safe element creation
const element: IndexedElement = {
  path: 'library/personas/example.md',
  type: ElementType.PERSONAS,
  name: 'Example Persona',
  description: 'An example persona for demonstration',
  version: '1.0.0',
  author: 'DollhouseMCP',
  tags: ['example', 'demo'],
  sha: 'abc123def456'
};

// Runtime validation
if (isIndexedElement(element)) {
  console.log('Element is valid');
}
```

## Integration with Existing Types

The types extend and are compatible with existing types in `src/types/index.ts`:
- Imports `ContentMetadata` union type
- Compatible with `BaseMetadata` interface
- Extends existing validation patterns

## Constants

- `DEFAULT_FIELD_LIMITS` - Standard field length limits
- `VALID_ELEMENT_TYPES` - Array of recognized element types
- `DEFAULT_BUILD_CONFIG` - Default build configuration values

## Future Extensions

The types include extensible interfaces for future features:
- `ExtendedIndexedElement` - Additional metadata fields
- `AdvancedBuildConfig` - Enhanced build options
- Parallel processing support
- Caching and incremental builds

## Type Safety Best Practices

1. **Always use type guards** for runtime validation
2. **Prefer readonly properties** for immutable data structures  
3. **Use enums** for fixed sets of values
4. **Define explicit interfaces** rather than inline types
5. **Include JSDoc comments** for complex types
6. **Export all types** that might be used externally

## Performance Considerations

The types are designed with performance in mind:
- `readonly` arrays prevent accidental mutations
- Efficient type guards with early returns
- Batch processing types for memory management
- Optional diagnostic fields to reduce overhead when not needed