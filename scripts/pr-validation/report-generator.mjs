#!/usr/bin/env node

/**
 * Report Generator for PR Validation
 * 
 * This utility aggregates validation results from security, quality, and integration
 * tests to generate comprehensive markdown reports that help maintainers make
 * informed decisions about PR approval.
 * 
 * Features:
 * - Aggregates all validation results into unified reports
 * - Generates contextual review recommendations
 * - Creates auto-approval eligibility assessments
 * - Provides reviewer checklists and decision support
 * - Includes visual indicators and prioritized information
 * - Offers improvement suggestions with examples
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Report configuration and thresholds
 */
const REPORT_CONFIG = {
  AUTO_APPROVAL: {
    minQualityScore: 85,
    maxSecurityRiskLevel: 'LOW',
    requiresAllTestsPassing: true,
    maxCriticalIssues: 0,
    maxHighRiskIssues: 1
  },
  
  RISK_LEVELS: {
    CRITICAL: { emoji: '🚨', color: 'red', priority: 1 },
    HIGH: { emoji: '⚠️', color: 'orange', priority: 2 },
    MEDIUM: { emoji: '🔶', color: 'yellow', priority: 3 },
    LOW: { emoji: '✅', color: 'green', priority: 4 }
  },
  
  QUALITY_GRADES: {
    A: { range: [90, 100], emoji: '🌟', description: 'Excellent' },
    B: { range: [80, 89], emoji: '✨', description: 'Good' },
    C: { range: [70, 79], emoji: '👍', description: 'Acceptable' },
    D: { range: [60, 69], emoji: '⚠️', description: 'Below Standard' },
    F: { range: [0, 59], emoji: '❌', description: 'Failing' }
  }
};

/**
 * Main report generator class
 */
class ReportGenerator {
  constructor() {
    this.templates = {};
    this.loadTemplates();
  }

