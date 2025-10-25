---
name: "Comprehensive Security Auditor"
description: "Advanced security audit orchestration skill that conducts thorough security assessments across code, dependencies, infrastructure, and MCP-specific vulnerabilities with intelligent reporting and remediation guidance"
type: "skill"
version: "1.0.0"
author: "DollhouseMCP"
created: "2025-09-16"
category: "security"
tags: ["security", "audit", "vulnerability-assessment", "owasp", "cwe", "mcp-security", "static-analysis", "compliance"]
proficiency_levels:
  beginner: "Basic security scanning and vulnerability identification"
  intermediate: "Comprehensive multi-domain security assessment with risk analysis"
  advanced: "Expert-level threat modeling, compliance assessment, and security architecture review"
parameters:
  project_path:
    type: "string"
    description: "Path to the project root directory to audit"
    required: true
    default: "."
  audit_scope:
    type: "array"
    description: "Security domains to include in the audit"
    default: ["code", "dependencies", "configuration", "mcp-specific", "infrastructure", "cryptography"]
    enum: ["code", "dependencies", "configuration", "mcp-specific", "infrastructure", "cryptography", "compliance"]
  severity_threshold:
    type: "string"
    description: "Minimum severity level to include in detailed analysis"
    default: "info"
    enum: ["critical", "high", "medium", "low", "info"]
  output_format:
    type: "array"
    description: "Report output formats to generate"
    default: ["console", "markdown"]
    enum: ["console", "markdown", "json", "sarif"]
  include_suppressions:
    type: "boolean"
    description: "Include analysis of suppression rules and their validity"
    default: true
  generate_remediation_plan:
    type: "boolean"
    description: "Generate detailed remediation plan with timelines"
    default: true
  compliance_frameworks:
    type: "array"
    description: "Compliance frameworks to assess against"
    default: ["owasp-top-10", "cwe-top-25", "nist-csf"]
    enum: ["owasp-top-10", "cwe-top-25", "nist-csf", "soc2", "iso27001"]
---

# Comprehensive Security Auditor Skill

This advanced skill orchestrates complete security audits that go far beyond basic vulnerability scanning, providing enterprise-grade security assessments with intelligent analysis, risk prioritization, and actionable remediation guidance.

## Core Capabilities

### 1. Multi-Domain Security Assessment
- **Code Security Analysis:** OWASP Top 10, CWE Top 25, and custom security patterns
- **MCP-Specific Security:** DMCP-SEC rules for persona, skill, template, and agent security
- **Dependency Security:** Supply chain analysis with CVE correlation
- **Infrastructure Security:** Configuration, deployment, and CI/CD security
- **Cryptographic Review:** Algorithm selection, key management, and implementation
- **Compliance Assessment:** Standards alignment and gap analysis

### 2. Intelligent Risk Analysis
- **Risk Scoring Matrix:** Impact vs. Likelihood assessment with CVSS integration
- **Threat Modeling:** Attack vector identification and exploitation analysis
- **False Positive Detection:** Advanced suppression validation and accuracy improvement
- **Contextual Risk Assessment:** Business impact and environmental factors

### 3. Advanced Reporting and Remediation
- **Executive Dashboards:** C-level security posture summaries
- **Technical Deep Dives:** Developer-focused vulnerability details with fixes
- **Compliance Reports:** Framework-specific compliance assessments
- **Remediation Planning:** Prioritized action plans with timelines and owners

## Execution Framework

### Phase 1: Pre-Audit Setup and Validation

```bash
# Validate audit environment and prerequisites
echo "🔒 Initializing Comprehensive Security Audit..."

# Check for required tools and configurations
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found - required for dependency analysis"
    exit 1
fi

# Verify project structure
if [ ! -f "package.json" ]; then
    echo "⚠️ No package.json found - limited dependency analysis available"
fi

# Check for existing security configuration
if [ -f "src/security/audit/SecurityAuditor.ts" ]; then
    echo "✅ SecurityAuditor found - enabling advanced scanning"
    SECURITY_AUDITOR_AVAILABLE=true
else
    echo "⚠️ SecurityAuditor not found - using basic analysis"
    SECURITY_AUDITOR_AVAILABLE=false
fi

# Initialize audit context
AUDIT_ID=$(date +%Y%m%d_%H%M%S)_$(openssl rand -hex 4)
AUDIT_START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PROJECT_NAME=$(basename "$(pwd)")
```

