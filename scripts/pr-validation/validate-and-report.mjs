#!/usr/bin/env node

/**
 * Integrated Validation and Reporting Pipeline
 * 
 * This script orchestrates the complete PR validation workflow:
 * 1. Runs security, quality, and integration validation
 * 2. Aggregates all results into a unified structure
 * 3. Generates comprehensive reports for reviewers
 * 4. Provides auto-approval recommendations
 * 
 * Features:
 * - Parallel execution of validation components
 * - Comprehensive error handling and recovery
 * - Detailed logging and progress tracking
 * - GitHub integration for status checks and comments
 * - Configurable validation thresholds
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import { ReportGenerator } from './report-generator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Pipeline configuration
 */
const PIPELINE_CONFIG = {
  COMPONENTS: {
    security: {
      script: 'security-scanner.mjs',
      timeout: 300000, // 5 minutes
      required: true,
      weight: 0.4
    },
    quality: {
      script: 'quality-analyzer.mjs',
      timeout: 180000, // 3 minutes
      required: true,
      weight: 0.3
    },
    integration: {
      script: 'integration-tester.mjs',
      timeout: 600000, // 10 minutes
      required: true,
      weight: 0.3
    }
  },
  
  OUTPUT: {
    directory: './validation-reports',
    formats: ['json', 'markdown'],
    includeArtifacts: true
  },
  
  GITHUB: {
    createStatusChecks: true,
    postComments: true,
    updatePRDescription: false
  }
};

/**
 * Main validation pipeline orchestrator
 */
class ValidationPipeline {
  constructor(options = {}) {
    this.config = { ...PIPELINE_CONFIG, ...options };
    this.results = {};
    this.files = [];
    this.startTime = Date.now();
    this.logger = new PipelineLogger();
  }

  /**
   * Run the complete validation pipeline
   */
  async run(files) {
    this.logger.info('🚀 Starting PR Validation Pipeline');
    this.logger.info(`📁 Files to validate: ${files.length}`);
    
    this.files = Array.isArray(files) ? files : [files];
    
    try {
      // Phase 1: Parallel validation execution
      this.logger.info('⚡ Phase 1: Running parallel validations...');
      await this.runValidations();
      
      // Phase 2: Results aggregation and analysis
      this.logger.info('📊 Phase 2: Aggregating results...');
      const aggregatedResults = this.aggregateResults();
      
      // Phase 3: Report generation
      this.logger.info('📝 Phase 3: Generating reports...');
      const reports = await this.generateReports(aggregatedResults);
      
      // Phase 4: GitHub integration (if enabled)
      if (this.config.GITHUB.createStatusChecks) {
        this.logger.info('🔗 Phase 4: Updating GitHub status...');
        await this.updateGitHubStatus(aggregatedResults, reports);
      }
      
      // Phase 5: Final summary
      this.logFinalSummary(aggregatedResults);
      
      return {
        success: true,
        results: aggregatedResults,
        reports,
        processingTime: Date.now() - this.startTime
      };
      
    } catch (error) {
      this.logger.error('❌ Pipeline failed:', error.message);
      return {
        success: false,
        error: error.message,
        results: this.results,
        processingTime: Date.now() - this.startTime
      };
    }
  }