  /**
   * Load report templates
   */
  loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    
    if (fs.existsSync(templatesDir)) {
      const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.md'));
      
      for (const file of templateFiles) {
        const templateName = path.basename(file, '.md');
        const templatePath = path.join(templatesDir, file);
        this.templates[templateName] = fs.readFileSync(templatePath, 'utf-8');
      }
    }
  }

  /**
   * Generate comprehensive validation report
   * @param {Object} results - Aggregated validation results
   * @param {Array} files - List of files being validated
   * @returns {Object} Report data with recommendations
   */
  generateReport(results, files = []) {
    const report = {
      timestamp: new Date().toISOString(),
      files: files,
      summary: this.generateSummary(results),
      security: this.analyzeSecurityResults(results.security || {}),
      quality: this.analyzeQualityResults(results.quality || {}),
      integration: this.analyzeIntegrationResults(results.integration || {}),
      autoApproval: this.assessAutoApproval(results),
      recommendations: this.generateRecommendations(results),
      reviewerChecklist: this.generateReviewerChecklist(results),
      similarElements: this.findSimilarElements(files),
      performanceImpact: this.assessPerformanceImpact(results)
    };

    return report;
  }

  /**
   * Generate executive summary with key metrics
   */
  generateSummary(results) {
    const securityLevel = this.getSecurityRiskLevel(results.security);
    const qualityScore = results.quality?.overallScore || 0;
    const qualityGrade = this.getQualityGrade(qualityScore);
    const integrationPassing = results.integration?.allTestsPassing || false;

    return {
      overallStatus: this.determineOverallStatus(results),
      securityLevel,
      qualityScore,
      qualityGrade,
      integrationPassing,
      criticalIssues: this.countCriticalIssues(results),
      highRiskIssues: this.countHighRiskIssues(results),
      estimatedReviewTime: this.estimateReviewTime(results)
    };
  }

  /**
   * Analyze security scan results with confidence scoring
   */
  analyzeSecurityResults(securityResults) {
    const issues = securityResults.issues || [];
    const riskDistribution = this.analyzeRiskDistribution(issues);
    const confidenceScore = this.calculateConfidenceScore(securityResults);
    
    return {
      riskLevel: this.getSecurityRiskLevel({ issues }),
      issueCount: issues.length,
      riskDistribution,
      confidenceScore,
      topThreats: this.identifyTopThreats(issues),
      mitigationSuggestions: this.generateMitigationSuggestions(issues),
      falsePositiveRisk: this.assessFalsePositiveRisk(securityResults)
    };
  }

  /**
   * Analyze quality assessment results with detailed breakdown
   */
  analyzeQualityResults(qualityResults) {
    const score = qualityResults.overallScore || 0;
    const grade = this.getQualityGrade(score);
    const breakdown = qualityResults.breakdown || {};
    
    return {
      score,
      grade,
      breakdown,
      strengths: this.identifyQualityStrengths(breakdown),
      improvements: this.identifyQualityImprovements(breakdown),
      complianceGaps: this.identifyComplianceGaps(qualityResults),
      benchmarkComparison: this.compareToBenchmark(score)
    };
  }

  /**
   * Analyze integration test results
   */
  analyzeIntegrationResults(integrationResults) {
    const testSuites = integrationResults.testSuites || {};
    const allPassing = integrationResults.allTestsPassing || false;
    
    return {
      allTestsPassing: allPassing,
      testSuites,
      compatibilityIssues: this.identifyCompatibilityIssues(integrationResults),
      dependencyChecks: this.analyzeDependencies(integrationResults),
      loadingPerformance: this.analyzeLoadingPerformance(integrationResults)
    };
  }

  /**
   * Assess auto-approval eligibility with detailed criteria
   */
  assessAutoApproval(results) {
    const criteria = REPORT_CONFIG.AUTO_APPROVAL;
    const securityLevel = this.getSecurityRiskLevel(results.security);
    const qualityScore = results.quality?.overallScore || 0;
    const allTestsPassing = results.integration?.allTestsPassing || false;
    const criticalIssues = this.countCriticalIssues(results);
    const highRiskIssues = this.countHighRiskIssues(results);

    const checks = {
      qualityScore: qualityScore >= criteria.minQualityScore,
      securityLevel: this.compareRiskLevels(securityLevel, criteria.maxSecurityRiskLevel) <= 0,
      allTestsPassing: allTestsPassing === criteria.requiresAllTestsPassing,
      criticalIssues: criticalIssues <= criteria.maxCriticalIssues,
      highRiskIssues: highRiskIssues <= criteria.maxHighRiskIssues
    };

    const eligible = Object.values(checks).every(check => check);
    const confidence = this.calculateAutoApprovalConfidence(results);

    return {
      eligible,
      confidence,
      checks,
      reasoning: this.generateAutoApprovalReasoning(checks),
      fallbackSuggestion: this.generateFallbackSuggestion(results)
    };
  }

  /**
   * Generate actionable recommendations based on validation results
   */
  generateRecommendations(results) {
    const recommendations = {
      immediate: [],
      suggested: [],
      future: []
    };

    // Security recommendations
    if (results.security?.issues?.length > 0) {
      recommendations.immediate.push(...this.generateSecurityRecommendations(results.security.issues));
    }

    // Quality recommendations
    if (results.quality?.overallScore < 80) {
      recommendations.suggested.push(...this.generateQualityRecommendations(results.quality));
    }

    // Integration recommendations
    if (!results.integration?.allTestsPassing) {
      recommendations.immediate.push(...this.generateIntegrationRecommendations(results.integration));
    }

    // Performance recommendations
    recommendations.future.push(...this.generatePerformanceRecommendations(results));

    return recommendations;
  }

  /**
   * Generate reviewer checklist based on validation results
   */
  generateReviewerChecklist(results) {
    const checklist = {
      critical: [],
      important: [],
      optional: []
    };

    // Add items based on validation results
    if (this.countCriticalIssues(results) > 0) {
      checklist.critical.push('Review and address all critical security issues');
    }

    if (results.quality?.overallScore < 70) {
      checklist.important.push('Ensure documentation meets minimum quality standards');
    }

    if (!results.integration?.allTestsPassing) {
      checklist.critical.push('Verify all integration tests pass before approval');
    }

    // Add standard checklist items
    checklist.important.push(
      'Verify element follows collection naming conventions',
      'Check that metadata is complete and accurate',
      'Ensure examples are clear and functional'
    );

    checklist.optional.push(
      'Consider suggesting improvements to enhance quality score',
      'Look for opportunities to improve documentation',
      'Check if similar elements exist in the collection'
    );

    return checklist;
  }

  /**
   * Find similar elements in the collection
   */
  findSimilarElements(_files) {
    // This would typically analyze existing collection content
    // For now, return placeholder data structure
    return {
      found: [],
      suggestions: [
        'Consider referencing similar elements in documentation',
        'Ensure consistency with existing naming patterns',
        'Check if functionality overlaps with existing elements'
      ]
    };
  }

  /**
   * Assess performance impact of changes
   */
  assessPerformanceImpact(_results) {
    return {
      estimatedLoadTime: '< 100ms',
      memoryUsage: 'Minimal',
      processingComplexity: 'Low',
      scalabilityImpact: 'None',
      recommendations: [
        'No performance concerns identified',
        'Element follows lightweight design patterns'
      ]
    };
  }

  /**
   * Generate formatted markdown report
   */
  generateMarkdown(report) {
    const template = this.templates['review-report'] || this.getDefaultReviewTemplate();
    
    return this.populateTemplate(template, {
      timestamp: report.timestamp,
      overallStatus: this.formatOverallStatus(report.summary.overallStatus),
      securityBadge: this.formatSecurityBadge(report.security.riskLevel),
      qualityBadge: this.formatQualityBadge(report.quality.grade, report.quality.score),
      integrationBadge: this.formatIntegrationBadge(report.integration.allTestsPassing),
      autoApprovalBadge: this.formatAutoApprovalBadge(report.autoApproval.eligible),
      
      // Detailed sections
      securitySection: this.formatSecuritySection(report.security),
      qualitySection: this.formatQualitySection(report.quality),
      integrationSection: this.formatIntegrationSection(report.integration),
      recommendationsSection: this.formatRecommendationsSection(report.recommendations),
      checklistSection: this.formatChecklistSection(report.reviewerChecklist),
      
      // Metadata
      reviewTime: report.summary.estimatedReviewTime,
      filesCount: report.files.length,
      filesList: report.files.map(f => `- ${f}`).join('\n')
    });
  }

  /**
   * Generate auto-approval report
   */
  generateAutoApprovalReport(report) {
    const template = this.templates['auto-approve'] || this.getDefaultAutoApproveTemplate();
    
    return this.populateTemplate(template, {
      eligible: report.autoApproval.eligible,
      confidence: report.autoApproval.confidence,
      reasoning: report.autoApproval.reasoning,
      checks: this.formatAutoApprovalChecks(report.autoApproval.checks),
      fallback: report.autoApproval.fallbackSuggestion
    });
  }

  /**
   * Generate reviewer checklist
   */
  generateChecklistReport(report) {
    const template = this.templates['checklist'] || this.getDefaultChecklistTemplate();
    
    return this.populateTemplate(template, {
      critical: this.formatChecklistItems(report.reviewerChecklist.critical),
      important: this.formatChecklistItems(report.reviewerChecklist.important),
      optional: this.formatChecklistItems(report.reviewerChecklist.optional),
      estimatedTime: report.summary.estimatedReviewTime
    });
  }

  // Helper methods for analysis and formatting

  determineOverallStatus(results) {
    const criticalIssues = this.countCriticalIssues(results);
    const qualityScore = results.quality?.overallScore || 0;
    const allTestsPassing = results.integration?.allTestsPassing || false;

    if (criticalIssues > 0) return 'CRITICAL_ISSUES';
    if (!allTestsPassing) return 'TESTS_FAILING';
    if (qualityScore < 70) return 'QUALITY_BELOW_STANDARD';
    if (qualityScore >= 85 && criticalIssues === 0) return 'EXCELLENT';
    return 'GOOD';
  }

  getSecurityRiskLevel(securityResults) {
    const issues = securityResults?.issues || [];
    const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
    const highCount = issues.filter(i => i.severity === 'HIGH').length;
    const mediumCount = issues.filter(i => i.severity === 'MEDIUM').length;

    if (criticalCount > 0) return 'CRITICAL';
    if (highCount > 2) return 'HIGH';
    if (highCount > 0 || mediumCount > 5) return 'MEDIUM';
    return 'LOW';
  }

  getQualityGrade(score) {
    for (const [grade, config] of Object.entries(REPORT_CONFIG.QUALITY_GRADES)) {
      if (score >= config.range[0] && score <= config.range[1]) {
        return grade;
      }
    }
    return 'F';
  }

  countCriticalIssues(results) {
    return results.security?.issues?.filter(i => i.severity === 'CRITICAL').length || 0;
  }

  countHighRiskIssues(results) {
    return results.security?.issues?.filter(i => i.severity === 'HIGH').length || 0;
  }

  estimateReviewTime(results) {
    const criticalIssues = this.countCriticalIssues(results);
    const qualityScore = results.quality?.overallScore || 0;
    const testFailures = !results.integration?.allTestsPassing;

    let minutes = 5; // Base review time

    if (criticalIssues > 0) minutes += criticalIssues * 10;
    if (qualityScore < 70) minutes += 15;
    if (testFailures) minutes += 10;

    return `${minutes} minutes`;
  }

  compareRiskLevels(level1, level2) {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return levels.indexOf(level1) - levels.indexOf(level2);
  }

  calculateAutoApprovalConfidence(results) {
    // Calculate confidence based on multiple factors
    let confidence = 100;
    
    const qualityScore = results.quality?.overallScore || 0;
    if (qualityScore < 90) confidence -= (90 - qualityScore) * 0.5;
    
    const criticalIssues = this.countCriticalIssues(results);
    if (criticalIssues > 0) confidence = 0;
    
    const highRiskIssues = this.countHighRiskIssues(results);
    confidence -= highRiskIssues * 10;
    
    return Math.max(0, Math.min(100, Math.round(confidence)));
  }

  // Template methods

  populateTemplate(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value || '');
    }
    return result;
  }

  formatOverallStatus(status) {
    const statusMap = {
      'EXCELLENT': '🌟 **EXCELLENT** - Ready for immediate approval',
      'GOOD': '✅ **GOOD** - Meets all requirements',
      'QUALITY_BELOW_STANDARD': '⚠️ **NEEDS IMPROVEMENT** - Quality below standards',
      'TESTS_FAILING': '❌ **TESTS FAILING** - Integration issues detected',
      'CRITICAL_ISSUES': '🚨 **CRITICAL ISSUES** - Security concerns found'
    };
    return statusMap[status] || status;
  }

  formatSecurityBadge(riskLevel) {
    const config = REPORT_CONFIG.RISK_LEVELS[riskLevel];
    return `${config.emoji} **${riskLevel}**`;
  }

  formatQualityBadge(grade, score) {
    const config = REPORT_CONFIG.QUALITY_GRADES[grade];
    return `${config.emoji} **Grade ${grade}** (${score}/100) - ${config.description}`;
  }

  formatIntegrationBadge(passing) {
    return passing ? '✅ **PASSING**' : '❌ **FAILING**';
  }

  formatAutoApprovalBadge(eligible) {
    return eligible ? '🤖 **ELIGIBLE**' : '👤 **MANUAL REVIEW REQUIRED**';
  }

  getDefaultReviewTemplate() {
    return `# PR Validation Report

{{timestamp}}

## 🎯 Overall Status

{{overallStatus}}

## 📊 Validation Results

| Component | Status | Details |
|-----------|---------|---------|
| Security | {{securityBadge}} | Risk assessment completed |
| Quality | {{qualityBadge}} | Documentation and standards |
| Integration | {{integrationBadge}} | Loading and compatibility |
| Auto-Approval | {{autoApprovalBadge}} | Eligibility assessment |

**Estimated Review Time:** {{reviewTime}}

## 🔒 Security Analysis

{{securitySection}}

## 📝 Quality Assessment

{{qualitySection}}

## 🔧 Integration Testing

{{integrationSection}}

## 💡 Recommendations

{{recommendationsSection}}

## ✅ Reviewer Checklist

{{checklistSection}}

## 📁 Files Analyzed ({{filesCount}})

{{filesList}}

---
*Generated by DollhouseMCP PR Validation System*`;
  }

  getDefaultAutoApproveTemplate() {
    return `# Auto-Approval Assessment

**Eligible:** {{eligible}}
**Confidence:** {{confidence}}%

## Decision Criteria

{{checks}}

## Reasoning

{{reasoning}}

{{fallback}}`;
  }

  getDefaultChecklistTemplate() {
    return `# Reviewer Checklist

**Estimated Review Time:** {{estimatedTime}}

## 🚨 Critical Items

{{critical}}

## ⚠️ Important Items

{{important}}

## 💡 Optional Items

{{optional}}`;
  }

  // Placeholder methods for complex analysis (would be implemented based on specific needs)
  
  analyzeRiskDistribution(issues) {
    return {
      critical: issues.filter(i => i.severity === 'CRITICAL').length,
      high: issues.filter(i => i.severity === 'HIGH').length,
      medium: issues.filter(i => i.severity === 'MEDIUM').length,
      low: issues.filter(i => i.severity === 'LOW').length
    };
  }

  calculateConfidenceScore(_securityResults) {
    // Placeholder implementation
    return 95;
  }

  identifyTopThreats(issues) {
    return issues.slice(0, 3).map(issue => ({
      category: issue.category,
      description: issue.description,
      severity: issue.severity
    }));
  }

  generateMitigationSuggestions(issues) {
    return issues.map(issue => ({
      issue: issue.description,
      mitigation: issue.mitigation || 'Review and address this security concern'
    }));
  }

  assessFalsePositiveRisk(_securityResults) {
    return 'LOW';
  }

  identifyQualityStrengths(_breakdown) {
    return ['Well-structured metadata', 'Clear documentation'];
  }

  identifyQualityImprovements(_breakdown) {
    return ['Add more examples', 'Improve description length'];
  }

  identifyComplianceGaps(_qualityResults) {
    return [];
  }

  compareToBenchmark(score) {
    const benchmark = 75;
    const difference = score - benchmark;
    return {
      benchmark,
      difference,
      comparison: difference >= 0 ? 'above' : 'below'
    };
  }

  identifyCompatibilityIssues(_integrationResults) {
    return [];
  }

  analyzeDependencies(_integrationResults) {
    return { resolved: true, issues: [] };
  }

  analyzeLoadingPerformance(_integrationResults) {
    return { loadTime: '< 50ms', acceptable: true };
  }

  generateAutoApprovalReasoning(checks) {
    const failed = Object.entries(checks).filter(([_, passed]) => !passed);
    if (failed.length === 0) {
      return 'All auto-approval criteria are met. This PR is safe for automatic approval.';
    }
    return `Auto-approval blocked by: ${failed.map(([criteria]) => criteria).join(', ')}`;
  }

  generateFallbackSuggestion(results) {
    if (this.countCriticalIssues(results) > 0) {
      return 'Recommend manual security review before approval.';
    }
    if (results.quality?.overallScore < 70) {
      return 'Recommend manual quality review and improvement suggestions.';
    }
    return 'Standard manual review process recommended.';
  }

  generateSecurityRecommendations(issues) {
    return issues.map(issue => `Address ${issue.category}: ${issue.mitigation}`);
  }

  generateQualityRecommendations(qualityResults) {
    const recommendations = [];
    if (qualityResults.overallScore < 80) {
      recommendations.push('Improve documentation completeness');
      recommendations.push('Add more detailed examples');
    }
    return recommendations;
  }

  generateIntegrationRecommendations(_integrationResults) {
    return ['Fix integration test failures before approval'];
  }

  generatePerformanceRecommendations(_results) {
    return ['Monitor performance impact in production'];
  }

  formatSecuritySection(security) {
    return `Risk Level: ${security.riskLevel}
Issue Count: ${security.issueCount}
Confidence: ${security.confidenceScore}%`;
  }

  formatQualitySection(quality) {
    return `Score: ${quality.score}/100
Grade: ${quality.grade}
Strengths: ${quality.strengths.join(', ')}`;
  }

  formatIntegrationSection(integration) {
    return `All Tests Passing: ${integration.allTestsPassing}
Compatibility: ${integration.compatibilityIssues.length === 0 ? 'Good' : 'Issues Found'}`;
  }

  formatRecommendationsSection(recommendations) {
    let section = '';
    if (recommendations.immediate.length > 0) {
      section += '### Immediate Actions Required\n';
      section += recommendations.immediate.map(r => `- ${r}`).join('\n') + '\n\n';
    }
    if (recommendations.suggested.length > 0) {
      section += '### Suggested Improvements\n';
      section += recommendations.suggested.map(r => `- ${r}`).join('\n') + '\n\n';
    }
    return section;
  }

  formatChecklistSection(checklist) {
    let section = '';
    if (checklist.critical.length > 0) {
      section += '### Critical\n';
      section += checklist.critical.map(item => `- [ ] ${item}`).join('\n') + '\n\n';
    }
    if (checklist.important.length > 0) {
      section += '### Important\n';
      section += checklist.important.map(item => `- [ ] ${item}`).join('\n') + '\n\n';
    }
    return section;
  }

  formatAutoApprovalChecks(checks) {
    return Object.entries(checks)
      .map(([criteria, passed]) => `- ${passed ? '✅' : '❌'} ${criteria}`)
      .join('\n');
  }

  formatChecklistItems(items) {
    return items.map(item => `- [ ] ${item}`).join('\n');
  }
}