### Phase 2: Automated Security Scanning

```typescript
// Orchestrate comprehensive automated scanning
async function executeAutomatedSecurityScan(auditConfig: AuditConfiguration): Promise<SecurityScanResults> {
    const scanResults: SecurityScanResults = {
        timestamp: new Date(),
        auditId: auditConfig.auditId,
        projectName: auditConfig.projectName,
        findings: [],
        metrics: {},
        suppression_analysis: {}
    };

    console.log("🔍 Phase 2: Executing Automated Security Scans...");

    // 2.1 Core SecurityAuditor Scan
    if (auditConfig.securityAuditorAvailable) {
        console.log("  📊 Running DollhouseMCP SecurityAuditor...");
        try {
            const securityAuditor = new SecurityAuditor(getAuditConfig());
            const coreResults = await securityAuditor.audit(auditConfig.projectPath);

            scanResults.findings.push(...coreResults.findings);
            scanResults.metrics.securityAuditor = {
                duration: coreResults.duration,
                scannedFiles: coreResults.scannedFiles,
                findingsCount: coreResults.findings.length,
                suppressedCount: getSuppressedCount(coreResults)
            };

            console.log(`     ✅ Found ${coreResults.findings.length} findings in ${coreResults.duration}ms`);
        } catch (error) {
            console.error("     ❌ SecurityAuditor scan failed:", error.message);
            scanResults.errors = scanResults.errors || [];
            scanResults.errors.push(`SecurityAuditor: ${error.message}`);
        }
    }

    // 2.2 Dependency Vulnerability Scan
    console.log("  📦 Analyzing Dependencies...");
    try {
        const npmAuditResult = await runNpmAudit();
        const dependencyFindings = parseNpmAuditResults(npmAuditResult);

        scanResults.findings.push(...dependencyFindings);
        scanResults.metrics.dependencies = {
            totalPackages: npmAuditResult.metadata?.totalDependencies || 0,
            vulnerabilities: npmAuditResult.metadata?.vulnerabilities || {},
            auditTime: npmAuditResult.auditReportVersion || 'unknown'
        };

        console.log(`     ✅ Analyzed ${scanResults.metrics.dependencies.totalPackages} packages`);
    } catch (error) {
        console.error("     ❌ Dependency scan failed:", error.message);
    }

    // 2.3 MCP-Specific Security Analysis
    console.log("  🎭 Analyzing MCP-Specific Security...");
    try {
        const mcpFindings = await analyzeMcpSecurity(auditConfig.projectPath);
        scanResults.findings.push(...mcpFindings);
        scanResults.metrics.mcpSecurity = {
            personaFiles: mcpFindings.filter(f => f.category === 'PERSONA').length,
            skillFiles: mcpFindings.filter(f => f.category === 'SKILL').length,
            templateFiles: mcpFindings.filter(f => f.category === 'TEMPLATE').length,
            agentFiles: mcpFindings.filter(f => f.category === 'AGENT').length
        };

        console.log(`     ✅ Analyzed MCP elements: ${Object.values(scanResults.metrics.mcpSecurity).reduce((a, b) => a + b, 0)} files`);
    } catch (error) {
        console.error("     ❌ MCP security analysis failed:", error.message);
    }

    // 2.4 Infrastructure Configuration Analysis
    if (auditConfig.auditScope.includes('infrastructure')) {
        console.log("  🏗️ Analyzing Infrastructure Configuration...");
        try {
            const infraFindings = await analyzeInfrastructureSecurity(auditConfig.projectPath);
            scanResults.findings.push(...infraFindings);
            scanResults.metrics.infrastructure = {
                workflowFiles: infraFindings.filter(f => f.file?.includes('.github/workflows')).length,
                configFiles: infraFindings.filter(f => f.category === 'CONFIG').length,
                dockerFiles: infraFindings.filter(f => f.file?.includes('Dockerfile')).length
            };

            console.log(`     ✅ Analyzed infrastructure configuration`);
        } catch (error) {
            console.error("     ❌ Infrastructure analysis failed:", error.message);
        }
    }

    return scanResults;
}
```

### Phase 3: Advanced Risk Analysis and Threat Modeling

