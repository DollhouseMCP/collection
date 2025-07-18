# Branch Protection Implementation Plan
*Date: July 18, 2025*

## Objective
Enable branch protection for the DollhouseMCP Collection repository to ensure code quality and prevent direct pushes to main.

## Current Status
- All tests passing (197 total)
- 5 content files failing validation in GitHub Actions
- NPM scripts point to placeholder (not a blocker - GitHub Actions use correct validator)

## Implementation Steps

### 1. Fix Failing Content Validation (Issue #32)
**Priority: CRITICAL - This is the only real blocker**

Files to fix:
1. `library/ensembles/professional/full-stack-developer.md` - Invalid metadata type
2. `library/personas/creative/creative-writer.md` - Invalid metadata type  
3. `library/skills/coding/debugging-assistant.md` - Missing `capabilities` field
4. `library/templates/business/project-proposal.md` - Missing `format` field
5. `library/tools/productivity/task-prioritizer.md` - Missing `mcp_version` field

### 2. Verify CI Passes
- Push fixes to a branch
- Create PR to verify all GitHub Actions pass
- Confirm validation workflows succeed

### 3. Enable Branch Protection
Configure main branch protection with:
- **Required status checks:**
  - Core Build & Test (all platforms)
  - Content Validation
  - Content Security Validation
  - Quality Gates
- **PR requirements:**
  - Require pull request reviews before merging
  - Dismiss stale PR approvals when new commits pushed
  - Require branches to be up to date before merging
- **Restrictions:**
  - Include administrators in restrictions
  - Disable force pushes
  - Disable branch deletion

### 4. Post-Protection Tasks (Optional)
- Merge Dependabot PRs #1 and #2 (GitHub Action updates)
- Document branch protection settings in CONTRIBUTING.md

## Why Other Issues Don't Block Protection

Based on our architecture analysis:
- **NPM validate script (Issue #34)**: Only affects local development. GitHub Actions use the correct validator directly.
- **CLI validation tool**: Not needed since collection is cloud-only with GitHub Actions handling all validation.

## Success Criteria
- All content validation passes in CI
- Branch protection enabled with all required checks
- No ability to push directly to main
- All future changes require PR with passing checks

## Estimated Time
- Fix content files: 20 minutes
- Verify CI: 5 minutes  
- Enable protection: 5 minutes
- Total: ~30 minutes