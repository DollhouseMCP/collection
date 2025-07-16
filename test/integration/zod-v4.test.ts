/**
 * Test to verify Zod v4 compatibility
 */

import { ContentValidator } from '../../src/validators/content-validator.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Zod v4 Compatibility Tests', () => {
  const testDir = join(__dirname, '../../.test-tmp/zod-test');
  const validator = new ContentValidator();

  beforeAll(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should handle missing required fields with Zod v4', async () => {
    const invalidContent = `---
type: persona
name: Test Persona
---

# Test Content`;

    const testFile = join(testDir, 'invalid-persona.md');
    await writeFile(testFile, invalidContent, 'utf8');

    const result = await validator.validateContent(testFile);
    
    expect(result.passed).toBe(false);
    expect(result.issues).toHaveLength(5); // missing description, unique_id, author, category + content too short
    
    // Check that Zod v4 error handling works
    const missingFieldIssues = result.issues.filter(i => 
      i.type === 'missing_field' || 
      (i.type === 'invalid_metadata' && i.details.includes('received undefined'))
    );
    expect(missingFieldIssues.length).toBeGreaterThan(0);
  });

  it('should validate correct content with Zod v4', async () => {
    const validContent = `---
type: persona
name: Test Persona
description: A test persona for Zod v4 compatibility
unique_id: test-persona-zod
author: test-author
category: educational
---

# Test Persona

This is a test persona to verify Zod v4 works correctly.`;

    const testFile = join(testDir, 'valid-persona.md');
    await writeFile(testFile, validContent, 'utf8');

    const result = await validator.validateContent(testFile);
    
    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('should handle invalid metadata types with Zod v4', async () => {
    const invalidTypeContent = `---
type: persona
name: 123
description: Test
unique_id: test
author: test
category: invalid-category
---

# Test`;

    const testFile = join(testDir, 'invalid-types.md');
    await writeFile(testFile, invalidTypeContent, 'utf8');

    const result = await validator.validateContent(testFile);
    
    expect(result.passed).toBe(false);
    
    // Should have category validation error
    const categoryIssue = result.issues.find(i => 
      i.details.includes('category') && i.type === 'invalid_metadata'
    );
    expect(categoryIssue).toBeDefined();
  });

  it('should handle tool metadata with record type in Zod v4', async () => {
    const toolContent = `---
type: tool
name: Test Tool
description: A test tool for Zod v4 record type
unique_id: test-tool
author: test-author
category: professional
mcp_version: 1.0.0
parameters:
  input: string
  count: number
---

# Test Tool

This is a comprehensive test tool designed to verify that Zod v4's record type validation works correctly with tool metadata parameters.`;

    const testFile = join(testDir, 'tool-with-params.md');
    await writeFile(testFile, toolContent, 'utf8');

    const result = await validator.validateContent(testFile);
    
    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
});