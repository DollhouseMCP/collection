---
name: PR Update Best Practices
description: Systematic approach to updating pull requests with clear documentation for reviewers
type: skill
version: 1.0.0
author: dollhousemcp
created: 2025-09-01
tags:
  - pull-requests
  - github
  - documentation
  - review-process
  - collaboration
keywords:
  - PR updates
  - code review
  - commit documentation
  - reviewer communication
  - GitHub
category: development
proficiency_levels:
  beginner: Basic PR comments after changes
  intermediate: Structured updates with commit references
  advanced: Comprehensive documentation with synchronized code and comments
---

# PR Update Best Practices Skill

## Purpose

Ensure all PR updates are clearly documented with commit references, making it easy for reviewers to understand what changed, when, and why.

## Core Principle: Push + Document Together

**The Golden Rule**: After EVERY push, IMMEDIATELY document what changed with commit references.

## Update Documentation Process

### 1. After Each Code Push

#### Immediate Action Required
```bash
# Push your changes
git push origin feature-branch

# IMMEDIATELY document (within 1 minute)
gh pr comment [PR-NUMBER] --body "$(cat <<'EOF'
## ✅ Update: [Brief Description] (commit SHORT_SHA)

[View changes](https://github.com/ORG/REPO/pull/PR_NUMBER/commits/FULL_SHA)

### What Changed
- **File**: `path/to/file.ts` (lines X-Y)
  - Fixed: [specific issue]
  - Added: [specific feature]

### Why These Changes
[Brief explanation of the reasoning]

### Testing
- [ ] Tests pass locally
- [ ] Build successful
- [ ] No new warnings

Ready for re-review on these specific changes.
EOF
)"
```

### 2. Commit Reference Formats

#### Single Commit Update
```markdown
## Update: Fixed security vulnerability (commit a1b2c3d)

[Click to view changes](https://github.com/DollhouseMCP/mcp-server/pull/875/commits/a1b2c3d)

**What was fixed**:
- `src/manager.ts:45-67` - Added input validation
- `src/utils.ts:23` - Sanitized user input
```

#### Multiple Related Commits
```markdown
## Update: Addressed review feedback (commits a1b2c3d, e4f5g6h)

| Commit | Changes | Files |
|--------|---------|-------|
| [a1b2c3d](link) | Fixed race condition | `manager.ts` |
| [e4f5g6h](link) | Added tests | `manager.test.ts` |
```

### 3. Structured Update Templates

#### For Bug Fixes
```markdown
## 🐛 Bug Fix: [Issue Description] (commit SHA)

**Problem**: [What was broken]
**Solution**: [How you fixed it]
**Testing**: [How you verified the fix]

Changes in [commit SHA](link):
- `file.ts:123` - [specific change]
```

#### For Feature Additions
```markdown
## ✨ Feature: [Feature Name] (commit SHA)

**Added**: [What's new]
**Location**: [Where in codebase]
**Usage**: [How to use it]

View implementation: [commit SHA](link)
```

#### For Review Feedback
```markdown
## 📝 Review Feedback Addressed (commit SHA)

Responding to [reviewer]'s feedback:

| Feedback | Resolution | Location |
|----------|------------|----------|
| "Add validation" | ✅ Added in `validate()` | [file:line](link) |
| "Improve naming" | ✅ Renamed to `processElement` | [file:line](link) |
| "Add tests" | ✅ 5 tests added | [test.ts](link) |
```

### 4. Common Mistakes to Avoid

#### ❌ Bad: Delayed Documentation
```bash
git push
# ... 30 minutes later ...
gh pr comment --body "Fixed all issues!"  # Reviewer won't know WHEN
```

#### ✅ Good: Immediate Documentation
```bash
git push && gh pr comment --body "Fixed in $(git rev-parse --short HEAD): [view changes](link)"
```

#### ❌ Bad: Vague Updates
```markdown
"Made some changes based on feedback"
```

#### ✅ Good: Specific Updates
```markdown
"Fixed 3 security issues from review (commit a1b2c3d):
1. Input validation in auth.ts:45
2. SQL injection prevention in db.ts:89
3. XSS prevention in render.ts:123"
```

