---
name: Verified Solutions Documenter
description: Test if full verified-solutions-documenter content causes failure
version: 2.1.0
created: '2025-09-11T21:11:53.114Z'
modified: '2025-09-12T21:11:53.114Z'
tags: []
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_verified-solutions-documenter_anonymous_20250911-211153
type: skill
author: DollhouseMCP
capabilities:
  - general-purpose
---
# Verified Solutions Documenter

A comprehensive documentation skill that captures working solutions with full reproducibility context, verification checklists, and failure pattern tracking.

#

# Core Capabilities

#

##

1. Solution Detection & Capture

- Success Pattern Recognition: Automatically detects when solutions work

- Immediate Documentation: Captures solutions in real-time

- Context Preservation: Records full environment state

- Command Sequencing: Preserves exact order of operations

- Output Verification: Captures proof of success

###

2. Verification Framework

- Checklist Enforcement: Ensures solutions meet reproducibility standards

- Environment Validation: Confirms portability across systems

- Prerequisite Tracking: Documents all dependencies

- Fre

sh Terminal Test: Verifies clean environment reproduction

- Cross-Platform Checks: Notes platform-specific variations

###

3. Failure Documentation

- Anti-Pattern Library: What doesnt work and why

- Error Message Index: Maps errors to solutions

- False Path Recording: Documents investigated dead ends

- Time Waste Prevention: Highlights common mistakes

- Hypothesis Tracking: What we thought vs. what was true

## Solution Verification Checklist

Before marking ANYTHING as VERIFIED WORKING:□ Can this be reproduced in a fre

sh terminal□ Does it work after a system restart□ Are ALL prerequisites documented□ Did Alex Sterling verify with actual output□ Is the solution portable to other environments□ Have we captured the exact error it solves□ Are environment variables documented□ Is the working directory specified□ Are version requirements noted□ Have we listed what DOESNT work

## Documentation Templatemarkdown

# SOLUTION: [Descriptive Problem Title]Date: [YYYY-MM-DD HH:MM:SS]Status: ✅ VERIFIED WORKINGChecklist: 10/10 items verified ✓Problem Cate

gory: [Docker/Git

Hub Auth/NPM/Testing/etc]Time Saved: [estimated hours this will save]

## Problem Statement

### Error/Issue[Exact error message or symptom]

### When This Occurs- [Scenario 1 that triggers this]- [Scenario 2 that triggers this]

## Environment Context

### System Information

- OS: [Platform and version]

- Shell: [ba

sh/z

sh/fi

sh]

- Working Directory: [pwd output]

- User: [whoami output]

### Environment VariablesGITHUB_TOKEN=[present/missing/value if safe]ANTHROPIC_API_KEY=[present/missing]DOLLHOUSE_PORTFOLIO_DIR=[path if set]NODE_ENV=[development/production]

### Tool Versionsnode --version  # [output]npm --version   # [output]docker --version # [output]git --version   # [output]

## Prerequisites

### Required Before Starting- [ ] [Tool/package] version [X.Y.Z] or higher- [ ] [Configuration file] exists at [path]- [ ] [Service] is running- [ ] [Permission/access] is granted

## Working Solution

### Step 1: [Clear Description]Purpose: [Why this step is needed]ba

sh

# Command to run[exact command with all flags]Expected Output:[What you should see if successful]If This Fails: [Trouble

shooting for this step]

### Step 2: [Clear Description][Continue pattern for all steps...]

## Verification

### Quick Test

bash

# Single command to verify solution works[verification command]Success Indicator:[Output that confirms its working]

### Complete Verification

1. Open new terminal fre

sh environment

2. Run: [command 1]

3. Verify: [what to check]

4. Run: [command 2]

5. Confirm: [final validation]

## What DOESNT Work Important

### Failed Approach 1What We Tried: [command or approach]Why It Failed: [Explanation]Error Produced: [error message]

### Failed Approach 2[Continue for all failed attempts...]

### Common Mistakes- ❌ Dont: [Common error]

- Because: [Why this fails]- ❌ Avoid: [Another mistake]

- Result: [What happens]

## Debug Journey

### Initial Hypothesis

We thought the problem was [assumption]

### Investigation Path

1. Tried [approach]

- Failed because [reason]

2. Discovered [clue]

- Led to [insight]

3. Realized [key understanding]

### Root Cause

Actual Problem: [What was really wrong]Why Missed Initially: [Why it wasnt obvious]

## Related Information

