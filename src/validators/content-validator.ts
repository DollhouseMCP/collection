/**
 * Content validator for DollhouseMCP Collection
 * Validates all content types against security and quality standards
 */

import * as fs from 'fs';
import matter from 'gray-matter';
import { z } from 'zod';
import { 
  scanForSecurityPatterns, 
  MAX_CONTENT_LENGTH, 
  MAX_METADATA_LENGTH,
  MAX_LINE_LENGTH,
  EMAIL_REGEX,
  SAFE_URL_REGEX
} from './security-patterns.js';
import type { 
  ContentMetadata, 
  ValidationResult, 
  ValidationIssue, 
  ValidationSummary 
} from '../types/index.js';

// Zod schemas for metadata validation
const BaseMetadataSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  unique_id: z.string().regex(/^[a-z0-9-_]+$/),
  author: z.string().min(2).max(100),
  category: z.enum(['creative', 'educational', 'gaming', 'personal', 'professional']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  created_date: z.union([z.string(), z.date()]).optional(),
  updated_date: z.union([z.string(), z.date()]).optional(),
  tags: z.array(z.string()).max(10).optional(),
  license: z.string().optional()
});

const PersonaMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('persona'),
  triggers: z.array(z.string()).max(10).optional(),
  age_rating: z.enum(['all', '13+', '18+']).optional(),
  content_flags: z.array(z.string()).max(5).optional(),
  ai_generated: z.boolean().optional(),
  generation_method: z.enum(['human', 'ChatGPT', 'Claude', 'hybrid']).optional(),
  price: z.string().optional(),
  revenue_split: z.string().optional()
});

const SkillMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('skill'),
  capabilities: z.array(z.string()),
  requirements: z.array(z.string()).optional(),
  compatibility: z.array(z.string()).optional()
});

const AgentMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('agent'),
  capabilities: z.array(z.string()),
  tools_required: z.array(z.string()).optional(),
  model_requirements: z.string().optional()
});

const PromptMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('prompt'),
  input_variables: z.array(z.string()).optional(),
  output_format: z.string().optional(),
  examples: z.array(z.string()).optional()
});

const TemplateMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('template'),
  format: z.string(),
  variables: z.array(z.string()).optional(),
  use_cases: z.array(z.string()).optional()
});

const ToolMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('tool'),
  mcp_version: z.string(),
  parameters: z.record(z.any()).optional(),
  returns: z.string().optional()
});

const EnsembleMetadataSchema = BaseMetadataSchema.extend({
  type: z.literal('ensemble'),
  components: z.object({
    personas: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    agents: z.array(z.string()).optional(),
    prompts: z.array(z.string()).optional(),
    templates: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional()
  }),
  coordination_strategy: z.string().optional(),
  use_cases: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional()
});

// Complete schema with all content types
const ContentMetadataSchema = z.discriminatedUnion('type', [
  PersonaMetadataSchema,
  SkillMetadataSchema,
  AgentMetadataSchema,
  PromptMetadataSchema,
  TemplateMetadataSchema,
  ToolMetadataSchema,
  EnsembleMetadataSchema
]);

