#!/usr/bin/env node
/**
 * CLI for validating collection content
 */

import { ContentValidator, ValidationResult } from '../validators/content-validator.js';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: validate-content <file-or-pattern> [file-or-pattern...]');
    console.error('Examples:');
    console.error('  validate-content persona.md');
    console.error('  validate-content library/personas/**/*.md');
    console.error('  validate-content "library/**/*.md" "showcase/**/*.md"');
    process.exit(1);
  }

  const validator = new ContentValidator();
  let allPassed = true;
  const allReports: Array<{ file: string; report: ValidationResult }> = [];

  // Expand glob patterns and collect all files
  const allFiles: string[] = [];
  for (const pattern of args) {
    if (pattern.includes('*')) {
      // It's a glob pattern
      const files = await glob(pattern);
      allFiles.push(...files);
    } else {
      // It's a direct file path
      allFiles.push(pattern);
    }
  }

  if (allFiles.length === 0) {
    console.error('No files found matching the provided patterns');
    process.exit(1);
  }

  console.log(`\n🔍 Validating ${allFiles.length} file(s)...\n`);

  // Validate each file
  for (const file of allFiles) {
    try {
      const result = await validator.validateContent(file);
      allReports.push({ file, report: result });
      
      if (!result.passed) {
        allPassed = false;
      }
      
      // Print result
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`${status} - ${file}`);
      
      if (!result.passed) {
        console.log(`   Critical: ${result.summary.critical}, High: ${result.summary.high}`);
      }
    } catch (error) {
      console.error(`❌ ERROR - ${file}: ${error}`);
      allPassed = false;
    }
  }

  // Generate summary
  console.log('\n📊 Summary');
  console.log('==========');
  
  const passedCount = allReports.filter(r => r.report.passed).length;
  const failedCount = allReports.filter(r => !r.report.passed).length;
  
  console.log(`Total files: ${allFiles.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  
  // Calculate total issues
  let totalCritical = 0;
  let totalHigh = 0;
  let totalMedium = 0;
  let totalLow = 0;
  
  for (const { report } of allReports) {
    totalCritical += report.summary.critical;
    totalHigh += report.summary.high;
    totalMedium += report.summary.medium;
    totalLow += report.summary.low;
  }
  
  if (totalCritical + totalHigh + totalMedium + totalLow > 0) {
    console.log('\nIssues by severity:');
    console.log(`  🔴 Critical: ${totalCritical}`);
    console.log(`  🟠 High: ${totalHigh}`);
    console.log(`  🟡 Medium: ${totalMedium}`);
    console.log(`  🟢 Low: ${totalLow}`);
  }

  // Write detailed report if requested
  const outputPath = process.env.OUTPUT_FILE || 
    (process.env.GITHUB_WORKSPACE 
      ? path.join(process.env.GITHUB_WORKSPACE, 'validation-report.json')
      : null);
    
  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(allReports, null, 2));
    console.log(`\n📄 Detailed report written to: ${outputPath}`);
  }

  // Show failed files with details
  if (failedCount > 0) {
    console.log('\n❌ Failed validations:');
    for (const { file, report } of allReports) {
      if (!report.passed) {
        console.log(`\n${file}:`);
        console.log(report.markdown.split('\n').map((line: string) => '  ' + line).join('\n'));
      }
    }
  }

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}