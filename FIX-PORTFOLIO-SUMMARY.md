# Portfolio Metadata Fixer - Dry-Run Results Summary

**Date**: October 25, 2025
**Script**: `/Users/mick/Developer/Organizations/DollhouseMCP/active/collection/fix-portfolio-metadata.mjs`

## Quick Stats

- **Total Files Scanned**: 261
- **Files Requiring Fixes**: 257 (98.5%)
- **Already Valid**: 4 (1.5%)
- **Errors Encountered**: 0

## Files Already Valid ✓

These 4 files pass all validation requirements:

1. ✓ `agents/academic-researcher.md`
2. ✓ `agents/roundtrip-test-agent.md`
3. ✓ `skills/safe-roundtrip-tester.md`
4. ✓ `templates/project-proposal.md`

## Issues Summary

### Total Issues by Category

| Issue | Count | % of Files | Description |
|-------|-------|------------|-------------|
| **type** | 225 | 86.2% | Plural form needs conversion (agents→agent, skills→skill, etc.) |
| **unique_id** | 190 | 72.8% | Invalid format (uppercase, colons, or missing) |
| **capabilities** | 119 | 45.6% | Missing required array for skills/agents |
| **author** | 114 | 43.7% | Missing or set to "anonymous" |
| **version** | 86 | 33.0% | Invalid format (not X.Y.Z semantic versioning) |
| **format** | 53 | 20.3% | Missing required field for templates |
| **category** | 53 | 20.3% | Invalid or missing for templates |

### Issues by Content Type

#### 📦 Agents (34 files total)
- **Status**: 32 need fixes, 2 already valid
- **Top Issues**:
  - 32 files: unique_id format invalid
  - 32 files: capabilities array missing
  - 29 files: type needs singular conversion
  - 27 files: author missing/anonymous
  - 4 files: version format issues

**Example Fix - sonar-sweep-agent.md**:
```yaml
# Before
author: anonymous
type: agents
version: 1.0.2

# After
author: DollhouseMCP
type: agent
version: 1.0.2
unique_id: agent_sonar-sweep-agent_dollhousemcp_20250928-163434
capabilities:
  - autonomous-task-execution
```

#### 🎯 Skills (88 files total)
- **Status**: 87 need fixes, 1 already valid
- **Top Issues**:
  - 87 files: unique_id format invalid
  - 87 files: capabilities array missing
  - 77 files: type needs singular conversion
  - 45 files: author missing/anonymous
  - 7 files: version format issues

**Example Fix - code-review.md**:
```yaml
# Before
name: "Code Review"
description: "Systematic code analysis..."
type: "skill"
version: "1.0.0"
author: "DollhouseMCP"

# After (adds):
unique_id: skill_code-review_dollhousemcp_20250723-000000
capabilities:
  - code-quality-analysis
  - security-scanning
  - best-practices-review
```

#### 📄 Templates (56 files total)
- **Status**: 55 need fixes, 1 already valid
- **Top Issues**:
  - 53 files: format field missing
  - 53 files: category invalid (often "general")
  - 52 files: unique_id format invalid
  - 43 files: type needs singular conversion
  - 41 files: author missing/anonymous

**Example Fix - business-letter.md**:
```yaml
# Before
category: general
output_format: markdown

# After
type: template
category: professional  # Changed from "general"
format: markdown        # Added required field
unique_id: template_business-letter_dollhousemcp_20251024-000000
author: DollhouseMCP
version: 1.0.0
```

#### 👤 Personas (75 files total)
- **Status**: 75 need fixes, 0 already valid
- **Top Issues**:
  - 75 files: type needs singular conversion
  - 72 files: version format issues (1.0 → 1.0.0)
  - 9 files: unique_id format invalid

**Example Fix - verbose-victorian-scholar.md**:
```yaml
# Before
name: Verbose-Victorian-Scholar
type: personas
version: 1.0.0
unique_id: verbose-victorian-scholar_20250827-102340_anon-calm-tiger-gjse

# After
name: Verbose-Victorian-Scholar
type: persona          # Singular
version: 1.0.0
unique_id: persona_verbose-victorian-scholar_mickdarling_20250827-102340
```

**Example Fix - alex-sterling.md**:
```yaml
# Before
version: 2.2
type: undefined

# After
version: 2.2.0         # Semantic versioning
type: persona          # Inferred from directory
```

#### 🎭 Ensembles (7 files)
- Most need: type conversion, unique_id fixes, author updates