export class ContentValidator {
  /**
   * Validates a content file
   * @param filePath Path to the content file
   * @returns Validation result with issues and summary
   */
  async validateContent(filePath: string): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        issues.push({
          severity: 'critical',
          type: 'file_not_found',
          details: `File not found: ${filePath}`
        });
        return this.createResult(issues);
      }

      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for empty content
      if (!content || content.trim() === '') {
        issues.push({
          severity: 'critical',
          type: 'empty_content',
          details: 'File is empty or contains only whitespace'
        });
        return this.createResult(issues);
      }
      
      // Check file size
      if (content.length > MAX_CONTENT_LENGTH) {
        issues.push({
          severity: 'critical',
          type: 'content_too_long',
          details: `Content exceeds maximum size of ${MAX_CONTENT_LENGTH} characters`
        });
        return this.createResult(issues);
      }

      // Parse frontmatter
      let parsed;
      try {
        parsed = matter(content);
      } catch {
        issues.push({
          severity: 'critical',
          type: 'invalid_format',
          details: `Failed to parse YAML frontmatter: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestion: 'Ensure the file starts with valid YAML between --- markers'
        });
        return this.createResult(issues);
      }

      // Validate metadata structure
      const metadataIssues = this.validateMetadata(parsed.data);
      issues.push(...metadataIssues);

      // Security scanning
      const securityIssues = scanForSecurityPatterns(content);
      // Convert SecurityIssue to ValidationIssue format
      const convertedSecurityIssues = securityIssues.map(securityIssue => ({
        severity: securityIssue.severity,
        type: `security_${securityIssue.category}`,
        details: `${securityIssue.description}: Pattern "${securityIssue.pattern}" detected`,
        line: securityIssue.line,
        suggestion: `Review and remove potentially unsafe content related to ${securityIssue.category}.`
      }));
      issues.push(...convertedSecurityIssues);

      // Content quality checks
      const qualityIssues = this.validateContentQuality(parsed.content, parsed.data as ContentMetadata);
      issues.push(...qualityIssues);

      // Line length check
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.length > MAX_LINE_LENGTH) {
          issues.push({
            severity: 'low',
            type: 'line_too_long',
            details: `Line exceeds ${MAX_LINE_LENGTH} characters`,
            line: index + 1,
            suggestion: 'Break long lines for better readability'
          });
        }
      });

    } catch (error) {
      issues.push({
        severity: 'critical',
        type: 'validation_error',
        details: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    return this.createResult(issues);
  }

  /**
   * Validates metadata against schema
   */
  private validateMetadata(metadata: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check metadata size
    const metadataString = JSON.stringify(metadata);
    if (metadataString.length > MAX_METADATA_LENGTH) {
      issues.push({
        severity: 'medium',
        type: 'metadata_too_large',
        details: `Metadata exceeds maximum size of ${MAX_METADATA_LENGTH} characters`
      });
    }

    // Validate against schema
    try {
      ContentMetadataSchema.parse(metadata);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const isMissingField = err.code === 'invalid_type' && err.received === 'undefined';
          issues.push({
            severity: 'high',
            type: isMissingField ? 'missing_field' : 'invalid_metadata',
            details: `${err.path.join('.')}: ${err.message}`,
            suggestion: this.getMetadataSuggestion(err)
          });
        });
      }
    }

    // Additional validation
    if (metadata.author && metadata.author.includes('@')) {
      if (!EMAIL_REGEX.test(metadata.author)) {
        issues.push({
          severity: 'medium',
          type: 'invalid_email',
          details: 'Author email format is invalid',
          suggestion: 'Use a valid email format or just a username'
        });
      }
    }

    return issues;
  }

  /**
   * Validates content quality
   */
  private validateContentQuality(content: string, metadata: ContentMetadata): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check content length
    if (content.trim().length < 50) {
      issues.push({
        severity: 'medium',
        type: 'content_too_short',
        details: 'Content body is too short (minimum 50 characters)',
        suggestion: 'Add more detailed instructions or information'
      });
    }

    // Check for placeholder content
    const placeholders = ['TODO', 'FIXME', 'XXX', '[INSERT', '[ADD'];
    placeholders.forEach(placeholder => {
      if (content.includes(placeholder)) {
        issues.push({
          severity: 'medium',
          type: 'placeholder_content',
          details: `Contains placeholder text: ${placeholder}`,
          suggestion: 'Replace placeholder text with actual content'
        });
      }
    });
    
    // Check for Lorem ipsum placeholder text
    if (content.toLowerCase().includes('lorem ipsum')) {
      issues.push({
        severity: 'medium',
        type: 'placeholder_content',
        details: 'Contains Lorem ipsum placeholder text',
        suggestion: 'Replace placeholder text with actual content'
      });
    }

    // Check for external URLs (warning only)
    const urlMatch = content.match(/https?:\/\/[^\s]+/g);
    if (urlMatch) {
      urlMatch.forEach(url => {
        if (!SAFE_URL_REGEX.test(url)) {
          issues.push({
            severity: 'low',
            type: 'unsafe_url',
            details: `URL may be malformed or too long: ${url.substring(0, 50)}...`,
            suggestion: 'Verify URL is correct and necessary'
          });
        }
      });
    }

    // Type-specific validation
    if (metadata.type === 'persona' && 'triggers' in metadata) {
      if (!metadata.triggers || metadata.triggers.length === 0) {
        issues.push({
          severity: 'low',
          type: 'missing_triggers',
          details: 'Persona has no activation triggers defined',
          suggestion: 'Add trigger words to help users activate this persona'
        });
      }
    }

    return issues;
  }

  /**
   * Creates a validation result from issues
   */
  /**
   * Validates multiple content files and returns a summary
   */
  async validateAllContent(filePaths: string[]): Promise<ValidationSummary & {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    fileResults: Array<{ file: string; passed: boolean; issues: number }>;
  }> {
    const fileResults: Array<{ file: string; passed: boolean; issues: number }> = [];
    let totalIssues = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0
    };
    
    for (const filePath of filePaths) {
      const result = await this.validateContent(filePath);
      fileResults.push({
        file: filePath,
        passed: result.passed,
        issues: result.summary.total
      });
      
      // Aggregate issues
      totalIssues.critical += result.summary.critical;
      totalIssues.high += result.summary.high;
      totalIssues.medium += result.summary.medium;
      totalIssues.low += result.summary.low;
      totalIssues.total += result.summary.total;
    }
    
    const validFiles = fileResults.filter(r => r.passed).length;
    const invalidFiles = fileResults.filter(r => !r.passed).length;
    
    return {
      ...totalIssues,
      totalFiles: filePaths.length,
      validFiles,
      invalidFiles,
      fileResults
    };
  }

  private createResult(issues: ValidationIssue[]): ValidationResult {
    const summary: ValidationSummary = {
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      total: issues.length
    };

    const passed = summary.critical === 0 && summary.high === 0;

    const markdown = this.generateMarkdownReport(issues, summary, passed);

    return {
      passed,
      summary,
      issues,
      markdown
    };
  }

  /**
   * Generates a markdown report of validation results
   */
  private generateMarkdownReport(
    issues: ValidationIssue[], 
    summary: ValidationSummary, 
    passed: boolean
  ): string {
    let report = `# Validation Report\n\n`;
    report += `**Status**: ${passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;
    
    report += `## Summary\n`;
    report += `- 🔴 Critical: ${summary.critical}\n`;
    report += `- 🟠 High: ${summary.high}\n`;
    report += `- 🟡 Medium: ${summary.medium}\n`;
    report += `- 🟢 Low: ${summary.low}\n`;
    report += `- **Total Issues**: ${summary.total}\n\n`;

    if (issues.length > 0) {
      report += `## Issues\n\n`;
      
      const sortedIssues = [...issues].sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });

      sortedIssues.forEach(issue => {
        const icon = {
          critical: '🔴',
          high: '🟠',
          medium: '🟡',
          low: '🟢'
        }[issue.severity];

        report += `### ${icon} ${issue.type}\n`;
        report += `**Severity**: ${issue.severity}\n`;
        report += `**Details**: ${issue.details}\n`;
        if (issue.line) {
          report += `**Line**: ${issue.line}\n`;
        }
        if (issue.suggestion) {
          report += `**Suggestion**: ${issue.suggestion}\n`;
        }
        report += '\n';
      });
    }

    return report;
  }

  /**
   * Gets helpful suggestion for metadata errors
   */
  private getMetadataSuggestion(error: z.ZodIssue): string {
    const field = error.path.join('.');
    
    const suggestions: Record<string, string> = {
      'unique_id': 'Use lowercase letters, numbers, hyphens, and underscores only',
      'version': 'Use semantic versioning format (e.g., 1.0.0)',
      'category': 'Choose from: creative, educational, gaming, personal, professional',
      'name': 'Use a clear, descriptive name (3-100 characters)',
      'description': 'Provide a brief description (10-500 characters)'
    };

    return suggestions[field] || 'Check the field format and try again';
  }
}