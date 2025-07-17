/**
 * Tests for JSON schema validation of test patterns
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Test Patterns Schema Validation', () => {
  const ajv = new Ajv({ allErrors: true });
  const schemaPath = join(__dirname, 'test-data/test-patterns-schema.json');
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as Record<string, unknown>;
  const validate = ajv.compile(schema);

  it('should validate correct test patterns structure', () => {
    const validData = {
      comment: "Valid test patterns",
      version: "1.0.0",
      categories: {
        test_category: {
          description: "Test category",
          testCases: [{
            id: "TC001",
            description: "Test case",
            placeholder: "TEST_PLACEHOLDER",
            realPattern: "[REDACTED - See documentation]",
            expectedCategory: "test",
            expectedSeverity: "high"
          }]
        }
      }
    };

    const valid = validate(validData);
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      comment: "Missing version field",
      categories: {}
    };

    const valid = validate(invalidData);
    expect(valid).toBe(false);
    expect(validate.errors).toBeDefined();
    expect(validate.errors?.some(err => err.message?.includes('required'))).toBe(true);
  });

  it('should reject invalid version format', () => {
    const invalidData = {
      comment: "Invalid version",
      version: "1.0",  // Should be x.y.z
      categories: {}
    };

    const valid = validate(invalidData);
    expect(valid).toBe(false);
    expect(validate.errors?.some(err => err.dataPath === '.version')).toBe(true);
  });

  it('should reject invalid test case ID format', () => {
    const invalidData = {
      comment: "Invalid ID format",
      version: "1.0.0",
      categories: {
        test: {
          description: "Test",
          testCases: [{
            id: "INVALID",  // Should be XX123 format
            description: "Test",
            placeholder: "TEST",
            realPattern: "[REDACTED]",
            expectedCategory: "test",
            expectedSeverity: "high"
          }]
        }
      }
    };

    const valid = validate(invalidData);
    expect(valid).toBe(false);
    expect(validate.errors?.some(err => err.dataPath.includes('.id'))).toBe(true);
  });

  it('should reject invalid severity levels', () => {
    const invalidData = {
      comment: "Invalid severity",
      version: "1.0.0",
      categories: {
        test: {
          description: "Test",
          testCases: [{
            id: "TC001",
            description: "Test",
            placeholder: "TEST",
            realPattern: "[REDACTED]",
            expectedCategory: "test",
            expectedSeverity: "extreme"  // Not in enum
          }]
        }
      }
    };

    const valid = validate(invalidData);
    expect(valid).toBe(false);
    expect(validate.errors?.some(err => err.dataPath.includes('expectedSeverity'))).toBe(true);
  });

  it('should reject non-redacted real patterns', () => {
    const invalidData = {
      comment: "Non-redacted pattern",
      version: "1.0.0",
      categories: {
        test: {
          description: "Test",
          testCases: [{
            id: "TC001",
            description: "Test",
            placeholder: "TEST",
            realPattern: "actual malicious pattern",  // Should start with [REDACTED
            expectedCategory: "test",
            expectedSeverity: "high"
          }]
        }
      }
    };

    const valid = validate(invalidData);
    expect(valid).toBe(false);
    expect(validate.errors?.some(err => err.dataPath.includes('realPattern'))).toBe(true);
  });

  it('should validate the actual test patterns file', () => {
    const testPatternsPath = join(__dirname, 'test-data/security-test-patterns.json');
    const testPatterns = JSON.parse(readFileSync(testPatternsPath, 'utf-8')) as unknown;
    
    const valid = validate(testPatterns);
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });
});