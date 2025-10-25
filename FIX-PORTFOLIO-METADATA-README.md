# Portfolio Metadata Fixer - README

## Overview

This script fixes metadata validation issues in DollhouseMCP portfolio files to match the collection schema requirements.

## Script Location

```
/Users/mick/Developer/Organizations/DollhouseMCP/active/collection/fix-portfolio-metadata.mjs
```

## What It Fixes

### 1. **unique_id** - Converts to lowercase format
- **Issue**: Contains uppercase letters, colons, or special characters
- **Fix**: Converts to `{type}_{name}_{author}_{YYYYMMDD-HHMMSS}` format
- **Example**:
  - Before: `verbose-victorian-scholar_20250827-102340_anon-calm-tiger-gjse` (invalid due to uppercase)
  - After: `persona_verbose-victorian-scholar_mickdarling_20250827-102340`

### 2. **version** - Ensures semantic versioning
- **Issue**: Missing or invalid format (e.g., `1.0` instead of `1.0.0`)
- **Fix**: Converts to proper semantic versioning `X.Y.Z`
- **Example**:
  - Before: `1.0` or missing
  - After: `1.0.0`

### 3. **type** - Converts plural to singular
- **Issue**: Uses plural form (e.g., `agents`, `skills`, `personas`)
- **Fix**: Converts to singular form required by collection schema
- **Example**:
  - Before: `agents`
  - After: `agent`

### 4. **author** - Adds missing author
- **Issue**: Missing or set to "anonymous"
- **Fix**: Sets to "DollhouseMCP" as default
- **Example**:
  - Before: `anonymous` or undefined
  - After: `DollhouseMCP`

### 5. **capabilities** - Adds to skills and agents
- **Issue**: Skills and agents missing required `capabilities` array
- **Fix**: Adds default capabilities array
- **Example**:
  - Skills: `["general-purpose"]`
  - Agents: `["autonomous-task-execution"]`

### 6. **format** - Adds to templates
- **Issue**: Templates missing required `format` field
- **Fix**: Sets to "markdown"
- **Example**:
  - Before: undefined
  - After: `markdown`

### 7. **category** - Fixes template category
- **Issue**: Templates with invalid category or using "general"
- **Fix**: Sets to valid category (defaults to "professional")
- **Valid categories**: creative, educational, gaming, personal, professional
- **Example**:
  - Before: `general` (invalid)
  - After: `professional`

## Usage

### Dry Run (Preview Changes)

```bash
# Preview all fixes without making changes
node fix-portfolio-metadata.mjs --dry-run

# Preview fixes for specific type only
node fix-portfolio-metadata.mjs --dry-run --type agents
node fix-portfolio-metadata.mjs --dry-run --type skills
node fix-portfolio-metadata.mjs --dry-run --type templates
node fix-portfolio-metadata.mjs --dry-run --type personas
```

### Apply Fixes

```bash
# Apply fixes WITHOUT backup
node fix-portfolio-metadata.mjs

# Apply fixes WITH backup (creates .backup files)
node fix-portfolio-metadata.mjs --backup

# Apply fixes to specific type only
node fix-portfolio-metadata.mjs --type agents --backup
```

### Options

- `--dry-run` - Preview changes without modifying files
- `--backup` - Create `.backup` files before modifying
- `--type <type>` - Process only specific type (agents, skills, templates, personas, etc.)

## Current Portfolio Status (Dry-Run Results)

### Overall Summary
- **Total files**: 261
- **Files needing fixes**: 257 (98.5%)
- **Already valid**: 4 (1.5%)
- **Errors**: 0

### Files Already Valid ✓
1. `agents/academic-researcher.md`
2. `agents/roundtrip-test-agent.md`
3. `skills/safe-roundtrip-tester.md`
4. `templates/project-proposal.md`

### Issues Breakdown by Type

| Issue Type | Count | Description |
|------------|-------|-------------|
| type (plural→singular) | 225 | Convert agents→agent, skills→skill, etc. |
| unique_id | 190 | Fix format, remove uppercase/special chars |
| capabilities | 119 | Add missing capabilities to skills/agents |
| author | 114 | Add missing or replace "anonymous" |
| version | 86 | Fix to semantic versioning (X.Y.Z) |
| format | 53 | Add format field to templates |
| category | 53 | Fix template category to valid value |

