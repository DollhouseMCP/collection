# Element Submission Workflow Setup

## Overview
The element submission workflow automatically processes element submissions from GitHub issues and creates pull requests directly to the main branch for immediate availability.

## Required Repository Settings

### Enable GitHub Actions PR Creation
**IMPORTANT**: GitHub Actions must be explicitly allowed to create pull requests.

1. Go to Repository **Settings** > **Actions** > **General**
2. Under **Workflow permissions**:
   - Select "Read and write permissions"
   - ✅ Check "Allow GitHub Actions to create and approve pull requests"
3. Save changes

Without this setting, you'll see:
```
Error: GitHub Actions is not permitted to create or approve pull requests (createPullRequest)
```

### Required Labels
The workflow requires these labels to exist:
- `element-submission` - Identifies element submission issues
- `automated-submission` - Marks automated PRs
- `needs-review` - Indicates PR needs review
- `persona` - For persona elements
- `template` - For template elements
- `prompt` - For prompt elements
- `workflow` - For workflow elements

Create them with:
```bash
gh label create "element-submission" --description "Element submission issue" --color "ededed"
gh label create "automated-submission" --description "Automatically submitted via workflow" --color "b60205"
gh label create "needs-review" --description "Needs review from maintainers" --color "fbca04"
gh label create "persona" --description "Persona element" --color "ededed"
gh label create "template" --description "Template element" --color "ededed"
gh label create "prompt" --description "Prompt element" --color "ededed"
gh label create "workflow" --description "Workflow element" --color "ededed"
```

## Element Submission GitFlow

Unlike regular development which follows: `feature -> develop -> main`

Element submissions follow a simplified flow:
```
Issue (with element-submission label)
  ↓
Automated validation & PR creation
  ↓
PR directly to main branch
  ↓
Manual review & merge
  ↓
Immediate availability in collection
```

### Why Direct to Main?
1. **Content-only**: Elements are data files, not executable code
2. **Pre-validated**: Automated validation ensures safety
3. **Immediate availability**: Users need access to new elements quickly
4. **No system impact**: Elements don't affect the collection system itself

### Security Considerations
- Elements are validated for security patterns before PR creation
- No executable code is run from element submissions
- Manual review required before merge
- Content-only changes minimize risk

## Workflow Features

### Auto-Generated unique_id
If an element submission is missing a `unique_id`, the workflow automatically generates one:
```
{type}_{safeName}_{author}_{YYYYMMDD}-{HHMMSS}
```

Example:
```
persona_creative-writer_anon-user_20250829-143025
```

### Force Push for Retries
The workflow uses `--force` when pushing branches to handle retry scenarios where a branch already exists from a failed attempt.

### Direct to Main
PRs are created with `--base main` to bypass the develop branch for immediate availability.

## Testing the Workflow

1. Create an issue with element submission format
2. Add `element-submission` label
3. Workflow triggers automatically
4. Check Actions tab for progress
5. Review created PR

## Troubleshooting

### "GitHub Actions is not permitted to create or approve pull requests"
- Enable the setting in Repository Settings (see above)
- If in an organization, may need to enable at org level first

### "Label not found" errors
- Create missing labels using commands above

### "Branch already exists" errors
- Workflow now uses force push to handle this
- Can manually delete branch: `git push origin --delete branch-name`

### Workflow not triggering
- Ensure issue has `element-submission` label
- Check issue body follows correct YAML format

## Re-triggering Failed Submissions

To re-trigger a failed submission:
```bash
# Edit the issue to trigger workflow
gh issue edit <number> --body "$(gh issue view <number> --json body -q .body) "
```

For batch re-triggering:
```bash
for issue in 172 173 174 175; do
  gh issue edit $issue --body "$(gh issue view $issue --json body -q .body) "
  sleep 5  # Avoid rate limiting
done
```