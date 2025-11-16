---
category: professional
description: >-
  Structured template for executing programmatic security analysis through
  Claudes analysis tool with automated response classification and DollhouseMCP
  integration
examples: []
includes: []
name: programmatic-analysis-template
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0
unique_id: unknown_programmatic-analysis-template_anonymous_20251025-191021
type: template
author: DollhouseMCP
format: markdown
security_exceptions:
  - pattern: "xss"
    reason: "Contains HTML examples and event handlers for documentation/template purposes - sanitized in actual usage"
---
# Programmatic Security Analysis Template

## Analysis Request

Target URL/Repository: target_url  Analysis Type: analysis_type  Security Level: security_level  User Context: user_context---

## Analysis Execution Protocol

### Phase 1: Data Collection and PreparationExecute the following programmatic analysis using the analysis tool:javascript// Initialize analysis contextconst analysisContext =     target: target_url,    analysisType: analysis_type,    timestamp: new Date.toISOString,    securityLevel: security_level,    userContext: user_contextconsole.log🔍 Starting security analysis for:, analysisContext.target// Main analysis executionasync function executeSecurityAnalysis     try         #if eq analysis_type web        // Web Security Analysis        const webResults = await validateWebSecurityanalysisContext.target        console.log📊 Web Analysis Results:
  console.log

JSON.stringifywebResults, null, 2        return webResults        /if                #if eq analysis_type repository        // Repository Security Analysis          const repoData = await fetchRepositoryDataanalysisContext.target        const repoResults = await validateRepositorySecurityrepoData        console.log📊 Repository Analysis Results:
  console.log

JSON.stringifyrepoResults, null, 2        return repoResults        /if                #if eq analysis_type ai_tool        // AI Tool Specific Analysis        const aiResults = await validateAIToolSecurityanalysisContext.target        console.log📊 AI Tool Analysis Results:
  console.log

JSON.stringifyaiResults, null, 2        return aiResults        /if             catch error         console.error❌ Analysis failed:, error.message        return             error: error.message,            riskLevel: ANALYSIS_FAILED,            recommendation: Manual review required            // Execute the analysisconst results = await executeSecurityAnalysis// Classify the responseconst responseClassification = classifySecurityResponseresultsconsole.log🎯 Response Classification:console.log

JSON.stringifyresponseClassification, null, 2// Return structured results for DollhouseMCP integrationconst finalResults =     analysisContext,    securityResults: results,    responseClassification,    executionTime: new Date.toISOStringconsole.log✅ Analysis Complete

- Final Results:console.log

JSON.stringifyfinalResults, null, 2return final

Results---

## Response Classification Logic

Based on the programmatic analysis results, the system will automatically classify the response:
  ### 🛑 CRITICAL Block Immediately

- Trigger Conditions:
  - Risk Score ≥ 15

- Critical threats detected crypto mining, code injection, prompt hijacking

- Active malware signatures

- Credential harvesting attempts

- Automated Response:
  SECURITY ALERT: Critical threat detected  Action: BLOCK  Content blocked to prevent potential compromise  Alternative recommendations provided  Incident logged for analysis  #

## ⚠️ WARNING Proceed with Caution

- Trigger Conditions:
  - Risk Score 8-14

- High-risk threats detected

- Prompt injection patterns

- Privacy policy violations

- Suspicious code behaviors

- Automated Response:
  SECURITY WARNING: Significant risks identified  Action: WARN  Detailed risk explanation provided  Mitigation strategies suggested  User confirmation required to proceed  #

## ℹ️ ADVISORY Best Practices Notice

- Trigger Conditions:
  - Risk Score 3-7

- Medium-risk concerns

- Missing security headers

- Outdated dependencies

- Minor privacy concerns

- Automated Response:
  SECURITY ADVISORY: Minor concerns noted  Action: ADVISE  Best practice recommendations provided  Continued monitoring enabled  Educational content included  #

## ✅ SAFE Proceed Normally

- Trigger Conditions:
  - Risk Score 0-2

- No significant threats detected

- Standard security practices observed

- Clean analysis results

- Automated Response:
  SECURITY CHECK PASSED: Content appears safe  Action: PROCEED  Standard security awareness maintained  Background monitoring continues  ---

## Integration with DollhouseMCP Workflow

### Skill Coordination

The programmatic analysis results automatically trigger appropriate skill responses:yamlskill_integration:
  high_risk_detected:
  activate_skills:
  - jailbreak-detection-agent

- security-incident-report

- alternative-recommendation-generator      medium_risk_detected:
  activate_skills:
  - educational-security-advisor

- mitigation-strategy-generator

- user-preference-learner      low_risk_detected:
  activate_skills:
  - background-monitor

- pattern-database-updater

- user-experience-optimizer

### Agent Activation

Based on analysis results, specific agents are activated:yamlagent_activation:
  critical_threats:
  primary: security-workflow-orchestrator    secondary: jailbreak-detection-agent    goal: Coordinate immediate threat response and user protection      moderate_threats:
  primary: educational-security-agent    secondary: recommendation-engine    goal: Provide detailed guidance and safer alternatives      monitoring_mode:
  primary: background-security-monitor    goal: Continue surveillance and pattern learning---

## Customization Variables

### Security Level Configuration

- security_level options:
  - paranoid: Maximum sensitivity, flag all potential risks

- high: Strict validation with low false positive tolerance

- balanced: Standard security with reasonable accuracy

- permissive: Minimal interference, obvious threats only

### Analysis Type Specification

- analysis_type options:
  - web: Website and web application analysis

- repository: Code repository and project analysis

- ai_tool: AI service and tool specific validation

- comprehensive: Full multi-type analysis

### User Context Integration

- user_context options:
  - professional: Business/enterprise security requirements

- personal: Individual user safety focus

- research: Academic/research context with educational value

- development: Software development workflow integration---

## Expected Output FormatThe template will generate structured JSON output that integrates seamlessly with DollhouseMCP:json  analysisId: uuid-string,  timestamp: ISO-datetime,  target: analyzed-url-or-repo,  riskScore: 0-20,  riskLevel: SAFELOWMEDIUMHIGHCRITICAL,   confidence: 85,  threats: [          type: THREAT_TYPE,      severity: LOWMEDIUMHIGHCRITICAL,      description: Human readable description,      technical_details: Technical analysis details,      recommendation: Specific mitigation advice      ],  responseClassification:
  action: PROCEEDADVISEWARNBLOCK,    level: SAFECAUTIONWARNINGCRITICAL,    message: User facing message,    recommendations: [List of recommendations]  ,  executionMetrics:
  analysisTime: 1500,    patternsScanned: 247,    confidence

Factors: [factor1, factor2]  This structured output enables precise automated decision making while providing full transparency and educational value to users.---Template designed for integration with DollhouseMCP programmatic security validation system  Version: 1.0  Compatible with: Claude Desktop analysis tool
