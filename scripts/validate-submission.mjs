#!/usr/bin/env node

/**
 * Element Submission Validator
 * 
 * This script validates element submissions for the GitHub Actions workflow.
 * It integrates with the existing validation infrastructure from the collection.
 * 
 * Usage: node validate-submission.mjs <content> [options]
 * 
 * Features:
 * - Security pattern scanning
 * - Schema validation using Zod
 * - Content quality checks
 * - Duplicate detection
 * - Detailed reporting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glob } from 'glob';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Security patterns (simplified version of the full security-patterns.ts)
const CRITICAL_PATTERNS = [
  { pattern: /\beval\s*\(/i, desc: 'Code evaluation attempt' },
  { pattern: /\bexec\s*\(/i, desc: 'Code execution attempt' },
  { pattern: /\bsystem\s*\(/i, desc: 'System command attempt' },
  { pattern: /ignore\s+(all\s+)?(previous|prior|above|preceding)\s+(instructions?|commands?|directives?|rules?)/i, desc: 'Instruction override attempt' },
  { pattern: /disregard\s+(all\s+|the\s+|everything\s+)?(previous|prior|above|preceding)\s+(instructions?|commands?|directives?|rules?)/i, desc: 'Instruction disregard attempt' },
  { pattern: /remove\s+all\s+restrictions|operate\s+without\s+any?\s+restrictions/i, desc: 'Restriction removal attempt' }
];

const HIGH_RISK_PATTERNS = [
  { pattern: /\brequire\s*\(/i, desc: 'Node.js require attempt' },
  { pattern: /\bimport\s+.*\bfs\b/i, desc: 'File system import attempt' },
  { pattern: /\bprocess\./i, desc: 'Process object access' },
  { pattern: /javascript:/i, desc: 'JavaScript protocol' },
  { pattern: /<script/i, desc: 'Script tag injection' },
  { pattern: /you\s+are\s+now\s+.{0,50}(instead|ignore|forget)/i, desc: 'Identity replacement attempt' },
  { pattern: /act\s+as\s+(root|admin|administrator|system|sudo)/i, desc: 'Privilege escalation attempt' }
];

const MEDIUM_RISK_PATTERNS = [
  { pattern: /data:.*base64/i, desc: 'Base64 data URL' },
  { pattern: /\$\{.*\}/i, desc: 'Template literal injection' },
  { pattern: /on\w+\s*=/i, desc: 'HTML event handler' },
  { pattern: /developer\s+mode|debug\s+mode/i, desc: 'Debug mode activation' }
];

// Validation constants
const MAX_CONTENT_LENGTH = 50000;
const MIN_CONTENT_LENGTH = 50;
const ALLOWED_TYPES = ['persona', 'skill', 'agent', 'prompt', 'template', 'tool', 'ensemble', 'memory'];
const ALLOWED_CATEGORIES = ['creative', 'educational', 'gaming', 'personal', 'professional'];

class SubmissionValidator {
  constructor() {
    this.results = {
      passed: false,
      errors: [],
      warnings: [],
      info: [],
      metadata: null,
      content: null,
      targetPath: null,
      securityScore: 0
    };
  }

  log(level, message) {
    this.results[level].push(message);
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  /**
   * Main validation function
   */
  async validate(content, options = {}) {
    try {
      this.log('info', 'Starting submission validation...');

      // Phase 1: Basic validation
      await this.validateBasics(content);

      // Phase 2: Security validation  
      await this.validateSecurity(content);

      // Phase 3: Content parsing
      const parsed = await this.parseContent(content);

      // Phase 4: Schema validation
      await this.validateSchema(parsed.data);

      // Phase 5: Quality validation
      await this.validateQuality(parsed.content, parsed.data);

      // Phase 6: Duplicate check
      if (!options.skipDuplicateCheck) {
        await this.checkDuplicates(parsed.data.unique_id);
      }

      // Phase 7: Determine target path
      this.setTargetPath(parsed.data);

      // Store validated content
      this.results.metadata = parsed.data;
      this.results.content = content;
      this.results.passed = this.results.errors.length === 0;

      this.log('info', `Validation complete. Status: ${this.results.passed ? 'PASSED' : 'FAILED'}`);
      
      return this.results;
      
    } catch (error) {
      this.log('errors', `Validation failed: ${error.message}`);
      this.results.passed = false;
      return this.results;
    }
  }

  /**
   * Basic content validation
   */
  async validateBasics(content) {
    this.log('info', 'Phase 1: Basic validation');

    if (!content || content.trim() === '') {
      throw new Error('Content is empty');
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Content exceeds maximum size of ${MAX_CONTENT_LENGTH} characters`);
    }

    this.log('info', `✓ Content size: ${content.length} characters`);
  }

  /**
   * Security pattern validation
   */
  async validateSecurity(content) {
    this.log('info', 'Phase 2: Security validation');

    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;

    // Check critical patterns
    for (const { pattern, desc } of CRITICAL_PATTERNS) {
      if (pattern.test(content)) {
        this.log('errors', `CRITICAL: ${desc}`);
        criticalCount++;
      }
    }

    // Check high-risk patterns
    for (const { pattern, desc } of HIGH_RISK_PATTERNS) {
      if (pattern.test(content)) {
        this.log('warnings', `HIGH: ${desc}`);
        highCount++;
      }
    }

    // Check medium-risk patterns
    for (const { pattern, desc } of MEDIUM_RISK_PATTERNS) {
      if (pattern.test(content)) {
        this.log('warnings', `MEDIUM: ${desc}`);
        mediumCount++;
      }
    }

    // Security scoring and decision
    this.results.securityScore = criticalCount * 10 + highCount * 5 + mediumCount * 2;

    if (criticalCount > 0) {
      throw new Error(`Security validation failed: ${criticalCount} critical security issues detected`);
    }

    if (highCount > 3) {
      throw new Error(`Security validation failed: Too many high-risk patterns (${highCount})`);
    }

    if (this.results.securityScore > 0) {
      this.log('warnings', `Security warnings detected (score: ${this.results.securityScore})`);
    } else {
      this.log('info', '✓ No security issues detected');
    }
  }

  /**
   * Parse and extract frontmatter
   */
  async parseContent(content) {
    this.log('info', 'Phase 3: Content parsing');

    try {
      const parsed = matter(content);
      
      if (!parsed.data || Object.keys(parsed.data).length === 0) {
        throw new Error('No frontmatter found. Content must start with YAML frontmatter between --- markers');
      }

      this.log('info', `✓ Frontmatter parsed with ${Object.keys(parsed.data).length} fields`);
      
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse frontmatter: ${error.message}`);
    }
  }

  /**
   * Schema validation
   */
  async validateSchema(metadata) {
    this.log('info', 'Phase 4: Schema validation');

    // Check required fields
    const requiredFields = ['name', 'description', 'unique_id', 'author', 'type'];
    for (const field of requiredFields) {
      if (!metadata[field] || (typeof metadata[field] === 'string' && metadata[field].trim() === '')) {
        throw new Error(`Missing or empty required field: ${field}`);
      }
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(metadata.type)) {
      throw new Error(`Invalid type: ${metadata.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
    }

    // Validate category if present
    if (metadata.category && !ALLOWED_CATEGORIES.includes(metadata.category)) {
      throw new Error(`Invalid category: ${metadata.category}. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`);
    }

    // Validate unique_id format
    if (!/^[a-z0-9-_]+$/.test(metadata.unique_id)) {
      throw new Error('unique_id must contain only lowercase letters, numbers, hyphens, and underscores');
    }

    // Validate name and description length
    if (metadata.name.length < 3 || metadata.name.length > 100) {
      throw new Error('name must be between 3 and 100 characters');
    }

    if (metadata.description.length < 10 || metadata.description.length > 500) {
      throw new Error('description must be between 10 and 500 characters');
    }

    // Validate version format if present
    if (metadata.version && !/^\d+\.\d+\.\d+$/.test(metadata.version)) {
      this.log('warnings', 'version should follow semantic versioning format (e.g., 1.0.0)');
    }

    this.log('info', '✓ Schema validation passed');
  }

  /**
   * Content quality validation
   */
  async validateQuality(content, metadata) {
    this.log('info', 'Phase 5: Quality validation');

    // Check content length
    if (content.trim().length < MIN_CONTENT_LENGTH) {
      throw new Error(`Content body is too short (minimum ${MIN_CONTENT_LENGTH} characters)`);
    }

    // Check for placeholder content
    const placeholders = ['TODO', 'FIXME', 'XXX', '[INSERT', '[ADD', 'TBD', 'lorem ipsum'];
    for (const placeholder of placeholders) {
      if (content.toLowerCase().includes(placeholder.toLowerCase())) {
        throw new Error(`Content contains placeholder text: ${placeholder}. Please replace with actual content`);
      }
    }

    // Check for empty or generic descriptions
    if (metadata.description.toLowerCase().includes('description goes here') ||
        metadata.description.toLowerCase().includes('add description') ||
        metadata.description.toLowerCase() === 'a helpful assistant') {
      this.log('warnings', 'Description appears to be generic or placeholder text');
    }

    // Type-specific quality checks
    if (metadata.type === 'persona') {
      if (!content.toLowerCase().includes('you are') && !content.toLowerCase().includes('your role')) {
        this.log('warnings', 'Persona content should define the AI\'s role and behavior');
      }
    }

    if (metadata.type === 'prompt') {
      if (!content.includes('{') && !content.includes('[')) {
        this.log('info', 'Consider adding placeholders for customizable parts of the prompt');
      }
    }

    this.log('info', '✓ Quality validation passed');
  }

  /**
   * Check for duplicate unique_id
   */
  async checkDuplicates(uniqueId) {
    this.log('info', 'Phase 6: Duplicate check');

    try {
      // Search in all potential directories
      const searchPaths = [
        'library/**/*.md',
        'showcase/**/*.md', 
        'catalog/**/*.md'
      ];

      for (const searchPath of searchPaths) {
        const files = await glob(searchPath, { cwd: rootDir, absolute: true });
        
        for (const file of files) {
          if (!fs.existsSync(file)) continue;
          
          try {
            const fileContent = fs.readFileSync(file, 'utf8');
            const fileParsed = matter(fileContent);
            
            if (fileParsed.data.unique_id === uniqueId) {
              throw new Error(`Element with unique_id "${uniqueId}" already exists in: ${path.relative(rootDir, file)}`);
            }
          } catch {
            // Skip files that can't be parsed
            continue;
          }
        }
      }

      this.log('info', '✓ No duplicates found');
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw error;
      }
      // If glob or file operations fail, just warn and continue
      this.log('warnings', `Could not complete duplicate check: ${error.message}`);
    }
  }

  /**
   * Set target file path
   */
  setTargetPath(metadata) {
    const elementType = metadata.type;
    const filename = metadata.unique_id.replace(/[^a-z0-9-_]/g, '-') + '.md';
    
    // Determine target directory based on type
    let typeDir;
    if (elementType === 'memory') {
      typeDir = 'memories'; // Plural form for consistency
    } else if (elementType === 'ensemble') {
      typeDir = 'ensembles';
    } else {
      typeDir = elementType + 's'; // Add 's' for other types
    }
    
    this.results.targetPath = `library/${typeDir}/${filename}`;
    this.log('info', `✓ Target path: ${this.results.targetPath}`);
  }

  /**
   * Generate markdown report
   */
  generateReport() {
    let report = `# Element Submission Validation Report\n\n`;
    report += `**Status**: ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;
    
    if (this.results.metadata) {
      report += `## Element Details\n`;
      report += `- **Name**: ${this.results.metadata.name}\n`;
      report += `- **Type**: ${this.results.metadata.type}\n`;
      report += `- **Author**: ${this.results.metadata.author}\n`;
      report += `- **Unique ID**: ${this.results.metadata.unique_id}\n`;
      if (this.results.targetPath) {
        report += `- **Target Path**: ${this.results.targetPath}\n`;
      }
      report += `\n`;
    }

    if (this.results.securityScore > 0) {
      report += `## Security Analysis\n`;
      report += `- **Security Score**: ${this.results.securityScore}\n`;
      report += `- **Status**: ${this.results.securityScore > 20 ? '🔴 High Risk' : this.results.securityScore > 10 ? '🟡 Medium Risk' : '🟢 Low Risk'}\n\n`;
    }

    if (this.results.errors.length > 0) {
      report += `## ❌ Errors\n`;
      this.results.errors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += '\n';
    }

    if (this.results.warnings.length > 0) {
      report += `## ⚠️ Warnings\n`;
      this.results.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
      report += '\n';
    }

    if (this.results.info.length > 0) {
      report += `## ℹ️ Information\n`;
      this.results.info.forEach(info => {
        report += `- ${info}\n`;
      });
      report += '\n';
    }

    return report;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node validate-submission.mjs <content> [--skip-duplicates]');
    process.exit(1);
  }

  const content = args[0];
  const options = {
    skipDuplicateCheck: args.includes('--skip-duplicates')
  };

  const validator = new SubmissionValidator();
  const results = await validator.validate(content, options);

  // Output results as JSON for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const output = {
      validation_passed: results.passed,
      error_message: results.errors.join('; '),
      warnings_count: results.warnings.length,
      target_path: results.targetPath,
      element_type: results.metadata?.type,
      element_name: results.metadata?.name,
      security_score: results.securityScore,
      report: validator.generateReport()
    };
    
    console.log('\n--- GITHUB ACTIONS OUTPUT ---');
    console.log(JSON.stringify(output, null, 2));
  }

  process.exit(results.passed ? 0 : 1);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { SubmissionValidator };