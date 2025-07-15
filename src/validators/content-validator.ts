/**
 * Content validator for DollhouseMCP Collection
 * Validates all content types against security and quality standards
 */

import * as fs from 'fs';
import * as path from 'path';
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
  created_date: z.string().optional(),
  updated_date: z.string().optional(),
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

// Add other content type schemas as needed
const ContentMetadataSchema = z.discriminatedUnion('type', [
  PersonaMetadataSchema,
  // Add other schemas here as implemented
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
      
      // Check file size
      if (content.length > MAX_CONTENT_LENGTH) {
        issues.push({
          severity: 'high',
          type: 'file_too_large',
          details: `File exceeds maximum size of ${MAX_CONTENT_LENGTH} characters`
        });
      }

      // Parse frontmatter
      let parsed;
      try {
        parsed = matter(content);
      } catch (error) {
        issues.push({
          severity: 'critical',
          type: 'invalid_format',
          details: 'Failed to parse YAML frontmatter',
          suggestion: 'Ensure the file starts with valid YAML between --- markers'
        });
        return this.createResult(issues);
      }

      // Validate metadata structure
      const metadataIssues = this.validateMetadata(parsed.data);
      issues.push(...metadataIssues);

      // Security scanning
      const securityIssues = scanForSecurityPatterns(content);
      issues.push(...securityIssues);

      // Content quality checks
      const qualityIssues = this.validateContentQuality(parsed.content, parsed.data);
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
          issues.push({
            severity: 'high',
            type: 'invalid_metadata',
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