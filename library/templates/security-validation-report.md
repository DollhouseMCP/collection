---
category: general
description: >-
  Comprehensive security validation report template for documenting analysis
  results, risk assessments, and recommendations for tools, websites, and
  repositories
examples: []
includes: []
name: security-validation-report
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# Security Validation Report

Analysis Date: analysis_date  Content Analyzed: content_url  Report ID: report_id  Risk Classification: risk_level---

## Executive Summary

Overall Risk Score: overall_risk_score/10  Recommendation: recommendation  Analysis Confidence: confidence_level%#if critical_findings

### 🚨 Critical Security Findings#each critical_findings

- threat_type: description

- Impact: impact

- Mitigation: mitigation/each/if#if alternative_recommendations

### ✅ Recommended Alternatives#each alternative_recommendations

- name: description

- Why safer: safety_explanation

- Link: url/each/if---

## Detailed Analysis Results

### Content Safety Validation

Analysis Method: content_analysis_method  Patterns Scanned: patterns_scanned  Detection Confidence: detection_confidence%#if prompt_injection_detected

#### ⚠️ Prompt Injection AnalysisRisk Level: prompt_injection_risk  Patterns Found:#each prompt_injection_patterns

- pattern_name: pattern_description Confidence: confidence%/eachDecoded Content Analysis:#if decoded_contentdecoded_contentRisk Assessment: decoded_content_riskelse

Content was not decoded due to high risk indicators/if/if

### Web Content Analysis#if web_analysis_performedDOM Security Scan: dom_security_status  Script Analysis: script_analysis_status  Network Behavior: network_behavior_status  Privacy Assessment: privacy_assessment_status#if suspicious_scripts

#### 🔍 Suspicious Scripts Detected#each suspicious_scripts

- Type: script_type

- Risk: script_risk

- Description: script_description

- Recommendation: script_recommendation/each/if#if privacy_concerns

#### 🔒 Privacy Concerns#each privacy_concerns

- Issue: privacy_issue

- Impact: privacy_impact

- Data Affected: data_affected

- Compliance: compliance_status/each/ifelse

Web content analysis not performed

- static content or repository analysis/if

### Encoding Pattern Detection

Encoding Scan Status: encoding_scan_status  Methods Checked: encoding_methods_checked  #if encoding_detected

#### 📊 Encoding Patterns Found#each encoding_patterns

- Method: encoding_method

- Confidence: encoding_confidence%

- Content Sample: content_sample

- Risk Assessment: encoding_risk/each/if

### Repository Analysis#if repository_analysis

Repository Type: repo_type  Primary Language: primary_language  Dependencies Scanned: dependencies_count  Security Score: repo_security_score/10#if code_vulnerabilities

#### 🛡️ Code Security Issues#each code_vulnerabilities

- File: file_path

- Issue Type: vulnerability_type

- Severity: severity

- Description: vulnerability_description

- Line: line_number

- Recommendation: fix_recommendation/each/if#if dependency_issues

#### 📦 Dependency Vulnerabilities#each dependency_issues

- Package: package_name vpackage_version

- CVE: cve_id

- Severity: cve_severity

- Description: cve_description

- Fixed In: fixed_version/each/if/if---

## Risk Assessment Matrix Risk Cate

gory  Score 1-10  Confidence  Impact -------------------------------------------------

- Prompt Injection  prompt_injection_score  prompt_injection_confidence%  prompt_injection_impact  Malicious Code  malicious_code_score  malicious_code_confidence%  malicious_code_impact  Privacy Violations  privacy_score  privacy_confidence%  privacy_impact  Data Security  data_security_score  data_security_confidence%  data_security_impact  Deceptive Practices  deceptive_practices_score  deceptive_practices_confidence%  deceptive_practices_impact Weighted Risk Score: weighted_risk_score/10---

## Contextual Assessment

### User Context Analysis

Intended Use Case: intended_use_case  Professional/Personal: usage_context  Security Requirements: security_requirements  Risk Tolerance: risk_tolerance

### Source Reputation

Domain Age: domain_age  SSL Certificate: ssl_status  Previous Incidents: previous_incidents  Community Reviews: community_reviews  T

rust Score: t

rust_score/10---

## Recommendations

### Immediate Actions Required#each immediate_actions

- action_description

- Priority: priority

- Timeline: timeline/each

### Security Best Practices#each security_recommendations

- practice_name: practice_description

- Implementation: implementation_guide

- Benefits: benefits/each

### Monitoring Recommendations#each monitoring_recommendations

- monitoring_type: monitoring_description

- Frequency: monitoring_frequency

- Alerts: alert_conditions/each---

## Technical Details

### Analysis Configuration

- Security Level: security_level

- Analysis Depth: analysis_depth

- Timeout Settings: timeout_settings

- False Positive Tolerance: fp_tolerance

### Detection Methods Used#each detection_methods

- method_name: method_description vmethod_version/each

### Performance Metrics

- Total Analysis Time: analysis_timems

- Patterns Evaluated: patterns_evaluated

- External Checks: external_checks

- Confidence Calculation: confidence_calculation---

## Appendices#if raw_detection_logs

### Appendix A: Raw Detection Logsraw_detection_logs/if#if pattern_match_details

### Appendix B: Pattern Match Details#each pattern_match_details

#### pattern_cate

gorypattern_details/each/if#if external_reputation_data

### Appendix C: External Reputation Dataexternal_reputation_data/if---Report generated by DollhouseMCP Security Validation System  Analysis Engine Version: engine_version  Pattern Database Version: pattern_db_version  Report Template Version: template_version

Distribution: distribution_list  Classification Level: classification_level  Retention Policy: retention_policy
