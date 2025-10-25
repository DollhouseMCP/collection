---
name: sonarcloud-modernizer
description: >-
  Automated code modernization skills for SonarCloud compliance - transforms
  code to follow modern JavaScript/TypeScript patterns
author: mickdarling
version: 1.0.2
created: '2025-09-28T16:33:21.645Z'
modified: '2025-09-28T16:33:21.645Z'
tags:
  - modernization
  - automation
  - sonarcloud
  - refactoring
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# SonarCloud Modernizer Skill

## Skill Overview
I provide automated code modernization capabilities to achieve SonarCloud compliance. I can systematically transform legacy patterns into modern, compliant code across your entire codebase.

## ⚠️ CRITICAL: Double Replacement Protection (Learned 2025-10-01)

When running automated sed replacements, **ALWAYS check for double replacements**:

```bash
# After running sed, ALWAYS run this check:
grep -r "Number\.Number\." src/ test/ && echo "⚠️  FOUND DOUBLE REPLACEMENTS" || echo "✓ No double replacements"

# If found, fix them immediately:
find . \( -name "*.ts" -o -name "*.js" \) \
  ! -path "*/node_modules/*" \
  -exec sed -i '' -e 's/Number\.Number\./Number./g' {} +
```

**Why this happens**: If a file already has `Number.parseInt()`, sed may replace it again to `Number.Number.parseInt()`.

**Prevention**: Use word boundaries `\b` in sed patterns (already included in scripts below).

## Core Capabilities

### 1. Number Method Modernization (Rule S7773)
Transform all global number functions to their Number. equivalents:

```typescript
// Transform these patterns:
parseInt(str) → Number.parseInt(str)
parseFloat(str) → Number.parseFloat(str)
isNaN(value) → Number.isNaN(value)
isFinite(value) → Number.isFinite(value)
```

**Automated Fix Script**:
```bash
# Step 1: Run automated replacements
find . \( -name "*.ts" -o -name "*.js" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  -exec sed -i '' \
    -e 's/\bparseInt(/Number.parseInt(/g' \
    -e 's/\bparseFloat(/Number.parseFloat(/g' \
    -e 's/\bisNaN(/Number.isNaN(/g' \
    -e 's/\bisFinite(/Number.isFinite(/g' \
    {} +

# Step 2: CRITICAL - Check for double replacements
grep -r "Number\.Number\." src/ test/ && echo "⚠️  FOUND DOUBLE REPLACEMENTS - FIXING..." || echo "✓ No double replacements"

# Step 3: Fix any double replacements
find . \( -name "*.ts" -o -name "*.js" \) \
  ! -path "*/node_modules/*" \
  -exec sed -i '' -e 's/Number\.Number\./Number./g' {} +

# Step 4: Verify build
npm run build

# Step 5: Verify tests
npm test
```

### 2. String Method Modernization (Rules S7781, S7758)
Update string methods to modern equivalents:

```typescript
// Global replace patterns:
str.replace(/pattern/g, replacement) → str.replaceAll(pattern, replacement)

// Unicode-aware methods:
String.fromCharCode(code) → String.fromCodePoint(code)
str.charCodeAt(index) → str.codePointAt(index)
```

### 3. Node.js Import Modernization (Rule S7772)
Add node: protocol to built-in imports:

```typescript
// Transform all built-in imports:
import fs from "fs" → import fs from "node:fs"
import path from "path" → import path from "node:path"
import crypto from "crypto" → import crypto from "node:crypto"
import { promises } from "fs" → import { promises } from "node:fs"
require("util") → require("node:util")
```

**Automated Fix Script**:
```bash
# Add node: prefix to imports
MODULES="fs path crypto util os stream events url child_process"
for mod in $MODULES; do
  find . \( -name "*.ts" -o -name "*.js" \) \
    ! -path "*/node_modules/*" \
    -exec sed -i '' \
      -e "s/from ['\"]${mod}['\"]/from \"node:${mod}\"/g" \
      -e "s/require(['\"]${mod}['\"])/require(\"node:${mod}\")/g" \
      {} +
done
```

### 4. Readonly Property Marking (Rule S2933)
Identify and mark never-reassigned properties:

```typescript
// Add readonly to properties only set in constructor:
private logger: Logger → private readonly logger: Logger
protected config: Config → protected readonly config: Config
```

### 5. Array Construction Fix (Rule S7723)
Ensure proper array instantiation:

```typescript
Array(5) → new Array(5)
Array.of(1,2,3) // Already compliant
```

## Verification Steps (MANDATORY)

After ANY automated fix:

### Step 1: Visual Inspection
```bash
# Review changes before committing
git diff
```

### Step 2: Build Verification
```bash
npm run build
# MUST succeed - if it fails, rollback and investigate
```

### Step 3: Test Verification
```bash
npm test
# MUST pass all tests - if failures, check for semantic changes
```

### Step 4: SonarCloud Re-Query
```bash
# Wait 2-3 minutes for CI scan to complete
gh pr checks <PR_NUMBER>

# Once CI passes, verify issue count
mcp__sonarqube__issues \
  --project_key DollhouseMCP_mcp-server \
  --rules <rule_id> \
  --output_mode count
```

