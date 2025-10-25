---
name: obsidian-atomizer-para
description: >-
  Two-stage AI processor for Obsidian: atomizes large multi-concept notes into
  discrete atomic notes, then uses context-aware LLM reasoning to categorize
  them into PARA structure with nuanced Project vs Area distinction based on
  vault context and user patterns
author: mick
version: 2.0.0
created: '2025-10-11T21:54:26.449Z'
modified: '2025-10-11T21:54:26.449Z'
tags:
  - obsidian
  - automation
  - knowledge-management
  - para
  - atomization
  - zettelkasten
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
# Obsidian PARA Note Atomizer  Processor

## Overview

Two-stage AI-assisted processing for Obsidian: 1 Atomizes large multi-concept notes into discrete atomic notes, then 2 uses LLM reasoning to cate

gorize them into PARA structure with context-aware Project vs Area distinction.

## The ChallengeUsers capture large notes containing multiple concepts from conversations, transcripts, brainstorming. These need to be:
  1. Atomized: Broken into single-concept notes

2. Cate

gorized: Placed in correct PARA location based on nuanced understanding of whether something is a Project has endpoint or Area on

going responsibility

Traditional rules-based systems fail because Project vs Area distinction requires contextual understanding of users goals and existing vault structure.

## Two-Stage Process

### Stage 1: AtomizationInput: Large note with multiple concepts from Inbox/Process:
  - LLM extracts discrete concepts

- Creates individual atomic notes

- Establi

shes relation

ships between concepts

- Preserves source tracking

- Generates descriptive titles

Output: Multiple atomic notes in Inbox/, linked to source and each other

### Stage 2: PARA Cate

gorization  Input: Atomic notes from Stage 1Process:
  - LLM analyzes each atomic note

- Reviews existing vault Projects and Areas for context

- Reasons about Project vs Area based on:
  - Clear endpoint → Project

- On

going responsibility → Area

- Part of existing Project/Area

- Users historical patterns

- Assigns confidence score

Output: Notes cate

gorized with reasoning and confidence

## Vault Structurevault/├── Inbox/│   ├── _sources/          # Original large notes archived after atomization│   └── [atomic notes]     # Awaiting cate

gorization├── Projects/              # Active work with clear endpoints│   ├── 3D-Printer-Upgrades/│   ├── Local-LLM-Setup/│   └── Health-App/├── Areas/                 # On

going responsibilities│   ├── Home-Lab/│   ├── Health-Fitness/│   └── Car-Maintenance/├── Resources/             # Reference material└── Archive/               # Completed/inactive

## Frontmatter Schema

### Source Note Big Multi-Concept Note

yaml---type: sourcestatus: atomized  pendingcreated: YYYY-MM-DDsource: claude-desktop  chatgpt  gemini  speech  transcriptatomized_date: YYYY-MM-DDatomic_notes: [[[Note 1]], [[Note 2]], [[Note 3]]]concepts_extracted: 5---

### Atomic Note

yaml---type: atomicstatus: extracted  suggested  reviewed  archivedsource_note: [[Original Conversation]]related_notes: [[[Related 1]], [[Related 2]]]suggested_location: Projects/Name  Areas/Name  Resources  Archivepara_cate

gory: project  area  resource  archiveconfidence: high  medium  lowreasoning: Explanation of cate

gorization decisioncreated: YYYY-MM-DDprocessed_date: YYYY-MM-DDtags: [tag1, tag2, tag3]project_indicators: [endpoint: local LLM running, deliverable: working setup]area_indicators: [on

going: home lab maintenance, no clear end]ambiguity_notes: Could be part of Home Lab area or separate project---

## Stage 1: Atomization Logic

### Concept Extraction Prompt

You are atomizing a large note into discrete atomic concepts.GUIDELINES FOR ATOMIC NOTES:
  - One concept per note

- Self-contained and understandable alone

- Specific enough to be actionable

- General enough to be discoverable

- Link-worthy others would reference itSOURCE NOTE:---source_content---EXTRACT:For each distinct concept:
  1. Title descriptive, concise

2. Content rewrite as atomic note, not excerpt

3. Relation

ships to other extracted concepts

4. Tags 3-5 relevant

5. Concept type idea, task, reference, decision, questionOUTPUT FORMAT JSON:
  concepts: [          title: Direct drive vs bowden extruder tradeoffs,      content: When choosing between...,      related_concepts: [2, 4],      tags: [3d-printing, hardware, extruders],      type: reference    ,    ...  ],  concept_relation

ships: [    from: 0, to: 2, type: supports,    from: 1, to: 3, type: prerequisite  ]

### Atomization Process

1. Read source note from Inbox

2. Call LLM with extraction prompt

3. Create atomic notes:
  - Generate filename from title

- Add frontmatter with source tracking

- Write content

- Create links to related notes

4. Update source note:
  - Move to Inbox/_sources/

- Add list of atomic notes created

- Mark status: atomized

5. Create relation

ship map optional visualization

## Stage 2: PARA Cate

gorization Logic

### Context-Aware Cate

gorization PromptYou are cate

gorizing atomic notes into a PARA-organized Obsidian vault.CRITICAL: Project vs Area distinction requires understanding users goals.PROJECT = Clear endpoint, specific goal, can be completedExamples:
  - Set up local LLM for note processing endpoint: working system

- Migrate containers to Kubernetes endpoint: migration complete

- Build 3D printer enclosure endpoint: enclosure builtAREA = On

going responsibility, maintenance, no clear endExamples:
  - Home Lab on