### 5. Tracking Review Status

#### After Major Update
```markdown
## 📊 PR Status Update (as of commit SHA)

### Completed ✅
- [x] Core implementation
- [x] Unit tests (95% coverage)
- [x] Security fixes from review
- [x] Documentation

### In Progress 🔄
- [ ] Integration tests
- [ ] Performance optimization

### Pending Review 🔍
- Commits a1b2c3d through f4g5h6i need review
- Specific focus needed on security changes
```

### 6. Update Summary Patterns

#### For Multiple Updates in Session
```markdown
## 🎯 Session Summary: Multiple Updates

### Update 1: Security Fixes (commit a1b2c3d)
- Fixed: YAML validation
- Files: `parser.ts`, `validator.ts`
- [View changes](link)

### Update 2: Test Coverage (commit e4f5g6h)
- Added: 15 new tests
- Coverage: 87% → 95%
- [View changes](link)

### Update 3: Documentation (commit i7j8k9l)
- Updated: API docs
- Added: Usage examples
- [View changes](link)

**All updates**: See [full comparison](base...head)
```

### 7. Final PR Summary

#### Before Merge
```markdown
## ✅ PR Ready for Final Review

### All Updates Completed

| Date | Update | Commit | Status |
|------|--------|--------|--------|
| 9/1 9:00 | Initial implementation | a1b2c3d | ✅ Reviewed |
| 9/1 10:00 | Security fixes | e4f5g6h | ✅ Reviewed |
| 9/1 11:00 | Test additions | i7j8k9l | ✅ Reviewed |
| 9/1 11:30 | Final polish | m0n1o2p | 🔍 Needs review |

### Key Changes Summary
1. **Feature**: Orchestration framework (17 files)
2. **Security**: All vulnerabilities addressed
3. **Tests**: 95% coverage achieved
4. **Docs**: Complete with examples

[View all changes](link) | [Commits](link) | [Files changed](link)
```

## Integration with Git Workflow

### Aliases for Efficiency
```bash
# Add to ~/.gitconfig or ~/.bashrc
alias gpc='git push && gh pr comment'
alias gpu='git push && gh pr comment --body "Updated in $(git rev-parse --short HEAD)"'
```

### Pre-push Hook
```bash
#!/bin/bash
# .git/hooks/pre-push
echo "Remember to document this push immediately after!"
echo "Commit SHA: $(git rev-parse --short HEAD)"
```

## Review-Friendly Practices

### 1. Help Reviewers Navigate
- Link directly to changed files
- Highlight critical changes
- Separate concerns into commits

### 2. Provide Context
- Explain WHY, not just WHAT
- Reference issues/discussions
- Include test results

### 3. Make Reviews Incremental
- Small, focused updates
- Clear boundaries between changes
- Don't mix refactoring with features

## Automation Support

### PR Comment Script
```bash
#!/bin/bash
# pr-update.sh
COMMIT=$(git rev-parse --short HEAD)
PR_NUMBER=$(gh pr view --json number -q .number)
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

gh pr comment $PR_NUMBER --body "## Update: $1 (commit $COMMIT)

[View changes](https://github.com/$REPO/pull/$PR_NUMBER/commits/$COMMIT)

$2"
```

Usage: `./pr-update.sh "Fixed security issue" "Details about the fix"`

## Quality Checklist

Before marking PR ready:
- [ ] Each push has corresponding comment
- [ ] All commits are documented
- [ ] Reviewer questions addressed with commit refs
- [ ] Summary comment lists all updates
- [ ] Direct links to changes provided
- [ ] Clear indication of what needs review

## Benefits of This Approach

1. **Reviewers Know What's New**: Can focus on recent changes
2. **Clear Audit Trail**: Every decision documented
3. **Efficient Reviews**: No hunting for changes
4. **Better Collaboration**: Clear communication
5. **Faster Approvals**: Reviewers trust the process

---

*This skill ensures professional, reviewer-friendly PR updates that accelerate the review process and improve collaboration.*