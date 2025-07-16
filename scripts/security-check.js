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
    if (error.code === 'ENOENT') {
      console.error(`Command not found: ${command.split(' ')[0]}`);
      console.error(`Please ensure the command is installed and available in PATH\n`);
    } else if (error.status) {
      console.error(`Command exited with code ${error.status}`);
      console.error(`Error: ${error.message}\n`);
    } else {
      console.error(`Error: ${error.message}\n`);
    }
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
    {
      path: 'src/validators/security-patterns.ts',
      description: 'Security pattern definitions',
      helpUrl: 'https://github.com/DollhouseMCP/collection/blob/main/docs/SECURITY.md'
    },
    {
      path: 'src/validators/content-validator.ts',
      description: 'Content validation logic',
      helpUrl: 'https://github.com/DollhouseMCP/collection/blob/main/docs/VALIDATION.md'
    },
    {
      path: '.github/workflows/security-scan.yml',
      description: 'Automated security scanning workflow',
      helpUrl: 'https://docs.github.com/en/actions/using-workflows'
    },
    {
      path: '.github/dependabot.yml',
      description: 'Dependency update configuration',
      helpUrl: 'https://docs.github.com/en/code-security/dependabot'
    }
  ];
  
  let allExist = true;
  
  for (const file of requiredFiles) {
    const fullPath = join(rootDir, file.path);
    if (existsSync(fullPath)) {
      console.log(`  ✅ ${file.path}`);
    } else {
      console.log(`  ❌ ${file.path} - MISSING`);
      console.log(`     ${file.description}`);
      console.log(`     Setup guide: ${file.helpUrl}`);
      allExist = false;
      hasErrors = true;
    }
  }
  
  if (allExist) {
    console.log('✅ Security configuration files - PASSED\n');
  } else {
    console.log('❌ Security configuration files - FAILED');
    console.log('   These files are required for branch protection and security compliance.\n');
  }
}

/**
 * Run dependency security audit
 */
function runDependencyAudit() {
  console.log('📋 Running comprehensive dependency security audit...');
  
  // Check for high/critical vulnerabilities
  const auditResult = runCommand('npm audit --audit-level=high --json', 'npm dependency security audit');
  
  if (auditResult) {
    try {
      const auditData = JSON.parse(auditResult);
      if (auditData.metadata && auditData.metadata.vulnerabilities) {
        const vulns = auditData.metadata.vulnerabilities;
        const total = vulns.high + vulns.critical;
        
        if (total > 0) {
          console.log(`  ⚠️  Found ${vulns.critical} critical and ${vulns.high} high severity vulnerabilities`);
          console.log('  💡 Run "npm audit fix" to resolve automatically fixable issues');
          console.log('  📖 Review "npm audit" output for manual fixes\n');
        } else {
          console.log('  ✅ No high or critical vulnerabilities found\n');
        }
      }
    } catch {
      console.log('  ℹ️  Unable to parse audit JSON, but command completed successfully\n');
    }
  }
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
    let hasSecurityIssues = false;
    
    // Check for dangerous npm scripts
    const dangerousScripts = ['postinstall', 'preinstall'];
    const foundDangerousScripts = dangerousScripts.filter(script => 
      packageJson.scripts && packageJson.scripts[script]
    );
    
    if (foundDangerousScripts.length > 0) {
      console.log(`  ⚠️  Potentially dangerous npm scripts detected: ${foundDangerousScripts.join(', ')}`);
      hasSecurityIssues = true;
    } else {
      console.log('  ✅ No dangerous npm scripts found');
    }
    
    // Check for suspicious script patterns
    if (packageJson.scripts) {
      const suspiciousPatterns = [
        /curl\s+.*\|\s*sh/,
        /wget\s+.*\|\s*sh/,
        /rm\s+-rf\s+\/[^/]/, // rm -rf with absolute paths
        /eval\s*\(/,
        /exec\s*\(/
      ];
      
      const suspiciousScripts = Object.entries(packageJson.scripts)
        .filter(([, script]) => 
          suspiciousPatterns.some(pattern => pattern.test(script))
        )
        .map(([name]) => name);
      
      if (suspiciousScripts.length > 0) {
        console.log(`  ⚠️  Scripts with suspicious patterns: ${suspiciousScripts.join(', ')}`);
        hasSecurityIssues = true;
      } else {
        console.log('  ✅ No suspicious script patterns found');
      }
    }
    
    // Check for missing security-related fields
    const securityFields = ['bugs', 'repository', 'license'];
    const missingFields = securityFields.filter(field => !packageJson[field]);
    
    if (missingFields.length > 0) {
      console.log(`  ℹ️  Missing recommended security fields: ${missingFields.join(', ')}`);
    } else {
      console.log('  ✅ All recommended security fields present');
    }
    
    if (hasSecurityIssues) {
      console.log('⚠️  Security misconfiguration issues found\n');
      hasErrors = true;
    } else {
      console.log('✅ Security misconfiguration check - PASSED\n');
    }
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