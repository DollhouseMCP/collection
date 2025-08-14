#!/usr/bin/env node

/**
 * Test the Complete Roundtrip Workflow
 * 
 * This script simulates the full element submission and validation workflow:
 * 1. Browse/search the collection for an element
 * 2. Install it locally (simulate)
 * 3. Validate the element with all PR validation scripts
 * 4. Generate reports
 * 5. Verify the workflow is working end-to-end
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || rootDir,
      stdio: options.silent ? 'pipe' : 'inherit'
    });

    let output = '';
    if (options.silent) {
      child.stdout?.on('data', (data) => output += data.toString());
      child.stderr?.on('data', (data) => output += data.toString());
    }

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}\n${output}`));
      }
    });
  });
}

class RoundtripWorkflowTester {
  constructor() {
    this.testResults = {
      steps: [],
      passed: 0,
      failed: 0,
      timestamp: new Date().toISOString()
    };

    // Test data directory
    this.testDir = path.join(rootDir, 'test-roundtrip');
    this.testElement = null;
  }

  async run() {
    logSection('🚀 ROUNDTRIP WORKFLOW TEST');
    log('Testing the complete element submission and validation workflow\n');

    try {
      // Step 1: Setup test environment
      await this.setupTestEnvironment();

      // Step 2: Select an element from collection
      await this.selectTestElement();

      // Step 3: Prepare test submission
      await this.prepareSubmission();

      // Step 4: Run security validation
      await this.runSecurityValidation();

      // Step 5: Run quality analysis
      await this.runQualityAnalysis();

      // Step 6: Run integration tests
      await this.runIntegrationTests();

      // Step 7: Generate reports
      await this.generateReports();

      // Step 8: Validate workflow
      await this.validateWorkflow();

      // Final report
      this.generateFinalReport();

    } catch (error) {
      log(`\n❌ Test failed: ${error.message}`, colors.red);
      this.testResults.error = error.message;
      process.exit(1);
    }
  }

  async setupTestEnvironment() {
    logSection('Step 1: Setting up test environment');
    
    // Create test directory
    if (!fs.existsSync(this.testDir)) {
      fs.mkdirSync(this.testDir, { recursive: true });
      log(`✅ Created test directory: ${this.testDir}`, colors.green);
    } else {
      log(`✅ Test directory exists: ${this.testDir}`, colors.green);
    }

    this.recordStep('Setup Test Environment', true);
  }

  async selectTestElement() {
    logSection('Step 2: Selecting element from collection');

    // List available elements
    const libraryPath = path.join(rootDir, 'library');
    const elements = [];

    // Find all markdown files in library
    const findElements = (dir, type) => {
      const typeDir = path.join(dir, type);
      if (fs.existsSync(typeDir)) {
        const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
        files.forEach(file => {
          elements.push({
            type,
            file,
            path: path.join(typeDir, file)
          });
        });
      }
    };

    ['agents', 'skills', 'templates', 'personas', 'ensembles'].forEach(type => {
      findElements(libraryPath, type);
    });

    if (elements.length === 0) {
      throw new Error('No elements found in collection');
    }

    // Select a good test candidate (prefer agents as they're complex)
    this.testElement = elements.find(e => e.type === 'agents' && e.file === 'code-reviewer.md') 
                      || elements[0];

    log(`\n📦 Selected element for testing:`, colors.cyan);
    log(`  Type: ${this.testElement.type}`, colors.yellow);
    log(`  File: ${this.testElement.file}`, colors.yellow);
    log(`  Path: ${this.testElement.path}`, colors.yellow);

    // Read element content
    const content = fs.readFileSync(this.testElement.path, 'utf8');
    const parsed = matter(content);
    
    log(`\n📋 Element details:`, colors.cyan);
    log(`  Name: ${parsed.data.name}`, colors.yellow);
    log(`  Description: ${parsed.data.description}`, colors.yellow);
    log(`  Author: ${parsed.data.author}`, colors.yellow);
    log(`  Type: ${parsed.data.type}`, colors.yellow);

    this.recordStep('Select Test Element', true);
  }

  async prepareSubmission() {
    logSection('Step 3: Preparing test submission');

    // Copy element to test directory
    const testFile = path.join(this.testDir, 'test-element.md');
    fs.copyFileSync(this.testElement.path, testFile);
    
    log(`✅ Copied element to: ${testFile}`, colors.green);

    // Create a modified version (to simulate user submission)
    const content = fs.readFileSync(testFile, 'utf8');
    const parsed = matter(content);
    
    // Modify metadata slightly
    parsed.data.unique_id = `test_${parsed.data.type}_roundtrip_${Date.now()}`;
    parsed.data.author = 'test-user';
    parsed.data.test_submission = true;
    
    // Write back
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(testFile, newContent);
    
    log(`✅ Modified element for testing`, colors.green);
    this.testFile = testFile;

    this.recordStep('Prepare Submission', true);
  }

  async runSecurityValidation() {
    logSection('Step 4: Running security validation');

    try {
      const securityScript = path.join(rootDir, 'scripts/pr-validation/security-scanner.mjs');
      
      log(`\n🔒 Running security scanner...`, colors.cyan);
      const output = await runCommand('node', [securityScript, this.testFile], { 
        silent: true, 
        cwd: rootDir 
      });

      // Parse results
      const resultFile = path.join(rootDir, 'security-report.json');
      if (fs.existsSync(resultFile)) {
        const results = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
        
        log(`\n📊 Security scan results:`, colors.cyan);
        log(`  Total patterns checked: ${results.summary?.patternsChecked || 'N/A'}`, colors.yellow);
        log(`  Issues found: ${results.summary?.totalIssues || 0}`, 
            results.summary?.totalIssues > 0 ? colors.red : colors.green);
        
        if (results.summary?.criticalCount > 0) {
          log(`  ⚠️  Critical issues: ${results.summary.criticalCount}`, colors.red);
        }
      }

      this.recordStep('Security Validation', true);
    } catch (error) {
      log(`⚠️  Security validation had issues: ${error.message}`, colors.yellow);
      this.recordStep('Security Validation', false, error.message);
    }
  }

  async runQualityAnalysis() {
    logSection('Step 5: Running quality analysis');

    try {
      const qualityScript = path.join(rootDir, 'scripts/pr-validation/quality-analyzer.mjs');
      
      log(`\n✨ Running quality analyzer...`, colors.cyan);
      const output = await runCommand('node', [qualityScript, this.testFile], { 
        silent: true, 
        cwd: rootDir 
      });

      // Parse results
      const resultFile = path.join(rootDir, 'quality-report.json');
      if (fs.existsSync(resultFile)) {
        const results = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
        
        log(`\n📊 Quality analysis results:`, colors.cyan);
        log(`  Overall score: ${results.summary?.score || 'N/A'}/100`, colors.yellow);
        log(`  Grade: ${results.summary?.grade || 'N/A'}`, colors.yellow);
        
        if (results.summary?.passed) {
          log(`  ✅ Quality threshold passed`, colors.green);
        } else {
          log(`  ❌ Below quality threshold`, colors.red);
        }
      }

      this.recordStep('Quality Analysis', true);
    } catch (error) {
      log(`⚠️  Quality analysis had issues: ${error.message}`, colors.yellow);
      this.recordStep('Quality Analysis', false, error.message);
    }
  }

  async runIntegrationTests() {
    logSection('Step 6: Running integration tests');

    try {
      const integrationScript = path.join(rootDir, 'scripts/pr-validation/integration-tester.mjs');
      
      log(`\n🧪 Running integration tests...`, colors.cyan);
      const output = await runCommand('node', [integrationScript, this.testFile], { 
        silent: true, 
        cwd: rootDir 
      });

      // Parse results
      const resultFile = path.join(rootDir, 'integration-report.json');
      if (fs.existsSync(resultFile)) {
        const results = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
        
        log(`\n📊 Integration test results:`, colors.cyan);
        log(`  Tests run: ${results.summary?.totalTests || 0}`, colors.yellow);
        log(`  Passed: ${results.summary?.passedTests || 0}`, colors.green);
        log(`  Failed: ${results.summary?.failedTests || 0}`, 
            results.summary?.failedTests > 0 ? colors.red : colors.green);
        log(`  Skipped: ${results.summary?.skippedTests || 0}`, colors.yellow);
      }

      this.recordStep('Integration Tests', true);
    } catch (error) {
      log(`⚠️  Integration tests had issues: ${error.message}`, colors.yellow);
      this.recordStep('Integration Tests', false, error.message);
    }
  }

  async generateReports() {
    logSection('Step 7: Generating comprehensive reports');

    try {
      const reportScript = path.join(rootDir, 'scripts/pr-validation/report-generator.mjs');
      
      log(`\n📝 Generating unified report...`, colors.cyan);
      
      // Create report inputs
      const inputs = {
        files: [this.testFile],
        securityReport: path.join(rootDir, 'security-report.json'),
        qualityReport: path.join(rootDir, 'quality-report.json'),
        integrationReport: path.join(rootDir, 'integration-report.json')
      };

      // Check which reports exist
      const reports = [];
      if (fs.existsSync(inputs.securityReport)) reports.push('Security');
      if (fs.existsSync(inputs.qualityReport)) reports.push('Quality');
      if (fs.existsSync(inputs.integrationReport)) reports.push('Integration');

      log(`\n📋 Available reports:`, colors.cyan);
      reports.forEach(r => log(`  ✅ ${r} report`, colors.green));

      // Generate markdown report
      const reportPath = path.join(this.testDir, 'roundtrip-test-report.md');
      
      let reportContent = `# Roundtrip Workflow Test Report\n\n`;
      reportContent += `**Date**: ${new Date().toISOString()}\n`;
      reportContent += `**Element**: ${this.testElement.file}\n`;
      reportContent += `**Type**: ${this.testElement.type}\n\n`;
      
      reportContent += `## Test Results\n\n`;
      this.testResults.steps.forEach(step => {
        const icon = step.passed ? '✅' : '❌';
        reportContent += `- ${icon} **${step.name}**: ${step.passed ? 'Passed' : `Failed - ${step.error || 'Unknown error'}`}\n`;
      });

      fs.writeFileSync(reportPath, reportContent);
      log(`\n✅ Report generated: ${reportPath}`, colors.green);

      this.recordStep('Generate Reports', true);
    } catch (error) {
      log(`⚠️  Report generation had issues: ${error.message}`, colors.yellow);
      this.recordStep('Generate Reports', false, error.message);
    }
  }

  async validateWorkflow() {
    logSection('Step 8: Validating complete workflow');

    // Check all expected files were created
    const expectedFiles = [
      path.join(this.testDir, 'test-element.md'),
      path.join(this.testDir, 'roundtrip-test-report.md')
    ];

    const optionalFiles = [
      path.join(rootDir, 'security-report.json'),
      path.join(rootDir, 'quality-report.json'),
      path.join(rootDir, 'integration-report.json')
    ];

    log(`\n📁 Checking generated files:`, colors.cyan);
    
    let allRequired = true;
    for (const file of expectedFiles) {
      if (fs.existsSync(file)) {
        log(`  ✅ ${path.basename(file)}`, colors.green);
      } else {
        log(`  ❌ ${path.basename(file)} - MISSING`, colors.red);
        allRequired = false;
      }
    }

    let optionalCount = 0;
    for (const file of optionalFiles) {
      if (fs.existsSync(file)) {
        log(`  ✅ ${path.basename(file)}`, colors.green);
        optionalCount++;
      } else {
        log(`  ⚠️  ${path.basename(file)} - Not generated`, colors.yellow);
      }
    }

    if (allRequired && optionalCount >= 2) {
      log(`\n✅ Workflow validation passed!`, colors.green);
      this.recordStep('Validate Workflow', true);
    } else {
      log(`\n⚠️  Workflow validation incomplete`, colors.yellow);
      this.recordStep('Validate Workflow', false, 'Some expected outputs missing');
    }
  }

  recordStep(name, passed, error = null) {
    const step = { name, passed, error };
    this.testResults.steps.push(step);
    if (passed) {
      this.testResults.passed++;
    } else {
      this.testResults.failed++;
    }
  }

  generateFinalReport() {
    logSection('📊 FINAL TEST RESULTS');

    const total = this.testResults.passed + this.testResults.failed;
    const successRate = total > 0 ? Math.round((this.testResults.passed / total) * 100) : 0;

    log(`\nTest Summary:`, colors.bright);
    log(`  Total steps: ${total}`, colors.yellow);
    log(`  Passed: ${this.testResults.passed}`, colors.green);
    log(`  Failed: ${this.testResults.failed}`, colors.red);
    log(`  Success rate: ${successRate}%`, successRate >= 75 ? colors.green : colors.red);

    if (this.testResults.failed === 0) {
      log(`\n🎉 ALL TESTS PASSED! The roundtrip workflow is working correctly.`, colors.bright + colors.green);
    } else if (successRate >= 75) {
      log(`\n✅ Workflow is mostly functional with minor issues.`, colors.yellow);
    } else {
      log(`\n❌ Workflow has significant issues that need attention.`, colors.red);
    }

    // Save final results
    const resultsPath = path.join(this.testDir, 'test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.testResults, null, 2));
    log(`\n📁 Test results saved to: ${resultsPath}`, colors.cyan);

    // Cleanup optional
    log(`\n💡 Test files preserved in: ${this.testDir}`, colors.cyan);
    log(`   Run 'rm -rf ${this.testDir}' to clean up`, colors.yellow);

    process.exit(this.testResults.failed === 0 ? 0 : 1);
  }
}

// Run the test
async function main() {
  const tester = new RoundtripWorkflowTester();
  await tester.run();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { RoundtripWorkflowTester };