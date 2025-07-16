/**
 * Integration tests for CLI validation tool
 * Tests the command-line interface and its integration with the validation system
 */

import { spawn } from 'child_process';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test constants
const TEST_TIMEOUT = 5000; // 5 seconds
const BATCH_TEST_TIMEOUT = 10000; // 10 seconds

describe('CLI Validation Tool Integration Tests', () => {
  const testDir = join(__dirname, '../../.test-tmp/cli-integration');
  const cliPath = join(__dirname, '../../dist/src/cli/validate-content.js');

  beforeAll(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  /**
   * Helper function to run CLI command
   * Uses process.execPath for cross-platform compatibility
   */
  function runCLI(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
    return new Promise((resolve) => {
      // Always use Node.js to run the script, ignoring the shebang
      const proc = spawn(process.execPath, [cliPath, ...args], {
        cwd: testDir,
        env: { ...process.env, NO_COLOR: '1' }, // Disable color output for testing
        windowsVerbatimArguments: true // Prevent Windows from messing with arguments
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on('error', (error) => {
        stderr += `Process error: ${error.message}`;
        resolve({ code: 1, stdout, stderr });
      });

      proc.on('close', (code) => {
        resolve({ code: code || 0, stdout, stderr });
      });
    });
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
      expect(stdout).toContain(testFile);
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
      expect(stdout).toContain(testFile);
      expect(stdout).toContain('Critical:');
      expect(stdout).toContain('High:');
    });
  });

  describe('Glob Pattern Support', () => {
    beforeEach(async () => {
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

      expect(stdout).toContain('Validating 6 file(s)'); // Includes the 2 previously created files
      expect(stdout).toContain('✅ PASSED');
      expect(stdout).toContain('❌ FAILED');
      expect(stdout).toContain('agents/invalid.md');
      expect(stdout).toContain('Failed: 2'); // 2 files have invalid content
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
      const env = { ...process.env, OUTPUT_FILE: outputPath, NO_COLOR: '1' };

      const proc = spawn('node', [cliPath, testFile], {
        cwd: testDir,
        env
      });

      // Wait for the process to complete
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Process timeout')), TEST_TIMEOUT);
        proc.on('close', (code) => {
          clearTimeout(timeout);
          if (code !== 0) {
            reject(new Error(`Process failed with code ${code}`));
          }
          resolve();
        });
        proc.on('error', reject);
      });

      // Check if report was created
      const { readFile } = await import('fs/promises');
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
      // Create 50 test files
      const filePromises = [];
      for (let i = 0; i < 50; i++) {
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

      expect(stdout).toContain('Validating 50 file(s)');
      expect(stdout).toContain('Total files: 50');
      expect(stdout).toContain('Passed: 50');
      expect(code).toBe(0);

      // Should complete within reasonable time
      expect(duration).toBeLessThan(BATCH_TEST_TIMEOUT);
      console.log(`CLI validated 50 files in ${duration}ms`);
    });
  });
});