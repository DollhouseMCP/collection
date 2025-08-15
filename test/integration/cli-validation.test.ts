/**
 * Integration tests for CLI validation tool
 * Tests the command-line interface and its integration with the validation system
 */

import { writeFile, mkdir, rm, readFile, mkdtemp, readdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { main as validateContent } from '../../dist/src/cli/validate-content.js';

// Type assertion to help ESLint understand this is a function
const validateContentFn = validateContent as (args?: string[]) => Promise<number>;

// Test constants
const BATCH_TEST_TIMEOUT = 10000; // 10 seconds
const LARGE_BATCH_SIZE = 50; // Number of files for performance testing

describe('CLI Validation Tool Integration Tests', () => {
  let testDir: string;
  
  // Console mocking utilities
  let originalLog: typeof console.log;
  let originalError: typeof console.error;
  let capturedStdout: string[] = [];
  let capturedStderr: string[] = [];

  beforeAll(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'cli-integration-'));
    
    // Save original console methods
    originalLog = console.log;
    originalError = console.error;
  });

  afterAll(async () => {
    await rm(testDir, { recursive: true, force: true });
    
    // Restore console methods
    console.log = originalLog;
    console.error = originalError;
  });

  beforeEach(() => {
    // Clear captured output
    capturedStdout = [];
    capturedStderr = [];
    
    // Mock console methods
    console.log = (...args: any[]) => {
      capturedStdout.push(args.join(' '));
    };
    console.error = (...args: any[]) => {
      capturedStderr.push(args.join(' '));
    };
  });

  afterEach(() => {
    // Restore console methods after each test
    console.log = originalLog;
    console.error = originalError;
  });

  /**
   * Helper function to run CLI command
   * Uses direct import instead of spawn for cross-platform compatibility
   */
  async function runCLI(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
    // Clear captured output
    capturedStdout = [];
    capturedStderr = [];
    
    // Change to test directory
    const originalCwd = process.cwd();
    process.chdir(testDir);
    
    try {
      // Call the CLI main function directly
      const code = await validateContentFn(args as string[]);
      
      return {
        code: code as number,
        stdout: capturedStdout.join('\n'),
        stderr: capturedStderr.join('\n')
      };
    } finally {
      // Restore original directory
      process.chdir(originalCwd);
    }
  }

  describe('Basic CLI Operations', () => {
    it('should show usage when run without arguments', async () => {
      const { code, stderr } = await runCLI([]);

      expect(code).toBe(1);
      expect(stderr).toContain('Usage: validate-content');
      expect(stderr).toContain('Examples:');
      expect(stderr).toContain('validate-content persona.md');
    });

    it('should validate a single valid file', async () => {
      const validContent = `---
type: persona
name: CLI Test Persona
description: Testing CLI validation with a valid persona file
unique_id: cli-test-persona
author: CLI Test Suite
category: educational
---

# CLI Test Persona

Valid content for CLI testing.`;

      const testFile = join(testDir, 'valid-persona.md');
      await writeFile(testFile, validContent, 'utf8');

      const { code, stdout } = await runCLI([testFile]);

      expect(code).toBe(0);
      expect(stdout).toContain('✅ PASSED');
      expect(stdout).toContain(testFile.replace(/\\/g, '/'));
    });

    it('should report errors for invalid files', async () => {
      const invalidContent = `---
type: skill
name: X
description: Short
unique_id: INVALID-ID
author: Y
category: wrong-category
---

Invalid skill content.`;

      const testFile = join(testDir, 'invalid-skill.md');
      await writeFile(testFile, invalidContent, 'utf8');

      const { code, stdout } = await runCLI([testFile]);

      expect(code).toBe(1);
      expect(stdout).toContain('❌ FAILED');
      expect(stdout).toContain(testFile.replace(/\\/g, '/'));
      expect(stdout).toContain('Critical:');
      expect(stdout).toContain('High:');
    });
  });

  describe('Glob Pattern Support', () => {
    beforeEach(async () => {
      // Clean contents of test directory to ensure consistent state
      const existingFiles = await readdir(testDir).catch(() => []);
      for (const file of existingFiles) {
        await rm(join(testDir, file), { recursive: true, force: true });
      }
      
      // Create test directory structure
      const dirs = ['personas', 'skills', 'agents'];
      for (const dir of dirs) {
        await mkdir(join(testDir, dir), { recursive: true });
      }

      // Create test files
      const files = [
        {
          path: 'personas/test1.md',
          content: `---
type: persona
name: Test Persona 1
description: First test persona for glob pattern testing
unique_id: glob-test-persona-1
author: Glob Test
category: personal
---

# Test Persona 1`
        },
        {
          path: 'personas/test2.md',
          content: `---
type: persona
name: Test Persona 2
description: Second test persona for glob pattern testing
unique_id: glob-test-persona-2
author: Glob Test
category: personal
---

# Test Persona 2`
        },
        {
          path: 'skills/test-skill.md',
          content: `---
type: skill
name: Test Skill
description: Test skill for glob pattern validation testing
unique_id: glob-test-skill
author: Glob Test
category: educational
capabilities:
  - testing
---

# Test Skill`
        },
        {
          path: 'agents/invalid.md',
          content: `---
type: agent
name: X
description: Invalid
unique_id: BAD
author: X
category: wrong
---

Invalid agent`
        }
      ];

      for (const file of files) {
        await writeFile(join(testDir, file.path), file.content, 'utf8');
      }
    });

    it('should validate files matching glob patterns', async () => {
      const { code, stdout } = await runCLI(['personas/*.md']);

      expect(stdout).toContain('Validating 2 file(s)');
      expect(stdout).toContain('personas/test1.md');
      expect(stdout).toContain('personas/test2.md');
      expect(stdout).not.toContain('skills/test-skill.md');
      expect(code).toBe(0);
    });

    it('should validate multiple glob patterns', async () => {
      const { code, stdout } = await runCLI(['personas/*.md', 'skills/*.md']);

      expect(stdout).toContain('Validating 3 file(s)');
      expect(stdout).toContain('personas/test1.md');
      expect(stdout).toContain('personas/test2.md');
      expect(stdout).toContain('skills/test-skill.md');
      expect(code).toBe(0);
    });

    it('should handle glob patterns with failures', async () => {
      const { code, stdout } = await runCLI(['**/*.md']);

      // Should find at least the 4 files created in beforeEach
      expect(stdout).toMatch(/Validating \d+ file\(s\)/);
      expect(stdout).toContain('✅ PASSED');
      expect(stdout).toContain('❌ FAILED');
      expect(stdout).toContain('agents/invalid.md');
      expect(stdout).toContain('Failed: 1'); // Only agents/invalid.md has invalid content
      expect(code).toBe(1);
    });

    it('should report when no files match pattern', async () => {
      const { code, stderr } = await runCLI(['nonexistent/*.md']);

      expect(code).toBe(1);
      expect(stderr).toContain('No files found matching the provided patterns');
    });
  });

  describe('Summary and Reporting', () => {
    it('should provide detailed summary for multiple files', async () => {
      // Create a mix of valid and invalid files
      const files = [
        {
          name: 'valid1.md',
          valid: true,
          content: `---
type: template
name: Valid Template 1
description: First valid template for summary testing
unique_id: summary-template-1
author: Summary Test
category: professional
format: markdown
---

# Valid Template`
        },
        {
          name: 'valid2.md',
          valid: true,
          content: `---
type: tool
name: Valid Tool
description: Valid tool for testing summary generation
unique_id: summary-tool
author: Summary Test
category: professional
mcp_version: 1.0.0
---

# Valid Tool`
        },
        {
          name: 'invalid1.md',
          valid: false,
          content: `---
type: prompt
name: X
description: Bad
unique_id: BAD-ID
author: X
category: invalid
---

Invalid prompt`
        },
        {
          name: 'security-issue.md',
          valid: false,
          content: `---
type: ensemble
name: Security Test Ensemble
description: Ensemble with security issues for testing reporting
unique_id: security-ensemble
author: Security Test
category: professional
components:
  personas:
    - test-persona
---

# Security Issues

API Key: sk-1234567890abcdef
Password: admin123`
        }
      ];

      for (const file of files) {
        await writeFile(join(testDir, file.name), file.content, 'utf8');
      }

      const { code, stdout } = await runCLI(files.map(f => f.name));

      // Check summary section
      expect(stdout).toContain('📊 Summary');
      expect(stdout).toContain('Total files: 4');
      expect(stdout).toContain('Passed: 3'); // 3 files pass (including security-issue.md which has warnings but no critical errors)
      expect(stdout).toContain('Failed: 1');

      // Check issue breakdown
      expect(stdout).toContain('Issues by severity:');
      expect(stdout).toContain('🔴 Critical:');
      expect(stdout).toContain('🟠 High:');

      // Check failed file details
      expect(stdout).toContain('❌ Failed validations:');
      expect(stdout).toContain('invalid1.md:');

      expect(code).toBe(1);
    });

    it('should generate JSON report when OUTPUT_FILE is set', async () => {
      const validContent = `---
type: persona
name: Report Test Persona
description: Testing JSON report generation in CLI
unique_id: report-test-persona
author: Report Test
category: educational
---

# Report Test`;

      const testFile = join(testDir, 'report-test.md');
      await writeFile(testFile, validContent, 'utf8');

      const outputPath = join(testDir, 'report.json');
      
      // Set environment variable for OUTPUT_FILE
      const originalOutputFile = process.env.OUTPUT_FILE;
      process.env.OUTPUT_FILE = outputPath;
      process.env.NO_COLOR = '1';
      
      try {
        const { code } = await runCLI([testFile]);
        expect(code).toBe(0);
      } finally {
        // Restore original environment
        if (originalOutputFile === undefined) {
          delete process.env.OUTPUT_FILE;
        } else {
          process.env.OUTPUT_FILE = originalOutputFile;
        }
      }

      // Check if report was created
      const reportContent = await readFile(outputPath, 'utf8');
      const report = JSON.parse(reportContent) as Array<{file: string; report: {passed: boolean; summary: unknown; issues: unknown[]}}>;

      expect(report).toBeInstanceOf(Array);
      expect(report[0]).toHaveProperty('file');
      expect(report[0]).toHaveProperty('report');
      expect(report[0].report).toHaveProperty('passed', true);
      expect(report[0].report).toHaveProperty('summary');
      expect(report[0].report).toHaveProperty('issues');
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors gracefully', async () => {
      const { code, stdout } = await runCLI(['/nonexistent/path/file.md']);

      expect(code).toBe(1);
      expect(stdout).toContain('❌ FAILED');
      expect(stdout).toContain('file_not_found');
    });

    it('should handle mixed file paths and patterns', async () => {
      // Create one valid file
      const validContent = `---
type: skill
name: Mixed Test Skill
description: Testing mixed file paths and patterns in CLI
unique_id: mixed-test-skill
author: Mixed Test
category: educational
capabilities:
  - testing
---

# Mixed Test`;

      const validFile = join(testDir, 'mixed-valid.md');
      await writeFile(validFile, validContent, 'utf8');

      // Mix direct path, glob pattern, and non-existent file
      const { code, stdout } = await runCLI([
        validFile,
        '*.md',
        '/nonexistent/file.md'
      ]);

      expect(stdout).toContain('mixed-valid.md');
      expect(stdout).toContain('✅ PASSED');
      expect(stdout).toContain('❌ FAILED');
      expect(stdout).toContain('file_not_found');
      expect(code).toBe(1); // Should fail due to non-existent file
    });
  });

  describe('Performance with Large Batches', () => {
    it('should handle large numbers of files efficiently', async () => {
      // Create test files for performance testing
      const filePromises = [];
      for (let i = 0; i < LARGE_BATCH_SIZE; i++) {
        const content = `---
type: prompt
name: Batch Test Prompt ${i}
description: Testing CLI performance with large batches of files
unique_id: batch-prompt-${i}
author: Batch Test
category: educational
---

# Batch Prompt ${i}`;

        const file = join(testDir, `batch-${i}.md`);
        filePromises.push(writeFile(file, content, 'utf8'));
      }

      await Promise.all(filePromises);

      const startTime = Date.now();
      const { code, stdout } = await runCLI(['batch-*.md']);
      const duration = Date.now() - startTime;

      expect(stdout).toContain(`Validating ${LARGE_BATCH_SIZE} file(s)`);
      expect(stdout).toContain(`Total files: ${LARGE_BATCH_SIZE}`);
      expect(stdout).toContain(`Passed: ${LARGE_BATCH_SIZE}`);
      expect(code).toBe(0);

      // Should complete within reasonable time
      expect(duration).toBeLessThan(BATCH_TEST_TIMEOUT);
    });
  });
});