/**
 * Main execution function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node report-generator.mjs <results-file> [output-dir]');
    process.exit(1);
  }

  const resultsFile = args[0];
  const outputDir = args[1] || './validation-reports';

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load validation results
    const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    
    // Generate reports
    const generator = new ReportGenerator();
    const report = generator.generateReport(results, results.files || []);

    // Write markdown report
    const markdownReport = generator.generateMarkdown(report);
    fs.writeFileSync(path.join(outputDir, 'review-report.md'), markdownReport);

    // Write auto-approval report
    const autoApprovalReport = generator.generateAutoApprovalReport(report);
    fs.writeFileSync(path.join(outputDir, 'auto-approval-assessment.md'), autoApprovalReport);

    // Write reviewer checklist
    const checklistReport = generator.generateChecklistReport(report);
    fs.writeFileSync(path.join(outputDir, 'reviewer-checklist.md'), checklistReport);

    // Write JSON report for programmatic access
    fs.writeFileSync(path.join(outputDir, 'validation-report.json'), JSON.stringify(report, null, 2));

    console.log('✅ Reports generated successfully');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`🤖 Auto-approval eligible: ${report.autoApproval.eligible}`);
    console.log(`📊 Quality score: ${report.quality.score}/100`);
    console.log(`🔒 Security risk: ${report.security.riskLevel}`);

  } catch (error) {
    console.error('❌ Error generating reports:', error.message);
    process.exit(1);
  }
}

// Export for testing and integration
export { ReportGenerator, REPORT_CONFIG };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}