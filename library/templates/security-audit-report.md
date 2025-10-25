---
category: general
description: >-
  Comprehensive security audit report template for documenting vulnerability
  assessments, risk analysis, and remediation tracking
examples: []
includes: []
name: security-audit-report
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# report_title

## Audit Information

- Date: audit_date

- Auditor: auditor_name

- Scope: audit_scope

- Duration: audit_duration

- Audit Type: audit_type

## Executive Summary

### Overall Security Posture

- Risk Level: risk_level

- Key Findings: total_findings total findings

- Immediate Actions Required: immediate_actions

### Quick Stats

- Files Scanned: files_scanned

- Repositories Checked: repos_checked

- Secrets Found: secrets_found

- Vulnerabilities Identified: vulnerabilities_found

- Compliance Issues: compliance_issues

##

1. Secrets and Credentials Audit

### 1.1 Local Repository Scan

Scope: local_scan_scope

#### Findings:#each local_findings

- status_icon finding/each

#### Detected Secrets:#if detected_secrets Location  Type  Severity  Status  Notes -----------------------------------------#each detected_secrets location  type  severity  status  notes /eachelse

No secrets detected in local repositories./if

### 1.2 GitHub Repository Scan

Repositories Checked: github_repos_list

#### Public Repository Findings:#each github_findings

- status_icon finding/each

#### Repository Secrets Configuration:#if repo_secrets Secret Name  Last Updated  Purpose  Risk Assessment ----------------------------------------------------#each repo_secrets name  updated  purpose  risk /each/if

### 1.3 NPM Package AuditPackage: npm_package

Version: npm_version

#### Findings:#each npm_findings

- status_icon finding/each

##

2. Git

Hub Actions Security

### 2.1 Workflow IntegrityTotal Workflows: total_workflows

Last Review Date: workflow_review_date

#### Verification Checklist:#each workflow_checks

- status_icon check/each

#### Workflow Inventory:#if workflows Workflow Name  Created Date  Risk Level  Notes -----------------------------------------------#each workflows name  created  risk  notes /each/if

##

3. Repository Owner

ship and Access

### 3.1 Organization Verification

- Organization Name: org_name

- Organization ID: org_id

- Created Date: org_created

- Owner Verified: owner_verified

### 3.2 Repository Access Control#if repositories Repository  Visibility  Last Activity  Anomalies --------------------------------------------------#each repositories name  visibility  last_activity  anomalies /each/if

### 3.3 Suspicious Activity Detection#each activity_checks

- status_icon check/each

##

4. Supply Chain Security

### 4.1 Dependency Analysis

- Total Dependencies: total_dependencies

- Outdated Dependencies: outdated_dependencies

- Vulnerable Dependencies: vulnerable_dependencies#if critical_vulnerabilities

#### Critical Vulnerabilities: Package  Version  Vulnerability  Severity  Fix Available ----------------------------------------------------------#each critical_vulnerabilities package  version  vulnerability  severity  fix_available /each/if

### 4.2 Security Indicators

Detection Results: detection_results

##

5. Risk Assessment

### Risk Matrix Risk Cate

gory  Current Level  Target Level  Gap ------------------------------------------------#each risk_matrix cate

gory  current/5  target/5  gap /each

### Overall Risk ScoreCurrent: current_score/25 risk_classification

Target: target_score/25Risk Trend: risk_trend

##

6. Recommendations

### Immediate Actions Critical#each immediate_actions_list@index. title

- description

- Timeline: Immediate/each

### Short-term Improvements Within 30 days#each short_term_improvements@index. title

- description

- Timeline: timeline/each

### Long-term Enhancements Quarterly#each long_term_enhancements@index. title

- description

- Expected Outcome: outcome/each

##

7. Positive Security Findings

### Strengths Identified#each strengths@index. title

- description/each

##

8. Compliance Certification

### Attestation

- attestation_findings All findings have been documented

- attestation_risk Risk assessments are accurate

- attestation_recommendations Recommendations are actionable

- attestation_review Report has been reviewedAuditor: auditor_signatureDate: certification_date

Next Audit Due: next_audit_date

## Appendices

### A. Tools Used#each tools_used

- tool/each

### B. Patterns Searchedregexsearch_patterns

### C. References#each references

- reference/each---

## Summarysummary_text

Overall Assessment: overall_assessment
