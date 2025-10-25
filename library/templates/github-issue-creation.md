---
category: general
description: >-
  Template for creating well-structured GitHub issues with proper labels and
  phase-based implementation plans no time estimates
examples: []
includes: []
name: github-issue-creation
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.1

---

# GitHub Issue Creation Template - Feature/Enhancement

**AUDIENCE:** This template is for AI agents and coding assistants creating GitHub issues, NOT for human users. Verbosity and specificity are intentional and beneficial.

## Pre-Creation Checklist (MANDATORY)

**BEFORE creating any GitHub issue, you MUST:**

1. **Read all available labels** from the repository:
   ```bash
   gh label list --limit 100 --json name,description
   ```

2. **Review existing issues** to avoid duplicates:
   ```bash
   gh issue list --search "keywords" --limit 20
   gh issue list --search "keywords" --state closed --limit 10
   ```

3. **Verify issue type** - Use this template for features/enhancements. For other types:
   - Bugs → Use `github-issue-bug-report` template
   - Documentation → Use `github-issue-documentation` template
   - Security → Use `github-issue-security` template

## Available Labels in Repository

**Priority Labels:**
- `priority: critical` - Urgent: Fix immediately
- `priority: high` - Important: Work on these first
- `priority: medium` - Standard priority
- `priority: low` - Nice to have

**Area Labels:**
- `area: docker` - Docker and containerization
- `area: testing` - Test suite and CI/CD
- `area: platform-compat` - Multi-platform support
- `area: marketplace` - GitHub marketplace integration
- `area: ux` - User experience improvements
- `area: security` - Security-related issues
- `area: ci/cd` - CI/CD workflows and automation
- `area: performance` - Performance optimization and monitoring
- `area: tooling` - Development tools and utilities
- `area: elements` - Element system (personas, skills, templates, etc.)

**Type Labels:**
- `enhancement` - New feature or request
- `type: research` - Investigation needed
- `type: task` - General task or chore
- `type: refactor` - Code refactoring

**Status Labels:**
- `status: needs-triage` - Needs initial review
- `status: in-progress` - Currently being worked on

**Other Labels:**
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `collection` - Collection submission and management
- `oauth` - OAuth authentication and authorization
- `meta-development` - Development using DollhouseMCP agents
- `architecture` - System architecture and design
- `technical-debt` - Technical debt that needs addressing

## When to Skip Full Template (Simple Issues)

Use simplified format for:
- Typo fixes in documentation or code comments
- Version bumps in dependencies (unless breaking changes)
- Single-line or trivial changes
- Changes to non-code files (config, markdown) under 10 lines

For simple issues, minimal format:
```bash
gh issue create \
  --title "Fix typo in README.md: 'recieve' → 'receive'" \
  --label "documentation,good first issue" \
  --body "Line 42 of README.md has a typo: 'recieve' should be 'receive'"
```

## Issue Structure for Features/Enhancements

### Title Format
Clear, concise, action-oriented. Use imperative mood.

**Patterns:**
- "Add [feature/capability]"
- "Implement [functionality]"
- "Improve [existing feature]"
- "Enable [capability]"
- "Support [new platform/format]"

**Good Examples:**
- "Add operational telemetry for installation metrics"
- "Implement hot-reload for configuration changes"
- "Improve error recovery in critical paths"
- "Enable self-hosting for telemetry server"
- "Support Windows path handling in file operations"

