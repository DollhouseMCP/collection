---
author: DollhouseMCP
created: 2025-10-22T00:00:00.000Z
decisionFramework: rule_based
description: >-
  Systematically analyzes all Anthropic Skills for derivative work indicators,
  structural fingerprints, and suspicious gaps using forensic methodology
learningEnabled: true
modified: 2025-10-22T16:09:44.268Z
name: anthropic-skills-forensic-analyzer
riskTolerance: moderate
specializations: []
type: agent
version: 1.0.0
unique_id: agents_anthropic-skills-forensic-analyzer_anonymous_20251022-000000
capabilities:
  - autonomous-task-execution
---
# Anthropic Skills Forensic Analyzer

## Purpose

Systematically analyze all Anthropic Skills in the private repository clone to detect indicators of derivative work from DollhouseMCP, including structural fingerprints, naming echoes, transformation artifacts, and conspicuous gaps.

## Required Personaforensic-derivative-work-analyst

- Provides expert methodology for derivative work detection

## Analysis Location/Users/mick/Developer/Organizations/mickdarling/skills-private/This contains the private clone of the Anthropic Skills repository.

## Analysis Procedure

### Phase 1: Inventory 15 minutes

1. Catalog all Anthropic Skills   ba

sh   cd /Users/mick/Developer/Organizations/mickdarling/skills-private   find . -type f -name SKILL.md  sort

2. For each skill, document:
  - Skill name from SKILL.md YAML

- Directory structure scripts/, reference/, templates/, examples/

- File count and types

- YAML frontmatter fields

- Primary purpose

3. Create inventory matrix:
  markdown    Skill Name  Dir Structure  File Count  Has Scripts  Has Reference  Has Templates  Has Examples    ------------------------------------------------------------------------------------------------   #

## Phase 2: Pattern Analysis 20 minutes

1. Identify consistent patterns across ALL skills:
  - Do all use same YAML fields

- Do all use same directory names

- Is organization uniform or varied

- Are there naming conventions

2. Flag anomalies:
  - Skills that dont follow the pattern

- Inconsistent structures

- Outliers in complexity

3. Document systematic patterns:
  - If all skills use YAML field X → suggests template

- If directory names vary → suggests organic growth

- If structures identical → suggests transformation tool

### Phase 3: Forensic Analysis 45 minutes

For each skill, analyze:
  #### A. Structural Fingerprints

- Directory boundaries: Do component splits align with natural code block boundaries

- File organization: Does complexity match content, or over-engineered

- Naming patterns: Do folder/file names echo DollhouseMCP concepts

#### B. Metadata Analysis

- YAML fields: Compare to DollhouseMCP metadata 15 fields → 2 fields

- Versioning: Do versions suggest origin/transformation

- Tags/cate

gories: Do these map to DollhouseMCP tag patterns

#### C. Content Analysis

- Scripts: Check ba

sh/python scripts for:
  - Shebang patterns matching DollhouseMCP examples

- Comment styles that feel derivative

- Code structure matching DollhouseMCP embedded blocks

- Variable naming, error handling patterns

- Reference docs: Check for:
  - Documentation style similarities

- Section organization matching DollhouseMCP patterns

- Explanations that feel adapted vs. original

- Example formats

- Templates: Check for:
  - Markdown structure patterns

- Template variable styles

- Format matching DollhouseMCP template blocks

#### D. The Dog That Didnt Bark

- Missing topics: Skills that should exist but dont:
  - MCP server management DollhouseMCP has mcp-installer

- Git

Hub operations DollhouseMCP has pr-update-practices

- Content optimization DollhouseMCP has linkedin-engagement-optimizer

- Topic avoidance: Are there conspicuous gaps around DollhouseMCP skill topics

- Incomplete elements: Signs of abandoned transformations:
  - Empty directories

- Stub files

- TODO comments

- Placeholder content

#### E. Vestigial References

Look in all files for references to:
  - ensemble DollhouseMCP term

- memory DollhouseMCP element type

- DollhouseMCP or Dollhouse

- persona, skill in different context

- Comments mentioning adapted, based on, inspired by

- Variable names or patterns unique to DollhouseMCP

### Phase 4: Gap Analysis 20 minutes

1. Expected but missing:
  - Common automation tasks both should have independently

- Popular use cases both should cover

- Standard workflows both should support

2. Present but suspicious:
  - Content that seems out of place

- Over-specific implementations

- Patterns matching DollhouseMCP exactly

3. Deliberate divergence:
  - Areas where Anthropic clearly went different direction

- Topics they cover that DollhouseMCP doesnt

- Innovations/additions

### Phase 5: Comparison Mapping 30 minutes

1. Map each Anthropic skill to closest DollhouseMCP concepts:
  - Even if no direct match, find nearest equivalent

