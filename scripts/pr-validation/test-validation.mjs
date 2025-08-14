#!/usr/bin/env node

/**
 * Test script for PR validation pipeline
 * 
 * This script tests all validation components to ensure they work correctly
 * before deploying the PR validation workflow.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

/**
 * Test runner class
 */
class ValidationTester {
  constructor() {
    this.results = {
      security: null,
      quality: null,
      integration: null,
      overallSuccess: false
    };
  }

  /**
   * Run all validation tests
   */
  async runTests() {
    console.log('🧪 Testing PR Validation Pipeline\n');

    // Use a sample file for testing
    const testFile = 'library/personas/creative-writer.md';
    
    if (!fs.existsSync(testFile)) {
      console.error(`❌ Test file not found: ${testFile}`);
      return false;
    }

    console.log(`📁 Using test file: ${testFile}\n`);

    try {
      // Test security scanner
      await this.testSecurityScanner(testFile);
      
      // Test quality analyzer
      await this.testQualityAnalyzer(testFile);
      
      // Test integration tester
      await this.testIntegrationTester(testFile);

      // Overall assessment
      this.assessOverallResults();

      return this.results.overallSuccess;

    } catch (error) {
      console.error(`❌ Test execution failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Test security scanner
   */
  async testSecurityScanner(testFile) {
    console.log('🔒 Testing Security Scanner...');
    
    try {
      const { stdout, stderr } = await execAsync(`node scripts/pr-validation/security-scanner.mjs "${testFile}"`);
      
      // Check if security report was generated
      const reportExists = fs.existsSync('security-report.json');
      const mdReportExists = fs.existsSync('security-report.md');
      
      this.results.security = {
        executed: true,
        reportsGenerated: reportExists && mdReportExists,
        output: stdout,
        error: stderr
      };

      if (reportExists) {
        const report = JSON.parse(fs.readFileSync('security-report.json', 'utf8'));
        this.results.security.riskLevel = report.summary.riskLevel;
        this.results.security.score = report.summary.overallScore;
      }

      console.log(`   ✅ Security scanner executed successfully`);
      console.log(`   📄 Reports generated: ${reportExists && mdReportExists ? 'Yes' : 'No'}`);
      if (this.results.security.riskLevel) {
        console.log(`   🔍 Risk Level: ${this.results.security.riskLevel}`);
      }

    } catch (error) {
      this.results.security = {
        executed: false,
        error: error.message
      };
      console.log(`   ❌ Security scanner failed: ${error.message}`);
    }
    console.log();
  }

  /**
   * Test quality analyzer
   */
  async testQualityAnalyzer(testFile) {
    console.log('📊 Testing Quality Analyzer...');
    
    try {
      const { stdout, stderr } = await execAsync(`node scripts/pr-validation/quality-analyzer.mjs "${testFile}"`);
      
      // Check if quality report was generated
      const reportExists = fs.existsSync('quality-report.json');
      const mdReportExists = fs.existsSync('quality-report.md');
      
      this.results.quality = {
        executed: true,
        reportsGenerated: reportExists && mdReportExists,
        output: stdout,
        error: stderr
      };

      if (reportExists) {
        const report = JSON.parse(fs.readFileSync('quality-report.json', 'utf8'));
        this.results.quality.averageScore = report.summary.averageScore;
        this.results.quality.grade = report.summary.overallGrade;
        this.results.quality.passed = report.summary.passedFiles > 0;
      }

      console.log(`   ✅ Quality analyzer executed successfully`);
      console.log(`   📄 Reports generated: ${reportExists && mdReportExists ? 'Yes' : 'No'}`);
      if (this.results.quality.averageScore !== undefined) {
        console.log(`   📈 Average Score: ${this.results.quality.averageScore}/100 (${this.results.quality.grade})`);
      }

    } catch (error) {
      this.results.quality = {
        executed: false,
        error: error.message
      };
      console.log(`   ❌ Quality analyzer failed: ${error.message}`);
    }
    console.log();
  }

  /**
   * Test integration tester
   */
  async testIntegrationTester(testFile) {
    console.log('🧪 Testing Integration Tester...');
    
    try {
      // Integration tester might exit with code 1 if tests fail, but that's expected
      let stdout, stderr;
      try {
        const result = await execAsync(`node scripts/pr-validation/integration-tester.mjs "${testFile}"`);
        stdout = result.stdout;
        stderr = result.stderr;
      } catch (execError) {
        // Capture output even if exit code is non-zero
        stdout = execError.stdout || '';
        stderr = execError.stderr || '';
      }
      
      // Check if integration report was generated
      const reportExists = fs.existsSync('integration-report.json');
      const mdReportExists = fs.existsSync('integration-report.md');
      
      this.results.integration = {
        executed: true,
        reportsGenerated: reportExists && mdReportExists,
        output: stdout,
        error: stderr
      };

      if (reportExists) {
        const report = JSON.parse(fs.readFileSync('integration-report.json', 'utf8'));
        this.results.integration.overallSuccess = report.summary.overallSuccess;
        this.results.integration.totalTests = report.summary.totalTests;
        this.results.integration.passedTests = report.summary.passedTests;
        this.results.integration.failedTests = report.summary.failedTests;
      }

      console.log(`   ✅ Integration tester executed successfully`);
      console.log(`   📄 Reports generated: ${reportExists && mdReportExists ? 'Yes' : 'No'}`);
      if (this.results.integration.totalTests !== undefined) {
        console.log(`   🔬 Tests: ${this.results.integration.passedTests}✅ ${this.results.integration.failedTests}❌`);
      }

    } catch (error) {
      this.results.integration = {
        executed: false,
        error: error.message
      };
      console.log(`   ❌ Integration tester failed: ${error.message}`);
    }
    console.log();
  }

  /**
   * Assess overall results
   */
  assessOverallResults() {
    console.log('📋 Overall Test Results:');
    
    const components = [
      { name: 'Security Scanner', result: this.results.security },
      { name: 'Quality Analyzer', result: this.results.quality },
      { name: 'Integration Tester', result: this.results.integration }
    ];

    let allExecuted = true;
    let allReportsGenerated = true;

    for (const component of components) {
      const status = component.result?.executed ? '✅' : '❌';
      const reports = component.result?.reportsGenerated ? '📄' : '❌';
      
      console.log(`   ${status} ${component.name}: ${component.result?.executed ? 'Executed' : 'Failed'}`);
      console.log(`   ${reports} Reports: ${component.result?.reportsGenerated ? 'Generated' : 'Missing'}`);
      
      if (!component.result?.executed) allExecuted = false;
      if (!component.result?.reportsGenerated) allReportsGenerated = false;
    }

    this.results.overallSuccess = allExecuted && allReportsGenerated;

    console.log(`\n🎯 Final Assessment: ${this.results.overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (this.results.overallSuccess) {
      console.log('\n🚀 PR Validation Pipeline is ready for deployment!');
      console.log('\nNext steps:');
      console.log('1. Commit and push the validation workflow');
      console.log('2. Test with a real PR to verify GitHub Actions integration');
      console.log('3. Monitor the validation reports and adjust thresholds as needed');
    } else {
      console.log('\n⚠️  Issues found. Please fix before deploying:');
      if (!allExecuted) console.log('- Some validation components failed to execute');
      if (!allReportsGenerated) console.log('- Some reports were not generated');
    }
  }

  /**
   * Clean up test artifacts
   */
  cleanup() {
    const artifacts = [
      'security-report.json',
      'security-report.md',
      'quality-report.json',
      'quality-report.md',
      'integration-report.json',
      'integration-report.md'
    ];

    for (const artifact of artifacts) {
      if (fs.existsSync(artifact)) {
        fs.unlinkSync(artifact);
      }
    }

    console.log('\n🧹 Cleaned up test artifacts');
  }
}

/**
 * Main function
 */
async function main() {
  const tester = new ValidationTester();
  
  try {
    const success = await tester.runTests();
    
    // Clean up test files
    tester.cleanup();
    
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error(`❌ Test runner failed: ${error.message}`);
    tester.cleanup();
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}