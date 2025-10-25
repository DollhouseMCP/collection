# Quick Start - Fix Portfolio Metadata

## TL;DR - Fix Everything Now

```bash
cd /Users/mick/Developer/Organizations/DollhouseMCP/active/collection

# 1. Preview what will be fixed
node fix-portfolio-metadata.mjs --dry-run

# 2. Apply ALL fixes with backup
node fix-portfolio-metadata.mjs --backup

# 3. Verify success (should show 0 issues)
node fix-portfolio-metadata.mjs --dry-run
```

## What This Fixes

- ❌ **225 files** with plural types (agents→agent, skills→skill)
- ❌ **190 files** with invalid unique_ids (uppercase, colons, missing)
- ❌ **119 files** missing capabilities arrays (skills/agents)
- ❌ **114 files** with missing/anonymous authors
- ❌ **86 files** with wrong version format (1.0→1.0.0)
- ❌ **53 files** missing template format/category

## Current Status

- **Total files**: 261
- **Need fixing**: 257 (98.5%)
- **Already valid**: 4 (1.5%)

## Safe Testing Workflow

### Step 1: Test on Agents (Smallest Group - 34 files)

```bash
# Preview agents only
node fix-portfolio-metadata.mjs --dry-run --type agents

# Apply with backup
node fix-portfolio-metadata.mjs --backup --type agents

# Check one file manually
cat ~/.dollhouse/portfolio/agents/sonar-sweep-agent.md | head -20
```

### Step 2: If Step 1 Looks Good, Apply to All

```bash
# Apply to everything with backup
node fix-portfolio-metadata.mjs --backup
```

### Step 3: Verify Success

```bash
# Should show: Files fixed: 0, Files skipped: 261
node fix-portfolio-metadata.mjs --dry-run
```

### Step 4: Clean Up Backups (Optional)

```bash
# After verifying everything works
find ~/.dollhouse/portfolio -name "*.backup.md" -delete
```

## If Something Goes Wrong

### Restore from Backup

```bash
# Restore all files
find ~/.dollhouse/portfolio -name "*.backup.md" -exec sh -c 'mv "$1" "${1%.backup.md}.md"' _ {} \;
```

### Restore One File

```bash
mv ~/.dollhouse/portfolio/agents/sonar-sweep-agent.md.backup \
   ~/.dollhouse/portfolio/agents/sonar-sweep-agent.md
```

## Example Before/After

### Agent File (sonar-sweep-agent.md)

**Before** (4 issues):
```yaml
---
author: anonymous
type: agents
version: 1.0.2
---
```

**After** (all valid):
```yaml
---
author: DollhouseMCP
capabilities:
  - autonomous-task-execution
type: agent
unique_id: agent_sonar-sweep-agent_dollhousemcp_20250928-163434
version: 1.0.2
---
```

### Template File (business-letter.md)

**Before** (5 issues):
```yaml
---
category: general
output_format: markdown
---
```

**After** (all valid):
```yaml
---
author: DollhouseMCP
category: professional
format: markdown
type: template
unique_id: template_business-letter_dollhousemcp_20251024-000000
version: 1.0.0
---
```

### Persona File (alex-sterling.md)

**Before** (2 issues):
```yaml
---
version: 2.2
---
```

**After** (all valid):
```yaml
---
type: persona
version: 2.2.0
---
```

## Common Questions

### Q: Will this overwrite my files?
**A**: Only if you run without `--dry-run`. Always preview first! Use `--backup` to be extra safe.

### Q: What if I have valid unique_ids already?
**A**: The script preserves existing valid unique_ids. It only fixes invalid ones.

### Q: Can I undo the changes?
**A**: Yes! Use `--backup` flag and restore from `.backup.md` files if needed.

### Q: Will this break my portfolio?
**A**: No! The script makes your portfolio MORE compliant with collection schema. Files will work better, not worse.

### Q: What about my custom metadata?
**A**: The script only adds/fixes required fields. All your custom fields are preserved.

## Detailed Documentation

- **Full README**: `FIX-PORTFOLIO-METADATA-README.md`
- **Detailed Summary**: `FIX-PORTFOLIO-SUMMARY.md`
- **Script Location**: `fix-portfolio-metadata.mjs`

## Ready to Fix?

```bash
# Go to collection directory
cd /Users/mick/Developer/Organizations/DollhouseMCP/active/collection

# Run with backup (safest option)
node fix-portfolio-metadata.mjs --backup
```

That's it! Your portfolio will be fully compliant with the collection schema.
