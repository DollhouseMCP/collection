/**
 * Tests for Zod v3/v4 compatibility layer
 * 
 * These tests ensure our code correctly handles error format differences between
 * Zod v3 and v4, particularly for missing field detection.
 */

import { ContentValidator } from '../../../src/validators/content-validator.js';
import type { ValidationIssue } from '../../../src/validators/content-validator.js';
import { z } from 'zod';
import { writeFile, rm, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testDir = join(__dirname, '../../../.test-tmp');

describe('Zod v3/v4 Compatibility', () => {
  let validator: ContentValidator;

  beforeEach(async () => {
    validator = new ContentValidator();
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('checkIfMissingField method', () => {
    // Access private method through any type cast for testing
    const getCheckIfMissingField = (validator: ContentValidator) => {
      return (validator as any).checkIfMissingField.bind(validator);
    };

    it('should detect Zod v4 format missing fields with received property', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      // Simulate Zod v4 error format - cast through unknown to avoid type issues
      const v4Error = {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['name'],
        message: 'Required',
        input: undefined
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(v4Error)).toBe(true);
    });

    it('should detect Zod v3 format missing fields via message', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      // Simulate Zod v3 error format (no 'received' property)
      const v3Error = {
        code: 'invalid_type',
        expected: 'string',
        path: ['name'],
        message: 'Required, received undefined'
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(v3Error)).toBe(true);
    });

    it('should return false for non-missing field errors in v4 format', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      // Zod v4 with received value that's not undefined
      const v4Error = {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['age'],
        message: 'Expected string, received number',
        input: 42
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(v4Error)).toBe(false);
    });

    it('should return false for non-missing field errors in v3 format', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      // Zod v3 with different error message
      const v3Error = {
        code: 'invalid_type',
        expected: 'string',
        path: ['age'],
        message: 'Expected string, received number'
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(v3Error)).toBe(false);
    });

    it('should return false for non-invalid_type error codes', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      const tooSmallError = {
        code: 'too_small',
        minimum: 3,
        type: 'string',
        inclusive: true,
        path: ['name'],
        message: 'String must contain at least 3 character(s)',
        input: 'ab'
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(tooSmallError)).toBe(false);
    });

    it('should handle edge case where received exists but is not "undefined"', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      const edgeCaseError = {
        code: 'invalid_type',
        expected: 'string',
        received: 'null', // string 'null', not undefined
        path: ['name'],
        message: 'Expected string, received null',
        input: null
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(edgeCaseError)).toBe(false);
    });

    it('should handle error objects without received property or matching message', () => {
      const checkIfMissingField = getCheckIfMissingField(validator);
      
      const ambiguousError = {
        code: 'invalid_type',
        expected: 'string',
        path: ['name'],
        message: 'Invalid type' // No 'received undefined' in message
      } as unknown as z.ZodIssue;

      expect(checkIfMissingField(ambiguousError)).toBe(false);
    });
  });

  describe('Error message format consistency', () => {
    it('should correctly categorize missing fields in actual validation', async () => {
      const testContent = `---
name: Test
type: persona
# missing required fields: unique_id, description, author, version
---
Test content`;

      const testFile = join(testDir, 'test-missing-fields.md');
      await writeFile(testFile, testContent);
      const result = await validator.validateContent(testFile);
      
      // Check that missing fields are correctly identified
      const missingFieldIssues = result.issues.filter((i: ValidationIssue) => i.type === 'missing_field');
      expect(missingFieldIssues.length).toBeGreaterThan(0);
      
      // Verify all missing field issues have the expected fields
      const missingFieldPaths = missingFieldIssues.map((i: ValidationIssue) => {
        const match = i.details.match(/^(\w+):/);
        return match ? match[1] : null;
      }).filter(Boolean);
      
      expect(missingFieldPaths).toContain('unique_id');
      expect(missingFieldPaths).toContain('description');
      expect(missingFieldPaths).toContain('author');
      // Version is not required for persona type in the base schema
    });

    it('should correctly categorize type mismatches as invalid_metadata', async () => {
      const testContent = `---
name: Test
type: persona
unique_id: test-persona
description: A test persona
author: Test Author
version: "not-semver"  # Invalid format
tags: "should be array"  # Wrong type
---
Test content`;

      const testFile = join(testDir, 'test-type-mismatch.md');
      await writeFile(testFile, testContent);
      const result = await validator.validateContent(testFile);
      
      // These should be invalid_metadata, not missing_field
      const invalidMetadataIssues = result.issues.filter((i: ValidationIssue) => 
        i.type === 'invalid_metadata' && 
        (i.details.includes('version') || i.details.includes('tags'))
      );
      
      // Tags validation and version format both trigger invalid_metadata
      expect(invalidMetadataIssues.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle deeply nested missing fields', async () => {
      const testContent = `---
name: Test Agent
type: agent
unique_id: test-agent
description: A test agent
author: Test Author
# Missing required nested capabilities field
---
Test content`;

      const testFile = join(testDir, 'test-nested.md');
      await writeFile(testFile, testContent);
      const result = await validator.validateContent(testFile);
      
      // Should have missing field issues
      const missingFieldIssues = result.issues.filter((i: ValidationIssue) => 
        i.type === 'missing_field'
      );
      
      expect(missingFieldIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Real-world Zod v4 integration', () => {
    it('should work with current Zod version for basic content types', async () => {
      // Test a simple persona with all required fields
      const personaContent = `---
name: Test Persona
type: persona
unique_id: test-persona
description: A test persona for Zod compatibility
author: Test Author
tags: ["test", "zod"]
category: professional
---
This is test content for the persona.`;

      const testFile = join(testDir, 'test-persona.md');
      await writeFile(testFile, personaContent);
      const result = await validator.validateContent(testFile);
      
      // Well-formed content should pass validation
      expect(result.passed).toBe(true);
      
      // Should not have any missing field issues
      const missingFieldIssues = result.issues.filter((i: ValidationIssue) => 
        i.type === 'missing_field'
      );
      expect(missingFieldIssues.length).toBe(0);
    });

    it('should maintain consistent error details format across Zod versions', async () => {
      const testContent = `---
name: ""  # Too short
type: persona
unique_id: "TEST"  # Should be lowercase
description: "Short"  # Too short
author: "A"  # Too short
version: "1.2"  # Invalid format
tags: ["ok", "this", "is", "way", "too", "many", "tags", "here", "now", "ten", "eleven"]
---
Test content`;

      const testFile = join(testDir, 'test-errors.md');
      await writeFile(testFile, testContent);
      const result = await validator.validateContent(testFile);
      
      // All error details should follow the pattern "field.path: message"
      result.issues.forEach((issue: ValidationIssue) => {
        if (issue.type === 'invalid_metadata' || issue.type === 'missing_field') {
          expect(issue.details).toMatch(/^[\w.]+: .+$/);
        }
      });
    });
  });
});