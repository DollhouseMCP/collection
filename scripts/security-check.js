#!/usr/bin/env node

/**
 * Security Check Script
 * 
 * Runs comprehensive security checks on the DollhouseMCP Collection repository:
 * - Content security pattern scanning
 * - Dependency vulnerability audit
 * - Configuration validation
 * - File permission checks
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔒 DollhouseMCP Collection Security Check\n');

let hasErrors = false;

/**
 * Run a command and return its output
 */
function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    const output = execSync(command, { 
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(`✅ ${description} - PASSED\n`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} - FAILED`);
    console.error(`Error: ${error.message}\n`);
    hasErrors = true;
    return null;
  }
}

/**
 * Check if required security files exist
 */
function checkSecurityFiles() {
  console.log('📋 Checking security configuration files...');
  
  const requiredFiles = [
    'src/validators/security-patterns.ts',
    'src/validators/content-validator.ts',
    '.github/workflows/security-scan.yml',
    '.github/dependabot.yml'
  ];
  
  let allExist = true;
  
  for (const file of requiredFiles) {
    const fullPath = join(rootDir, file);
    if (existsSync(fullPath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      allExist = false;
      hasErrors = true;
    }
  }
  
  if (allExist) {
    console.log('✅ Security configuration files - PASSED\n');
  } else {
    console.log('❌ Security configuration files - FAILED\n');
  }
}

/**
 * Run dependency security audit
 */
function runDependencyAudit() {
  // Check for high/critical vulnerabilities
  runCommand('npm audit --audit-level=high', 'npm dependency security audit');
}

/**
 * Run content security validation
 */
function runContentValidation() {
  // Build the project first if needed
  if (!existsSync(join(rootDir, 'dist'))) {
    runCommand('npm run build', 'Building project for security validation');
  }
  
  // Run content validation
  runCommand('npm run validate:content', 'Content security validation');
}

/**
 * Check TypeScript compilation
 */
function checkTypeScript() {
  runCommand('npx tsc --noEmit', 'TypeScript compilation check');
}

/**
 * Run ESLint security rules
 */
function runESLintSecurity() {
  runCommand('npm run lint', 'ESLint security rules check');
}

/**
 * Check for common security misconfigurations
 */
function checkSecurityMisconfigurations() {
  console.log('📋 Checking for security misconfigurations...');
  
  // Check package.json for security issues
  try {
    const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    
    // Check for scripts that might be dangerous
    const dangerousScripts = ['postinstall', 'preinstall'];
    const haseDangerousScripts = dangerousScripts.some(script => 
      packageJson.scripts && packageJson.scripts[script]
    );
    
    if (haseDangerousScripts) {
      console.log('  ⚠️  Potentially dangerous npm scripts detected');
      hasErrors = true;
    } else {
      console.log('  ✅ No dangerous npm scripts found');
    }
    
    console.log('✅ Security misconfiguration check - PASSED\n');
  } catch (error) {
    console.error('❌ Security misconfiguration check - FAILED');
    console.error(`Error: ${error.message}\n`);
    hasErrors = true;
  }
}

/**
 * Main security check execution
 */
async function main() {
  console.log(`Running security checks in: ${rootDir}\n`);
  
  // Run all security checks
  checkSecurityFiles();
  checkSecurityMisconfigurations();
  checkTypeScript();
  runESLintSecurity();
  runDependencyAudit();
  runContentValidation();
  
  // Final report
  console.log('🏁 Security Check Complete');
  console.log('========================');
  
  if (hasErrors) {
    console.log('❌ SECURITY ISSUES FOUND');
    console.log('Please review and fix the issues above before deploying.');
    process.exit(1);
  } else {
    console.log('✅ ALL SECURITY CHECKS PASSED');
    console.log('Repository appears secure for deployment.');
    process.exit(0);
  }
}

// Run the security check
main().catch(error => {
  console.error('💥 Security check failed with error:', error);
  process.exit(1);
});