#### 💾 Memories (75 files)
- Most need: type conversion, unique_id fixes

## Common Fix Patterns

### 1. Type Conversion (225 files)
```yaml
# All plural forms converted to singular
personas → persona
agents → agent
skills → skill
templates → template
memories → memory
ensembles → ensemble
```

### 2. Unique ID Generation (190 files)
```yaml
# Format: {type}_{name}_{author}_{YYYYMMDD-HHMMSS}

# Before (invalid examples)
undefined
verbose-victorian-scholar_20250827-102340_anon-calm-tiger-gjse  # Has uppercase
personas:verbose-scholar:123  # Has colons

# After (valid format)
persona_verbose-victorian-scholar_mickdarling_20250827-102340
agent_sonar-sweep_dollhousemcp_20250928-163434
skill_code-review_dollhousemcp_20250723-000000
```

### 3. Version Normalization (86 files)
```yaml
# Before → After
1.0 → 1.0.0
2.2 → 2.2.0
1 → 1.0.0
missing → 1.0.0
```

### 4. Capabilities Addition (119 files)
```yaml
# Skills get:
capabilities:
  - general-purpose

# Agents get:
capabilities:
  - autonomous-task-execution
```

### 5. Template Requirements (53 files)
```yaml
# Templates need both:
format: markdown
category: professional  # Must be: creative/educational/gaming/personal/professional
```

## Validation Rules Reference

From collection schema (`src/validators/content-validator.ts`):

### Required for All Types
```typescript
unique_id: /^[a-z0-9-_]+$/  // Lowercase, numbers, hyphens, underscores only
author: string (min 2, max 100)
name: string (min 3, max 100)
description: string (min 10, max 500)
version: /^\d+\.\d+\.\d+$/  // Semantic versioning X.Y.Z
type: 'persona' | 'skill' | 'agent' | 'prompt' | 'template' | 'tool' | 'ensemble' | 'memory'
```

### Type-Specific Requirements

**Skills**:
```typescript
type: 'skill'
capabilities: string[]  // Required, non-empty
```

**Agents**:
```typescript
type: 'agent'
capabilities: string[]  // Required, non-empty
```

**Templates**:
```typescript
type: 'template'
format: string  // Required
category: 'creative' | 'educational' | 'gaming' | 'personal' | 'professional'
```

**Personas**:
```typescript
type: 'persona'
// No additional required fields beyond base
```

## Next Steps

### 1. Review Dry-Run Output
```bash
cd /Users/mick/Developer/Organizations/DollhouseMCP/active/collection
node fix-portfolio-metadata.mjs --dry-run > dry-run-full.log
```

### 2. Test on One Type First
```bash
# Start with agents (smallest group)
node fix-portfolio-metadata.mjs --type agents --backup

# Verify the changes
ls -la ~/.dollhouse/portfolio/agents/*.backup.md
```

### 3. Apply All Fixes with Backup
```bash
node fix-portfolio-metadata.mjs --backup
```

### 4. Verify Success
```bash
# Run dry-run again - should show 0 issues
node fix-portfolio-metadata.mjs --dry-run
```

### 5. Clean Up Backups (After Verification)
```bash
find ~/.dollhouse/portfolio -name "*.backup.md" -delete
```

## Risk Assessment

### Low Risk ✅
- Type conversion (plural → singular)
- Version normalization (1.0 → 1.0.0)
- Adding default capabilities
- Adding format field

### Medium Risk ⚠️
- Unique ID generation (changes IDs)
- Author replacement (anonymous → DollhouseMCP)
- Category changes (general → professional)

### Mitigation
- **Always use --backup flag** for first run
- **Test on one type first** before applying to all
- **Keep backups** until you've verified everything works
- **Script preserves existing data** where possible (e.g., existing valid unique_ids)

## Expected Outcome

After running the script successfully:

- ✅ All 257 files will pass collection schema validation
- ✅ All files will have proper unique_ids (lowercase, no special chars)
- ✅ All versions will be semantic (X.Y.Z)
- ✅ All types will be singular
- ✅ All skills/agents will have capabilities
- ✅ All templates will have format and valid category
- ✅ All files will have proper author attribution

## Questions?

See the detailed README:
- `/Users/mick/Developer/Organizations/DollhouseMCP/active/collection/FIX-PORTFOLIO-METADATA-README.md`

Or run the script with `--dry-run` to preview changes without modifying files.
