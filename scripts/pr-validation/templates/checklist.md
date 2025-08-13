# ✅ PR Review Checklist

**Generated:** {{timestamp}}
**Estimated Review Time:** {{estimatedTime}}
**Priority Level:** {{priorityLevel}}

---

## 🎯 Review Overview

### 📊 Quick Assessment

| Aspect | Status | Priority | Time Estimate |
|--------|--------|----------|---------------|
| **Security** | {{securityStatus}} | {{securityPriority}} | {{securityTime}} |
| **Quality** | {{qualityStatus}} | {{qualityPriority}} | {{qualityTime}} |
| **Integration** | {{integrationStatus}} | {{integrationPriority}} | {{integrationTime}} |
| **Documentation** | {{docStatus}} | {{docPriority}} | {{docTime}} |

**Total Estimated Time:** {{totalTime}}

---

## 🚨 Critical Items (Must Complete)

> These items are **mandatory** for approval. Any failing critical item blocks merge.

{{#each criticalItems}}
### {{priority}} {{title}}

- [ ] **{{task}}**
  - **Why Critical:** {{reason}}
  - **How to Check:** {{checkMethod}}
  - **Expected Outcome:** {{expectedOutcome}}
  {{#if automatedCheck}}
  - **Automated Check:** {{automatedCheck}} ✅
  {{/if}}
  {{#if tools}}
  - **Tools Needed:** {{tools}}
  {{/if}}

{{/each}}

### 🔒 Security Critical Checks

- [ ] **No critical security vulnerabilities detected**
  - Run security scanner and verify 0 critical issues
  - Check for prompt injection patterns
  - Verify no code execution attempts
  - Confirm no data exfiltration risks

- [ ] **Content sanitization verified**
  - No JavaScript or script tags in content
  - No external resource loading
  - No suspicious URL patterns
  - File paths are relative and safe

- [ ] **Access control patterns reviewed**
  - No privilege escalation attempts
  - No system command references
  - No file system access patterns
  - No network access attempts

### 🔧 Integration Critical Checks

- [ ] **All integration tests pass**
  - Element loads without errors
  - Schema validation succeeds
  - No naming conflicts with existing elements
  - Cross-references resolve correctly

- [ ] **Collection compatibility verified**
  - Follows collection naming conventions
  - Metadata structure is valid
  - Required fields are present and correct
  - Dependencies are properly declared

---

## ⚠️ Important Items (Should Complete)

> These items significantly impact quality and should be addressed before approval.

{{#each importantItems}}
### {{title}}

- [ ] **{{task}}**
  - **Impact:** {{impact}}
  - **Check Method:** {{checkMethod}}
  - **Resolution:** {{resolution}}

{{/each}}

### 📝 Quality Important Checks

- [ ] **Documentation meets standards**
  - Description is clear and comprehensive (>20 words)
  - Examples are provided and functional
  - Usage instructions are complete
  - Purpose and use cases are explained

- [ ] **Metadata completeness**
  - Author information is present
  - Version follows semantic versioning
  - Tags are relevant and helpful
  - Category/type is appropriate

- [ ] **Content structure validation**
  - YAML frontmatter is well-formed
  - Markdown formatting is consistent
  - Headers follow proper hierarchy
  - Links are functional and appropriate

### 🎯 Usability Important Checks

- [ ] **User experience considerations**
  - Instructions are beginner-friendly
  - Examples demonstrate real-world usage
  - Potential gotchas are documented
  - Success criteria are clear

- [ ] **Accessibility and clarity**
  - Language is clear and professional
  - Technical jargon is explained
  - Screenshots/examples aid understanding
  - Common use cases are covered

---

## 💡 Optional Items (Nice to Have)

> These items enhance quality but aren't blocking. Address time permitting.

{{#each optionalItems}}
### {{title}}

- [ ] **{{task}}**
  - **Benefit:** {{benefit}}
  - **Suggestion:** {{suggestion}}

{{/each}}

### 🌟 Enhancement Opportunities

- [ ] **Content enrichment**
  - Additional examples for edge cases
  - Links to related elements
  - Advanced usage patterns
  - Troubleshooting section

- [ ] **Community value**
  - Consider broad applicability
  - Check for duplicate functionality
  - Suggest improvements for discoverability
  - Evaluate reusability potential

- [ ] **Performance optimizations**
  - Content length is reasonable
  - No excessive complexity
  - Memory usage is minimal
  - Loading time is acceptable

---

## 🔍 Detailed Review Guides

### 🔒 Security Review Process

#### Step 1: Automated Security Scan
```bash
# Run security scanner
node scripts/pr-validation/security-scanner.mjs "{{fileList}}"

# Check for critical issues
grep -i "CRITICAL" security-report.json
```

#### Step 2: Manual Security Review
1. **Content Analysis**
   - Read through all content for suspicious patterns
   - Check for social engineering attempts
   - Verify no malicious instructions or prompts

2. **Technical Review**
   - Examine any code snippets or commands
   - Verify file paths and references
   - Check for injection attack vectors

3. **Context Assessment**
   - Consider element purpose and functionality
   - Assess potential for misuse
   - Evaluate user permission levels required

### 📝 Quality Review Process

#### Step 1: Automated Quality Analysis
```bash
# Run quality analyzer
node scripts/pr-validation/quality-analyzer.mjs "{{fileList}}"

# Check score breakdown
cat quality-report.json | jq '.breakdown'
```

#### Step 2: Manual Quality Review
1. **Documentation Review**
   - Verify description clarity and completeness
   - Check examples work as documented
   - Ensure instructions are followable

2. **Structure Assessment**
   - Validate YAML frontmatter completeness
   - Check markdown formatting consistency
   - Verify proper use of headers and organization

3. **Content Quality**
   - Assess language quality and professionalism
   - Check for typos and grammatical errors
   - Verify technical accuracy

### 🔧 Integration Review Process

#### Step 1: Automated Integration Tests
```bash
# Run integration tests
node scripts/pr-validation/integration-tester.mjs "{{fileList}}"

# Verify all tests pass
echo "Exit code: $?"
```

#### Step 2: Manual Integration Review
1. **Loading Verification**
   - Manually load element in test environment
   - Verify all metadata parses correctly
   - Check for any runtime errors

2. **Compatibility Testing**
   - Compare with similar existing elements
   - Check for naming conflicts
   - Verify collection integration

3. **Functionality Validation**
   - Test element works as documented
   - Verify examples produce expected results
   - Check error handling and edge cases

---

## 📊 Review Decision Matrix

### ✅ Approval Criteria

| Component | Required Status | Current Status | Blocking Issues |
|-----------|-----------------|----------------|-----------------|
| **Security** | No Critical/High | {{securityCurrentStatus}} | {{securityBlockers}} |
| **Quality** | Score ≥ 70 | {{qualityCurrentStatus}} | {{qualityBlockers}} |
| **Integration** | All Tests Pass | {{integrationCurrentStatus}} | {{integrationBlockers}} |
| **Documentation** | Complete | {{docCurrentStatus}} | {{docBlockers}} |

### 🎯 Decision Guidelines

#### ✅ **APPROVE** if:
- All critical items are checked ✅
- No blocking security issues
- Quality score ≥ 70
- All integration tests pass

#### ⏸️ **REQUEST CHANGES** if:
- Any critical item fails
- Quality score < 70
- Integration tests failing
- Security issues present

#### 💬 **REQUEST REVIEW** if:
- Borderline quality (70-75)
- Minor security concerns
- Need second opinion
- Unusual or complex submission

---

## 📝 Review Comments Template

### 🎉 Approval Comment
```markdown
## ✅ Approved

Great submission! This PR meets all our standards:

- 🔒 Security: {{securitySummary}}
- 📝 Quality: {{qualitySummary}} 
- 🔧 Integration: {{integrationSummary}}

**Highlights:**
{{approvalHighlights}}

Thanks for your contribution to the DollhouseMCP collection! 🚀
```

### 📝 Changes Requested Comment
```markdown
## 📝 Changes Requested

Thanks for your submission! Before we can approve, please address:

### 🚨 Critical Issues
{{criticalIssuesList}}

### ⚠️ Important Improvements
{{importantIssuesList}}

### 💡 Optional Enhancements
{{optionalSuggestionsList}}

Once these are addressed, I'll be happy to review again. Let me know if you need any clarification! 🤝
```

### ❓ Review Request Comment
```markdown
## 👀 Review Requested

@{{reviewerTag}} - Could you take a look at this PR?

**Specific areas to review:**
{{specificReviewAreas}}

**Context:**
{{reviewContext}}

Thanks! 🙏
```

---

## 🔧 Tools & Resources

### 🛠️ Review Tools

| Tool | Purpose | Command | Documentation |
|------|---------|---------|---------------|
| Security Scanner | Vulnerability detection | `node scripts/pr-validation/security-scanner.mjs` | [Security Docs](../docs/SECURITY.md) |
| Quality Analyzer | Content quality assessment | `node scripts/pr-validation/quality-analyzer.mjs` | [Quality Guide](../docs/QUALITY.md) |
| Integration Tester | Functionality verification | `node scripts/pr-validation/integration-tester.mjs` | [Integration Docs](../docs/INTEGRATION.md) |

### 📚 Reference Documentation

- **Element Guidelines:** [Element Submission Workflow](../docs/workflows/ELEMENT_SUBMISSION_WORKFLOW.md)
- **Security Policy:** [Security and Validation Strategy](../docs/SECURITY_AND_VALIDATION_STRATEGY.md)
- **Quality Standards:** [Contributing Guidelines](../CONTRIBUTING.md)
- **Review Process:** [Review Workflow Documentation](../docs/REVIEW_WORKFLOW.md)

### 🆘 Getting Help

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| **Security Concerns** | `@security-team` | Immediate |
| **Technical Questions** | `@maintainers` | 24 hours |
| **Policy Clarification** | `@community-team` | 48 hours |
| **Tool Issues** | Create issue with `bug` label | 72 hours |

---

## 📊 Review Statistics

### ⏱️ Time Tracking

- **Review Started:** {{reviewStartTime}}
- **Estimated Completion:** {{estimatedEndTime}}
- **Actual Time Spent:** _[Fill in when complete]_

### ✅ Completion Status

**Critical Items:** {{criticalProgress}} ({{criticalPercent}}%)
**Important Items:** {{importantProgress}} ({{importantPercent}}%)
**Optional Items:** {{optionalProgress}} ({{optionalPercent}}%)

**Overall Progress:** {{overallProgress}} ({{overallPercent}}%)

---

*📋 Review Checklist | Generated by DollhouseMCP PR Validation | Version {{checklistVersion}}*

**Final Decision:** _[To be filled by reviewer]_

- [ ] ✅ **APPROVED**
- [ ] 📝 **CHANGES REQUESTED** 
- [ ] 👀 **ADDITIONAL REVIEW NEEDED**