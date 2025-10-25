---
category: professional
description: >-
  Enhanced template for creating comprehensive element analysis tasks with
  structured evaluation criteria and detailed success metrics
examples: []
includes: []
name: swarm-analysis-task-template-v2
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0
unique_id: unknown_swarm-analysis-task-template-v2_anonymous_20251025-191021
type: template
author: DollhouseMCP
format: markdown
---
# Enhanced Analysis Task Template v2.0

## Template Purpose

Create comprehensive element analysis tasks for enhanced v2 workers with structured evaluation criteria and detailed success metrics.

## Memory Name Formatswarm-task-TASK_ID-analysis-ELEMENT_NAMEExamples:
  - swarm-task-001-analysis-swarm-worker-v1

- swarm-task-042-analysis-task-template

- swarm-task-099-analysis-protocol-efficiency

## Enhanced Template Structure

yamltask_id: UNIQUE_TASK_ID-analysis-ELEMENT_NAMEstatus: pendingpriority: highmediumlowassigned_to: nullworker_specialization_required: analysttask_type: element_analysistask_subtype: structuralfunctionalqualityperformanceusability

# Enhanced task definitiontask_definition:
  objective: Conduct comprehensive analysis of ELEMENT_NAME and identify improvement opportunities    analysis_scope:
  structural_analysis: Examine element organization, metadata, dependencies    quality_assessment: Evaluate against best practices and standards    functionality_review: Test all features and validate behavior    improvement_identification: Find specific enhancement opportunities    comparison_analysis: Benchmark against similar elements    target_element:
  name: ELEMENT_NAME    type: ELEMENT_TYPE    current_version: CURRENT_VERSION    location: ELEMENT_PATH_OR_ID

# Detailed analysis requirementsanalysis_requirements:
  depth_level: comprehensive  # basicstandardcomprehensiveexpert    required_assessments:
  - Structure and organization quality

- Content completeness and accuracy

- Documentation quality and clarity

- Integration and compatibility

- Performance and efficiency

- User experience and usability

- Maintainability and extensibility    comparison_elements:
  - Find 3-5 similar elements for benchmarking

- Identify industry best practices

- Compare with establi

shed patterns    tools_to_use:
  - mcp__DollhouseMCP__get_element_details

- mcp__DollhouseMCP__get_element_relation

ships

- mcp__DollhouseMCP__find_similar_elements

- mcp__DollhouseMCP__validate_element

- mcp__DollhouseMCP__search_portfolio

# Expected deliverablesdeliverables:
  primary_output:
  format: structured_analysis_report    sections:
  - Executive Summary 100-150 words

- Structural Analysis 300-400 words

- Quality Assessment Matrix scored evaluation

- Functionality Review 200-300 words

- Improvement Opportunities prioritized list

- Enhancement Recommendations detailed proposals

- Implementation Roadmap actionable steps        word_count: 1000-1500 words total    format_requirements:
  - Use markdown formatting

- Include YAML metadata blocks

- Provide scoring matrices where applicable

- Add code examples for technical recommendations    supporting_outputs:
  quality_scorecard: Numerical assessment across 10 criteria 1-10 scale    comparison_matrix: Side-by-side comparison with benchmark elements    improvement_backlog: Prioritized list of 10-15 specific improvements    v2_design_proposal: High-level specification for enhanced version

# Success criteria  validationsuccess_criteria:
  completeness_checks:
  - All required assessment areas covered

- Minimum 10 specific improvement opportunities identified

- All findings supported by evidence and examples

- Comparison with minimum 3 similar elements completed    quality_standards:
  - Analysis is actionable and specific not generic

- Recommendations include implementation guidance

- Findings validated using MCP tools where possible

- Report structure follows template exactly    technical_validation:
  - Element details retrieved and verified

- Similar elements identified and analyzed

- Quality metrics calculated and documented

- Enhancement proposals are technically feasible

# Quality gatesquality_gates:
  self_assessment:
  checklist:
  - [ ] All deliverables completed as specified      - [ ] Analysis depth meets comprehensive standard      - [ ] Recommendations are specific and actionable      - [ ] Evidence provided for all major findings      - [ ] Technical validation completed using MCP tools      - [ ] Report formatting matches requirements    peer_review_criteria:
  - Analysis methodology is sound

- Findings are well-supported and credible

- Recommendations are practical and implementable

- Report is clear and well-organized

# Collaboration requirementscollaboration:
  handoff_preparation:
  - Prepare detailed findings for content improvement specialist

- Identify specific content enhancement opportunities

- Highlight user experience improvement areas

- Document technical constraints and requirements    coordination_points:
  - Share preliminary findings at 50% completion

- Validate technical recommendations with available tools

- Coordinate with other analysts if parallel analysis

# Enhanced metadatametadata:
  estimated_duration: 45-60 minutes  complexity_level: intermediate-advanced  required_tools: [DollhouseMCP, element_analysis_framework]  output_formats: [markdown, yaml, structured_report]  dependencies: [access_to_target_element, portfolio_search_capability]    session_info:
  session_id: SESSION_ID    session_directory: SESSION_MEMORY_PATH    worker_coordination: analyst_queuetimestamps:
  created_at: ISO_TIMESTAMP  claimed_at: null  started_at: null  completed_at: null  # Progress trackingprogress_milestones:
  25_percent: Element retrieved and initial assessment completed  50_percent: Structural analysis and quality assessment fini

shed  75_percent: Improvement opportunities identified and prioritized  100_percent: Complete analysis report delivered and validated

## Usage Guidelines

### Task Creation Workflow

1. Identify Target Element: Choose element needing analysis

2. Set Analysis Scope: Determine depth and focus areas

3. Configure Requirements: Specify deliverables and success criteria

4. Assign Specialization: Ensure task goes to analyst worker

5. Set Quality Gates: Define validation checkpoints

6. Plan Collaboration: Prepare for handoff to content specialist

### Quality Assurance Integration

- All analysis tasks include built-in quality gates

- Self-assessment checklists ensure completeness

- Peer review criteria maintain consistency

- Technical validation using MCP tools---Template Version: 2.0  Compatibility: Requires enhanced v2 analyst workers  Quality Standard: Comprehensive analysis with actionable recommendations
