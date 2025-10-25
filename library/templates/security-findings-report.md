---
name: "Security Findings Report"
description: "Standardized template for documenting individual security vulnerabilities and findings with comprehensive remediation guidance"
type: "template"
version: "1.0.0"
author: "DollhouseMCP"
created: "2025-09-16"
category: "security"
tags: ["security", "vulnerability", "finding", "remediation", "compliance", "cwe", "owasp", "cvss"]
variables:
  finding_id:
    type: "string"
    description: "Unique identifier for the security finding"
    required: true
  title:
    type: "string"
    description: "Descriptive title of the security finding"
    required: true
  severity:
    type: "string"
    description: "Severity level of the finding"
    required: true
    enum: ["critical", "high", "medium", "low", "info"]
  rule_id:
    type: "string"
    description: "Security rule that detected this finding"
    required: true
  file_path:
    type: "string"
    description: "File path where the finding was detected"
    required: false
  line_number:
    type: "integer"
    description: "Line number where the finding was detected"
    required: false
  cwe_id:
    type: "string"
    description: "Common Weakness Enumeration (CWE) identifier"
    required: false
  owasp_category:
    type: "string"
    description: "OWASP Top 10 category"
    required: false
  cvss_score:
    type: "number"
    description: "CVSS v3.1 base score (0.0-10.0)"
    required: false
  discovery_method:
    type: "string"
    description: "How the finding was discovered"
    required: false
    enum: ["automated-scan", "manual-review", "penetration-test", "code-review", "security-audit"]
  affected_component:
    type: "string"
    description: "System component affected by this finding"
    required: false
  business_impact:
    type: "string"
    description: "Potential business impact"
    required: false
    enum: ["critical", "high", "medium", "low", "none"]
  exploitability:
    type: "string"
    description: "How easily this vulnerability can be exploited"
    required: false
    enum: ["trivial", "easy", "moderate", "difficult", "very-difficult"]
  reported_by:
    type: "string"
    description: "Person or tool that reported the finding"
    required: false
  assigned_to:
    type: "string"
    description: "Person responsible for remediation"
    required: false
  status:
    type: "string"
    description: "Current status of the finding"
    required: false
    default: "open"
    enum: ["open", "in-progress", "resolved", "suppressed", "false-positive", "accepted-risk"]
outputFormats: ["markdown", "json", "sarif", "csv"]
includes: []
---

# Security Finding Report: {{title}}

