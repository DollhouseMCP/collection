---
category: general
description: Handlebars template for generating context transfer files between sessions
examples: []
includes: []
name: session-context-transfer
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---

# Session Context Transfer - {{main_topic}} - {{end_date}}

## Session Metadata
- **Original Session ID**: {{session_id}}
- **Date Range**: {{start_date}} - {{end_date}}
- **Duration**: {{duration}}
- **Main Topic**: {{main_topic}}

## Essential Context
{{essential_background}}

## Key Decisions Made
{{#each decisions}}
- **{{title}}**: {{rationale}} *({{timestamp}})*
{{/each}}

## Technical Specifications
{{#if architecture}}
**Architecture**: {{architecture}}
{{/if}}
{{#if implementation}}
**Implementation Details**: {{implementation}}
{{/if}}
{{#if security}}
**Security Considerations**: {{security}}
{{/if}}

## Elements Created/Modified
{{#each elements}}
- **{{type}}**: {{name}} - {{description}}
{{/each}}

## Current State
- **Progress**: {{current_progress}}
- **Next Priority**: {{next_priority}}
- **Blockers**: {{blockers}}

## For New Session
To continue this work, you need to know:
{{continuation_context}}

**Immediate next steps:**
{{#each next_steps}}
1. {{this}}
{{/each}}

## Conversation Summary
{{conversation_flow}}

## Hook System Implementation (If Applicable)
{{#if hooks_discussed}}
- **Hook Elements Created**: {{hook_elements}}
- **Monitoring Patterns**: {{monitoring_patterns}}
- **Reaction Strategies**: {{reaction_strategies}}
- **Integration Points**: {{integration_points}}
{{/if}}

---
*Generated as artifact by Session Notes Agent at {{generation_timestamp}}*