**Bad Examples:**
- "Telemetry" (too vague)
- "We should add telemetry maybe" (not imperative, uncertain)
- "Fix telemetry bugs" (that's a bug, not enhancement)
- "Make things better" (not specific)

### Summary Section (REQUIRED)

2-4 sentence overview answering:
1. **What** needs to be done
2. **Why** it's needed
3. **Who** benefits (users, developers, both)

**Example:**
```markdown
## Summary

Add minimal, privacy-respecting operational telemetry to track DollhouseMCP installation and basic usage metrics. This will provide visibility into installation counts, platform distribution, and crash rates while respecting user privacy. Currently, we rely on incomplete NPM stats that miss local clones and installations.
```

### Problem Statement (REQUIRED)

Describe the current state and motivation. Be specific about:
- What's missing or broken in current state
- What pain points exist
- What opportunities are being missed
- Why NOW is the right time

**Structure:**
```markdown
## Problem

Currently, we have no visibility into:
- [Specific problem 1]
- [Specific problem 2]
- [Specific problem 3]

This means we cannot:
- [Consequence 1]
- [Consequence 2]

[Additional context if needed]
```

### Proposed Solution (REQUIRED)

High-level approach to solving the problem. Include:
- Core approach/strategy
- Key components or changes
- How it addresses the problem
- Why this approach over alternatives (if relevant)

**Example:**
```markdown
## Proposed Solution

Implement lightweight operational telemetry that:
- Sends installation events on first run (OS, Node version, MCP client)
- Sends daily heartbeats when server starts
- Sends crash reports (sanitized, no PII)
- Defaults to opt-out via environment variable or config
- Uses open source telemetry server for AGPL compliance
```

### Implementation Plan (PHASE-BASED - NO TIME ESTIMATES)

**CRITICAL RULE:** NEVER include time estimates (no weeks, days, hours, months, quarters).

Break work into logical phases based on dependencies and complexity, NOT arbitrary time windows.

**Why no time estimates?**
- Software estimates are notoriously inaccurate
- Creates false pressure and technical debt
- Dependencies and complexity are more predictable
- Work happens at natural pace

**Format:**
```markdown
## Implementation Plan

### Phase 1: [Foundation/Core Component Name]
- [ ] Specific task A
- [ ] Specific task B (prerequisite for Phase 2)
- [ ] Specific task C

### Phase 2: [Next Component] (depends on Phase 1)
- [ ] Specific task D (requires task B from Phase 1)
- [ ] Specific task E
- [ ] Specific task F

### Phase 3: [Integration/Polish] (depends on Phase 2)
- [ ] Specific task G
- [ ] Specific task H

### Phase 4: [Testing/Documentation] (depends on Phases 1-3)
- [ ] Specific task I
- [ ] Specific task J
```

**Key Principles:**
- Use checkbox format `- [ ]` for trackable tasks in GitHub
- Specify dependencies between phases explicitly
- Name phases by WHAT they accomplish, not WHEN
- Break tasks into specific, actionable items
- If a task depends on specific prior task, note it in parentheses
- Each task should be verifiable (can say "this is done")

**Anti-Patterns to AVOID:**
```markdown
❌ ### Phase 1: Foundation (Week 1-2)
❌ ### Phase 2: Integration (2-3 days)
❌ ### Q1: Planning, Q2: Implementation
❌ ### Phase 1: Setup (vague - setup for what?)
❌ ### Phase 2: Everything else (not specific)
❌ - Implement feature (too vague - what specifically?)
```

**Good Example:**
```markdown
## Implementation Plan

### Phase 1: Telemetry Client Foundation
- [ ] Create `OperationalTelemetry` class with event types
- [ ] Generate anonymous UUID on first install (stored in ~/.dollhouse/.telemetry-id)
- [ ] Implement event serialization and validation
- [ ] Add environment variable support (DOLLHOUSE_TELEMETRY=false)
- [ ] Add config file support (telemetry.enabled: false)
- [ ] Create local transparency log (~/.dollhouse/telemetry.log)

### Phase 2: Event Implementation (depends on Phase 1)
- [ ] Implement install event (requires OperationalTelemetry class)
- [ ] Implement heartbeat event with daily throttling
- [ ] Implement crash event with PII sanitization
- [ ] Add event buffering for offline scenarios
- [ ] Add retry logic with exponential backoff

### Phase 3: Documentation (can parallel Phase 2)
- [ ] Add README section explaining operational telemetry
- [ ] Create TELEMETRY_PRIVACY_POLICY.md document
- [ ] Document all opt-out methods (env var, config, CLI)
- [ ] Add FAQ entries about data collection
- [ ] Update installation guide with telemetry notice

### Phase 4: Server Infrastructure (can parallel Phases 2-3)
- [ ] Create separate open source repository for telemetry server
- [ ] Implement event ingestion API with validation
- [ ] Add rate limiting and DDoS protection
- [ ] Create 24-hour aggregation pipeline
- [ ] Build public analytics dashboard
- [ ] Add self-hosting deployment guide

### Phase 5: Testing and Validation (depends on Phases 1-4)
- [ ] Test all opt-out mechanisms work correctly
- [ ] Verify no PII leakage in any event type
- [ ] Confirm server works fully without telemetry
- [ ] Test self-hosted endpoint override (DOLLHOUSE_TELEMETRY_ENDPOINT)
- [ ] Load test telemetry server
- [ ] Security audit of telemetry implementation
```

### Out of Scope (RECOMMENDED)

Be explicit about what this issue will NOT address. This prevents scope creep and sets clear boundaries.

**Format:**
```markdown
## Out of Scope

This issue will NOT include:
- ❌ [Feature/capability X] (reason: separate concern, will create Issue #XXX)
- ❌ [Feature/capability Y] (reason: future work, not MVP)
- ❌ [Refactoring Z] (reason: unrelated to telemetry)
```

**Example:**
```markdown
## Out of Scope

This issue will NOT include:
- ❌ Behavioral telemetry (tool usage, conversations, element access)
- ❌ User content collection (personas, skills, templates, memories)
- ❌ Detailed logging beyond crash sanitization
- ❌ A/B testing infrastructure
- ❌ User analytics or cohort analysis
```

### Success Criteria (REQUIRED)

Clear, measurable, verifiable outcomes that define "done". Use checkbox format for GitHub tracking.

**Categories:**
- Functional criteria (what works)
- Quality criteria (test coverage, performance, security)
- Documentation criteria (what's documented)
- Operational criteria (deployment, monitoring)

**Format:**
```markdown
## Success Criteria

### Functional
- [ ] Telemetry client sends install/heartbeat/crash events
- [ ] All three opt-out methods work (env var, config, CLI)
- [ ] Events include OS, Node version, MCP client detection
- [ ] Server receives and stores events correctly

### Quality
- [ ] Test coverage >95% for telemetry code
- [ ] No PII in any logged or transmitted data
- [ ] Zero performance impact on MCP server startup (<10ms overhead)
- [ ] Graceful degradation if telemetry server unavailable

### Documentation
- [ ] README clearly explains what telemetry collects
- [ ] Privacy policy published and linked
- [ ] All opt-out methods documented
- [ ] FAQ answers common questions

### Operational
- [ ] Telemetry server deployed and operational
- [ ] Public dashboard shows aggregated stats
- [ ] Monitoring alerts configured
- [ ] Self-hosting guide validated by external user
```

### References (OPTIONAL but RECOMMENDED)

Link to related issues, PRs, documentation, or external resources.

**Format:**
```markdown
## References

**Related Issues:**
- #1128 - Enhanced Index telemetry (internal metrics, different scope)
- #441 - Update success telemetry (feature-specific)
- #739 - OAuth usage monitoring (feature-specific)

**Related PRs:**
- #1125 - Telemetry infrastructure (merged, provides foundation)

**External Documentation:**
- [VS Code Telemetry](https://code.visualstudio.com/docs/getstarted/telemetry)
- [Homebrew Analytics](https://docs.brew.sh/Analytics)
- [Next.js Telemetry](https://nextjs.org/telemetry)

**Design Documents:**
- `docs/investigation/TELEMETRY_BEST_PRACTICES_AND_RECOMMENDATIONS.md`
```

## Label Selection for Features/Enhancements

**Required Labels:**
- `enhancement` (always for new features)
- One `priority: *` label
- At least one `area: *` label

**Common Combinations:**
```markdown
# New user-facing feature
--label "enhancement,priority: high,area: ux"

# Performance improvement
--label "enhancement,priority: medium,area: performance"

# Developer tooling
--label "enhancement,priority: low,area: tooling,good first issue"

# Security feature
--label "enhancement,priority: critical,area: security"

# Architecture change
--label "enhancement,architecture,type: refactor"
```

## Issue Creation Commands

### Using Inline Body (Short Issues)
```bash
gh issue create \
  --title "Add operational telemetry for installation metrics" \
  --label "enhancement,priority: high,area: performance" \
  --body "$(cat <<'EOF'
## Summary
Brief description here.

## Problem
Current state description.

## Proposed Solution
Approach description.

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
EOF
)"
```

**IMPORTANT:** Note the quotes around `'EOF'` - this prevents variable interpolation in the heredoc.

### Using Body File (Long Issues)
```bash
# Write issue body to temp file first
cat > /tmp/issue-1234.md <<'EOF'
[Full issue content here]
EOF

# Create issue from file
gh issue create \
  --title "Add operational telemetry for installation metrics" \
  --label "enhancement,priority: high,area: performance" \
  --body-file /tmp/issue-1234.md

# Clean up
rm /tmp/issue-1234.md
```

## Quality Checklist (Review Before Submitting)

Before creating the issue, verify:

- [ ] Read available labels from repository (`gh label list`)
- [ ] Selected labels from available list (not invented)
- [ ] Checked for duplicate issues (`gh issue list --search`)
- [ ] Title is clear and action-oriented (imperative mood)
- [ ] Summary explains what, why, and who benefits
- [ ] Problem statement describes current state
- [ ] Proposed solution is high-level but clear
- [ ] Implementation uses phases, NOT time estimates
- [ ] Dependencies between phases are explicit
- [ ] Tasks are specific and verifiable
- [ ] Out of scope section prevents scope creep
- [ ] Success criteria are measurable and complete
- [ ] All markdown formatting is correct
- [ ] Code blocks use appropriate syntax highlighting
- [ ] Heredoc uses `'EOF'` (quoted) to prevent interpolation

## Complete Example Issue

```markdown
## Summary

Add minimal, privacy-respecting operational telemetry to track DollhouseMCP installation and basic usage metrics. This will provide visibility into installation counts, platform distribution, and crash rates while respecting user privacy. Currently, we rely on incomplete NPM stats that miss local clones and installations.

## Problem

Currently, we have no visibility into:
- How many installations are actually running (NPM stats miss local clones/installs)
- What platforms/environments users are on (cannot prioritize platform support)
- Basic operational health (crash rates, version adoption rates)
- Which MCP clients are most commonly used (Claude Desktop, Claude Code, VS Code)

This means we cannot:
- Make informed decisions about platform priorities
- Detect widespread crashes or failures
- Understand actual user adoption beyond NPM downloads
- Justify resource allocation for development

Friends have confirmed they're using DollhouseMCP via local clones, but these installations are invisible to us.

## Proposed Solution

Implement lightweight operational telemetry that:
- Sends installation event on first run (OS, Node version, MCP client type, DollhouseMCP version)
- Sends daily heartbeat when server starts (uptime tracking)
- Sends crash reports (sanitized error type, component, no stack traces or PII)
- Defaults to enabled with easy opt-out via environment variable or config
- Uses open source telemetry server repository for AGPL compliance
- Provides public dashboard with aggregated stats (no individual data)

## Implementation Plan

### Phase 1: Telemetry Client Foundation
- [ ] Create `OperationalTelemetry` class with event types
- [ ] Generate anonymous UUID on first install (stored in ~/.dollhouse/.telemetry-id)
- [ ] Implement event serialization and validation
- [ ] Add environment variable support (DOLLHOUSE_TELEMETRY=false)
- [ ] Add config file support (telemetry.enabled: false)
- [ ] Create local transparency log (~/.dollhouse/telemetry.log)
- [ ] Implement MCP client detection (Claude Desktop, Claude Code, VS Code, other)

### Phase 2: Event Implementation (depends on Phase 1)
- [ ] Implement install event (requires OperationalTelemetry class)
- [ ] Implement heartbeat event with daily throttling (once per 24 hours)
- [ ] Implement crash event with PII sanitization
- [ ] Add event buffering for offline scenarios (queue up to 100 events)
- [ ] Add retry logic with exponential backoff (3 retries max)
- [ ] Test all events in isolation

### Phase 3: Documentation (can parallel Phase 2)
- [ ] Add README section explaining operational telemetry
- [ ] Create TELEMETRY_PRIVACY_POLICY.md document
- [ ] Document all opt-out methods (env var, config, CLI command)
- [ ] Add FAQ entries about data collection
- [ ] Update installation guide with telemetry notice
- [ ] Create visual diagram of data flow

### Phase 4: Server Infrastructure (can parallel Phases 2-3)
- [ ] Create separate open source repository for telemetry server
- [ ] Implement event ingestion API with validation
- [ ] Add rate limiting and DDoS protection
- [ ] Create 24-hour aggregation pipeline (delete individual events after aggregation)
- [ ] Build public analytics dashboard (aggregated data only)
- [ ] Add self-hosting deployment guide
- [ ] Deploy production telemetry server

### Phase 5: Testing and Validation (depends on Phases 1-4)
- [ ] Test all opt-out mechanisms work correctly
- [ ] Verify no PII leakage in any event type (automated scan)
- [ ] Confirm MCP server works fully without telemetry
- [ ] Test self-hosted endpoint override (DOLLHOUSE_TELEMETRY_ENDPOINT)
- [ ] Load test telemetry server (10,000 events/minute)
- [ ] Security audit of telemetry implementation
- [ ] Privacy review by external auditor (if available)

## Out of Scope

This issue will NOT include:
- ❌ Behavioral telemetry (tool usage, conversations, element access patterns)
- ❌ User content collection (personas, skills, templates, memories, any user data)
- ❌ Detailed logging beyond crash sanitization (no stack traces, no file paths)
- ❌ A/B testing infrastructure (separate concern)
- ❌ User analytics or cohort analysis (separate concern)
- ❌ Tool-specific metrics (covered by Issue #1128)
- ❌ OAuth usage metrics (covered by Issue #739)

## Success Criteria

### Functional
- [ ] Telemetry client sends install/heartbeat/crash events successfully
- [ ] All three opt-out methods work (DOLLHOUSE_TELEMETRY=false, config file, CLI)
- [ ] Events include OS type, Node version, MCP client detection, DollhouseMCP version
- [ ] Telemetry server receives and stores events correctly
- [ ] Daily heartbeat throttling works (max one per 24 hours)
- [ ] Crash events sanitize all PII automatically

### Quality
- [ ] Test coverage >95% for all telemetry code
- [ ] No PII in any logged or transmitted data (verified by automated scan)
- [ ] Zero noticeable performance impact (<10ms overhead on server startup)
- [ ] Graceful degradation if telemetry server unavailable (no errors, no delays)
- [ ] Security audit passes with no critical findings
- [ ] Load test succeeds at 10,000 events/minute

### Documentation
- [ ] README clearly explains what operational telemetry collects
- [ ] Privacy policy published at docs/privacy/TELEMETRY_PRIVACY_POLICY.md
- [ ] All opt-out methods documented with examples
- [ ] FAQ answers minimum 10 common questions
- [ ] Visual diagram shows data flow and storage
- [ ] Self-hosting guide validated by external tester

### Operational
- [ ] Telemetry server deployed and operational at telemetry.dollhousemcp.com
- [ ] Public dashboard shows aggregated stats at stats.dollhousemcp.com
- [ ] Monitoring alerts configured (uptime, error rates, performance)
- [ ] Self-hosting guide validated by at least one external user
- [ ] Open source telemetry server repository published
- [ ] 24-hour aggregation pipeline running automatically

## References

**Related Issues:**
- #1128 - Enhanced Index telemetry dashboard (internal metrics, different scope)
- #441 - Update success telemetry (feature-specific)
- #739 - OAuth usage monitoring (feature-specific)
- #348 - Token usage analytics (user-facing feature, different scope)

**Industry Examples:**
- [VS Code Telemetry](https://code.visualstudio.com/docs/getstarted/telemetry)
- [Homebrew Analytics](https://docs.brew.sh/Analytics)
- [Next.js Telemetry](https://nextjs.org/telemetry)
- [npm CLI Usage Metrics](https://docs.npmjs.com/cli/v10/using-npm/config#send-metrics)

**Design Documents:**
- `docs/investigation/TELEMETRY_BEST_PRACTICES_AND_RECOMMENDATIONS.md` (comprehensive research)

**AGPL Compliance:**
- Telemetry must be optional (works fully without it)
- Telemetry server must be open source
- Users must be able to self-host telemetry endpoint
```

---

## For AI Agents: Additional Context

**When to trigger this template:**
- User says "create issue", "write issue", "new issue", "github issue"
- User asks to document a feature request
- User wants to track enhancement work

**Template philosophy:**
- Verbosity is intentional - provides comprehensive guidance
- Repetition reinforces critical rules (no time estimates, check labels first)
- Examples are exhaustive to show best practices
- All anti-patterns are explained with rationale

**Critical rules to enforce:**
1. ALWAYS run `gh label list` first
2. NEVER use time estimates in implementation plans
3. ALWAYS specify phase dependencies explicitly
4. ALWAYS include success criteria

**This template is designed for AI consumption and usage, not human reading.** Specificity and completeness are prioritized over brevity.