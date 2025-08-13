#!/usr/bin/env node

/**
 * Content Quality Analyzer for PR Validation
 * 
 * This utility performs comprehensive quality analysis on content files,
 * evaluating documentation standards, completeness, and overall quality.
 * 
 * Features:
 * - Documentation completeness analysis
 * - Content structure validation
 * - Language quality assessment
 * - Metadata richness evaluation
 * - Usability and clarity metrics
 * - Best practices compliance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Quality metrics and scoring criteria
 */
const QUALITY_METRICS = {
  DOCUMENTATION: {
    weight: 25,
    criteria: {
      hasDescription: { points: 5, required: true },
      descriptionLength: { minLength: 20, points: 5 },
      hasExamples: { points: 8 },
      hasUsageInstructions: { points: 7 }
    }
  },
  
  METADATA: {
    weight: 20,
    criteria: {
      hasRequiredFields: { points: 8, required: true },
      hasAuthor: { points: 3 },
      hasVersion: { points: 2 },
      hasTags: { points: 4 },
      hasCategory: { points: 3 }
    }
  },
  
  CONTENT_STRUCTURE: {
    weight: 20,
    criteria: {
      properHeadings: { points: 5 },
      logicalFlow: { points: 8 },
      codeBlocksFormatted: { points: 4 },
      linksValid: { points: 3 }
    }
  },
  
  LANGUAGE_QUALITY: {
    weight: 15,
    criteria: {
      grammarCheck: { points: 6 },
      readabilityScore: { points: 5 },
      professionalTone: { points: 4 }
    }
  },
  
  USABILITY: {
    weight: 10,
    criteria: {
      clearPurpose: { points: 4 },
      actionableContent: { points: 3 },
      troubleshooting: { points: 3 }
    }
  },
  
  BEST_PRACTICES: {
    weight: 10,
    criteria: {
      followsConventions: { points: 4 },
      securityConsiderations: { points: 3 },
      performanceNotes: { points: 3 }
    }
  }
};

/**
 * Quality analyzer class
 */
class QualityAnalyzer {
  constructor() {
    this.results = {
      files: {},
      summary: {
        totalFiles: 0,
        averageScore: 0,
        passedFiles: 0,
        failedFiles: 0,
        overallGrade: 'A',
        recommendations: []
      },
      timestamp: new Date().toISOString()
    };
    
    this.passingScore = 70; // Minimum score to pass
  }

