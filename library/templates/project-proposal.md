---
name: "Project Proposal"
description: "Professional template for creating comprehensive project proposals"
type: "template"
version: "2.0.0"
author: "DollhouseMCP"
created: "2025-07-15"
category: "business"
tags: ["business", "project-management", "proposals", "documentation"]
unique_id: template_project-proposal_dollhousemcp_20250715-100300
variables:
  - { name: "project_name", type: "string", required: true, description: "Name of the proposed project" }
  - { name: "client_name", type: "string", required: true, description: "Client or stakeholder name" }
  - { name: "current_date", type: "string", required: false, description: "Date of the proposal" }
  - { name: "author_name", type: "string", required: true, description: "Person preparing the proposal" }
  - { name: "executive_summary", type: "string", required: false, description: "Concise overview of the project, its objectives, and expected outcomes (2-3 paragraphs)" }
  - { name: "background", type: "string", required: false, description: "Context and need for this project, what problem it solves" }
  - { name: "objectives", type: "string", required: false, description: "Pre-formatted numbered list of project objectives" }
  - { name: "in_scope", type: "string", required: false, description: "Pre-formatted bullet list of what is included" }
  - { name: "out_of_scope", type: "string", required: false, description: "Pre-formatted bullet list of what is not included" }
  - { name: "key_deliverables", type: "string", required: false, description: "Pre-formatted list of project deliverables with descriptions" }
  - { name: "project_duration", type: "string", required: true, description: "Total project duration (e.g. 10 weeks)" }
  - { name: "timeline", type: "string", required: false, description: "Pre-formatted table rows: | Phase | Duration | Key Milestones |" }
  - { name: "budget_range", type: "string", required: true, description: "Estimated budget range" }
  - { name: "cost_breakdown", type: "string", required: false, description: "Pre-formatted budget breakdown with category and percentage" }
  - { name: "team_size", type: "string", required: true, description: "Number of team members" }
  - { name: "team_roles", type: "string", required: false, description: "Pre-formatted list of key roles and responsibilities" }
  - { name: "risks", type: "string", required: false, description: "Pre-formatted table rows: | Risk | Probability | Impact | Mitigation |" }
  - { name: "success_criteria", type: "string", required: false, description: "Pre-formatted numbered list of success criteria" }
  - { name: "next_steps", type: "string", required: false, description: "Pre-formatted numbered list of next steps after proposal approval" }
  - { name: "contact_info", type: "string", required: false, description: "Contact details for follow-up" }
---
# Project Proposal: {{project_name}}

**Prepared for:** {{client_name}}
**Date:** {{current_date}}
**Prepared by:** {{author_name}}

## Executive Summary

{{executive_summary}}

## Project Overview

### Background
{{background}}

### Objectives
{{objectives}}

### Scope
**In Scope:**
{{in_scope}}

**Out of Scope:**
{{out_of_scope}}

## Deliverables

{{key_deliverables}}

## Timeline

**Total Duration:** {{project_duration}}

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
{{timeline}}

## Budget

**Estimated Range:** {{budget_range}}

### Cost Breakdown
{{cost_breakdown}}

## Team Structure

**Team Size:** {{team_size}}

### Key Roles
{{team_roles}}

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
{{risks}}

## Success Criteria

{{success_criteria}}

## Next Steps

{{next_steps}}

---

**Contact Information**
{{contact_info}}