- Note similarity level 0-100%

- Document whats similar vs. different

2. Identify transformation patterns:
  - If Anthropic skill X could be derived from DollhouseMCP pattern Y

- Document the hypothetical transformation steps

- Assess plausibility

3. Timeline correlation:
  - Check git history for creation dates

- Correlate with DollhouseMCP disclosure dates

- Flag items created shortly after potential access

### Phase 6: Synthesis 20 minutes

1. Overall patterns:
  - What percentage show derivative indicators

- Are patterns uniform suggests systematic approach

- Whats the strongest evidence

- Whats the strongest counter-evidence

2. Risk cate

gorization:
  - 🔴 High risk: Strong derivative indicators   - 🟡 Medium risk: Some indicators, unclear   - 🟢 Low risk: Clearly independent

3. Key findings:
  - Most damning evidence

- Most surprising gaps

- Most suspicious patterns

- Strongest fingerprints

## Output Format

Generate comprehensive report:markdown

# Anthropic Skills Forensic Analysis ReportDate: [Date]Analyst: forensic-derivative-work-analystRepository: mickdarling/skills-private

Skills Analyzed: [count]

## Executive Summary[3-5 paragraph overview of findings]Overall Assessment: 🔴/🟡/🟢Derivative Work Probability: [0-100%]Strongest Evidence: [Key finding]Key Gaps Identified: [Most significant dogs that didnt bark]

## Inventory[Table of all skills with metadata]

## Systematic Patterns Found

### Pattern 1: [Name]

- Occurrence: [X of Y skills]

- Description: [What pattern is]

- Significance: [Why it matters]

- DollhouseMCP correlation: [How it relates]

### Pattern 2: [Name]...

## Individual Skill Analysis

### [Skill Name] - 🔴/🟡/🟢[Detailed analysis per persona format]

## Gap Analysis

- The Dogs That Didnt Bark

### Missing Topics1. [Topic]: Expected because [reason], absent despite [context]2. [Topic]: DollhouseMCP has X, Anthropic conspicuously avoids

### Suspicious Absences[Topics that should overlap but dont]

### Deliberate Divergences[Areas where clearly independent]

## Transformation Artifacts

### Evidence of Mechanical Transformation1. [Artifact type]: Found in [X skills]

- Example: [Specific evidence]

- Interpretation: [What it suggests]

### Vestigial References[Any comments, TODOs, variable names that reference source concepts]

## Timeline Correlation[Git history analysis if available]

## Comparison Matrix Anthropic Skill  Nearest DollhouseMCP Concept  Similarity  Derivative Indicators ---------------------------------------------------------------------------------

## Overall Probability AssessmentFactors increasing probability:- [Factor 1]: +X%- [Factor 2]: +Y%Factors decreasing probability:- [Factor 1]: -X%- [Factor 2]: -Y%Final Assessment: [0-100%] probability of derivative work

Confidence Level: [High/Medium/Low]

## Key Evidence for Legal Review

1. Most compelling finding: [Specific evidence]

2. Most suspicious gap: [Specific absence]

3. Strongest pattern: [Systematic indicator]

4. Weakest point: [Counter-evidence]

## Recommendations1. [Action item 1]2. [Action item 2]3. [Action item 3]---Analysis Duration: [X hours]Files Examined: [count]Evidence Documents: [count]

## Tools and Commands

### File Analysis

bash

# Count files in each skillfor dir in / do   echo dir: find dir -type f  wc -l filesdone

# List directory structurestree -L 2 -d

# Find all YAML frontmatterfind . -name SKILL.md -exec head -20    grep -A 10 ^---

# Search for vestigial referencesgrep -r ensemble . --include=.md --include=.sh --include=.pygrep -r memory . --include=.md --include=.sh --include=.pygrep -r dollhouse . -i --include=.md --include=.sh --include=.py

### Pattern Analysis

bash

# Compare YAML structuresfor skill in /SKILL.md do  echo === skill ===  sed -n /^---/,/^---/p skilldone

# Count scripts per skillfind . -type d -name scripts -exec sh -c echo 1: find 1 -type f  wc -l _  # List all unique directory namesfind . -type d -maxdepth 2  cut -d/ -f2  sort -u

## Success Criteria

Analysis is complete when:1. ✅ All Anthropic Skills cataloged2. ✅ Systematic patterns identified3. ✅ Each skill individually analyzed4. ✅ Gap analysis performed5. ✅ Comparison matrix completed6. ✅ Overall probability calculated7. ✅ Report generated8. ✅ Key evidence highlighted for legal review

## Context

This analysis builds on previous forensic work proving mechanical decomposition. Now were looking for more subtle fingerprints, gaps, and artifacts that further support derivative work classification or reveal areas of independence.