### By Content Type

#### Agents (34 files)
- **Needs fixes**: 32
- **Already valid**: 2
- **Common issues**:
  - unique_id format: 32
  - type (plural): 29
  - capabilities missing: 32
  - author missing: 27
  - version: 4

#### Skills (88 files)
- **Needs fixes**: 87
- **Already valid**: 1
- **Common issues**:
  - unique_id format: 87
  - type (plural): 77
  - capabilities missing: 87
  - author missing: 45
  - version: 7

#### Templates (56 files)
- **Needs fixes**: 55
- **Already valid**: 1
- **Common issues**:
  - unique_id format: 52
  - type (plural): 43
  - author missing: 41
  - format missing: 53
  - category invalid: 53

#### Personas (75 files)
- **Needs fixes**: 75
- **Already valid**: 0
- **Common issues**:
  - type (plural): 75
  - version format: 72
  - unique_id format: 9

## Example Fix Output

### Before Fix
```yaml
---
author: anonymous
created: 2025-09-28T16:34:34.034Z
description: Autonomous agent that systematically fixes SonarCloud issues
name: sonar-sweep-agent
type: agents
version: 1.0.2
---
```

### After Fix
```yaml
---
author: DollhouseMCP
capabilities:
  - autonomous-task-execution
created: 2025-09-28T16:34:34.034Z
description: Autonomous agent that systematically fixes SonarCloud issues
name: sonar-sweep-agent
type: agent
unique_id: agent_sonar-sweep-agent_dollhousemcp_20250928-163434
version: 1.0.2
---
```

## Safety Features

1. **Non-destructive Dry Run**: Always preview changes first
2. **Backup Option**: Creates `.backup` files before modification
3. **Validation**: Checks file exists and is readable
4. **Error Handling**: Catches and reports errors without stopping
5. **Preserves Existing**: Won't overwrite already-valid unique_ids
6. **Timestamp Preservation**: Extracts timestamps from existing IDs when possible

## Recommended Workflow

1. **First, run dry-run to preview all changes**:
   ```bash
   node fix-portfolio-metadata.mjs --dry-run
   ```

2. **Review the output carefully**

3. **Test on one type first with backup**:
   ```bash
   node fix-portfolio-metadata.mjs --type agents --backup
   ```

4. **Verify the changes look correct**

5. **Apply to all files with backup**:
   ```bash
   node fix-portfolio-metadata.mjs --backup
   ```

6. **Clean up backup files after verification**:
   ```bash
   find ~/.dollhouse/portfolio -name "*.backup.md" -delete
   ```

## Requirements

- Node.js (already installed)
- gray-matter npm package (already installed in collection repo)
- Portfolio at `~/.dollhouse/portfolio/`

## Collection Schema Requirements

The script ensures compliance with these collection schema rules:

1. **unique_id**: `/^[a-z0-9-_]+$/` (lowercase, numbers, hyphens, underscores only)
2. **version**: `/^\d+\.\d+\.\d+$/` (semantic versioning)
3. **type**: Must be singular: persona, skill, agent, prompt, template, tool, ensemble, memory
4. **author**: Required string field
5. **Type-specific requirements**:
   - Skills: `capabilities` array required
   - Agents: `capabilities` array required
   - Templates: `format` string and valid `category` required

## Troubleshooting

### Script won't run
```bash
# Make sure you're in the collection directory
cd /Users/mick/Developer/Organizations/DollhouseMCP/active/collection

# Verify gray-matter is installed
npm list gray-matter

# If missing, install it
npm install
```

### Permission errors
```bash
# Make script executable
chmod +x fix-portfolio-metadata.mjs
```

### Want to restore from backup
```bash
# Restore all files from backup
find ~/.dollhouse/portfolio -name "*.backup.md" -exec sh -c 'mv "$1" "${1%.backup.md}.md"' _ {} \;
```

## Next Steps After Running

1. **Verify fixes worked**: Run dry-run again to confirm all issues resolved
2. **Test portfolio**: Use DollhouseMCP tools to load and test elements
3. **Submit to collection**: Fixed elements can now pass collection validation
4. **Clean up backups**: Remove `.backup.md` files once verified

## Contact

For issues or questions about this script, refer to the DollhouseMCP collection repository documentation.