```typescript
// Perform advanced risk analysis and threat modeling
async function performAdvancedRiskAnalysis(scanResults: SecurityScanResults): Promise<RiskAnalysisResults> {
    console.log("🎯 Phase 3: Advanced Risk Analysis and Threat Modeling...");

    const riskAnalysis: RiskAnalysisResults = {
        overallRiskScore: 0,
        riskMatrix: {},
        threatModeling: {},
        businessImpact: {},
        remediationPriority: []
    };

    // 3.1 Calculate Risk Scores Using CVSS and Custom Metrics
    console.log("  📊 Calculating Risk Scores...");
    for (const finding of scanResults.findings) {
        const riskScore = calculateRiskScore(finding);
        finding.riskScore = riskScore;
        finding.businessImpact = assessBusinessImpact(finding);
        finding.exploitability = assessExploitability(finding);
    }

    // 3.2 Threat Vector Analysis
    console.log("  🎯 Analyzing Threat Vectors...");
    riskAnalysis.threatModeling = {
        injectionVectors: analyzeInjectionThreats(scanResults.findings),
        authenticationThreats: analyzeAuthThreats(scanResults.findings),
        dataExposureRisks: analyzeDataExposureRisks(scanResults.findings),
        mcpSpecificThreats: analyzeMcpThreats(scanResults.findings),
        supplyChainRisks: analyzeSupplyChainRisks(scanResults.findings)
    };

    // 3.3 Risk Prioritization Matrix
    console.log("  🔄 Building Risk Prioritization Matrix...");
    riskAnalysis.riskMatrix = buildRiskMatrix(scanResults.findings);
    riskAnalysis.overallRiskScore = calculateOverallRiskScore(riskAnalysis.riskMatrix);

    // 3.4 Remediation Priority Calculation
    console.log("  📋 Calculating Remediation Priorities...");
    riskAnalysis.remediationPriority = prioritizeRemediation(scanResults.findings);

    return riskAnalysis;
}
```

### Phase 4: Suppression Analysis and Validation

```typescript
// Analyze and validate suppression rules for accuracy and appropriateness
async function analyzeSuppressionRules(scanResults: SecurityScanResults): Promise<SuppressionAnalysis> {
    console.log("🔍 Phase 4: Suppression Analysis and Validation...");

    const suppressionAnalysis: SuppressionAnalysis = {
        totalSuppressions: 0,
        validSuppressions: 0,
        questionableSuppressions: [],
        overlyBroadSuppressions: [],
        recommendations: []
    };

    // 4.1 Load and Parse Suppression Configuration
    console.log("  📋 Loading Suppression Configuration...");
    const suppressionConfig = await loadSuppressionConfig();
    suppressionAnalysis.totalSuppressions = suppressionConfig.suppressions.length;

    // 4.2 Validate Each Suppression Rule
    console.log("  ✅ Validating Suppression Rules...");
    for (const suppression of suppressionConfig.suppressions) {
        const validation = validateSuppression(suppression, scanResults.findings);

        if (validation.isValid) {
            suppressionAnalysis.validSuppressions++;
        } else if (validation.isQuestionable) {
            suppressionAnalysis.questionableSuppressions.push({
                rule: suppression.rule,
                file: suppression.file,
                reason: suppression.reason,
                issue: validation.issue
            });
        }

        if (validation.isOverlyBroad) {
            suppressionAnalysis.overlyBroadSuppressions.push({
                rule: suppression.rule,
                file: suppression.file,
                affectedFiles: validation.affectedFiles
            });
        }
    }

    // 4.3 Generate Suppression Recommendations
    console.log("  💡 Generating Suppression Recommendations...");
    suppressionAnalysis.recommendations = generateSuppressionRecommendations(suppressionAnalysis);

    console.log(`     ✅ Validated ${suppressionAnalysis.totalSuppressions} suppressions`);
    console.log(`     ⚠️ Found ${suppressionAnalysis.questionableSuppressions.length} questionable suppressions`);

    return suppressionAnalysis;
}
```

### Phase 5: Compliance Assessment