  /**
   * Run all validation components in parallel
   */
  async runValidations() {
    const filesList = this.files.join(',');
    const validationPromises = [];

    for (const [component, config] of Object.entries(this.config.COMPONENTS)) {
      if (config.required) {
        this.logger.info(`   🔄 Starting ${component} validation...`);
        
        const validationPromise = this.runValidationComponent(
          component,
          config.script,
          filesList,
          config.timeout
        );
        
        validationPromises.push(validationPromise);
      }
    }

    // Wait for all validations to complete
    const results = await Promise.allSettled(validationPromises);
    
    // Process results and handle failures
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const componentName = Object.keys(this.config.COMPONENTS)[i];
      
      if (result.status === 'fulfilled') {
        this.results[componentName] = result.value;
        this.logger.success(`   ✅ ${componentName} validation completed`);
      } else {
        this.logger.error(`   ❌ ${componentName} validation failed:`, result.reason.message);
        this.results[componentName] = {
          error: result.reason.message,
          status: 'FAILED'
        };
      }
    }
  }

  /**
   * Run a single validation component
   */
  async runValidationComponent(name, script, files, timeout) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, script);
      const args = [scriptPath, files];
      
      const child = spawn('node', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          try {
            // Try to parse JSON output
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (parseError) {
            // If not JSON, return raw output
            resolve({
              output: stdout,
              status: 'COMPLETED',
              rawOutput: true
            });
          }
        } else {
          reject(new Error(`${name} failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start ${name}: ${error.message}`));
      });

      // Handle timeout
      setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`${name} validation timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Aggregate results from all validation components
   */
  aggregateResults() {
    const aggregated = {
      files: this.files,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - this.startTime,
      security: this.results.security || { issues: [], overallRiskLevel: 'UNKNOWN' },
      quality: this.results.quality || { overallScore: 0 },
      integration: this.results.integration || { allTestsPassing: false },
      pipeline: {
        version: '1.0.0',
        componentsRun: Object.keys(this.results).length,
        componentsSuccessful: Object.values(this.results).filter(r => !r.error).length,
        totalProcessingTime: Date.now() - this.startTime
      }
    };

    return aggregated;
  }

  /**
   * Generate comprehensive reports
   */
  async generateReports(results) {
    const generator = new ReportGenerator();
    const outputDir = this.config.OUTPUT.directory;

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    this.logger.info(`   📁 Output directory: ${outputDir}`);

    try {
      // Generate comprehensive report data
      const reportData = generator.generateReport(results, this.files);
      
      const reports = {
        data: reportData,
        files: {}
      };

      // Generate markdown reports
      if (this.config.OUTPUT.formats.includes('markdown')) {
        reports.files.reviewReport = path.join(outputDir, 'review-report.md');
        reports.files.autoApproval = path.join(outputDir, 'auto-approval-assessment.md');
        reports.files.checklist = path.join(outputDir, 'reviewer-checklist.md');

        const reviewMarkdown = generator.generateMarkdown(reportData);
        const autoApprovalMarkdown = generator.generateAutoApprovalReport(reportData);
        const checklistMarkdown = generator.generateChecklistReport(reportData);

        fs.writeFileSync(reports.files.reviewReport, reviewMarkdown);
        fs.writeFileSync(reports.files.autoApproval, autoApprovalMarkdown);
        fs.writeFileSync(reports.files.checklist, checklistMarkdown);

        this.logger.info('   📝 Markdown reports generated');
      }

      // Generate JSON reports
      if (this.config.OUTPUT.formats.includes('json')) {
        reports.files.json = path.join(outputDir, 'validation-report.json');
        reports.files.summary = path.join(outputDir, 'validation-summary.json');

        fs.writeFileSync(reports.files.json, JSON.stringify(reportData, null, 2));
        fs.writeFileSync(reports.files.summary, JSON.stringify({
          summary: reportData.summary,
          autoApproval: reportData.autoApproval,
          recommendations: reportData.recommendations
        }, null, 2));

        this.logger.info('   📊 JSON reports generated');
      }

      // Generate artifacts (if enabled)
      if (this.config.OUTPUT.includeArtifacts) {
        const artifactsDir = path.join(outputDir, 'artifacts');
        if (!fs.existsSync(artifactsDir)) {
          fs.mkdirSync(artifactsDir, { recursive: true });
        }

        // Save raw validation results
        for (const [component, result] of Object.entries(this.results)) {
          const artifactPath = path.join(artifactsDir, `${component}-raw-results.json`);
          fs.writeFileSync(artifactPath, JSON.stringify(result, null, 2));
        }

        this.logger.info('   📦 Validation artifacts saved');
      }

      return reports;

    } catch (error) {
      this.logger.error('Failed to generate reports:', error.message);
      throw error;
    }
  }

  /**
   * Update GitHub status checks and comments
   */
  async updateGitHubStatus(results, reports) {
    try {
      // This would integrate with GitHub API in a real implementation
      // For now, we'll create status files that GitHub Actions can use
      
      const statusDir = path.join(this.config.OUTPUT.directory, 'github-status');
      if (!fs.existsSync(statusDir)) {
        fs.mkdirSync(statusDir, { recursive: true });
      }

      // Generate status check data
      const statusChecks = this.generateStatusChecks(results);
      fs.writeFileSync(
        path.join(statusDir, 'status-checks.json'),
        JSON.stringify(statusChecks, null, 2)
      );

      // Generate PR comment
      const prComment = this.generatePRComment(results, reports);
      fs.writeFileSync(
        path.join(statusDir, 'pr-comment.md'),
        prComment
      );

      this.logger.info('   🔗 GitHub status files created');

    } catch (error) {
      this.logger.warn('Failed to update GitHub status:', error.message);
    }
  }

  /**
   * Generate GitHub status checks data
   */
  generateStatusChecks(results) {
    const checks = [];

    // Security status
    const securityLevel = results.security?.overallRiskLevel || 'UNKNOWN';
    checks.push({
      name: 'pr-validation/security',
      status: securityLevel === 'LOW' ? 'success' : 'failure',
      title: `Security: ${securityLevel} risk`,
      summary: `${results.security?.issues?.length || 0} issues found`
    });

    // Quality status
    const qualityScore = results.quality?.overallScore || 0;
    checks.push({
      name: 'pr-validation/quality',
      status: qualityScore >= 70 ? 'success' : 'failure',
      title: `Quality: ${qualityScore}/100`,
      summary: qualityScore >= 80 ? 'Excellent quality' : qualityScore >= 70 ? 'Acceptable quality' : 'Below standards'
    });

    // Integration status
    const integrationPassing = results.integration?.allTestsPassing || false;
    checks.push({
      name: 'pr-validation/integration',
      status: integrationPassing ? 'success' : 'failure',
      title: `Integration: ${integrationPassing ? 'PASSING' : 'FAILING'}`,
      summary: `All tests ${integrationPassing ? 'passed' : 'failed'}`
    });

    return checks;
  }

  /**
   * Generate PR comment with validation summary
   */
  generatePRComment(results, reports) {
    const summary = results.summary || {};
    const autoApproval = results.autoApproval || {};

    return `## 🤖 PR Validation Results

