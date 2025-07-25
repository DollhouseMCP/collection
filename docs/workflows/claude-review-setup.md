# Claude Review Status Check Setup

## Quick Summary
Transform Claude reviews from advisory to blocking by making the workflow fail when critical issues are found. Also enables manual triggering for community PRs.

## What We Implemented
1. **Status Check Blocking**: Claude can fail the workflow when issues found
2. **Manual Trigger**: Comment `@claude review` to review community PRs
3. **Branch Protection Ready**: Works with 0 required reviewers

## How It Works

### Automatic Reviews (Your PRs)
1. You create a PR
2. Claude automatically reviews (if you're in authorized users list)
3. If Claude finds critical issues → workflow fails ❌ → merge blocked
4. If Claude approves → workflow passes ✅ → can merge

### Manual Reviews (Community PRs)
1. Community member creates PR
2. Claude doesn't auto-run (saves API costs)
3. You review content and comment `@claude review`
4. Claude runs and provides feedback
5. You decide to merge or request changes

## Implementation Details

### Files Modified
1. `.github/workflows/claude-review.yml` - Added failure logic
2. `.github/workflows/claude-review-manual.yml` - Added manual trigger

### Key Code Added
```javascript
// In claude-review.yml - fails workflow if changes needed
if (reviewEvent === 'REQUEST_CHANGES') {
  core.setFailed('❌ Claude has requested changes. Please address the issues identified in the review above before merging.');
}
```

## Branch Protection Configuration

Go to **Settings → Branches → Add rule**:

```yaml
Branch name pattern: main

✅ Require a pull request before merging
  - Require approvals: 0
  - ✅ Dismiss stale pull request approvals
  
✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date
  - Required status checks:
    - claude-review
    
❌ Include administrators (unchecked = allows override)
```

## Manual Review Trigger

Two ways to trigger Claude on any PR:

1. **Comment Method**: Type `@claude review` in the PR
   - You'll get a 🚀 reaction when it starts
   - Results appear as a new comment

2. **Actions Method**: 
   - Go to Actions tab
   - Select "Claude Review" workflow
   - Click "Run workflow"
   - Enter PR number

## Community PR Workflow

1. Community creates PR
2. Required checks pending (blocking merge)
3. You review content manually first
4. If it looks good, comment `@claude review`
5. Claude runs and updates status check
6. Based on Claude + your review:
   - Both good → merge
   - Issues found → request changes
   - False positive → admin override

## Keyword Detection

Claude will fail the workflow if it detects:
- Critical security issues
- Dangerous patterns
- Must-fix problems
- Errors or failures (excluding benign uses like "error handling")

## Troubleshooting

### Claude is too strict
- Adjust blocking keywords in the workflow
- Look for patterns like `/\b(critical|dangerous|must[\s-]fix)\b/`

### Need to merge anyway
- Use admin privileges (since "Include administrators" is unchecked)
- Shows as "Administrator merged this pull request"

### Community PR not running Claude
- Make sure to comment `@claude review`
- Check you're logged in as an authorized user
- Verify the PR is still open

### Status check not updating
- Check Actions tab for workflow runs
- Look for errors in the workflow logs
- Ensure ANTHROPIC_API_KEY secret is set

## Important Notes

- Only authorized users can trigger manual reviews
- Claude's decision is based on keyword analysis of its own review
- The fallback comment still works if PR creation fails
- Community PRs always require manual trigger to save API costs