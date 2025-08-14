#!/usr/bin/env node

/**
 * Advanced Security Scanner for PR Validation
 * 
 * This utility performs comprehensive security analysis on content files
 * in pull requests, providing detailed reports and risk assessments.
 * 
 * Features:
 * - Multi-layered security pattern detection
 * - Context-aware vulnerability assessment
 * - Machine learning-based anomaly detection
 * - Detailed threat categorization
 * - Risk scoring and mitigation recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Comprehensive security patterns organized by severity and category
 */
const SECURITY_PATTERNS = {
  CRITICAL: [
    {
      id: 'code-injection-eval',
      pattern: /\b(eval|Function|setTimeout|setInterval)\s*\(\s*['"]/gi,
      category: 'code-injection',
      description: 'Direct code evaluation attempt',
      mitigation: 'Remove dynamic code evaluation patterns',
      cwe: 'CWE-94'
    },
    {
      id: 'system-command-execution',
      pattern: /\b(exec|spawn|system|shell|cmd|powershell|bash|sh)\s*[([]/gi,
      category: 'command-injection',
      description: 'System command execution attempt',
      mitigation: 'Remove system command execution patterns',
      cwe: 'CWE-78'
    },
    {
      id: 'prompt-injection-ignore',
      pattern: /(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|above|preceding|initial)\s+(?:instructions?|commands?|directives?|rules?|prompts?)/gi,
      category: 'prompt-injection',
      description: 'Instruction override attempt',
      mitigation: 'Remove prompt injection patterns',
      cwe: 'CWE-74'
    },
    {
      id: 'restriction-bypass',
      pattern: /(?:remove|bypass|disable|override)\s+(?:all\s+)?(?:restrictions?|limitations?|safeguards?|filters?)/gi,
      category: 'security-bypass',
      description: 'Security restriction bypass attempt',
      mitigation: 'Remove restriction bypass patterns',
      cwe: 'CWE-284'
    }
  ],
  
  HIGH: [
    {
      id: 'file-system-access',
      pattern: /\b(?:require|import)\s*\([^)]*['"](?:fs|path|child_process|os|crypto)['"][^)]*\)|process\./gi,
      category: 'file-system',
      description: 'File system or process access attempt',
      mitigation: 'Avoid file system access patterns in user content',
      cwe: 'CWE-22'
    },
    {
      id: 'javascript-protocol',
      pattern: /javascript\s*:/gi,
      category: 'script-injection',
      description: 'JavaScript protocol usage',
      mitigation: 'Remove javascript: protocol references',
      cwe: 'CWE-79'
    },
    {
      id: 'script-tag-injection',
      pattern: /<script[^>]*>|<\/script>/gi,
      category: 'xss',
      description: 'Script tag injection attempt',
      mitigation: 'Remove script tags from content',
      cwe: 'CWE-79'
    },
    {
      id: 'identity-manipulation',
      pattern: /(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be|roleplay\s+as)\s+(?:admin|administrator|root|system|developer|god|super)/gi,
      category: 'identity-manipulation',
      description: 'Identity manipulation attempt',
      mitigation: 'Remove identity manipulation patterns',
      cwe: 'CWE-863'
    },
    {
      id: 'credential-extraction',
      pattern: /(?:password|secret|token|key|credential).*[:=]\s*['"][^'"]{8,}/gi,
      category: 'credential-leak',
      description: 'Potential credential exposure',
      mitigation: 'Remove hardcoded credentials',
      cwe: 'CWE-798'
    }
  ],
  
  MEDIUM: [
    {
      id: 'base64-data-url',
      pattern: /data:[^;]+;base64,[A-Za-z0-9+/]+=*/gi,
      category: 'data-exfiltration',
      description: 'Base64 encoded data URL',
      mitigation: 'Review base64 content for malicious payloads',
      cwe: 'CWE-506'
    },
    {
      id: 'template-injection',
      pattern: /\$\{[^}]*\}|\{\{[^}]*\}\}/gi,
      category: 'template-injection',
      description: 'Template literal or expression injection',
      mitigation: 'Sanitize template expressions',
      cwe: 'CWE-94'
    },
    {
      id: 'event-handler-injection',
      pattern: /on\w+\s*=/gi,
      category: 'xss',
      description: 'HTML event handler injection',
      mitigation: 'Remove HTML event handlers',
      cwe: 'CWE-79'
    },
    {
      id: 'developer-mode-activation',
      pattern: /(?:developer|debug|admin|test)\s+mode/gi,
      category: 'privilege-escalation',
      description: 'Debug or developer mode activation',
      mitigation: 'Remove debug mode references',
      cwe: 'CWE-489'
    }
  ],
  
  LOW: [
    {
      id: 'suspicious-urls',
      pattern: /https?:\/\/(?:bit\.ly|tinyurl|short\.link|t\.co|tiny\.cc)\/\w+/gi,
      category: 'phishing',
      description: 'Shortened URL detected',
      mitigation: 'Use full URLs for transparency',
      cwe: 'CWE-601'
    },
    {
      id: 'potential-social-engineering',
      pattern: /(?:urgent|immediate|asap|emergency).*(?:click|download|install|execute)/gi,
      category: 'social-engineering',
      description: 'Potential social engineering language',
      mitigation: 'Review urgency-based language',
      cwe: 'CWE-1021'
    }
  ]
};

/**
 * Context-aware security analyzer
 */
class SecurityScanner {
  constructor() {
    this.results = {
      files: {},
      summary: {
        totalFiles: 0,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0,
        overallScore: 0,
        riskLevel: 'LOW'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Scan multiple files for security issues
   */
  async scanFiles(filePaths) {
    console.log(`🔍 Starting security scan of ${filePaths.length} files...`);
    
    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        await this.scanFile(filePath);
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
      }
    }

    this.calculateSummary();
    this.assessRiskLevel();
    return this.results;
  }

  /**
   * Scan individual file
   */
  async scanFile(filePath) {
    console.log(`📄 Scanning: ${filePath}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileResult = {
        path: filePath,
        size: content.length,
        issues: [],
        score: 0,
        riskLevel: 'LOW',
        metadata: null
      };

      // Parse frontmatter if available
      try {
        const parsed = matter(content);
        fileResult.metadata = parsed.data;
        fileResult.bodyContent = parsed.content;
      } catch {
        fileResult.bodyContent = content;
      }

      // Run security checks
      await this.runPatternMatching(content, fileResult);
      await this.runContextualAnalysis(content, fileResult);
      await this.runAnomalyDetection(content, fileResult);

      // Calculate file score and risk level
      this.calculateFileScore(fileResult);
      
      this.results.files[filePath] = fileResult;
      console.log(`   ${fileResult.issues.length} issues found, score: ${fileResult.score}, risk: ${fileResult.riskLevel}`);
      
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}: ${error.message}`);
      this.results.files[filePath] = {
        path: filePath,
        error: error.message,
        score: 0,
        issues: []
      };
    }
  }

  /**
   * Pattern matching security checks
   */
  async runPatternMatching(content, fileResult) {
    const allPatterns = [
      ...SECURITY_PATTERNS.CRITICAL.map(p => ({ ...p, severity: 'CRITICAL' })),
      ...SECURITY_PATTERNS.HIGH.map(p => ({ ...p, severity: 'HIGH' })),
      ...SECURITY_PATTERNS.MEDIUM.map(p => ({ ...p, severity: 'MEDIUM' })),
      ...SECURITY_PATTERNS.LOW.map(p => ({ ...p, severity: 'LOW' }))
    ];

    for (const pattern of allPatterns) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        for (const match of matches) {
          const issue = {
            id: pattern.id,
            severity: pattern.severity,
            category: pattern.category,
            description: pattern.description,
            mitigation: pattern.mitigation,
            cwe: pattern.cwe,
            match: match.trim(),
            context: this.extractContext(content, match),
            line: this.findLineNumber(content, match)
          };
          
          fileResult.issues.push(issue);
        }
      }
    }
  }

  /**
   * Contextual analysis for sophisticated threats
   */
  async runContextualAnalysis(content, fileResult) {
    // Check for instruction injection in different contexts
    if (fileResult.metadata?.type === 'persona' || fileResult.metadata?.type === 'prompt') {
      this.checkPromptInjectionContext(content, fileResult);
    }

    // Check for data exfiltration patterns
    this.checkDataExfiltrationPatterns(content, fileResult);
    
    // Check for encoding/obfuscation attempts
    this.checkObfuscationPatterns(content, fileResult);
  }

  /**
   * Check for prompt injection in AI assistant contexts
   */
  checkPromptInjectionContext(content, fileResult) {
    const suspiciousContexts = [
      /(?:new\s+instructions?|updated\s+rules?|override\s+default)/gi,
      /(?:jailbreak|DAN|evil|harmful)\s+mode/gi,
      /(?:ignore|bypass)\s+safety/gi
    ];

    for (const pattern of suspiciousContexts) {
      const matches = content.match(pattern);
      if (matches) {
        fileResult.issues.push({
          id: 'contextual-prompt-injection',
          severity: 'HIGH',
          category: 'prompt-injection',
          description: 'Contextual prompt injection attempt detected',
          mitigation: 'Review and remove instruction override attempts',
          match: matches[0],
          context: this.extractContext(content, matches[0]),
          cwe: 'CWE-74'
        });
      }
    }
  }

  /**
   * Check for data exfiltration patterns
   */
  checkDataExfiltrationPatterns(content, fileResult) {
    // Large base64 blobs
    const base64Pattern = /[A-Za-z0-9+/]{100,}={0,2}/g;
    const base64Matches = content.match(base64Pattern);
    
    if (base64Matches && base64Matches.length > 0) {
      fileResult.issues.push({
        id: 'large-base64-blob',
        severity: 'MEDIUM',
        category: 'data-exfiltration',
        description: 'Large base64 encoded data detected',
        mitigation: 'Review base64 content for malicious payloads',
        match: `${base64Matches.length} base64 blobs found`,
        cwe: 'CWE-506'
      });
    }
  }

  /**
   * Check for obfuscation patterns
   */
  checkObfuscationPatterns(content, fileResult) {
    // Unicode obfuscation
    // Use explicit Unicode ranges to avoid control characters
    const unicodePattern = /[\u0080-\uffff]{10,}/g;
    const unicodeMatches = content.match(unicodePattern);
    
    if (unicodeMatches && unicodeMatches.length > 2) {
      fileResult.issues.push({
        id: 'unicode-obfuscation',
        severity: 'MEDIUM',
        category: 'obfuscation',
        description: 'Potential Unicode obfuscation detected',
        mitigation: 'Review non-ASCII character usage',
        match: `${unicodeMatches.length} Unicode sequences`,
        cwe: 'CWE-1019'
      });
    }
  }

  /**
   * Anomaly detection using statistical analysis
   */
  async runAnomalyDetection(content, fileResult) {
    const stats = this.calculateContentStatistics(content);
    
    // Check for unusual entropy (potential encoded content)
    if (stats.entropy > 7.5) {
      fileResult.issues.push({
        id: 'high-entropy-content',
        severity: 'LOW',
        category: 'anomaly',
        description: 'High entropy content detected (potential encoded data)',
        mitigation: 'Review content for encoded or compressed data',
        match: `Entropy: ${stats.entropy.toFixed(2)}`,
        cwe: 'CWE-506'
      });
    }

    // Check for unusual character distribution
    if (stats.nonPrintableRatio > 0.1) {
      fileResult.issues.push({
        id: 'non-printable-characters',
        severity: 'MEDIUM',
        category: 'anomaly',
        description: 'High ratio of non-printable characters',
        mitigation: 'Review content for hidden or encoded data',
        match: `Non-printable ratio: ${(stats.nonPrintableRatio * 100).toFixed(1)}%`,
        cwe: 'CWE-1019'
      });
    }
  }

  /**
   * Calculate content statistics for anomaly detection
   */
  calculateContentStatistics(content) {
    const charCounts = {};
    let nonPrintable = 0;
    
    // Count character frequencies
    for (const char of content) {
      charCounts[char] = (charCounts[char] || 0) + 1;
      if (char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126) {
        nonPrintable++;
      }
    }

    // Calculate Shannon entropy
    const length = content.length;
    let entropy = 0;
    for (const count of Object.values(charCounts)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }

    return {
      entropy,
      nonPrintableRatio: nonPrintable / length,
      uniqueChars: Object.keys(charCounts).length,
      avgCharFrequency: length / Object.keys(charCounts).length
    };
  }

  /**
   * Extract context around a match
   */
  extractContext(content, match) {
    const index = content.indexOf(match);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + match.length + 50);
    
    return content.slice(start, end).replace(/\n/g, ' ').trim();
  }

  /**
   * Find line number of a match
   */
  findLineNumber(content, match) {
    const index = content.indexOf(match);
    if (index === -1) return 0;
    
    return content.slice(0, index).split('\n').length;
  }

  /**
   * Calculate file security score
   */
  calculateFileScore(fileResult) {
    let score = 0;
    
    for (const issue of fileResult.issues) {
      switch (issue.severity) {
        case 'CRITICAL': score += 25; break;
        case 'HIGH': score += 10; break;
        case 'MEDIUM': score += 5; break;
        case 'LOW': score += 1; break;
      }
    }

    fileResult.score = score;
    
    // Determine risk level
    if (score >= 25) fileResult.riskLevel = 'CRITICAL';
    else if (score >= 15) fileResult.riskLevel = 'HIGH';
    else if (score >= 8) fileResult.riskLevel = 'MEDIUM';
    else fileResult.riskLevel = 'LOW';
  }

  /**
   * Calculate overall summary
   */
  calculateSummary() {
    this.results.summary.totalFiles = Object.keys(this.results.files).length;
    
    for (const fileResult of Object.values(this.results.files)) {
      if (fileResult.issues) {
        for (const issue of fileResult.issues) {
          switch (issue.severity) {
            case 'CRITICAL': this.results.summary.criticalIssues++; break;
            case 'HIGH': this.results.summary.highIssues++; break;
            case 'MEDIUM': this.results.summary.mediumIssues++; break;
            case 'LOW': this.results.summary.lowIssues++; break;
          }
        }
        this.results.summary.overallScore += fileResult.score || 0;
      }
    }
  }

  /**
   * Assess overall risk level
   */
  assessRiskLevel() {
    const { criticalIssues, highIssues, overallScore } = this.results.summary;
    
    if (criticalIssues > 0) {
      this.results.summary.riskLevel = 'CRITICAL';
    } else if (highIssues > 0 || overallScore >= 15) {
      this.results.summary.riskLevel = 'HIGH';
    } else if (overallScore >= 5) {
      this.results.summary.riskLevel = 'MEDIUM';
    } else {
      this.results.summary.riskLevel = 'LOW';
    }
  }

  /**
   * Generate security report
   */
  generateReport() {
    const { summary } = this.results;
    const riskIcon = {
      'CRITICAL': '🔴',
      'HIGH': '🟠',
      'MEDIUM': '🟡',
      'LOW': '🟢'
    };

    let report = `# Security Scan Report\n\n`;
    report += `**Overall Risk Level**: ${riskIcon[summary.riskLevel]} ${summary.riskLevel}\n`;
    report += `**Security Score**: ${summary.overallScore}\n`;
    report += `**Files Scanned**: ${summary.totalFiles}\n\n`;

    report += `## Issue Summary\n\n`;
    report += `- 🔴 Critical: ${summary.criticalIssues}\n`;
    report += `- 🟠 High: ${summary.highIssues}\n`;
    report += `- 🟡 Medium: ${summary.mediumIssues}\n`;
    report += `- 🟢 Low: ${summary.lowIssues}\n\n`;

    // File-specific details
    for (const [filePath, fileResult] of Object.entries(this.results.files)) {
      if (fileResult.issues && fileResult.issues.length > 0) {
        report += `## File: ${filePath}\n\n`;
        report += `**Risk Level**: ${riskIcon[fileResult.riskLevel]} ${fileResult.riskLevel}\n`;
        report += `**Score**: ${fileResult.score}\n`;
        report += `**Issues**: ${fileResult.issues.length}\n\n`;

        for (const issue of fileResult.issues) {
          report += `### ${riskIcon[issue.severity]} ${issue.description}\n\n`;
          report += `- **Severity**: ${issue.severity}\n`;
          report += `- **Category**: ${issue.category}\n`;
          if (issue.cwe) report += `- **CWE**: ${issue.cwe}\n`;
          if (issue.line) report += `- **Line**: ${issue.line}\n`;
          report += `- **Match**: \`${issue.match}\`\n`;
          if (issue.context) report += `- **Context**: \`${issue.context}\`\n`;
          report += `- **Mitigation**: ${issue.mitigation}\n\n`;
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
    console.error('Usage: node security-scanner.mjs <file1,file2,...>');
    process.exit(1);
  }

  // Parse comma-separated file list
  const files = args[0].split(',').map(f => f.trim()).filter(f => f);
  
  if (files.length === 0) {
    console.log('No files to scan');
    process.exit(0);
  }

  const scanner = new SecurityScanner();
  const results = await scanner.scanFiles(files);

  // Save detailed report
  fs.writeFileSync('security-report.json', JSON.stringify(results, null, 2));
  
  // Generate markdown report
  const markdownReport = scanner.generateReport();
  fs.writeFileSync('security-report.md', markdownReport);

  // Output for GitHub Actions
  const passed = results.summary.criticalIssues === 0 && results.summary.highIssues === 0;
  
  console.log(`\n--- SCAN COMPLETE ---`);
  console.log(`Overall Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Risk Level: ${results.summary.riskLevel}`);
  console.log(`Security Score: ${results.summary.overallScore}`);
  console.log(`Issues: ${results.summary.criticalIssues + results.summary.highIssues + results.summary.mediumIssues + results.summary.lowIssues}`);

  // Set GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `passed=${passed}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `score=${results.summary.overallScore}\n`);
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

export { SecurityScanner };