**Finding ID:** {{finding_id}}
**Severity:** {{severity}} {{#if cvss_score}}(CVSS: {{cvss_score}}){{/if}}
**Status:** {{status}}
**Discovered:** {{discovery_date}}
**Reporter:** {{reported_by}}
{{#if assigned_to}}**Assigned To:** {{assigned_to}}{{/if}}

---

## Executive Summary

{{#if executive_summary}}
{{executive_summary}}
{{else}}
This security finding represents a {{severity}} severity vulnerability that requires {{#eq severity "critical"}}immediate attention{{/eq}}{{#eq severity "high"}}prompt remediation{{/eq}}{{#eq severity "medium"}}timely resolution{{/eq}}{{#eq severity "low"}}eventual fixing{{/eq}}. The issue affects {{affected_component}} and poses {{business_impact}} risk to business operations.
{{/if}}

## Finding Details

### Location
{{#if file_path}}
- **File:** `{{file_path}}`{{#if line_number}}:{{line_number}}{{/if}}
{{/if}}
{{#if affected_component}}
- **Component:** {{affected_component}}
{{/if}}
{{#if url}}
- **URL:** {{url}}
{{/if}}

### Classification
- **Rule ID:** {{rule_id}}
{{#if cwe_id}}
- **CWE:** [{{cwe_id}}](https://cwe.mitre.org/data/definitions/{{cwe_id}}.html) - {{cwe_name}}
{{/if}}
{{#if owasp_category}}
- **OWASP Top 10:** {{owasp_category}} - {{owasp_description}}
{{/if}}
{{#if discovery_method}}
- **Discovery Method:** {{discovery_method}}
{{/if}}

### Risk Assessment
{{#if cvss_score}}
- **CVSS v3.1 Base Score:** {{cvss_score}}/10.0
- **CVSS Vector:** {{cvss_vector}}
{{/if}}
- **Business Impact:** {{business_impact}}
- **Exploitability:** {{exploitability}}
- **Likelihood:** {{likelihood}}

## Vulnerability Description

{{#if description}}
{{description}}
{{else}}
### Technical Details
[Provide detailed technical description of the vulnerability, including:]
- What the vulnerability is
- How it manifests in the code/system
- Why it represents a security risk
- Under what conditions it can be exploited

### Root Cause
[Explain the underlying cause of the vulnerability:]
- Coding error or oversight
- Configuration issue
- Design flaw
- Dependency vulnerability
{{/if}}

## Proof of Concept

{{#if proof_of_concept}}
{{proof_of_concept}}
{{else}}
{{#if code_snippet}}
### Vulnerable Code
```{{programming_language}}
{{code_snippet}}
```
{{/if}}

{{#if exploit_steps}}
### Exploitation Steps
{{#each exploit_steps}}
{{step_number}}. {{step_description}}
{{/each}}
{{else}}
### How to Reproduce
1. [Step 1 - Initial setup or conditions]
2. [Step 2 - Action that triggers the vulnerability]
3. [Step 3 - Observable result demonstrating the issue]
{{/if}}

{{#if example_input}}
### Example Input
```
{{example_input}}
```
{{/if}}

{{#if expected_output}}
### Expected Output
```
{{expected_output}}
```
{{/if}}
{{/if}}

## Impact Analysis

### Security Impact
{{#if security_impact}}
{{security_impact}}
{{else}}
- **Confidentiality:** {{confidentiality_impact}}
- **Integrity:** {{integrity_impact}}
- **Availability:** {{availability_impact}}
{{/if}}

### Business Impact
{{#if business_impact_details}}
{{business_impact_details}}
{{else}}
{{#eq business_impact "critical"}}
- Potential for complete system compromise
- Significant data breach risk
- Business operations disruption
- Regulatory compliance violations
- Reputation damage
{{/eq}}
{{#eq business_impact "high"}}
- Potential for significant data exposure
- Partial system compromise possible
- Moderate business disruption
- Compliance implications
{{/eq}}
{{#eq business_impact "medium"}}
- Limited data exposure risk
- Minor operational impact
- Reduced system reliability
{{/eq}}
{{#eq business_impact "low"}}
- Minimal direct business impact
- Information disclosure concerns
- User experience degradation
{{/eq}}
{{/if}}

### Affected Systems/Users
{{#if affected_systems}}
{{affected_systems}}
{{else}}
- **User Base:** {{affected_users}}
- **Systems:** {{affected_system_list}}
- **Data Types:** {{affected_data_types}}
{{/if}}

## Remediation Guidance

### Immediate Actions Required
{{#if immediate_actions}}
{{#each immediate_actions}}
- {{action}}
{{/each}}
{{else}}
{{#eq severity "critical"}}
- **Immediate:** Disable affected functionality or take system offline
- **Communicate:** Notify security team and stakeholders immediately
- **Monitor:** Implement enhanced monitoring for exploitation attempts
- **Document:** Record all actions taken for incident response
{{/eq}}
{{#eq severity "high"}}
- **Prioritize:** Move this finding to top of development queue
- **Review:** Conduct immediate code review of affected area
- **Test:** Verify no active exploitation is occurring
{{/eq}}
{{#eq severity "medium"}}
- **Schedule:** Plan remediation within current sprint/cycle
- **Analyze:** Review for similar issues in codebase
{{/eq}}
{{#eq severity "low"}}
- **Backlog:** Add to security improvement backlog
- **Monitor:** Include in regular security reviews
{{/eq}}
{{/if}}

### Recommended Fix
{{#if recommended_fix}}
{{recommended_fix}}
{{else}}
[Provide specific, actionable remediation steps:]

1. **Code Changes Required:**
   - [Specific code modifications needed]
   - [Security controls to implement]
   - [Input validation requirements]

2. **Configuration Changes:**
   - [Security settings to modify]
   - [Access controls to implement]

3. **Dependencies:**
   - [Packages to update]
   - [Security patches to apply]
{{/if}}

### Fixed Code Example
{{#if fixed_code}}
```{{programming_language}}
{{fixed_code}}
```
{{else}}
```{{programming_language}}
// Example of secure implementation:
// [Provide corrected code that addresses the vulnerability]
```
{{/if}}

### Testing and Validation
{{#if testing_steps}}
{{testing_steps}}
{{else}}
1. **Unit Tests:** Create tests that verify the fix works correctly
2. **Security Tests:** Implement tests that confirm the vulnerability is resolved
3. **Regression Tests:** Ensure the fix doesn't break existing functionality
4. **Integration Tests:** Verify the fix works in the full system context
{{/if}}

## Prevention Measures

### Code Review Guidelines
{{#if code_review_guidelines}}
{{code_review_guidelines}}
{{else}}
- Review all input validation and sanitization
- Check for proper error handling
- Verify authentication and authorization controls
- Ensure sensitive data is properly protected
{{/if}}

### Security Controls
{{#if security_controls}}
{{security_controls}}
{{else}}
- **Input Validation:** Implement comprehensive input sanitization
- **Output Encoding:** Ensure proper encoding for all outputs
- **Access Controls:** Verify proper authentication and authorization
- **Logging:** Implement security event logging and monitoring
{{/if}}

### Development Practices
{{#if development_practices}}
{{development_practices}}
{{else}}
- Use secure coding standards and guidelines
- Implement security testing in CI/CD pipeline
- Regular dependency updates and vulnerability scanning
- Security training for development team
{{/if}}

## Compliance Considerations

{{#if compliance_frameworks}}
### Regulatory Requirements
{{#each compliance_frameworks}}
- **{{framework}}:** {{requirements}}
{{/each}}
{{else}}
### Applicable Standards
- **OWASP:** {{owasp_compliance_notes}}
- **CWE:** {{cwe_compliance_notes}}
- **Regulatory:** {{regulatory_compliance_notes}}
{{/if}}

## References and Additional Information

### Technical References
{{#if technical_references}}
{{#each technical_references}}
- [{{title}}]({{url}})
{{/each}}
{{else}}
{{#if cwe_id}}
- [CWE-{{cwe_id}}: {{cwe_name}}](https://cwe.mitre.org/data/definitions/{{cwe_id}}.html)
{{/if}}
{{#if owasp_category}}
- [OWASP Top 10: {{owasp_category}}](https://owasp.org/Top10/)
{{/if}}
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
{{/if}}

### Related Findings
{{#if related_findings}}
{{#each related_findings}}
- [{{finding_id}}]({{finding_url}}) - {{title}}
{{/each}}
{{else}}
*No related findings identified*
{{/if}}

## Tracking Information

### Timeline
- **Discovered:** {{discovery_date}}
- **Reported:** {{report_date}}
- **Acknowledged:** {{acknowledgment_date}}
- **Target Fix Date:** {{target_fix_date}}
- **Actual Fix Date:** {{actual_fix_date}}
- **Verified Fixed:** {{verification_date}}

### Status History
{{#if status_history}}
| Date | Status | Notes | Updated By |
|------|--------|-------|------------|
{{#each status_history}}
| {{date}} | {{status}} | {{notes}} | {{updated_by}} |
{{/each}}
{{else}}
| Date | Status | Notes | Updated By |
|------|--------|-------|------------|
| {{discovery_date}} | Open | Initial discovery | {{reported_by}} |
{{/if}}

### Communication Log
{{#if communication_log}}
{{#each communication_log}}
- **{{date}}** ({{participant}}): {{message}}
{{/each}}
{{else}}
*No communication history recorded*
{{/if}}

---

## JSON Export

For tool integration and automated processing, this finding can be exported as JSON:

```json
{
  "finding_id": "{{finding_id}}",
  "title": "{{title}}",
  "severity": "{{severity}}",
  "rule_id": "{{rule_id}}",
  "file_path": "{{file_path}}",
  "line_number": {{line_number}},
  "cwe_id": "{{cwe_id}}",
  "owasp_category": "{{owasp_category}}",
  "cvss_score": {{cvss_score}},
  "discovery_method": "{{discovery_method}}",
  "business_impact": "{{business_impact}}",
  "exploitability": "{{exploitability}}",
  "status": "{{status}}",
  "discovery_date": "{{discovery_date}}",
  "reported_by": "{{reported_by}}",
  "assigned_to": "{{assigned_to}}",
  "description": "{{description}}",
  "remediation": "{{recommended_fix}}",
  "references": {{technical_references}}
}
```

## SARIF Export

For integration with security tools and code analysis platforms:

```json
{
  "version": "2.1.0",
  "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0.json",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "DollhouseMCP Security Auditor",
          "version": "1.0.0"
        }
      },
      "results": [
        {
          "ruleId": "{{rule_id}}",
          "level": "{{sarif_level}}",
          "message": {
            "text": "{{title}}: {{description}}"
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "{{file_path}}"
                },
                "region": {
                  "startLine": {{line_number}}
                }
              }
            }
          ],
          "properties": {
            "security-severity": "{{cvss_score}}",
            "tags": ["security", "{{severity}}"],
            "cwe": "{{cwe_id}}",
            "owasp": "{{owasp_category}}"
          }
        }
      ]
    }
  ]
}
```

---

**Report Generated:** {{report_generation_date}}
**Generated By:** {{report_generator}}
**Template Version:** {{template_version}}

*This security finding report follows industry standards for vulnerability disclosure and remediation tracking. For questions about this finding, contact the security team or assigned remediation owner.*