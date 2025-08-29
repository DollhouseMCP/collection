# Element PR Queue Management Guide

## Overview
This guide explains how to efficiently manage the queue of automated element submission PRs.

## Current Workflow

### 1. Automated Validation & PR Creation
When an issue with the `element-submission` label is created:
- Workflow automatically validates the content
- If valid: Creates PR with all necessary labels
- If invalid: Comments on issue with problems (future enhancement)

### 2. PR Queue Dashboard

#### View All Pending Element PRs
```bash
gh pr list --label "automated-submission" --label "needs-review"
```

#### View Only Green (Ready to Merge) PRs
```bash
# Check PRs that have passed all checks
gh pr list --label "automated-submission" | while read pr; do
  pr_num=$(echo $pr | awk '{print $1}')
  if gh pr checks $pr_num | grep -q "All checks have passed"; then
    echo "✅ PR #$pr_num is ready to merge"
  fi
done
```

#### Quick Status Check
```bash
# See validation status for all element PRs
gh pr list --label "automated-submission" --json number,title,statusCheckRollup \
  | jq -r '.[] | "\(.number)\t\(.title)\t\(.statusCheckRollup[0].conclusion)"'
```

## Triggering CI Checks

Since PRs created by GitHub Actions don't automatically trigger checks, use one of these methods:

### Method 1: Empty Commit (Recommended)
```bash
gh pr checkout <PR_NUMBER>
git commit --allow-empty -m "Trigger CI checks"
git push
```

### Method 2: Manual Workflow Trigger
```bash
gh workflow run "Core Build & Test" --ref <branch-name>
```

## Batch Processing

### Process Multiple Submissions
```bash
# Re-trigger multiple issues at once
for issue in 173 174 175; do
  gh issue edit $issue --body "$(gh issue view $issue --json body -q .body) "
  sleep 5  # Avoid rate limiting
done
```

### Merge All Green PRs
```bash
# Review and merge all passing PRs
gh pr list --label "automated-submission" | while read pr; do
  pr_num=$(echo $pr | awk '{print $1}')
  if gh pr checks $pr_num | grep -q "All checks have passed"; then
    echo "Merging PR #$pr_num..."
    gh pr merge $pr_num --merge --delete-branch
  fi
done
```

## Rejection Handling

For PRs that fail validation:
1. Comment on the PR with specific issues
2. Close the PR
3. Update the original issue with feedback
4. Remove `needs-review` label

Example:
```bash
gh pr comment <PR_NUMBER> --body "Validation failed: [specific issue]"
gh pr close <PR_NUMBER>
gh issue comment <ISSUE_NUMBER> --body "Submission failed validation. Please fix: [issue]"
```

## Future Enhancements

### Planned Improvements
1. **Automatic Rejection**: Failed validations automatically close PR and notify submitter
2. **GitHub App Token**: Eliminate need for manual CI triggering
3. **Batch Approval UI**: Custom dashboard for bulk operations
4. **Auto-merge**: Automatically merge PRs that pass all checks after timeout

### Environment-Based Approval (Future)
```yaml
# In workflow file
jobs:
  validate-and-create-pr:
    environment: element-approval  # Requires manual approval
```

Then configure in GitHub Settings:
- Create "element-approval" environment
- Add required reviewers
- Set auto-merge policies

## Quick Commands Reference

```bash
# View PR queue
gh pr list --label "automated-submission"

# Check specific PR status
gh pr checks <PR_NUMBER>

# Trigger CI on PR
gh pr checkout <PR_NUMBER> && git commit --allow-empty -m "Trigger CI" && git push

# Merge PR
gh pr merge <PR_NUMBER> --merge --delete-branch

# Close failed PR
gh pr close <PR_NUMBER> --comment "Validation failed: [reason]"
```

## Best Practices

1. **Review Queue Daily**: Check for new submissions each day
2. **Batch Operations**: Process multiple PRs together for efficiency  
3. **Clear Communication**: Always comment when closing/rejecting
4. **Monitor CI**: Ensure checks are running properly
5. **Clean Up**: Delete merged branches to keep repo tidy

## Troubleshooting

### Checks Not Running
- Use empty commit method to trigger
- Verify branch protection rules aren't blocking

### Malformed Content
- Check if workflow is using `printf` not `echo`
- Ensure proper escaping of special characters

### Duplicate PRs
- Workflow uses `--force` push to handle retries
- Close older PR if duplicates exist

---

*Last Updated: August 29, 2025*