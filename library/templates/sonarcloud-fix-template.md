---
category: professional
description: >-
  Structured template for documenting and tracking SonarCloud fixes with
  before/after examples and verification steps
examples: []
includes: []
name: sonarcloud-fix-template
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.1
unique_id: unknown_sonarcloud-fix-template_anonymous_20251025-191021
type: template
author: DollhouseMCP
format: markdown
---
# Sonar

Cloud Fix Documentation Template

## 📋 Fix InformationRule ID: rule_idRule Name: rule_nameCate

gory: cate

gory Reliability/Maintainability/SecuritySeverity: severity Low/Medium/High/CriticalIssue Count: issue_count

Estimated Effort: effort_estimate

## 📖 Rule Descriptionrule_description

### Why This Mattersexplanation_why_this_is_important

### Sonar

Cloud Reference- [Rule Documentation]https://rules.sonarsource.com/language/RSPEC-rule_number

## 🔍 Detection Pattern

### Search Command

bashgrep_or_search_pattern

### Files Affectedlist_of_affected_files

## 🔧 Fix Implementation

### ❌ Before Non-Compliantlanguageproblematic_code_example

Issues with this code:
  - issue_1

- issue_2

### ✅ After Compliantlanguagefixed_code_example

Improvements:
  - improvement_1

- improvement_2

## 🤖 Automation Approach

### Automated Fix Script

bashautomation_script_if_applicable

### Manual Steps Required

1. manual_step_

12. manual_step_

23. manual_step_3

## ⚠️ Edge Cases  Warnings

### Edge Cases to Consider

- edge_case_1

- edge_case_2

### Potential Side Effects

- side_effect_1

- side_effect_2

### Backwards Compatibility

- Minimum Node.js version: min_node_version

- Breaking changes: breaking_changes_if_any

## ✅ Verification Steps

### Pre-Fix Checklist- [ ] Current Sonar

Cloud issue count noted- [ ] Tests passing- [ ] Branch created from develop- [ ] Backup/commit point created

### Fix Process- [ ] All instances identified using search pattern- [ ] Each instance reviewed for context- [ ] Fixes applied consistently- [ ] Edge cases handled appropriately

### Post-Fix Verification- [ ] Code compiles successfully npm run build- [ ] All tests pass npm test- [ ] Linting passes npm run lint- [ ] TypeScript check passes npm run typecheck- [ ] Sonar

Cloud shows reduction of issue_count issues

### Sonar

Cloud Validation

bash

# Check specific rule violationssonar-scanner -Dsonar.rules=rule_id

# Or check via APIcurl https://sonarcloud.io/api/issues/searchcomponent

Keys=projectrules=rule_id

## 📊 Metrics  Impact

### Before Fix

- Issues: before_issue_count

- Technical Debt: before_tech_debt

- Quality Gate: before_quality_gate

### After Fix

- Issues: after_issue_count

- Technical Debt: after_tech_debt

- Quality Gate: after_quality_gate

### Time Invested

- Research: research_time

- Implementation: implementation_time

- Testing: testing_time

- Total: total_time

## 📝 Pull Request Template

### PR Titlefixsonarcloud: Fix rule_id

- rule_name issue_count issues

### PR Descriptionmarkdown

## 🎯 PurposeFixes Sonar

Cloud cate

gory issues for rule rule_id.

## 📊 Changes

- Fixed issue_count instances of rule_name

- Files modified: file_count

- Pattern: brief_pattern_description

## ✅ Verification- [ ] All instances fixed- [ ] Tests pass- [ ] No regressions- [ ] Sonar

Cloud shows improvement

## 📚 References

- Fixes #issue_number- [Sonar

Cloud Rule rule_id]https://rules.sonarsource.com/language/RSPEC-rule_number

## 🚨 Suppression Template

When a fix cannot be applied:typescript// @sonar-disable-next-line rule_id// Justification: clear_justification// Review date: future_review_date// Issue: #tracking_issue_numbercode_that_cannot_be_fixed

## 📂 Related Elements

- Persona: sonar-guardian

- Skill: sonarcloud-modernizer

- Agent: sonar-sweep-agent

- Memory: sonarcloud-rules-reference---Template Version: 1.0.0Last Updated: current_date
