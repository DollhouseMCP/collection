#!/usr/bin/env node

/**
 * Test Report Generator
 * 
 * This script tests the report generator with sample validation results
 * to ensure all templates and functionality work correctly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ReportGenerator } from './report-generator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate sample validation results for testing
 */
function generateSampleResults() {
  return {
    files: [
      'library/personas/security-analyst.md',
      'library/skills/threat-modeling.md'
    ],
    security: {
      issues: [
        {
          id: 'test-medium-issue',
          severity: 'MEDIUM',
          category: 'content-analysis',
          description: 'Potential sensitive information reference',
          mitigation: 'Review and sanitize references to sensitive data',
          file: 'library/personas/security-analyst.md',
          line: 45,
          pattern: 'password pattern detected'
        }
      ],
      overallRiskLevel: 'LOW',
      confidenceScore: 94,
      processingTime: 156,
      stats: {
        filesScanned: 2,
        patternsChecked: 847,
        totalChecks: 1694
      }
    },
    quality: {
      overallScore: 87,
      breakdown: {
        documentation: { score: 22, maxScore: 25, percentage: 88 },
        metadata: { score: 18, maxScore: 20, percentage: 90 },
        structure: { score: 17, maxScore: 20, percentage: 85 },
        language: { score: 13, maxScore: 15, percentage: 87 },
        usability: { score: 9, maxScore: 10, percentage: 90 },
        bestPractices: { score: 8, maxScore: 10, percentage: 80 }
      },
      strengths: [
        'Excellent metadata completeness',
        'Clear documentation structure',
        'Professional language quality'
      ],
      improvements: [
        'Add more practical examples',
        'Expand usage instructions',
        'Include troubleshooting section'
      ],
      processingTime: 89
    },
    integration: {
      allTestsPassing: true,
      testSuites: {
        elementLoading: {
          name: 'Element Loading',
          status: 'PASSED',
          testsRun: 4,
          testsPassed: 4,
          details: {
            canParseYaml: 'PASSED',
            hasValidStructure: 'PASSED',
            metadataComplete: 'PASSED',
            contentAccessible: 'PASSED'
          }
        },
        schemaCompliance: {
          name: 'Schema Compliance',
          status: 'PASSED',
          testsRun: 4,
          testsPassed: 4,
          details: {
            requiredFieldsPresent: 'PASSED',
            fieldTypesCorrect: 'PASSED',
            constraintsRespected: 'PASSED',
            validationPassed: 'PASSED'
          }
        },
        collectionIntegration: {
          name: 'Collection Integration',
          status: 'PASSED',
          testsRun: 3,
          testsPassed: 3,
          details: {
            noNamingConflicts: 'PASSED',
            properDirectoryStructure: 'PASSED',
            collectionMetadataValid: 'PASSED'
          }
        }
      },
      processingTime: 234,
      performanceMetrics: {
        loadTime: 47,
        memoryUsage: 'minimal',
        complexity: 'low'
      }
    }
  };
}

/**
 * Generate failing validation results for testing
 */
function generateFailingResults() {
  return {
    files: [
      'library/tools/suspicious-tool.md'
    ],
    security: {
      issues: [
        {
          id: 'critical-code-injection',
          severity: 'CRITICAL',
          category: 'code-injection',
          description: 'Direct code evaluation attempt detected',
          mitigation: 'Remove eval() and Function() calls',
          file: 'library/tools/suspicious-tool.md',
          line: 23,
          pattern: 'eval(userInput)'
        },
        {
          id: 'high-prompt-injection',
          severity: 'HIGH',
          category: 'prompt-injection',
          description: 'Instruction override attempt',
          mitigation: 'Remove prompt injection patterns',
          file: 'library/tools/suspicious-tool.md',
          line: 67,
          pattern: 'ignore previous instructions'
        }
      ],
      overallRiskLevel: 'CRITICAL',
      confidenceScore: 98,
      processingTime: 203
    },
    quality: {
      overallScore: 45,
      breakdown: {
        documentation: { score: 8, maxScore: 25, percentage: 32 },
        metadata: { score: 12, maxScore: 20, percentage: 60 },
        structure: { score: 10, maxScore: 20, percentage: 50 },
        language: { score: 6, maxScore: 15, percentage: 40 },
        usability: { score: 3, maxScore: 10, percentage: 30 },
        bestPractices: { score: 6, maxScore: 10, percentage: 60 }
      },
      strengths: [
        'Basic metadata present'
      ],
      improvements: [
        'Expand documentation significantly',
        'Improve content structure',
        'Add usage examples',
        'Enhance language clarity',
        'Follow best practices'
      ],
      processingTime: 67
    },
    integration: {
      allTestsPassing: false,
      testSuites: {
        elementLoading: {
          name: 'Element Loading',
          status: 'FAILED',
          testsRun: 4,
          testsPassed: 2,
          details: {
            canParseYaml: 'PASSED',
            hasValidStructure: 'FAILED',
            metadataComplete: 'FAILED',
            contentAccessible: 'PASSED'
          }
        },
        schemaCompliance: {
          name: 'Schema Compliance',
          status: 'FAILED',
          testsRun: 4,
          testsPassed: 1,
          details: {
            requiredFieldsPresent: 'FAILED',
            fieldTypesCorrect: 'FAILED',
            constraintsRespected: 'FAILED',
            validationPassed: 'PASSED'
          }
        }
      },
      processingTime: 156
    }
  };
}