going maintenance and evolution

- Health  Fitness continuous practice- 3D Printing skill area, not a specific projectCONTEXT-AWARE REASONING:
  - Something can be BOTH: Local LLM Setup might be:
  - A PROJECT if goal is get it working once

- Part of HOME LAB AREA if its on

going infrastructure

- Look at existing Projects/Areas to see where it fits

- Consider: Is this a one-time goal or on

going maintenanceCURRENT VAULT STRUCTURE:Projects: list_projectsAreas: list_areasResources: list_resourcesATOMIC NOTE TO CATE

GORIZE:---Title: note_titleContent: note_contentTags: note_tags

Related: related_notes---PROVIDE:
  suggested_location: Projects/Name  Areas/Name  Resources  Archive,  para_cate

gory: project  area  resource  archive,  confidence: high  medium  low,  reasoning: Detailed explanation of decision,  project_indicators: [endpoint: X, deliverable: Y],  area_indicators: [on

going: X, maintenance: Y],  ambiguity_notes: Could also be... because...,  alternative_locations: [Projects/Alt, Areas/Alt],  suggested_parent: Could live under existing Home-Lab area

### Cate

gorization Process

1. Read atomic note from Inbox

2. Load vault context:
  - List existing Projects with descriptions

- List existing Areas with descriptions

- Recent cate

gorization patterns

3. Call LLM with cate

gorization prompt

4. Process result:
  - High confidence: Auto-suggest, flag for review

- Medium confidence: Require human review

- Low confidence: Present alternatives, ask user

5. Update frontmatter with suggestion

6. Create review queue entry

## Confidence Scoring

### High 80%

- Auto-Suggest

- Clear indicators present

- Fits existing structure obviously

- Unambiguous endpoint or on

going nature

- Strong keyword matches

- Similar past cate

gorizations

### Medium 50-80%

- Human Review Required

- Could fit multiple locations

- Endpoint unclear

- New type of content

- Overlaps multiple areas

- User pattern unclear

### Low 50%

- Interactive Clarification

- Ambiguous content

- Insufficient context

- Conflicts with existing structure

- Multiple valid interpretations

- Ask user: Is this a one-time goal or on

going work

## Learning from Corrections

### Feedback Loop

yamlcorrection_log:
  - note: Container migration planning    ai_suggested: Areas/Home-Lab    ai_reasoning: On

going infrastructure maintenance    user_corrected: Projects/K8s-Migration    user_note: This is a specific migration project with endpoint    pattern: container + migration = project despite infrastructure

### Pattern Recognition

- Track user corrections

- Identify cate

gorization patterns

- Adjust future prompts with learned patterns

- Build user-specific classification hints

## Usage Patterns

### CLI Commands

bash

# Atomize large notedollhouse execute obsidian-atomizer --action atomize --file Inbox/big-note.md

# Process atomized notes cate

gorizedollhouse execute obsidian-atomizer --action cate

gorize-inbox

# Full pipeline atomize + cate

gorizedollhouse execute obsidian-atomizer --action process-all

# Review suggestionsdollhouse execute obsidian-atomizer --action review-queue

# Manual interventiondollhouse execute obsidian-atomizer --action clarify --file Inbox/atomic-note.md

### Obsidian Plugin Integration

javascript// Atomize current notePOST /atomize  filePath: Inbox/conversation.md,  vaultPath: /path/to/vault// Cate

gorize inboxPOST /cate

gorize-inbox  vaultPath: /path/to/vault,  autoMove: false,  minConfidence: high// Get clarification optionsPOST /clarify  filePath: Inbox/atomic-note.md,  vault

Path: /path/to/vault

## Interactive Clarification

### When Ambiguous🤔 This note could be cate

gorized multiple ways:Note: Set up local LLM for note processin

gOPTION 1: Projects/Local-LLM-Setup→ Reasoning: Has clear endpoint working LLM system→ Pro: Specific deliverable→ Con: Might be on

going maintenanceOPTION 2: Areas/Home-Lab→ Reasoning: Part of on

going infrastructure→ Pro: Related to existing home lab work→ Con: Might have specific completion criteriaOPTION 3: Projects/Local-LLM-Setup under Areas/Home-Lab→ Reasoning: Nested project within area→ Pro: Both specific goal AND part of larger area→ Con: Adds structural complexity

What would you like to do[1] Choose Option 1[2] Choose Option 2  [3] Choose Option 3[4] Create custom location[5] Skip for now

## Example Workflow

### Input: Big Conversation Notemarkdown

# Conversation with Claude - 2025-10-11Discussed upgrading 3D printer with direct drive extruder.Looked at Orbiter v2 options. Need to print new mounting bracket.Also talked about home lab container migration to k8s.Planning to set up k3s cluster on spare machines.Will use this for running local LLM Ollama for note processing.Mentioned health tracking app idea

- integrate with home automation.Could track sleep data from bedroom sensors.

### Stage 1: AtomizationCreates 6 atomic notes:
  1. Direct drive extruder upgrade for 3D printer

2. Orbiter v2 extruder evaluation

3. Custom mounting bracket design needed

4. Home lab Kubernetes migration plan

5. K3s cluster setup on spare hardware

6. Local LLM Ollama for automated note processing

7. Health tracking app with home automation integration

8. Sleep data from bedroom sensors

Relation

ships:
  - Note 1 → Note 2 related

- Note 1 → Note 3 requires

- Note 4 → Note 5 contains

- Note 4 → Note 6 enables

- Note 7 →
