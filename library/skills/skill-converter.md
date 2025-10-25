---
name: skill-converter
description: Convert skills between Claude Skills (Anthropic) and DollhouseMCP formats bidirectionally with automatic format detection
version: 1.0.0
category: development
author: DollhouseMCP
tags:
  - conversion
  - claude-skills
  - anthropic-skills
  - import
  - export
  - interoperability
triggers:
  - convert skill
  - convert claude skill
  - import claude skill
  - export skill
  - skill conversion
  - import anthropic skill
  - convert to claude
  - convert from claude
---

# Skill Converter

Automatically detect and convert skills between **Claude Skills** (Anthropic's format) and **DollhouseMCP Skills** format in both directions.

## What This Skill Does

This skill enables seamless bidirectional conversion between:
- **Claude Skills** → DollhouseMCP Skills (import from Claude.ai)
- **DollhouseMCP Skills** → Claude Skills (export to share on Claude.ai)

The skill automatically detects the input format and chooses the correct conversion direction.

## Terminology

- **Claude Skills** = Official name for Anthropic's skill system (use this in conversations)
- **Anthropic Skills** = Alternative name (also recognized)
- Both terms refer to the same format

## When to Use This Skill

Use this skill when you need to:
- **Import Claude Skills** downloaded from Claude.ai (ZIP files or directories)
- **Export DollhouseMCP Skills** to share on Claude.ai
- **Convert between formats** for compatibility
- **Work with both ecosystems** seamlessly

## Automatic Format Detection

The skill will automatically detect:

1. **Claude Skill (Anthropic format)**:
   - Has `SKILL.md` file
   - May have `scripts/`, `reference/`, `examples/` directories
   - Often comes as a ZIP file from Claude.ai downloads

2. **DollhouseMCP Skill**:
   - Single `.md` file with YAML frontmatter
   - Located in `~/.dollhouse/portfolio/skills/`

3. **Input Type**:
   - ZIP file (`.zip` extension) → Extract and convert
   - Directory → Direct conversion
   - Single `.md` file → DollhouseMCP format

## Conversion Commands

### Import Claude Skill → DollhouseMCP

```bash
# Import from ZIP file (most common - downloaded from Claude.ai)
dollhouse convert from-anthropic ~/Downloads/my-skill.zip

# Import from extracted directory
dollhouse convert from-anthropic ~/Downloads/my-skill-folder

# With verbose output
dollhouse convert from-anthropic ~/Downloads/my-skill.zip --verbose

# Custom output location
dollhouse convert from-anthropic ~/Downloads/my-skill.zip -o ~/custom/location
```

**Default output:** `~/.dollhouse/portfolio/skills/skill-name.md`

### Export DollhouseMCP Skill → Claude Skills

```bash
# Export to Claude Skills format
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/my-skill.md

# Export with verbose output
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/my-skill.md --verbose

# Custom output directory
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/my-skill.md -o ./exports

# Preview without executing
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/my-skill.md --dry-run
```

**Default output:** `./anthropic-skills/skill-name/` directory structure

## Conversion Workflow

### Step 1: Analyze Input

```bash
# Check if input exists
ls -la <input-path>

# For ZIP files, check size
du -h <input-path>
```

### Step 2: Detect Format

**Ask these questions:**
1. Is it a ZIP file? → Likely Claude Skill download
2. Is it a directory with `SKILL.md`? → Claude Skill
3. Is it a `.md` file with YAML frontmatter? → DollhouseMCP Skill
4. Where is the user asking to convert TO or FROM?

### Step 3: Execute Conversion

Choose the appropriate command based on detection:

```bash
# If Claude Skill (ZIP or directory with SKILL.md)
dollhouse convert from-anthropic <input> --verbose

# If DollhouseMCP Skill (.md file)
dollhouse convert to-anthropic <input> --verbose
```

### Step 4: Verify Results

```bash
# For imports (Claude → DollhouseMCP)
ls -la ~/.dollhouse/portfolio/skills/
cat ~/.dollhouse/portfolio/skills/<skill-name>.md

# For exports (DollhouseMCP → Claude)
ls -la ./anthropic-skills/<skill-name>/
cat ./anthropic-skills/<skill-name>/SKILL.md
```

## Common Use Cases

### Use Case 1: Import Claude Skill from Claude.ai

**User says:** "I downloaded a Claude skill, can you import it?"

**Workflow:**
1. Locate the ZIP file in Downloads
2. Run import conversion
3. Verify it's in portfolio
4. Optionally activate it

```bash
# Find recent downloads
ls -lt ~/Downloads/*.zip | head -5

# Import the skill
dollhouse convert from-anthropic ~/Downloads/<skill-name>.zip --verbose

# Verify
ls -la ~/.dollhouse/portfolio/skills/<skill-name>.md
```

### Use Case 2: Export DollhouseMCP Skill to Share

**User says:** "I want to share my skill on Claude.ai"

**Workflow:**
1. Locate the skill in portfolio
2. Export to Claude Skills format
3. Provide directory location for upload

```bash
# Export skill
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/<skill-name>.md --verbose

# Show output location
echo "Skill exported to: ./anthropic-skills/<skill-name>/"
echo "Upload this directory to Claude.ai to share"
```

### Use Case 3: Bidirectional Roundtrip

**User says:** "Can you convert this skill back and forth?"

**Workflow:**
1. Convert DollhouseMCP → Claude Skills
2. Convert back Claude Skills → DollhouseMCP
3. Verify lossless conversion

```bash
# Export
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/original.md -o ./temp

# Import back
dollhouse convert from-anthropic ./temp/original -o ./roundtrip

# Compare
diff ~/.dollhouse/portfolio/skills/original.md ./roundtrip/original.md
```

## Options Reference

### Common Options (Both Directions)

- `-o, --output <dir>` - Custom output directory
- `-v, --verbose` - Show detailed conversion steps
- `-r, --report` - Generate conversion report
- `--dry-run` - Preview without executing

### Import-Specific (from-anthropic)

- Automatically handles ZIP extraction
- Validates ZIP size limits (100MB max)
- Detects zip bombs (500MB extracted max)
- Cleans up temp files automatically
- Default output: `~/.dollhouse/portfolio/skills/`

### Export-Specific (to-anthropic)

- Creates directory structure with SKILL.md
- Extracts scripts to `scripts/` directory
- Preserves metadata in `metadata/dollhouse.yaml` for roundtrip
- Default output: `./anthropic-skills/`

## Security Features

The converter includes built-in security:

- **ZIP size validation** - Prevents DoS via large files (100MB limit)
- **Zip bomb detection** - Validates extracted size (500MB limit)
- **Unicode normalization** - Prevents homograph attacks in file paths
- **Automatic cleanup** - Removes temp files on success/failure
- **Security audit logging** - Logs all conversion operations

## Tips for Natural Interaction

When users mention:
- "Claude skill" → They mean Anthropic Skills format
- "Import from Claude" → Use `from-anthropic`
- "Export to Claude" → Use `to-anthropic`
- "Share on Claude.ai" → Export to Claude Skills format
- "Downloaded from Claude.ai" → Usually a ZIP file, use `from-anthropic`

## Error Handling

If conversion fails:

1. **Check input exists:**
   ```bash
   ls -la <input-path>
   ```

2. **Verify format:**
   ```bash
   # For directories
   ls -la <directory>/SKILL.md

   # For DollhouseMCP skills
   head -20 <skill-file>.md  # Should show YAML frontmatter
   ```

3. **Check permissions:**
   ```bash
   ls -la ~/.dollhouse/portfolio/skills/
   ```

4. **Review error messages** - They include specific remediation steps

## Examples

### Example 1: Quick Import

```bash
# User downloaded "code-reviewer.zip" from Claude.ai
dollhouse convert from-anthropic ~/Downloads/code-reviewer.zip --verbose
```

**Result:** `~/.dollhouse/portfolio/skills/code-reviewer.md`

### Example 2: Quick Export

```bash
# User wants to share "custom-analyzer" skill
dollhouse convert to-anthropic ~/.dollhouse/portfolio/skills/custom-analyzer.md --verbose
```

**Result:** `./anthropic-skills/custom-analyzer/` directory ready for upload

### Example 3: Batch Conversion

```bash
# Convert multiple Claude Skills
for zip in ~/Downloads/claude-skills/*.zip; do
    dollhouse convert from-anthropic "$zip" --verbose
done

# Verify all imported
ls -la ~/.dollhouse/portfolio/skills/
```

## Integration with DollhouseMCP Workflow

After importing a Claude Skill:

1. **Reload skills:**
   ```bash
   # Use DollhouseMCP MCP tool
   mcp__dollhousemcp__reload_elements --type skills
   ```

2. **Activate the skill:**
   ```bash
   mcp__dollhousemcp__activate_element --type skills --name <skill-name>
   ```

3. **Verify activation:**
   ```bash
   mcp__dollhousemcp__get_active_elements --type skills
   ```

## Remember

- **Always use `--verbose`** for transparency in what's happening
- **Claude Skills = Anthropic Skills** (same thing, different names)
- **Auto-detection is smart** - just provide the input path
- **Security is built-in** - ZIP bombs, size limits, Unicode attacks all prevented
- **Bidirectional** - no data loss in roundtrip conversions

## Success Indicators

You'll know conversion succeeded when you see:

**Import (from-anthropic):**
```
✓ Conversion complete
  Created: ~/.dollhouse/portfolio/skills/<skill-name>.md
```

**Export (to-anthropic):**
```
✓ Conversion complete
  Created 5 file(s) in: ./anthropic-skills/<skill-name>
```

---

**This skill makes DollhouseMCP and Claude.ai skill ecosystems fully interoperable!** 🎯