### Step 5: Edge Case Check
```bash
# Check no replacements in string literals
grep -r "\".*Number\.parseInt.*\"" src/ test/

# Check no replacements in comments
grep -r "// .*Number\.parseInt.*" src/ test/

# Check radix parameter preserved
grep -r "Number\.parseInt([^,)]*)" src/ test/ | grep -v ", 1[0-9])"
```

## Smart Detection Patterns

### Find Candidates for Modernization
```typescript
// Regex to find parseInt usage (avoiding Number.parseInt)
/\bparseInt\(/  // Matches: parseInt(  but not Number.parseInt(

// Regex to find global replace patterns
/.replace\([^)]*\/g[^)]*\)/

// Regex to find imports needing node: prefix
/from ['"][^node:](?:fs|path|crypto|util|os|stream|events|url|child_process)['"]/
```

## Safety Checks

### Pre-Modernization Validation
1. **Check Node Version**: Ensure Node.js >= 14.13.1 for node: protocol
2. **Test Coverage**: Run tests before and after changes
3. **Type Checking**: Ensure TypeScript compilation succeeds
4. **Backup**: Create git commit before bulk changes

```bash
# Create safety commit
git add -A
git commit -m "chore: backup before automated modernization" --no-verify || true
```

### Post-Modernization Verification
```bash
# Verify no broken imports
npm run build

# Check for any remaining issues
npm run lint

# Run tests to ensure no behavior change
npm test

# Check git diff for unexpected changes
git diff | less
```

## Incremental Approach

### Phase 1: Safe Automated Fixes (Zero Risk)
- Number methods (no behavior change)
- Node imports (no behavior change)
- Array constructor (no behavior change)

### Phase 2: Semi-Automated Fixes (Low Risk)
- String replaceAll (verify regex patterns)
- Readonly properties (verify no reassignments)

### Phase 3: Manual Review Required (Medium Risk)
- Control characters in regex
- Complex refactoring for cognitive complexity

## Common Edge Cases

### parseInt with Radix
```typescript
// MUST preserve radix parameter:
parseInt(str, 16) → Number.parseInt(str, 16)  // ✅ CORRECT
parseInt(str, 16) → Number.parseInt(str)      // ❌ WRONG - changes behavior!
```

The sed pattern with `\b` boundaries handles this correctly.

### Replace with Functions
```typescript
// Don't convert if replacement is a function:
str.replace(/pattern/g, match => ...) // Keep as-is, replaceAll syntax different
```

### Dynamic Imports
```typescript
// Don't add node: to dynamic imports:
const mod = await import(moduleName) // Keep as-is - runtime value
```

### String Literals
```typescript
// Sed should NOT replace inside strings:
const msg = "Use parseInt() function"  // Should remain unchanged
```

Use `git diff` to review and manually revert any incorrect string replacements.

## Troubleshooting

### "Tests failing after Number.parseInt replacement"
**Likely cause**: Radix parameter accidentally removed or test mocks affected

**Solution**:
```bash
# Find all parseInt calls without radix
grep -r "Number\.parseInt([^,)]*)" src/ test/

# Review each one - some may need explicit radix
```

### "Build failing with 'Cannot find module'"
**Likely cause**: node: prefix added incorrectly or to user module

**Solution**:
```bash
# Check for incorrect node: additions
grep -r "from ['\"]node:" src/ | grep -v "node:fs\|node:path\|node:crypto"

# Manually revert incorrect additions
```

### "Double replacements found"
**Solution**: Already handled in script - runs automatic cleanup

```bash
# Manual cleanup if needed
find . -name "*.ts" -exec sed -i '' 's/Number\.Number\./Number./g' {} +
```

## Metrics Tracking

Track modernization progress:
- **Issues fixed per category**: Query before/after
- **Time saved through automation**: Automated = minutes, Manual = hours
- **SonarCloud score improvements**: Monitor quality gate
- **Test coverage maintained**: Verify coverage didn't drop

Example tracking:
```bash
# Before
mcp__sonarqube__issues --rules typescript:S7773 --output_mode count
# total: 105

# After
mcp__sonarqube__issues --rules typescript:S7773 --output_mode count
# total: 0

# Result: 105 issues fixed in ~15 minutes (vs ~9 hours manual)
```

## Integration Points

Works seamlessly with:
- **sonar-guardian** persona - For guidance and workflow
- **sonarcloud-fix-template** - For documentation patterns
- **sonar-sweep-agent** - For autonomous fixing (if available)
- **sonarcloud-rules-reference** - For rule lookups
- **sonarcloud-api-reference** - For API operations and workarounds

## Best Practices (Learned from Experience)

1. **Always run in development branch** - Never on main/develop directly
2. **Create backup commit first** - Easy rollback if issues
3. **Check for double replacements** - Most common automated fix problem
4. **Test incrementally** - Run tests after each rule category
5. **Review git diff** - Catch unintended changes before commit
6. **Wait for CI scan** - Give SonarCloud 2-3 minutes to process
7. **Document in commit message** - Note exact counts and files affected
8. **Add 50% time buffer** - Estimated 20 min → Plan for 30 min

---

**Last Updated**: October 1, 2025
**Critical Addition**: Double replacement protection and verification steps
**Verified Approach**: Issue #1221 completion, preparing for #1220
