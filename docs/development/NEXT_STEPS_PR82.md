# Next Steps: PR #82 (Agents/Memories)

**Created**: July 25, 2025, 3:45 PM
**Priority**: HIGH - This is the next PR to process

## Quick Start Commands

```bash
# 1. Switch to main and pull latest
git checkout main
git pull origin main

# 2. Checkout PR #82 branch
git checkout feat/add-agents-memories-v1.3.0

# 3. Merge latest main (to get all the fixes)
git merge origin/main
```

## Expected Issues to Fix

Based on PR #81 experience, expect these issues:

### 1. Metadata Field Names
- Change all `created:` to `created_date:`
- Files will likely have: `created: '2025-07-XX'`
- Should be: `created_date: '2025-07-XX'`

### 2. Author Capitalization
- Change all `author: DollhouseMCP` to `author: dollhousemcp`
- Check unique_ids for any uppercase "DollhouseMCP" and change to lowercase

### 3. Directory Structure
- Move all files from subdirectories like:
  - `library/agents/creative/*.md` → `library/agents/*.md`
  - `library/agents/professional/*.md` → `library/agents/*.md`
  - `library/memories/personal/*.md` → `library/memories/*.md`
  - etc.
- Delete empty category directories

### 4. Validation Requirements
- **Agents** must have `capabilities` array
- **Memories** have no additional required fields beyond base
- All must have: name, description, type, unique_id, author, created_date

## Quick Fix Script

```bash
# Fix created to created_date in all files
cd library/agents && for file in *.md; do sed -i '' 's/^created:/created_date:/' "$file"; done
cd ../memories && for file in *.md; do sed -i '' 's/^created:/created_date:/' "$file"; done

# Fix author capitalization (if needed)
cd library/agents && for file in *.md; do sed -i '' 's/author: DollhouseMCP/author: dollhousemcp/' "$file"; done
cd ../memories && for file in *.md; do sed -i '' 's/author: DollhouseMCP/author: dollhousemcp/' "$file"; done
```

## Validation Before Commit

```bash
# Validate agents
node dist/src/cli/validate-content.js library/agents/*.md

# Validate memories
node dist/src/cli/validate-content.js library/memories/*.md

# If all pass, commit and push
git add library/agents library/memories
git commit -m "fix: Apply flat structure and metadata fixes to agents/memories"
git push origin feat/add-agents-memories-v1.3.0
```

## What to Watch For

1. **Hidden characters in unique_ids** - Use `grep unique_id: file.md | od -c` to check
2. **Line length warnings** - Low severity, can usually ignore
3. **Missing capabilities in agents** - High severity, must fix
4. **Case sensitivity** - All unique_ids must be lowercase only

## Success Criteria

- [ ] All agent files in `library/agents/` (no subdirectories)
- [ ] All memory files in `library/memories/` (no subdirectories)
- [ ] All files have `created_date` not `created`
- [ ] All files have lowercase `dollhousemcp` in metadata
- [ ] All files pass validation locally
- [ ] CI validation passes after push
- [ ] PR ready to merge

## After PR #82

Next will be PR #83 (Ensembles) - the final PR in the v1.3.0 rollout!