  /**
   * Analyze multiple files for quality
   */
  async analyzeFiles(filePaths) {
    console.log(`📊 Starting quality analysis of ${filePaths.length} files...`);
    
    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        await this.analyzeFile(filePath);
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
      }
    }

    this.calculateSummary();
    return this.results;
  }

  /**
   * Analyze individual file
   */
  async analyzeFile(filePath) {
    console.log(`📄 Analyzing: ${filePath}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileResult = {
        path: filePath,
        size: content.length,
        score: 0,
        maxScore: 100,
        grade: 'F',
        passed: false,
        metrics: {},
        issues: [],
        recommendations: [],
        metadata: null,
        contentBody: null
      };

      // Parse frontmatter
      try {
        const parsed = matter(content);
        fileResult.metadata = parsed.data;
        fileResult.contentBody = parsed.content;
      } catch (e) {
        fileResult.contentBody = content;
        fileResult.issues.push({
          category: 'structure',
          severity: 'high',
          message: 'Failed to parse frontmatter',
          suggestion: 'Ensure content starts with valid YAML frontmatter'
        });
      }

      // Run quality assessments
      await this.assessDocumentation(fileResult);
      await this.assessMetadata(fileResult);
      await this.assessContentStructure(fileResult);
      await this.assessLanguageQuality(fileResult);
      await this.assessUsability(fileResult);
      await this.assessBestPractices(fileResult);

      // Calculate final score and grade
      this.calculateFileScore(fileResult);
      
      this.results.files[filePath] = fileResult;
      console.log(`   Score: ${fileResult.score}/${fileResult.maxScore} (${fileResult.grade}) - ${fileResult.passed ? 'PASSED' : 'FAILED'}`);
      
    } catch (error) {
      console.error(`❌ Error analyzing ${filePath}: ${error.message}`);
      this.results.files[filePath] = {
        path: filePath,
        error: error.message,
        score: 0,
        passed: false,
        issues: [{ category: 'system', severity: 'high', message: error.message }]
      };
    }
  }

  /**
   * Assess documentation quality
   */
  async assessDocumentation(fileResult) {
    const metric = QUALITY_METRICS.DOCUMENTATION;
    const assessment = {
      category: 'documentation',
      score: 0,
      maxScore: metric.weight,
      details: {}
    };

    const { metadata, contentBody } = fileResult;
    
    // Check for description
    if (metadata && metadata.description && metadata.description.trim()) {
      assessment.details.hasDescription = { score: 5, maxScore: 5 };
      assessment.score += 5;
      
      // Check description length
      if (metadata.description.length >= 20) {
        assessment.details.descriptionLength = { score: 5, maxScore: 5 };
        assessment.score += 5;
      } else {
        assessment.details.descriptionLength = { score: 2, maxScore: 5 };
        assessment.score += 2;
        fileResult.recommendations.push('Expand the description to be more detailed (minimum 20 characters)');
      }
    } else {
      assessment.details.hasDescription = { score: 0, maxScore: 5 };
      fileResult.issues.push({
        category: 'documentation',
        severity: 'high',
        message: 'Missing or empty description',
        suggestion: 'Add a clear, descriptive summary of the element\'s purpose'
      });
    }

    // Check for examples
    if (contentBody && (contentBody.includes('## Example') || contentBody.includes('## Usage') || contentBody.includes('```'))) {
      assessment.details.hasExamples = { score: 8, maxScore: 8 };
      assessment.score += 8;
    } else {
      assessment.details.hasExamples = { score: 0, maxScore: 8 };
      fileResult.recommendations.push('Add usage examples or code snippets to demonstrate functionality');
    }

    // Check for usage instructions
    if (contentBody && (contentBody.includes('how to') || contentBody.includes('usage') || contentBody.includes('instructions'))) {
      assessment.details.hasUsageInstructions = { score: 7, maxScore: 7 };
      assessment.score += 7;
    } else {
      assessment.details.hasUsageInstructions = { score: 3, maxScore: 7 };
      assessment.score += 3;
      fileResult.recommendations.push('Include clear usage instructions');
    }

    fileResult.metrics.documentation = assessment;
  }

  /**
   * Assess metadata quality
   */
  async assessMetadata(fileResult) {
    const metric = QUALITY_METRICS.METADATA;
    const assessment = {
      category: 'metadata',
      score: 0,
      maxScore: metric.weight,
      details: {}
    };

    const { metadata } = fileResult;
    
    if (!metadata) {
      fileResult.issues.push({
        category: 'metadata',
        severity: 'critical',
        message: 'No frontmatter metadata found',
        suggestion: 'Add YAML frontmatter with required fields'
      });
      fileResult.metrics.metadata = assessment;
      return;
    }

    // Check required fields
    const requiredFields = ['name', 'description', 'unique_id', 'author', 'type'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    
    if (missingFields.length === 0) {
      assessment.details.hasRequiredFields = { score: 8, maxScore: 8 };
      assessment.score += 8;
    } else {
      assessment.details.hasRequiredFields = { score: Math.max(0, 8 - missingFields.length * 2), maxScore: 8 };
      assessment.score += assessment.details.hasRequiredFields.score;
      fileResult.issues.push({
        category: 'metadata',
        severity: 'high',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        suggestion: 'Add all required metadata fields'
      });
    }

    // Check optional but recommended fields
    if (metadata.author && metadata.author.trim()) {
      assessment.details.hasAuthor = { score: 3, maxScore: 3 };
      assessment.score += 3;
    } else {
      assessment.details.hasAuthor = { score: 0, maxScore: 3 };
      fileResult.recommendations.push('Add author information');
    }

    if (metadata.version) {
      assessment.details.hasVersion = { score: 2, maxScore: 2 };
      assessment.score += 2;
    } else {
      assessment.details.hasVersion = { score: 0, maxScore: 2 };
      fileResult.recommendations.push('Add version number for better tracking');
    }

    if (metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
      assessment.details.hasTags = { score: 4, maxScore: 4 };
      assessment.score += 4;
    } else {
      assessment.details.hasTags = { score: 0, maxScore: 4 };
      fileResult.recommendations.push('Add relevant tags for better discoverability');
    }

    if (metadata.category) {
      assessment.details.hasCategory = { score: 3, maxScore: 3 };
      assessment.score += 3;
    } else {
      assessment.details.hasCategory = { score: 0, maxScore: 3 };
      fileResult.recommendations.push('Add category for better organization');
    }

    fileResult.metrics.metadata = assessment;
  }

  /**
   * Assess content structure quality
   */
  async assessContentStructure(fileResult) {
    const metric = QUALITY_METRICS.CONTENT_STRUCTURE;
    const assessment = {
      category: 'structure',
      score: 0,
      maxScore: metric.weight,
      details: {}
    };

    const { contentBody } = fileResult;
    
    if (!contentBody) {
      fileResult.metrics.contentStructure = assessment;
      return;
    }

    // Check for proper headings
    const headings = contentBody.match(/^#+\s+.+$/gm);
    if (headings && headings.length >= 2) {
      assessment.details.properHeadings = { score: 5, maxScore: 5 };
      assessment.score += 5;
    } else {
      assessment.details.properHeadings = { score: 2, maxScore: 5 };
      assessment.score += 2;
      fileResult.recommendations.push('Use proper heading structure (## Section, ### Subsection)');
    }

    // Check logical flow (basic heuristic)
    const sections = ['introduction', 'usage', 'example', 'configuration'];
    let flowScore = 0;
    for (const section of sections) {
      if (contentBody.toLowerCase().includes(section)) {
        flowScore += 2;
      }
    }
    assessment.details.logicalFlow = { score: Math.min(8, flowScore), maxScore: 8 };
    assessment.score += assessment.details.logicalFlow.score;

    // Check for formatted code blocks
    const codeBlocks = contentBody.match(/```[\s\S]*?```/g);
    if (codeBlocks && codeBlocks.length > 0) {
      assessment.details.codeBlocksFormatted = { score: 4, maxScore: 4 };
      assessment.score += 4;
    } else {
      assessment.details.codeBlocksFormatted = { score: 0, maxScore: 4 };
      if (contentBody.includes('`') && !contentBody.includes('```')) {
        fileResult.recommendations.push('Use proper code block formatting with ```');
      }
    }

    // Check for valid links (basic validation)
    const links = contentBody.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (links) {
      const validLinks = links.filter(link => {
        const url = link.match(/\(([^)]+)\)/)[1];
        return url.startsWith('http') || url.startsWith('/') || url.startsWith('#');
      });
      
      if (validLinks.length === links.length) {
        assessment.details.linksValid = { score: 3, maxScore: 3 };
        assessment.score += 3;
      } else {
        assessment.details.linksValid = { score: 1, maxScore: 3 };
        assessment.score += 1;
        fileResult.issues.push({
          category: 'structure',
          severity: 'medium',
          message: 'Some links may be invalid or malformed',
          suggestion: 'Review and fix broken or malformed links'
        });
      }
    } else {
      assessment.details.linksValid = { score: 3, maxScore: 3 }; // No links is not a penalty
      assessment.score += 3;
    }

    fileResult.metrics.contentStructure = assessment;
  }

  /**
   * Assess language quality
   */
  async assessLanguageQuality(fileResult) {
    const metric = QUALITY_METRICS.LANGUAGE_QUALITY;
    const assessment = {
      category: 'language',
      score: 0,
      maxScore: metric.weight,
      details: {}
    };

    const { contentBody, metadata } = fileResult;
    const fullText = `${metadata?.description || ''} ${contentBody || ''}`;
    
    if (!fullText.trim()) {
      fileResult.metrics.languageQuality = assessment;
      return;
    }

    // Basic grammar check (simple heuristics)
    const grammarScore = this.checkBasicGrammar(fullText);
    assessment.details.grammarCheck = { score: grammarScore, maxScore: 6 };
    assessment.score += grammarScore;

    // Readability assessment
    const readabilityScore = this.calculateReadability(fullText);
    assessment.details.readabilityScore = { score: readabilityScore, maxScore: 5 };
    assessment.score += readabilityScore;

    // Professional tone check
    const toneScore = this.checkProfessionalTone(fullText);
    assessment.details.professionalTone = { score: toneScore, maxScore: 4 };
    assessment.score += toneScore;

    fileResult.metrics.languageQuality = assessment;
  }

  /**
   * Basic grammar checking using simple heuristics
   */
  checkBasicGrammar(text) {
    let score = 6; // Start with full score
    
    // Check for common issues
    const issues = [
      { pattern: /\s{2,}/g, deduction: 0.5, message: 'Multiple spaces' },
      { pattern: /[.!?]\s*[a-z]/g, deduction: 1, message: 'Missing capitalization after sentence end' },
      { pattern: /\s[.!?]/g, deduction: 0.5, message: 'Space before punctuation' },
      { pattern: /[A-Z]{3,}/g, deduction: 0.5, message: 'Excessive capitalization' }
    ];

    for (const issue of issues) {
      const matches = text.match(issue.pattern);
      if (matches) {
        score -= issue.deduction * Math.min(matches.length, 3); // Cap deduction
      }
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate readability score using simple metrics
   */
  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    // Simplified Flesch Reading Ease calculation
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    // Optimal ranges: 10-20 words per sentence, 1.3-1.7 syllables per word
    let score = 5;
    
    if (avgWordsPerSentence > 25) score -= 2;
    else if (avgWordsPerSentence > 20) score -= 1;
    
    if (avgSyllablesPerWord > 2) score -= 2;
    else if (avgSyllablesPerWord > 1.7) score -= 1;

    return Math.max(0, score);
  }

  /**
   * Count syllables in a word (simplified)
   */
  countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  /**
   * Check for professional tone
   */
  checkProfessionalTone(text) {
    let score = 4;
    const lowerText = text.toLowerCase();
    
    // Deduct for overly casual language
    const casualPatterns = [
      /\b(gonna|wanna|gotta|dunno|ain't)\b/g,
      /\b(omg|lol|wtf|tbh|imo)\b/g,
      /(!!+|\?\?+)/g
    ];

    for (const pattern of casualPatterns) {
      const matches = lowerText.match(pattern);
      if (matches) {
        score -= 0.5 * Math.min(matches.length, 3);
      }
    }

    // Check for appropriate technical language
    if (lowerText.includes('please') || lowerText.includes('recommend') || lowerText.includes('consider')) {
      score += 0.5; // Bonus for polite language
    }

    return Math.max(0, Math.round(score * 10) / 10);
  }

  /**
   * Assess usability aspects
   */
  async assessUsability(fileResult) {
    const metric = QUALITY_METRICS.USABILITY;
    const assessment = {
      category: 'usability',
      score: 0,
      maxScore: metric.weight,
      details: {}
    };

    const { contentBody, metadata } = fileResult;
    const fullText = `${metadata?.description || ''} ${contentBody || ''}`;
    
    // Check for clear purpose
    if (metadata?.description && contentBody && contentBody.length > 100) {
      assessment.details.clearPurpose = { score: 4, maxScore: 4 };
      assessment.score += 4;
    } else {
      assessment.details.clearPurpose = { score: 1, maxScore: 4 };
      assessment.score += 1;
      fileResult.recommendations.push('Clearly explain the purpose and benefits');
    }

    // Check for actionable content
    const actionWords = ['step', 'follow', 'run', 'execute', 'configure', 'install', 'setup'];
    const hasActionable = actionWords.some(word => fullText.toLowerCase().includes(word));
    
    if (hasActionable) {
      assessment.details.actionableContent = { score: 3, maxScore: 3 };
      assessment.score += 3;
    } else {
      assessment.details.actionableContent = { score: 0, maxScore: 3 };
      fileResult.recommendations.push('Include actionable steps or instructions');
    }

    // Check for troubleshooting or common issues
    if (fullText.toLowerCase().includes('troubleshoot') || 
        fullText.toLowerCase().includes('common issue') ||
        fullText.toLowerCase().includes('known limitation')) {
      assessment.details.troubleshooting = { score: 3, maxScore: 3 };
      assessment.score += 3;
    } else {
      assessment.details.troubleshooting = { score: 0, maxScore: 3 };
      fileResult.recommendations.push('Consider adding troubleshooting guidance');
    }

    fileResult.metrics.usability = assessment;
  }

  /**
   * Assess best practices compliance
   */
  async assessBestPractices(fileResult) {
    const metric = QUALITY_METRICS.BEST_PRACTICES;
    const assessment = {
      category: 'bestPractices',
      score: 0,
      maxScore: metric.weight,
      details: {}
    };

    const { contentBody, metadata } = fileResult;
    
    // Check for naming conventions
    if (metadata?.unique_id && /^[a-z0-9-_]+$/.test(metadata.unique_id)) {
      assessment.details.followsConventions = { score: 4, maxScore: 4 };
      assessment.score += 4;
    } else {
      assessment.details.followsConventions = { score: 1, maxScore: 4 };
      assessment.score += 1;
      fileResult.recommendations.push('Follow naming conventions for unique_id');
    }

    // Check for security considerations
    if (contentBody && (contentBody.toLowerCase().includes('security') || 
                       contentBody.toLowerCase().includes('caution') ||
                       contentBody.toLowerCase().includes('warning'))) {
      assessment.details.securityConsiderations = { score: 3, maxScore: 3 };
      assessment.score += 3;
    } else {
      assessment.details.securityConsiderations = { score: 0, maxScore: 3 };
      fileResult.recommendations.push('Consider adding security notes if applicable');
    }

    // Check for performance notes
    if (contentBody && (contentBody.toLowerCase().includes('performance') ||
                       contentBody.toLowerCase().includes('optimization') ||
                       contentBody.toLowerCase().includes('efficiency'))) {
      assessment.details.performanceNotes = { score: 3, maxScore: 3 };
      assessment.score += 3;
    } else {
      assessment.details.performanceNotes = { score: 0, maxScore: 3 };
      fileResult.recommendations.push('Consider adding performance considerations');
    }

    fileResult.metrics.bestPractices = assessment;
  }

  /**
   * Calculate final file score and grade
   */
  calculateFileScore(fileResult) {
    let totalScore = 0;
    
    for (const metric of Object.values(fileResult.metrics)) {
      totalScore += metric.score;
    }

    fileResult.score = Math.round(totalScore);
    fileResult.passed = fileResult.score >= this.passingScore;

    // Calculate letter grade
    if (fileResult.score >= 90) fileResult.grade = 'A';
    else if (fileResult.score >= 80) fileResult.grade = 'B';
    else if (fileResult.score >= 70) fileResult.grade = 'C';
    else if (fileResult.score >= 60) fileResult.grade = 'D';
    else fileResult.grade = 'F';
  }

  /**
   * Calculate overall summary
   */
  calculateSummary() {
    const files = Object.values(this.results.files);
    this.results.summary.totalFiles = files.length;
    
    if (files.length === 0) return;
    
    let totalScore = 0;
    let passedCount = 0;
    
    for (const file of files) {
      if (file.score !== undefined) {
        totalScore += file.score;
        if (file.passed) passedCount++;
      }
    }

    this.results.summary.averageScore = Math.round(totalScore / files.length);
    this.results.summary.passedFiles = passedCount;
    this.results.summary.failedFiles = files.length - passedCount;

    // Calculate overall grade
    const avgScore = this.results.summary.averageScore;
    if (avgScore >= 90) this.results.summary.overallGrade = 'A';
    else if (avgScore >= 80) this.results.summary.overallGrade = 'B';
    else if (avgScore >= 70) this.results.summary.overallGrade = 'C';
    else if (avgScore >= 60) this.results.summary.overallGrade = 'D';
    else this.results.summary.overallGrade = 'F';

    // Generate recommendations
    this.generateRecommendations();
  }

  /**
   * Generate overall recommendations
   */
  generateRecommendations() {
    const files = Object.values(this.results.files);
    const commonIssues = {};
    
    for (const file of files) {
      if (file.recommendations) {
        for (const rec of file.recommendations) {
          commonIssues[rec] = (commonIssues[rec] || 0) + 1;
        }
      }
    }

    // Get most common recommendations
    const sortedRecommendations = Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([rec]) => rec);

    this.results.summary.recommendations = sortedRecommendations;
  }

  /**
   * Generate quality report
   */
  generateReport() {
    const { summary } = this.results;
    const gradeIcons = { A: '🌟', B: '✅', C: '⚠️', D: '❌', F: '💥' };

    let report = `# Content Quality Analysis Report\n\n`;
    report += `**Overall Grade**: ${gradeIcons[summary.overallGrade]} ${summary.overallGrade} (${summary.averageScore}/100)\n`;
    report += `**Files Analyzed**: ${summary.totalFiles}\n`;
    report += `**Passed**: ${summary.passedFiles} | **Failed**: ${summary.failedFiles}\n\n`;

    if (summary.recommendations.length > 0) {
      report += `## Top Recommendations\n\n`;
      for (const rec of summary.recommendations) {
        report += `- ${rec}\n`;
      }
      report += '\n';
    }

    // File-specific details
    for (const [filePath, fileResult] of Object.entries(this.results.files)) {
      if (fileResult.score !== undefined) {
        report += `## File: ${filePath}\n\n`;
        report += `**Score**: ${fileResult.score}/100 | **Grade**: ${gradeIcons[fileResult.grade]} ${fileResult.grade} | **Status**: ${fileResult.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

        // Metrics breakdown
        if (fileResult.metrics) {
          report += `### Metrics Breakdown\n\n`;
          for (const [metricName, metric] of Object.entries(fileResult.metrics)) {
            const percentage = Math.round((metric.score / metric.maxScore) * 100);
            report += `- **${metricName}**: ${metric.score}/${metric.maxScore} (${percentage}%)\n`;
          }
          report += '\n';
        }

        // Issues
        if (fileResult.issues && fileResult.issues.length > 0) {
          report += `### Issues\n\n`;
          for (const issue of fileResult.issues) {
            const severityIcon = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
            report += `- ${severityIcon[issue.severity]} **${issue.message}**\n`;
            if (issue.suggestion) report += `  - *Suggestion*: ${issue.suggestion}\n`;
          }
          report += '\n';
        }

        // Recommendations
        if (fileResult.recommendations && fileResult.recommendations.length > 0) {
          report += `### Recommendations\n\n`;
          for (const rec of fileResult.recommendations) {
            report += `- 💡 ${rec}\n`;
          }
          report += '\n';
        }
      }
    }

    return report;
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node quality-analyzer.mjs <file1,file2,...>');
    process.exit(1);
  }

  // Parse comma-separated file list
  const files = args[0].split(',').map(f => f.trim()).filter(f => f);
  
  if (files.length === 0) {
    console.log('No files to analyze');
    process.exit(0);
  }

  const analyzer = new QualityAnalyzer();
  const results = await analyzer.analyzeFiles(files);

  // Save detailed report
  fs.writeFileSync('quality-report.json', JSON.stringify(results, null, 2));
  
  // Generate markdown report
  const markdownReport = analyzer.generateReport();
  fs.writeFileSync('quality-report.md', markdownReport);

  // Determine pass/fail
  const passed = results.summary.averageScore >= analyzer.passingScore;
  
  console.log(`\n--- ANALYSIS COMPLETE ---`);
  console.log(`Overall Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Average Score: ${results.summary.averageScore}/100`);
  console.log(`Grade: ${results.summary.overallGrade}`);
  console.log(`Files: ${results.summary.passedFiles} passed, ${results.summary.failedFiles} failed`);

  // Set GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `passed=${passed}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `score=${results.summary.averageScore}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report=${markdownReport.replace(/\n/g, '%0A')}\n`);
  }

  process.exit(passed ? 0 : 1);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { QualityAnalyzer };