---
name: todo-system-skills
description: >-
  Specialized skills for managing software development todo systems with AI
  agent collaboration
author: Claude
version: 1.0.0
created: '2025-08-15T17:36:28.890Z'
modified: '2025-08-15T17:36:28.890Z'
tags:
  - task-management
  - ai-collaboration
  - workflow-optimization
  - project-management
  - software-development
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
# Todo System Management Skills

This skill provides specific functions and utilities for working with the Software Development Todo System template and dev-task-manager agent.

## Task Analysis Functions

### analyze_task_prioritytasks_list, project_constraints

Analyzes a list of tasks and suggests optimal prioritization based on:
  - Dependencies between tasks

- Effort estimates and available resources

- Business impact and risk factors

- Technical constraints and blockers

### estimate_task_efforttask_description, context

Provides effort estimation for development tasks using:
  - Task complexity analysis

- Historical data patterns

- Technical requirements assessment

- Risk and uncertainty factors

### identify_ai_suitable_taskstasks_list

Evaluates tasks to determine which are suitable for AI automation:
  - Code generation tasks with clear specifications

- Test creation and documentation tasks

- Refactoring and analysis work

- Routine development operations

## Progress Tracking Functions

### calculate_sprint_velocitycompleted_tasks, time_period

Tracks team velocity and productivity metrics:
  - Story points completed over time

- Task completion rates

- AI vs human contribution ratios

- Trend analysis and forecasting

### generate_progress_reporttodo_list, time_period

Creates comprehensive progress reports including:
  - Task completion statistics

- Blockers and risk analysis

- Resource utilization metrics

- Recommendations for improvement

### update_task_dependenciestodo_list, completed_task

Automatically updates task statuses when dependencies are resolved:
  - Identifies dependent tasks

- Updates availability status

- Suggests next actions

- Maintains dependency graph

## AI Agent Integration Functions

### prepare_ai_task_contexttask, codebase_info

Prepares comprehensive context for AI agents:
  - Extracts relevant code files and documentation

- Identifies coding patterns and conventions

- Gathers test examples and requirements

- Creates clear task specifications

### validate_ai_outputai_result, acceptance_criteria

Validates AI-generated work against requirements:
  - Code quality and standards compliance

- Test coverage and functionality

- Documentation completeness

- Integration compatibility

### manage_ai_task_queueai_tasks, resource_availability

Optimizes AI task processing:
  - Prioritizes tasks based on dependencies

- Balances workload across available AI resources

- Manages task scheduling and timing

- Handles error recovery and retries

## Human-AI Collaboration Functions

### suggest_task_assignmenttask, team_capabilities

Recommends optimal task assignment:
  - Evaluates human vs AI suitability

- Considers current workload and availability

- Assesses skill requirements and complexity

- Suggests collaborative approaches

### facilitate_handoffscompleted_work, next_assignee

Manages work handoffs between humans and AI:
  - Creates detailed transition documentation

- Validates work completion criteria

- Prepares context for next phase

- Tracks handoff quality and issues

### coordinate_review_processcompleted_tasks, reviewers

Manages code review and quality assurance:
  - Assigns appropriate reviewers

- Tracks review status and feedback

- Manages revision cycles

- Ensures quality standards

## Workflow Optimization Functions

### identify_workflow_bottleneckstodo_history, team_metrics

Analyzes workflow efficiency:
  - Identifies common delay patterns

- Suggests process improvements

- Recommends automation opportunities

- Tracks improvement impact

### optimize_task_breakdownlarge_task, team_structure

Breaks down complex tasks effectively:
  - Identifies logical sub-components

- Ensures proper dependency ordering

- Balances task sizes and complexity

- Considers team skills and availability

### suggest_process_improvementsproject_metrics, industry_best_practices

Recommends development process enhancements:
  - Compares current performance to benchmarks

- Suggests tooling and automation improvements

- Identifies training and skill development needs

- Proposes workflow optimizations

## Integration and Automation Functions

### sync_with_external_toolstodo_list, tool_integrations

Synchronizes with external project management tools:
  - Updates issue trackers and project boards

- Syncs with CI/CD pipeline status

- Integrates with version control systems

- Maintains data consistency across tools

### automate_routine_updatestodo_list, automation_rules

Handles routine todo list maintenance:
  - Updates task statuses based on external events

- Applies recurring task patterns

- Manages deadline reminders and escalations

- Maintains data quality and consistency

### generate_reports_and_da

shboardsproject_data, stakeholder_needs

Creates various project reporting formats:
  - Executive summary da

shboards

- Technical progress reports

- Team performance metrics

- Risk and blocker analysis

## Quality Assurance Functions

### validate_todo_completenesstodo_list, project_requirements

Ensures todo lists cover all necessary work:
  - Checks against project specifications

- Identifies missing tasks or gaps

- Validates acceptance criteria completeness

- Suggests additional quality gates

### audit_task_qualitycompleted_tasks, quality_standards

Reviews completed work for quality compliance:
  - Code quality and standards adherence

- Test coverage and documentation quality

- Security and performance considerations

- Maintenance and support readiness

### maintain_knowledge_baseproject_learnings, team_experience

Captures and organizes project knowledge:
  - Documents lessons learned and best practices

- Maintains decision logs and rationale

- Creates reusable patterns and templates

- Supports knowledge transfer and onboarding

## Usage Examplesmarkdown

# Example: Analyzing and optimizing a sprint backlog

1. Load current todo list from dev-todo-system template

2. Run analyze_task_priority to optimize ordering

3. Use identify_ai_suitable_tasks to find automation opportunities

4. Apply prepare_ai_task_context for AI-ready tasks

5. Generate progress tracking with calculate_sprint_velocity

# Example: Managing AI agent collaboration

1. Use suggest_task_assignment to determine human vs AI work

2. Apply prepare_ai_task_context for AI tasks

3. Monitor progress with manage_ai_task_queue

4. Validate outputs with validate_ai_output

5. Handle handoffs with facilitate_handoffs

# Example: Continuous improvement cycle

1. Analyze workflow with identify_workflow_bottlenecks

2. Generate insights with generate_progress_report

3. Apply optimizations with suggest_process_improvements

4. Track improvements with project metrics

5. Update processes and templates based on learnings

These skills work together with the dev-todo-system template and dev-task-manager agent to create a comprehensive, AI-enhanced development workflow management system.