**Overall Status:** ${summary.overallStatus || 'UNKNOWN'}

### 📊 Quick Summary

| Component | Status | Score/Level |
|-----------|--------|-------------|
| Security | ${this.getStatusEmoji(results.security?.overallRiskLevel)} ${results.security?.overallRiskLevel || 'UNKNOWN'} | ${results.security?.issues?.length || 0} issues |
| Quality | ${this.getQualityEmoji(results.quality?.overallScore)} ${results.quality?.overallScore || 0}/100 | ${this.getQualityGrade(results.quality?.overallScore)} |
| Integration | ${results.integration?.allTestsPassing ? '✅' : '❌'} ${results.integration?.allTestsPassing ? 'PASSING' : 'FAILING'} | All tests ${results.integration?.allTestsPassing ? 'passed' : 'failed'} |

### 🤖 Auto-Approval Status

**${autoApproval.eligible ? '✅ ELIGIBLE' : '❌ MANUAL REVIEW REQUIRED'}**

${autoApproval.eligible ? 
  '🎉 This PR meets all criteria for automatic approval!' : 
  '👀 This PR requires manual review before approval.'}

### 📋 Next Steps

${this.generateNextSteps(results)}

---

📁 **Detailed Reports:** Available in workflow artifacts
🔗 **Pipeline Version:** ${results.pipeline?.version || '1.0.0'}
⏱️ **Processing Time:** ${Math.round((results.processingTime || 0) / 1000)}s`;
  }

  /**
   * Helper methods for status formatting
   */
  getStatusEmoji(riskLevel) {
    const emojiMap = {
      'LOW': '✅',
      'MEDIUM': '🔶',
      'HIGH': '⚠️',
      'CRITICAL': '🚨'
    };
    return emojiMap[riskLevel] || '❓';
  }

  getQualityEmoji(score) {
    if (score >= 90) return '🌟';
    if (score >= 80) return '✨';
    if (score >= 70) return '👍';
    if (score >= 60) return '⚠️';
    return '❌';
  }

  getQualityGrade(score) {
    if (score >= 90) return 'Grade A';
    if (score >= 80) return 'Grade B';
    if (score >= 70) return 'Grade C';
    if (score >= 60) return 'Grade D';
    return 'Grade F';
  }

  generateNextSteps(results) {
    const steps = [];
    
    if (results.security?.issues?.some(i => i.severity === 'CRITICAL')) {
      steps.push('🚨 **Critical:** Address security vulnerabilities immediately');
    }
    
    if (!results.integration?.allTestsPassing) {
      steps.push('🔧 **Required:** Fix integration test failures');
    }
    
    if ((results.quality?.overallScore || 0) < 70) {
      steps.push('📝 **Required:** Improve documentation quality');
    }
    
    if (steps.length === 0) {
      steps.push('✅ **Ready:** All validations passed, ready for review!');
    }
    
    return steps.map(step => `- ${step}`).join('\n');
  }

  /**
   * Log final pipeline summary
   */
  logFinalSummary(results) {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    this.logger.info('\n🎉 Pipeline completed successfully!');
    this.logger.info('─'.repeat(50));
    this.logger.info(`📁 Files analyzed: ${this.files.length}`);
    this.logger.info(`⏱️  Total time: ${duration}s`);
    this.logger.info(`🔒 Security: ${results.security?.overallRiskLevel || 'UNKNOWN'} risk`);
    this.logger.info(`📝 Quality: ${results.quality?.overallScore || 0}/100`);
    this.logger.info(`🔧 Integration: ${results.integration?.allTestsPassing ? 'PASSING' : 'FAILING'}`);
    this.logger.info(`🤖 Auto-approval: ${results.autoApproval?.eligible ? 'ELIGIBLE' : 'MANUAL REVIEW'}`);
    this.logger.info('─'.repeat(50));
  }
}

/**
 * Enhanced logging utility
 */
class PipelineLogger {
  info(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  }

  success(message, ...args) {
    console.log(`[SUCCESS] ${message}`, ...args);
  }

  warn(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  }
}

/**
 * Main execution function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node validate-and-report.mjs <file1,file2,...> [options]');
    console.error('');
    console.error('Options:');
    console.error('  --output-dir DIR    Specify output directory (default: ./validation-reports)');
    console.error('  --no-github         Disable GitHub integration');
    console.error('  --json-only         Only generate JSON reports');
    console.error('  --markdown-only     Only generate Markdown reports');
    process.exit(1);
  }

  const files = args[0].split(',').map(f => f.trim());
  
  // Parse options
  const options = {
    OUTPUT: { ...PIPELINE_CONFIG.OUTPUT },
    GITHUB: { ...PIPELINE_CONFIG.GITHUB }
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--no-github') {
      options.GITHUB.createStatusChecks = false;
    } else if (arg === '--json-only') {
      options.OUTPUT.formats = ['json'];
    } else if (arg === '--markdown-only') {
      options.OUTPUT.formats = ['markdown'];
    } else if (arg === '--output-dir' && i + 1 < args.length) {
      options.OUTPUT.directory = args[i + 1];
      i++; // Skip next argument
    }
  }

  try {
    const pipeline = new ValidationPipeline(options);
    const result = await pipeline.run(files);
    
    if (result.success) {
      console.log('\n✅ Validation completed successfully');
      process.exit(0);
    } else {
      console.error('\n❌ Validation failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Pipeline error:', error.message);
    process.exit(1);
  }
}

// Export for testing and integration
export { ValidationPipeline, PipelineLogger };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}