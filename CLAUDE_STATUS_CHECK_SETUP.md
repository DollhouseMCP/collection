# Claude Review Status Check Setup

## Quick Summary
Transform Claude reviews from advisory to blocking by making the workflow fail when critical issues are found. Also enables manual triggering for community PRs.

## What We Implemented
1. **Status Check Blocking**: Claude can fail the workflow when issues found
2. **Manual Trigger**: Comment `@claude review` to review community PRs
3. **Branch Protection Ready**: Works with 0 required reviewers

## Step 1: Modify the Workflow

In `.github/workflows/claude-review.yml`, after line 162 where it logs the review result, add:

```yaml
# Exit with error if changes are requested
- name: Check Review Result
  if: steps.claude-review.outcome == 'success'
  uses: actions/github-script@v7
  with:
    script: |
      // This runs after the PR Review creation attempt
      // Check if we determined changes were needed
      const reviewData = ${{ toJSON(steps.create-pr-review.outputs) }};
      if (reviewData && reviewData.reviewEvent === 'REQUEST_CHANGES') {
        core.setFailed('❌ Claude has requested changes. Please address the issues before merging.');
      }
```

OR simpler approach - in the Create PR Review step script, after determining reviewEvent:

```javascript
// Add this after line 162 (console.log)
if (reviewEvent === 'REQUEST_CHANGES') {
  // Set the workflow as failed
  core.setFailed('Claude has requested changes. Please address the issues before merging.');
}
```

## Step 2: Configure Branch Protection

1. Go to **Settings → Branches**
2. Click **Add rule** (or edit existing)
3. **Branch name pattern**: `main`
4. Configure as follows:

### ✅ ENABLE These Settings:

**Require a pull request before merging**
- [ ] Require approvals: **0** (or leave unchecked)
- [x] Dismiss stale pull request approvals when new commits are pushed
- [ ] Require review from CODEOWNERS (optional)

**Require status checks to pass before merging**
- [x] Require branches to be up to date before merging
- **Status checks that are required**: 
  - `claude-review` (from claude-review.yml workflow)
  - Any other CI checks you want (tests, build, etc.)

**Require conversation resolution before merging** (optional but recommended)

### ❌ DISABLE These Settings:

- [ ] **Include administrators** - UNCHECK this to allow admin override
- [ ] Restrict who can push to matching branches (unless you want this)
- [ ] Allow force pushes
- [ ] Allow deletions

## Step 3: How It Works

1. **Create PR** → Claude reviews automatically
2. **Claude finds issues** → workflow fails ❌ → merge blocked
3. **Claude approves** → workflow passes ✅ → can merge
4. **Need override?** → Admin can force merge (since "Include administrators" is unchecked)

## Step 4: Testing

1. Create a test PR with obvious issues (e.g., add "TODO: fix security vulnerability")
2. Claude should flag it and the check should fail
3. Fix the issues and push
4. Claude should approve and check should pass

## Key Implementation Detail

The critical code to add to `.github/workflows/claude-review.yml`:

```javascript
// In the Create PR Review step, after determining reviewEvent (around line 162)
if (reviewEvent === 'REQUEST_CHANGES') {
  core.setFailed('Claude has requested changes. Please address the issues before merging.');
}
```

This uses GitHub Actions' `core.setFailed()` to mark the workflow as failed, which makes the status check fail and blocks merging.

## Manual Review Trigger

For community PRs that don't auto-trigger Claude:

1. **Comment Method**: Type `@claude review` in the PR
2. **Actions Method**: Actions → Claude Review → Run workflow → Enter PR #

## Community PR Workflow

1. Community creates PR
2. Required checks pending (blocking merge)
3. You review content manually
4. Comment `@claude review` to trigger Claude
5. If Claude ✅ and you approve → merge
6. If Claude ❌ → request changes

## Important Notes

- This was implemented in PR #80 (skills PR) but applies repo-wide
- Created two workflows:
  - `claude-review.yml` - Auto-runs for authorized users, fails on issues
  - `claude-review-manual.yml` - Triggered by `@claude review` comment
- Branch protection needs `claude-review` as required status check

## Troubleshooting

- If Claude is too strict, adjust the blocking keywords in the workflow
- If you need to merge anyway, use admin privileges
- Check workflow logs to see why Claude blocked a PR
- Community PRs need manual trigger to run Claude