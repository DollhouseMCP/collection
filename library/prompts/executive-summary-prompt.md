---
type: prompt
name: Executive Summary Prompt
description: C-level communication template for concise, high-impact executive summaries
unique_id: prompt_executive-summary-prompt_dollhousemcp_20251025-101400
author: dollhousemcp
category: documentation
version: 1.0.0
tags:
  - executive-summary
  - business-communication
  - reporting
  - leadership
  - communication
license: MIT
parameters:
  - name: summary_type
    type: string
    options:
      - project-status
      - business-case
      - incident-report
      - strategic-proposal
      - quarterly-review
    default: project-status
  - name: audience
    type: string
    options:
      - c-suite
      - board
      - investors
      - stakeholders
    default: c-suite
  - name: urgency
    type: string
    options:
      - routine
      - important
      - urgent
      - critical
    default: routine
created: 2025-10-25T00:00:00.000Z
---

# Executive Summary Prompt

A framework for crafting clear, concise executive summaries that communicate key information and drive decision-making at the leadership level.

## When to Use This Prompt

- Reporting project status to executives
- Proposing strategic initiatives
- Communicating incidents or crises
- Presenting business cases
- Delivering quarterly or annual reviews
- Requesting executive decisions or approval

## Prompt Template

```
Create {summary_type} executive summary for {audience} with {urgency} priority.

## EXECUTIVE SUMMARY FORMAT

### Header
**To:** [Executive names/titles]
**From:** [Your name and role]
**Date:** [Date]
**Subject:** [Clear, specific subject line]
**Priority:** {urgency}

### The Bottom Line (First Sentence)
[Single sentence that answers: What do they need to know RIGHT NOW?]

Example:
- "We are on track to launch Product X on October 31 with $2M under budget."
- "Critical security incident resolved; no customer data compromised."
- "Recommend allocating $500K to Project Y to capture $5M market opportunity."

### Executive Summary (2-3 paragraphs, max 300 words)

**Paragraph 1: Situation & Context**
- What is this about?
- Why does it matter?
- What's the business impact?

**Paragraph 2: Key Facts & Analysis**
- Most important 3-5 points
- Relevant data and metrics
- Critical implications

**Paragraph 3: Action Required**
- What decision is needed?
- What are you recommending?
- What's the timeline?
- What happens if no action taken?

---

## DETAILED CONTENT STRUCTURE

### FOR PROJECT STATUS SUMMARY

**Status Overview**
- **Overall Status:** [On Track / At Risk / Behind / Ahead]
- **Budget:** [% spent] of [$amount] ([Under/Over/On] budget by [$amount])
- **Timeline:** [On schedule / X weeks ahead/behind]
- **Scope:** [Complete / On track / Changed]
- **Risk Level:** [Low / Medium / High / Critical]

**Key Accomplishments (Since Last Update)**
1. [Major achievement 1]: [Impact or metric]
2. [Major achievement 2]: [Impact or metric]
3. [Major achievement 3]: [Impact or metric]

**Critical Metrics**
Metric | Target | Current | Status | Trend
-------|--------|---------|--------|------
Revenue | $10M | $12M | ✓ | ↑ +20%
Users | 50K | 47K | ⚠ | ↓ -6%
NPS | 45 | 52 | ✓ | ↑ +16%
Churn | 5% | 3% | ✓ | ↓ -40%

**Top 3 Priorities (Next 30 Days)**
1. [Priority 1]: [Why important] [Owner] [Date]
2. [Priority 2]: [Why important] [Owner] [Date]
3. [Priority 3]: [Why important] [Owner] [Date]

**Risks & Issues**
- **CRITICAL:** [Issue]: [Impact] - [Mitigation plan] - Owner: [Name]
- **HIGH:** [Issue]: [Impact] - [Mitigation plan] - Owner: [Name]

**Decisions Needed**
1. [Decision]: [Options] - Recommend: [Option] - By: [Date]
2. [Decision]: [Options] - Recommend: [Option] - By: [Date]

**Resource Needs**
- [Resource type]: [Amount] - [Justification] - [When]

---

### FOR BUSINESS CASE SUMMARY

**Opportunity**
- **Market Opportunity:** [$X size, Y% growth rate]
- **Target Customers:** [Segment description, market size]
- **Competitive Landscape:** [Brief assessment]
- **Strategic Fit:** [How it aligns with company strategy]

**Proposed Solution**
- **What:** [1-2 sentence description]
- **Why Now:** [Market timing, competitive advantage]
- **Differentiation:** [What makes this unique/defensible]

**Financial Summary**
Investment Required: [$Amount over timeframe]
Expected Returns: [$Revenue/Cost savings over timeframe]
ROI: [X%]
Payback Period: [Months/Years]
NPV: [$Amount]

**Key Assumptions**
1. [Assumption]: [Impact if wrong]
2. [Assumption]: [Impact if wrong]
3. [Assumption]: [Impact if wrong]

**Risks & Mitigation**
Risk | Likelihood | Impact | Mitigation
-----|------------|--------|------------
[Risk 1] | High | High | [Strategy]
[Risk 2] | Medium | High | [Strategy]

**Recommendation**
[Approve / Further study / Decline] because [clear rationale]

**Next Steps (if approved)**
1. [Action] by [Date]
2. [Action] by [Date]
3. [Milestone] by [Date]

---

### FOR INCIDENT REPORT SUMMARY

**Incident Classification**
- **Severity:** [SEV1 Critical / SEV2 High / SEV3 Medium]
- **Duration:** [Start time] to [End time] ([Total duration])
- **Systems Affected:** [List]
- **Customer Impact:** [Number affected, % of base]

**Impact Summary**
- **Business Impact:** [Revenue loss, customer churn, SLA breach]
- **Customer Impact:** [Services unavailable, degraded performance]
- **Reputation Impact:** [Media coverage, social media sentiment]

**What Happened**
[2-3 sentence clear explanation of incident in plain language]

**Root Cause**
[1-2 sentence explanation of underlying cause]

**Resolution**
[What was done to restore service]
- **Detection Time:** [How long to detect]
- **Resolution Time:** [How long to fix]
- **Total Downtime:** [Total customer impact]

**Customer Communication**
- Status page updated: [Time]
- Email notification: [Time] ([Number] customers)
- Individual outreach: [For critical customers]

**Immediate Actions Taken**
1. [Action]: [When completed]
2. [Action]: [When completed]

**Preventive Measures (Next 30 Days)**
1. [Action]: [Owner] [Due date] [Expected outcome]
2. [Action]: [Owner] [Due date] [Expected outcome]
3. [Action]: [Owner] [Due date] [Expected outcome]

**Lessons Learned**
- What went well: [Positive aspects]
- What needs improvement: [Gaps identified]

**Financial Impact**
- Direct costs: [$Amount]
- Estimated revenue impact: [$Amount]
- SLA credits: [$Amount]

---

### FOR STRATEGIC PROPOSAL SUMMARY

**Strategic Context**
- **Current State:** [Where we are today]
- **Problem/Opportunity:** [What we're addressing]
- **Market Dynamics:** [What's changing in the market]
- **Competitive Pressure:** [What competitors are doing]

**Proposal**
[2-3 sentence description of what you're proposing]

**Strategic Rationale**
- **Alignment:** How this fits company strategy
- **Timing:** Why now is the right time
- **Differentiation:** What makes this unique
- **Defensibility:** Why competitors can't easily copy

**Expected Outcomes**
**Year 1:**
- Revenue: [$Amount]
- Customers: [Number]
- Market share: [%]

**Year 3:**
- Revenue: [$Amount]
- Customers: [Number]
- Market share: [%]

**Investment Required**
Category | Year 1 | Year 2 | Year 3 | Total
---------|--------|--------|--------|-------
People | $XM | $XM | $XM | $XM
Technology | $XM | $XM | $XM | $XM
Marketing | $XM | $XM | $XM | $XM
**Total** | **$XM** | **$XM** | **$XM** | **$XM**

**Key Success Factors**
1. [Factor]: [Why critical]
2. [Factor]: [Why critical]
3. [Factor]: [Why critical]

**Alternatives Considered**
- **Option A:** [Description] - Rejected because [reason]
- **Option B:** [Description] - Rejected because [reason]
- **Do Nothing:** Risk of [outcome]

**Decision Requested**
[Specific ask: approval, budget, resources, timeline]

**Timeline**
- Decision needed by: [Date]
- Project start: [Date]
- Key milestones: [Dates]
- Expected completion: [Date]

---

### FOR QUARTERLY/ANNUAL REVIEW SUMMARY

**Quarter/Year Highlights**
[2-3 sentence overview of major achievements and challenges]

**Financial Performance**
Metric | Target | Actual | Variance | YoY
-------|--------|--------|----------|----
Revenue | $XM | $XM | +X% | +Y%
Profit | $XM | $XM | +X% | +Y%
Margin | X% | Y% | +/-Z pts | +/-A pts

**Key Performance Indicators**
[Table of critical business metrics with targets, actuals, and trends]

**Major Accomplishments**
1. [Achievement 1]: [Impact and metrics]
2. [Achievement 2]: [Impact and metrics]
3. [Achievement 3]: [Impact and metrics]

**Challenges & Learnings**
- **Challenge:** [What happened]
  - **Impact:** [Business effect]
  - **Response:** [How addressed]
  - **Learning:** [What we'll do differently]

**Strategic Progress**
Initiative | Status | Progress | Impact
-----------|--------|----------|-------
[Initiative 1] | On track | 75% | $XM revenue
[Initiative 2] | Behind | 60% | [Impact]

**Market Position**
- Market share: [X%] ([Change] from prior period)
- Competitive position: [Assessment]
- Customer satisfaction: [NPS/CSAT score]

**Looking Ahead**
**Next Quarter/Year Priorities:**
1. [Priority 1]: [Expected outcome]
2. [Priority 2]: [Expected outcome]
3. [Priority 3]: [Expected outcome]

**Forecast**
- Revenue: [$Amount] ([% growth])
- Key assumptions: [List]
- Risk factors: [List]

---

## FORMATTING & STYLE GUIDELINES

### Keep It Executive-Friendly

**Do:**
- Start with the conclusion (bottom line up front)
- Use short sentences and paragraphs
- Include visuals (charts, tables, dashboards)
- Highlight key numbers in bold
- Use bullet points for scannability
- Include one-page summary + detailed appendix
- Use consistent formatting
- Define acronyms on first use

**Don't:**
- Bury the lead in details
- Use technical jargon without explanation
- Create dense paragraphs
- Omit specific numbers ("many customers" vs "247 customers")
- Forget context for numbers (growth rate, comparison)
- Make it longer than necessary
- Use passive voice
- Hide bad news

### The One-Page Rule
- Executive summary: 1 page maximum
- Supporting details: Appendix (if needed)
- If longer than 1 page, cut something

### Visual Hierarchy
**Use:**
- Headers and subheaders
- Bold for key metrics
- Tables for comparisons
- Charts for trends
- Icons for status (✓ ⚠ ✗)
- Color coding (green/yellow/red)

### Numbers & Metrics
- Always include context: "$5M revenue (up 20% from $4.2M)"
- Show trends: "↑ ↓ →"
- Use consistent units
- Round to meaningful precision ($4.7M not $4,739,284.17)
- Include benchmarks when relevant

### Tone & Voice
- Confident but not arrogant
- Direct and clear
- Solution-oriented
- Honest about challenges
- Forward-looking

## Quality Checklist

**Before Sending:**
- [ ] Bottom line is in first sentence
- [ ] Key recommendation is clear
- [ ] Numbers include context and comparison
- [ ] Risks are honestly presented
- [ ] Action items have owners and dates
- [ ] One page or less (details in appendix)
- [ ] Jargon explained or removed
- [ ] Proofread for errors
- [ ] Executive would understand without explanation
- [ ] Can be read in <5 minutes

## Example Executive Summaries

### Example 1: Project Status

```
TO: CEO, CFO, CPO
FROM: Sarah Johnson, VP Engineering
DATE: October 25, 2025
SUBJECT: Q4 Platform Migration - Week 8 Status
PRIORITY: Routine