```typescript
// Assess compliance against various security frameworks
async function assessCompliance(scanResults: SecurityScanResults, frameworks: string[]): Promise<ComplianceResults> {
    console.log("📋 Phase 5: Compliance Assessment...");

    const complianceResults: ComplianceResults = {
        frameworks: {},
        overallComplianceScore: 0,
        gaps: [],
        recommendations: []
    };

    for (const framework of frameworks) {
        console.log(`  📊 Assessing ${framework.toUpperCase()} Compliance...`);

        switch (framework) {
            case 'owasp-top-10':
                complianceResults.frameworks[framework] = assessOwaspCompliance(scanResults.findings);
                break;
            case 'cwe-top-25':
                complianceResults.frameworks[framework] = assessCweCompliance(scanResults.findings);
                break;
            case 'nist-csf':
                complianceResults.frameworks[framework] = assessNistCompliance(scanResults.findings);
                break;
            case 'soc2':
                complianceResults.frameworks[framework] = assessSoc2Compliance(scanResults.findings);
                break;
            case 'iso27001':
                complianceResults.frameworks[framework] = assessIso27001Compliance(scanResults.findings);
                break;
        }

        const frameworkResult = complianceResults.frameworks[framework];
        console.log(`     ✅ ${framework.toUpperCase()}: ${frameworkResult.score}% compliant`);
    }

    // Calculate overall compliance score
    complianceResults.overallComplianceScore = calculateOverallCompliance(complianceResults.frameworks);

    return complianceResults;
}
```

### Phase 6: Report Generation and Remediation Planning

```bash
# Generate comprehensive reports and remediation plans
echo "📊 Phase 6: Report Generation and Remediation Planning..."

# 6.1 Generate Executive Summary Report
echo "  📋 Generating Executive Summary..."
generate_executive_summary() {
    cat << EOF > "security-audit-executive-summary-${AUDIT_ID}.md"
# Security Audit Executive Summary

**Project:** ${PROJECT_NAME}
**Audit Date:** ${AUDIT_START_TIME}
**Audit ID:** ${AUDIT_ID}

## Risk Assessment
- **Overall Risk Level:** ${OVERALL_RISK_LEVEL}
- **Critical Issues:** ${CRITICAL_COUNT}
- **High Risk Issues:** ${HIGH_COUNT}
- **Compliance Score:** ${COMPLIANCE_SCORE}%

## Key Findings
${KEY_FINDINGS}

## Immediate Actions Required
${IMMEDIATE_ACTIONS}

## Strategic Recommendations
${STRATEGIC_RECOMMENDATIONS}
EOF
}

# 6.2 Generate Technical Detailed Report
echo "  🔧 Generating Technical Report..."
if [ "$SECURITY_AUDITOR_AVAILABLE" = true ]; then
    # Use SecurityAuditor's built-in reporting
    npm run security:audit -- --markdown --verbose --audit-id="${AUDIT_ID}"
fi

# Generate comprehensive report using template
render_comprehensive_report() {
    # Use the comprehensive security audit template
    node -e "
    const fs = require('fs');
    const template = fs.readFileSync('docs/security/comprehensive-security-audit-template.md', 'utf8');
    const data = JSON.parse(fs.readFileSync('security-audit-data-${AUDIT_ID}.json', 'utf8'));

    // Simple template variable replacement
    let report = template;
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp('{{' + key + '}}', 'g');
        report = report.replace(regex, value || 'N/A');
    }

    fs.writeFileSync('comprehensive-security-audit-${AUDIT_ID}.md', report);
    "
}

# 6.3 Generate Remediation Plan
echo "  🛠️ Generating Remediation Plan..."
generate_remediation_plan() {
    cat << EOF > "security-remediation-plan-${AUDIT_ID}.md"
# Security Remediation Plan

**Generated:** $(date)
**Audit ID:** ${AUDIT_ID}

## Critical Priority (Fix Immediately)
${CRITICAL_REMEDIATIONS}

## High Priority (Fix Within 7 Days)
${HIGH_REMEDIATIONS}

## Medium Priority (Fix Within 30 Days)
${MEDIUM_REMEDIATIONS}

## Implementation Timeline
${REMEDIATION_TIMELINE}

## Resource Requirements
${RESOURCE_REQUIREMENTS}

## Success Metrics
${SUCCESS_METRICS}
EOF
}

# 6.4 Generate SARIF Report for Tool Integration
if [[ " ${OUTPUT_FORMATS[@]} " =~ " sarif " ]]; then
    echo "  🔗 Generating SARIF Report for Tool Integration..."
    generate_sarif_report "${AUDIT_ID}"
fi
```

## Usage Instructions

### Basic Usage
```bash
# Run comprehensive security audit on current project
dollhouse activate skill comprehensive-security-auditor
```