### See Also

- Session Notes: [path/to/session/notes.md]

- Git

Hub Issue: [#number if applicable]

- Similar Problems: [links to related solutions]

### Future Improvements- [ ] [Potential enhancement]- [ ] [Additional automation]

### Credits

- Discovered by: [who found it]

- Verified by: Alex Sterling

- Documented by: Solution Keeper---Reproducibility Score: 10/10 ✓Estimated Time Saved: [X hours per occurrence]Last Verified: [date of last test]

## Advanced Features

###

1. Solution Indexing System

Automatically maintains searchable index:markdown

## Solutions Index

### By Error Message

- Cannot find module → docker/2025-09-11-module-resolution.md

- Permission denied → github/2025-09-11-auth-permissions.md

### By Cate

gory

- Docker: 15 solutions

- Git

Hub Auth: 8 solutions

- NPM/Node: 12 solutions

### By Date

- Latest: [most recent solution]

- This Week: 5 new solutions

- This Month: 23 solutions

###

2. Failure Pattern Librarymarkdown

## Known Failure Patterns

### Pattern: Environment Variable Not PersistingSymptoms: Variable set but not available in subprocessCommon Cause: Shell vs environment scope

Solutions: See env/2025-09-11-variable-persistence.md

### Pattern: Docker Build Cache Issues[Continue for all patterns...]

###

3. Time Tracking Metrics

- Document time spent on each problem

- Calculate time saved by documentation

- Track reuse frequency of solutions

## Integration Protocols

### With Alex Sterling

- Receives verification: This works with evidence

- Requests proof: Show output demonstrating success

- Captures evidence: Screen

shots, logs, test results

### With Debug Detective

- Documents investigation path

- Records eliminated hypotheses

- Captures debugging methodology

### With Solution Keeper Persona

- Provides template structure

- Enforces verification checklist

- Manages solution storage

## Quality Standards

### Documentation MUST Include:
  1. Exact Commands: Copy-paste ready

2. Expected Output: What success looks like

3. Failure Cases: What doesnt work

4. Environment State: Complete context

5. Verification Steps: Proof it works

### Documentation MUST NOT:
  1. Include assumptions without verification

2. Skip failure documentation

3. Omit environment details

4. Use vague descriptions

5. Forget timestamp/versioning

## Usage Examples

### Capturing Docker Solution

# Problem: Container wont start with MCP

# After fixing...SOLUTION CAPTURED:
  - Cate

gory: Docker

- Verification: 10/10 checklist items

- Commands: 5 steps documented

- Failures: 3 approaches that dont work

- Time Saved: 2 hours per occurrence

### Documenting Git

Hub Auth Fix

# Problem: PAT not working in container

# After solving...SOLUTION DOCUMENTED:
  - Cate

gory: Git

Hub Authentication

- Environment: 4 variables captured

- Prerequisites: 3 requirements listed

- Verification: Automated test included

## File Management

### Storage Structuredocs/solutions/├── README.md index├── docker/│   ├── container-setup.md│   ├── volume-mounting.md│   └── network-issues.md├── github/│   ├── auth-pat.md│   ├── auth-oauth.md│   └── portfolio-sync.md├── npm/│   ├── module-resolution.md│   └── package-conflicts.md└── failures/    ├── DONT-DO-THIS.md    └── common-mistakes.md

### Naming Convention[cate

gory]/YYYY-MM-DD-[brief-description].md

Example: docker/2025-09-11-mcp-container-setup.md

## Success Metrics

### Effectiveness Indicators

- Reproduction Success Rate: 95%

- Time to Solution: 5 minutes using docs

- Reuse Frequency: Solutions used multiple times

- Failure Prevention: Mistakes not repeated

### Documentation Health

- All solutions pass verification checklist

- Regular validation of older solutions

- Failure library growing with patterns

- Cross-references maintained

## Continuous Improvement

### Regular Reviews

- Weekly: Validate recent solutions still work

- Monthly: Update index and patterns

- Quarterly: Archive outdated solutions

### Feedback Loop

- Track which solutions get reused most

- Identify missing documentation gaps

- Update templates based on usage

- Refine verification checklist---

## Activation ProtocolWhen activated alongside Solution Keeper persona:
  1. Provide this complete documentation framework

2. Enforce verification checklist strictly

3. Capture all context immediately

4. Never allow Ill document it later

5. Treat undocumented solutions as incomplete work

Remember: A solution without documentation is just tomorrows problem.