THE BOTTOM LINE:
Platform migration is ON TRACK for November 15 launch, $200K under
budget, with zero customer-impacting incidents during testing.

EXECUTIVE SUMMARY:
We are in week 8 of 10 for the platform migration project. All
critical components have been migrated and tested successfully.
99.8% of test scenarios pass, meeting our 99.5% target. Customer
beta testing (N=50) shows 15% performance improvement and zero
reported issues.

Budget: $2.8M spent of $3M allocated ($200K under budget due to
negotiated infrastructure savings). Timeline: On schedule for
November 15 go-live. Risk: One medium risk remains around data
migration throughput for largest customer (Enterprise Corp), with
mitigation plan in place.

RECOMMENDATION: Proceed with launch as planned. Schedule final
executive review November 8.

KEY METRICS:
- Test completion: 99.8% (target: 99.5%)
- Performance improvement: +15% (target: +10%)
- Budget: $2.8M / $3M (7% under)
- Customer beta satisfaction: 9.2/10

DECISIONS NEEDED:
1. Approve November 15 launch date (by Nov 1)
2. Approve $50K contingency budget extension for Enterprise Corp
   edge case (by Nov 5)

NEXT MILESTONE:
Final production validation test - November 8
```

### Example 2: Incident Report

```
TO: CEO, Board of Directors
FROM: CTO
DATE: October 25, 2025, 18:00 PST
SUBJECT: RESOLVED: Critical Service Outage - October 25
PRIORITY: CRITICAL

