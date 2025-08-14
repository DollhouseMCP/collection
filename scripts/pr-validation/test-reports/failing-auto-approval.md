# 🤖 Auto-Approval Eligibility Assessment

**Generated:** {{timestamp}}
**PR:** {{prNumber}}
**Files:** {{filesCount}}

---

## 🎯 Decision Summary

### {{autoApprovalStatus}}

**Confidence Level:** % {{confidenceIndicator}}

{{decisionBadge}}

---

## 📋 Eligibility Criteria Analysis

### ✅ Auto-Approval Requirements

| Criteria | Required | Actual | Status | Weight |
|----------|----------|--------|--------|--------|
| **Quality Score** | ≥ 85 | {{qualityScore}} | {{qualityStatus}} | 🔥 High |
| **Security Risk Level** | ≤ LOW | {{securityLevel}} | {{securityStatus}} | 🚨 Critical |
| **Critical Security Issues** | = 0 | {{criticalIssues}} | {{criticalStatus}} | 🚨 Critical |
| **High Risk Issues** | ≤ 1 | {{highRiskIssues}} | {{highRiskStatus}} | ⚠️ High |
| **Integration Tests** | 100% Pass | {{integrationPassRate}}% | {{integrationStatus}} | ⚠️ High |

### 🎖️ Criteria Status Legend
- 🟢 **PASS** - Meets requirement
- 🟡 **WARN** - Close to threshold
- 🔴 **FAIL** - Does not meet requirement

---

## 🧠 Decision Logic

### Auto-approval blocked by: qualityScore, securityLevel, allTestsPassing, criticalIssues

#### 📊 Scoring Breakdown

```
Base Confidence: 100%
Quality Adjustment: {{qualityAdjustment}}
Security Adjustment: {{securityAdjustment}}
Integration Adjustment: {{integrationAdjustment}}
Final Confidence: %
```

#### 🎯 Key Decision Factors

