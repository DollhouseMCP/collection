---
name: repository-security-auditor
description: >-
  Comprehensive security audit skill for scanning repositories, detecting
  secrets, verifying GitHub Actions integrity, and assessing overall security
  posture
author: Security Analyst
version: 1.0.0
created: '2025-09-16T19:01:55.906Z'
modified: '2025-09-16T19:01:55.906Z'
tags:
  - security
  - audit
  - secrets
  - github
  - npm
  - vulnerability
dependencies: []
custom: {}
languages: []
complexity: advanced
domains: []
prerequisites:
  - GitHub CLI
  - npm CLI
  - grep/ripgrep
  - git
parameters: []
examples: []
proficiency_level: 0
---
#

# Repository Security AuditorA comprehensive security auditing skill that performs deep analysis of code repositories, Git

Hub Actions, NPM packages, and organizational security posture to identify vulnerabilities and ensure compliance.

### Core Capabilities

####

1. Secrets Detection

- Pattern Matching: Scans for API keys, tokens, passwords, and credentials using regex patterns

- Context Analysis: Differentiates between actual secrets and false positives

- Scope Coverage: Checks source code, comments, configuration files, and commit history

- Git

Ignore Verification: Ensures sensitive files are properly excluded from version control

####

2. Git

Hub Actions Security

- Workflow Integrity: Verifies all workflows are created by authorized users

- Permission Auditing: Checks for excessive permissions and write access

- Third-party Actions: Reviews external action usage and version pinning

- Secret Usage: Audits proper handling of secrets in workflows

####

3. Repository Analysis

- Owner

ship Verification: Confirms repository owner

ship and organization integrity

- Access Control: Reviews contributor permissions and anomalous activity

- Commit History: Analyzes patterns for suspicious modifications

- Branch Protection: Verifies security controls are properly configured

####

4. Supply Chain Security

- Dependency Scanning: Identifies vulnerable or outdated dependencies

- NPM Package Auditing: Verifies package integrity and maintainer consistency

- Worm Detection: Checks for indicators of known Git

Hub/NPM worms

- Publication History: Reviews package release patterns for anomalies

### Audit Process

#### Phase 1: Local Repository Scan

bash

# Search for hardcoded secretsgrep -r api[_-]keysecrettokenpassword --exclude-dir=node_modules

# Check for exposed environment filesfind . -name .env -o -name .key -o -name .pem

# Verify gitignore configurationgit check-ignore sensitive-file.env

#### Phase 2: Git

Hub Repository Analysis

bash

# Check repository detailsgh repo view ORG/REPO --json owner,created

At,visibility

# List workflow configurationsgh workflow list --repo ORG/REPO --all

# Review recent commitsgh api repos/ORG/REPO/commits --jq .[0:10]

# Check repository secrets names onlygh api repos/ORG/REPO/actions/secrets

#### Phase 3: NPM Package Review

bash

# Inspect publi

shed package contentsnpm pack @scope/package --dry-run --json

# Check package metadatanpm view @scope/package --json

# Review maintainer informationnpm owner ls @scope/package

### Security Patterns Detected

#### Critical Patterns

- AWS Keys: AKIA[0-9A-Z]16

- Git

Hub Tokens: gh[psruoa]_[A-Za-z0-9_]36,

- NPM Tokens: npm_[A-Za-z0-9]36

- Generic API Keys: api[_-]key.[][A-Za-z0-9]32,

#### Risk Indicators

- Unexpected workflow modifications

- Unknown S

SH keys added

- Suspicious commit messages

- Unauthorized package publications

- Unusual API access patterns

### Reporting Format

#### Executive Summary

- Overall risk level assessment

- Key findings count by severity

- Immediate action requirements

#### Detailed Findings

1. Secrets and Credentials

- Location, type, severity, and status

- Remediation recommendations

2. Infrastructure Security

- Git

Hub Actions configuration

- Repository access controls

- Branch protection status

3. Supply Chain Risks

- Dependency vulnerabilities

- Package integrity issues

- Worm detection results

### Best Practices Enforced

#### Code Security

- Input validation implementation

- Output encoding verification

- Secure error handling

- Authentication checks

- Use of security utilities TokenManager, Security

Monitor

#### Infrastructure Security

- Branch protection enabled

- Required reviews configured

- Status checks enforced

- Security scanning active

- Dependabot configured

### Risk Assessment Framework

#### Risk Cate

gories 1-5 scale

1. Secrets Management: Handling of sensitive credentials

2. Access Control: Repository and action permissions

3. Supply Chain: Third-party dependency risks

4. Code Security: Application-level vulnerabilities

5. Infrastructure: CI/CD and repository configuration

#### Risk CalculationOverall Risk = Sum

Cate

gory Scores / 25Risk Level:- 0-5: Low- 6-10: Medium- 11-15: High- 16-25: Critical

### Remediation Guidance

#### Immediate Actions Critical

- Remove hardcoded secrets immediately

- Rotate compromised credentials

- Fix critical vulnerabilities

#### Short-term 30 days

- Update vulnerable dependencies

- Configure security scanning

- Implement secret rotation

#### Long-term Quarterly

- Security training for developers

- Regular audit schedule

- Incident response planning

### Integration Points

- CI/CD Pipeline: Automated scanning on pull requests

- Scheduled Audits: Regular security assessments

- Alert Systems: Real-time notification of critical findings

- Compliance Tracking: Documentation for regulatory requirements

### Success Metrics

- Zero hardcoded secrets in repositories

- All workflows properly configured

- No critical vulnerabilities in dependencies- 100% gitignore coverage for sensitive files

- Regular security audit completion

This skill provides comprehensive security coverage for modern development workflows, protecting against both accidental exposure and malicious attacks.