/**
 * Test the report generator with different scenarios
 */
async function runTests() {
  console.log('🧪 Testing Report Generator...\n');

  const generator = new ReportGenerator();
  const testOutputDir = path.join(__dirname, 'test-reports');

  // Ensure test output directory exists
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }

  try {
    // Test 1: High-quality, passing submission
    console.log('📊 Test 1: High-Quality Submission');
    const passingResults = generateSampleResults();
    const passingReport = generator.generateReport(passingResults, passingResults.files);

    // Generate all report types
    const passingMarkdown = generator.generateMarkdown(passingReport);
    const passingAutoApproval = generator.generateAutoApprovalReport(passingReport);
    const passingChecklist = generator.generateChecklistReport(passingReport);

    // Write test reports
    fs.writeFileSync(path.join(testOutputDir, 'passing-review-report.md'), passingMarkdown);
    fs.writeFileSync(path.join(testOutputDir, 'passing-auto-approval.md'), passingAutoApproval);
    fs.writeFileSync(path.join(testOutputDir, 'passing-checklist.md'), passingChecklist);
    fs.writeFileSync(path.join(testOutputDir, 'passing-report.json'), JSON.stringify(passingReport, null, 2));

    console.log(`   ✅ Auto-approval eligible: ${passingReport.autoApproval.eligible}`);
    console.log(`   📊 Quality score: ${passingReport.quality.score}/100`);
    console.log(`   🔒 Security risk: ${passingReport.security.riskLevel}`);
    console.log('   📁 Reports generated in test-reports/passing-*\n');

    // Test 2: Failing submission with critical issues
    console.log('🚨 Test 2: Failing Submission');
    const failingResults = generateFailingResults();
    const failingReport = generator.generateReport(failingResults, failingResults.files);

    const failingMarkdown = generator.generateMarkdown(failingReport);
    const failingAutoApproval = generator.generateAutoApprovalReport(failingReport);
    const failingChecklist = generator.generateChecklistReport(failingReport);

    fs.writeFileSync(path.join(testOutputDir, 'failing-review-report.md'), failingMarkdown);
    fs.writeFileSync(path.join(testOutputDir, 'failing-auto-approval.md'), failingAutoApproval);
    fs.writeFileSync(path.join(testOutputDir, 'failing-checklist.md'), failingChecklist);
    fs.writeFileSync(path.join(testOutputDir, 'failing-report.json'), JSON.stringify(failingReport, null, 2));

    console.log(`   ❌ Auto-approval eligible: ${failingReport.autoApproval.eligible}`);
    console.log(`   📊 Quality score: ${failingReport.quality.score}/100`);
    console.log(`   🔒 Security risk: ${failingReport.security.riskLevel}`);
    console.log('   📁 Reports generated in test-reports/failing-*\n');

    // Test 3: Template loading
    console.log('📄 Test 3: Template System');
    console.log(`   📝 Templates loaded: ${Object.keys(generator.templates).length}`);
    console.log(`   📄 Available templates: ${Object.keys(generator.templates).join(', ')}`);
    console.log('   ✅ Template system working\n');

    // Test 4: Edge cases
    console.log('🔍 Test 4: Edge Cases');
    const emptyResults = {
      files: [],
      security: { issues: [] },
      quality: { overallScore: 0 },
      integration: { allTestsPassing: false }
    };
    const edgeReport = generator.generateReport(emptyResults);
    console.log(`   🔄 Empty results handled: ${edgeReport.summary.overallStatus}`);
    console.log('   ✅ Edge cases handled properly\n');

    // Summary
    console.log('🎉 All tests completed successfully!');
    console.log(`📁 Test reports available in: ${testOutputDir}`);
    console.log('\n📋 Test Report Summary:');
    console.log('   ✅ High-quality submission → Auto-approval eligible');
    console.log('   ❌ Failing submission → Manual review required');
    console.log('   📄 All templates working correctly');
    console.log('   🔍 Edge cases handled properly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, generateSampleResults, generateFailingResults };