{{#if eligible}}
✅ **APPROVED FOR AUTO-APPROVAL**

**Why this PR is safe for automatic approval:**
- All critical security checks passed
- Quality standards exceeded
- Integration tests fully successful
- No manual intervention required

**Automated Actions:**
- Will be automatically approved when CI passes
- Will be merged to main branch
- Collection will be updated automatically
- Contributors will be notified of successful merge

{{else}}
❌ **REQUIRES MANUAL REVIEW**

**Blocking factors:**
{{blockingFactors}}

**Required actions before approval:**
{{requiredActions}}

**Escalation path:**
{{escalationPath}}
{{/if}}

---

## 🔍 Risk Assessment

### 🛡️ Security Risk Profile

| Risk Category | Level | Confidence | Impact | Mitigation |
|---------------|-------|------------|--------|------------|
| **Code Injection** | {{codeInjectionRisk}} | {{codeInjectionConfidence}}% | {{codeInjectionImpact}} | {{codeInjectionMitigation}} |
| **Prompt Injection** | {{promptInjectionRisk}} | {{promptInjectionConfidence}}% | {{promptInjectionImpact}} | {{promptInjectionMitigation}} |
| **Data Exfiltration** | {{dataExfiltrationRisk}} | {{dataExfiltrationConfidence}}% | {{dataExfiltrationImpact}} | {{dataExfiltrationMitigation}} |
| **Social Engineering** | {{socialEngineeringRisk}} | {{socialEngineeringConfidence}}% | {{socialEngineeringImpact}} | {{socialEngineeringMitigation}} |

### 📈 Quality Risk Profile

| Quality Aspect | Score | Risk Level | Impact on Users | Recommendation |
|----------------|-------|------------|-----------------|----------------|
| **Documentation** | {{docScore}}/25 | {{docRisk}} | {{docImpact}} | {{docRecommendation}} |
| **Metadata** | {{metaScore}}/20 | {{metaRisk}} | {{metaImpact}} | {{metaRecommendation}} |
| **Structure** | {{structScore}}/20 | {{structRisk}} | {{structImpact}} | {{structRecommendation}} |
| **Usability** | {{usabilityScore}}/35 | {{usabilityRisk}} | {{usabilityImpact}} | {{usabilityRecommendation}} |

---

## 🎯 Recommendation Engine

### 🤖 Automated Recommendation

{{#if eligible}}
**APPROVE AUTOMATICALLY** 

This PR meets all criteria for safe automatic approval:
- Exceptional quality ({{qualityScore}}/100)
- No security concerns detected
- All integration tests passing
- Follows community guidelines

**Estimated time saved:** {{timeSaved}} minutes of manual review

{{else}}
**ROUTE TO MANUAL REVIEW**

**Recommended reviewer:** {{recommendedReviewer}}
**Review priority:** {{reviewPriority}}
**Estimated review time:** {{estimatedReviewTime}}

### 📋 Review Focus Areas

{{#if criticalIssues}}
#### 🚨 Critical Review Required
{{criticalReviewAreas}}
{{/if}}

{{#if qualityIssues}}
#### 📝 Quality Concerns
{{qualityReviewAreas}}
{{/if}}

{{#if integrationIssues}}
#### 🔧 Integration Issues
{{integrationReviewAreas}}
{{/if}}
{{/if}}

---

## 📊 Comparative Analysis

### 📈 Collection Benchmarks

| Metric | This PR | Collection Avg | Percentile | Status |
|--------|---------|----------------|------------|--------|
| **Quality Score** | {{qualityScore}} | {{avgQualityScore}} | {{qualityPercentile}}% | {{qualityBenchmarkStatus}} |
| **Security Score** | {{securityScore}} | {{avgSecurityScore}} | {{securityPercentile}}% | {{securityBenchmarkStatus}} |
| **Documentation** | {{docScore}} | {{avgDocScore}} | {{docPercentile}}% | {{docBenchmarkStatus}} |
| **Test Coverage** | {{testCoverage}}% | {{avgTestCoverage}}% | {{testPercentile}}% | {{testBenchmarkStatus}} |

### 🏆 Quality Ranking

**This submission ranks in the {{qualityRankPercentile}} percentile** of all collection elements.

{{#if topPerformer}}
🌟 **TOP PERFORMER** - This PR exceeds 90% of submissions in overall quality!
{{/if}}

{{#if belowAverage}}
⚠️ **BELOW AVERAGE** - Consider improvements to match collection standards.
{{/if}}

---

## 🔄 Fallback Strategy

### {{fallbackStrategy}}

{{#if eligible}}
**If auto-approval fails for any reason:**

1. **Immediate Actions:**
   - Route to senior maintainer review
   - Flag for priority processing
   - Notify contributor of delay

2. **Escalation Path:**
   - Level 1: Automated retry after 5 minutes
   - Level 2: Senior maintainer review (30 min SLA)
   - Level 3: Security team review if security flags raised

{{else}}
**Manual Review Optimization:**

1. **Pre-Review Preparation:**
   {{preReviewSteps}}

2. **Review Efficiency Tips:**
   {{reviewEfficiencyTips}}

3. **Common Resolution Paths:**
   {{commonResolutions}}
{{/if}}

---

## 📞 Support & Escalation

### 🆘 When to Escalate

| Scenario | Action | Contact |
|----------|--------|---------|
| **Security Alert** | Immediate escalation | `@security-team` |
| **Quality Dispute** | Standard escalation | `@quality-reviewers` |
| **Technical Issues** | Auto-assign | `@tech-maintainers` |
| **Policy Questions** | Documentation review | `@policy-team` |

### 📚 Resources

- **Auto-Approval Policy:** [Auto-Approval Guidelines](../docs/AUTO_APPROVAL_POLICY.md)
- **Manual Review Process:** [Review Workflow](../docs/REVIEW_WORKFLOW.md)
- **Appeal Process:** [Dispute Resolution](../docs/DISPUTE_RESOLUTION.md)
- **Security Escalation:** [Security Response](../SECURITY.md)

---

## 🔧 Technical Metadata

### ⚙️ Assessment Configuration

```json
{
  "autoApprovalThresholds": {
    "qualityScore": {{qualityThreshold}},
    "securityRiskLevel": "{{securityThreshold}}",
    "criticalIssues": {{criticalThreshold}},
    "highRiskIssues": {{highRiskThreshold}},
    "integrationPassRate": {{integrationThreshold}}
  },
  "confidenceWeights": {
    "quality": {{qualityWeight}},
    "security": {{securityWeight}},
    "integration": {{integrationWeight}},
    "community": {{communityWeight}}
  },
  "processingTime": "{{processingTime}}ms",
  "modelVersion": "{{modelVersion}}"
}
```

### 📊 Decision Audit Trail

| Timestamp | Component | Decision | Confidence | Notes |
|-----------|-----------|----------|------------|-------|
| {{securityTimestamp}} | Security Scanner | {{securityDecision}} | {{securityConfidence}}% | {{securityNotes}} |
| {{qualityTimestamp}} | Quality Analyzer | {{qualityDecision}} | {{qualityConfidence}}% | {{qualityNotes}} |
| {{integrationTimestamp}} | Integration Tester | {{integrationDecision}} | {{integrationConfidence}}% | {{integrationNotes}} |
| {{finalTimestamp}} | Auto-Approval Engine | {{finalDecision}} | {{finalConfidence}}% | {{finalNotes}} |

---

*🤖 Auto-Approval Assessment | Engine Version: {{engineVersion}} | Report ID: {{reportId}}*

**Next Steps:** {{nextSteps}}