### Advanced Configuration
```bash
# Custom audit with specific scope and output
dollhouse activate skill comprehensive-security-auditor \
  --project-path="/path/to/project" \
  --audit-scope="code,dependencies,mcp-specific" \
  --severity-threshold="medium" \
  --output-format="markdown,json,sarif" \
  --compliance-frameworks="owasp-top-10,soc2"
```

### Integration with CI/CD
```yaml
# GitHub Actions Integration
- name: Comprehensive Security Audit
  run: |
    dollhouse activate skill comprehensive-security-auditor \
      --output-format="sarif,json" \
      --severity-threshold="high" \
      --generate-remediation-plan=true

    # Upload SARIF results to GitHub Security tab
    - uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: security-audit-*.sarif
```

## Key Features

### 1. Multi-Layered Security Analysis
- **Automated Scanning:** Leverages existing SecurityAuditor infrastructure
- **Manual Review Guidance:** Identifies areas requiring expert analysis
- **Risk Contextualization:** Business impact and threat likelihood assessment
- **Compliance Mapping:** Framework-specific gap analysis

### 2. Intelligent Suppression Management
- **Suppression Validation:** Ensures suppressions are appropriate and not overly broad
- **False Positive Reduction:** Continuous improvement of detection accuracy
- **Suppression Lifecycle:** Recommendations for suppression maintenance

### 3. Advanced Reporting Capabilities
- **Multi-Format Output:** Console, Markdown, JSON, SARIF for different audiences
- **Executive Dashboards:** High-level security posture for leadership
- **Technical Deep Dives:** Detailed findings for developers
- **Compliance Reports:** Framework-specific assessments

### 4. Remediation Planning and Tracking
- **Priority Matrix:** Risk-based prioritization of fixes
- **Resource Planning:** Effort estimation and dependency mapping
- **Timeline Management:** Realistic remediation schedules
- **Success Metrics:** Measurable security improvement goals

## Integration Points

### Works Seamlessly With
- **DollhouseMCP SecurityAuditor:** Core scanning engine
- **npm audit:** Dependency vulnerability detection
- **GitHub Security Features:** SARIF upload and integration
- **Development Workflows:** CI/CD pipeline integration
- **Compliance Frameworks:** OWASP, CWE, NIST, SOC 2, ISO 27001

### Enhances Other Skills
- **Code Review Skill:** Security-focused code analysis
- **Debug Detective Persona:** Security vulnerability debugging
- **Technical Documentation:** Security finding documentation
- **Project Management:** Security remediation tracking

## Output Examples

### Console Output
```
🔒 Comprehensive Security Audit Results
=====================================

📊 Summary:
   Critical: 0    High: 2    Medium: 5    Low: 12
   Risk Score: 6.2/10 (MEDIUM)
   Compliance: 87% (OWASP), 92% (CWE)

🎯 Top Priorities:
   1. Update lodash dependency (CVE-2021-23337)
   2. Review OAuth token validation logic
   3. Implement rate limiting on API endpoints

📋 Reports Generated:
   ✅ Executive Summary: security-audit-executive-summary-20250916_143022_a1b2c3d4.md
   ✅ Technical Report: comprehensive-security-audit-20250916_143022_a1b2c3d4.md
   ✅ Remediation Plan: security-remediation-plan-20250916_143022_a1b2c3d4.md
   ✅ SARIF Report: security-audit-20250916_143022_a1b2c3d4.sarif
```

### Remediation Plan Snippet
```markdown
## Critical Priority (Fix Immediately)

### 1. Dependency Vulnerability: lodash
- **Issue:** Prototype pollution vulnerability (CVE-2021-23337)
- **Impact:** Potential remote code execution
- **Fix:** Update lodash to version 4.17.21 or later
- **Effort:** 2 hours
- **Owner:** Development Team
- **Deadline:** Within 24 hours

## High Priority (Fix Within 7 Days)

### 1. OAuth Token Validation
- **Issue:** Insufficient token validation in GitHub OAuth flow
- **Impact:** Potential token replay attacks
- **Fix:** Implement token expiry validation and nonce checking
- **Effort:** 8 hours
- **Owner:** Security Team
- **Deadline:** September 23, 2025
```

This comprehensive security auditor skill transforms basic security scanning into enterprise-grade security assessment, providing the depth and rigor needed for production security audits while maintaining the usability and automation expected from modern security tools.