THE BOTTOM LINE:
2-hour service outage (14:15-16:15 PST) affected 15% of customers.
Service fully restored, no data loss, root cause identified,
preventive measures in progress.

INCIDENT SUMMARY:
Database failover mechanism failed due to misconfigured monitoring
threshold, causing 2-hour service degradation for 7,500 customers
(15% of base). Team detected issue within 3 minutes, restored
service in 2 hours. Zero data loss or security breach. Estimated
revenue impact: $50K. SLA credits: $12K.

ROOT CAUSE:
Database monitoring threshold set to 95% (should be 80%), delaying
automatic failover. Human error during last week's configuration
change, not caught by code review.

IMMEDIATE ACTIONS COMPLETED:
- Service restored 16:15 PST
- All customers notified
- Configuration corrected across all environments
- Code review process updated with checklist

PREVENTIVE MEASURES (Next 7 days):
1. Automated configuration validation (Eng Lead, Oct 27)
2. Enhanced monitoring alerts (DevOps, Oct 28)
3. Disaster recovery drill (All teams, Oct 31)

This is our first SEV1 incident in 8 months. Full post-mortem
report will be available Oct 28.
```

### Example 3: Business Case

```
TO: Executive Team
FROM: VP Product
DATE: October 25, 2025
SUBJECT: Proposal: AI-Powered Analytics Feature
PRIORITY: Important

THE BOTTOM LINE:
$2M investment in AI analytics could generate $8M incremental
revenue by capturing 20% of the $40M analytics market opportunity.

BUSINESS CASE:
Customer research (N=250) shows 78% would pay premium for AI-powered
insights. Current product is losing deals to AI-enabled competitors
(32% of losses in Q3). The market is shifting - 5 of top 10
competitors launched AI features in 2025.

FINANCIAL SUMMARY:
Investment: $2M over 18 months (engineering + infrastructure)
Revenue: $8M incremental in Years 1-3
ROI: 300%
Payback: 9 months

RISKS:
- Technical: AI accuracy must exceed 90% (mitigation: 6-month
  validation period)
- Market: Competitors could match feature (mitigation: 12-month
  time-to-market advantage)
- Adoption: Requires customer education (mitigation: comprehensive
  training program)

RECOMMENDATION: Approve $2M investment to begin development
immediately. Launch beta Q2 2026, GA Q3 2026.

DECISION REQUESTED: Investment approval by November 1 to hit Q2
beta timeline.
```

## Related Elements

Works well with:
- `business-consultant` persona for strategic framing
- `meeting-notes` prompt for executive meeting documentation
- `product-requirements` prompt for detailed specs
- `competitive-analysis` prompt for market context
