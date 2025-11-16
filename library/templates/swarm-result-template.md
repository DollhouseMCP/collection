---
category: professional
description: >-
  Standard template for submitting completed task results with proper structure
  and metadata
examples: []
includes: []
name: swarm-result-template
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0
unique_id: unknown_swarm-result-template_anonymous_20251025-191021
type: template
author: DollhouseMCP
format: markdown
---
# Swarm Result Template

Use this template when submitting completed work to the orchestrator.

## Memory Name Formatswarm-result-task-id

Examples:
  - swarm-result-001-research-ai-trends

- swarm-result-042-analyze-feedback

- swarm-result-099-write-summary

## Template Content

yamltask_id: task-idworker_id: your-worker-idstatus: completedfailedoutput:
  The actual work product

- formatted according to task requirementsmetadata:
  execution_time_minutes: number  approach: brief description of your method  sources_consulted: number or list  challenges_encountered: any issues you overcame  quality_notes: self-assessment of outputcompleted_at: ISO timestamperror: null or error message if failed

## Field Descriptions

- task_id: Must match the task you worked on

- worker_id: Your worker identifier worker-1, worker-2, etc.

- status: Either completed or failed

- output: The actual deliverable markdown, code, analysis, etc.

- metadata: Additional context about execution

- completed_at: ISO timestamp when you fini

shed

- error: Only populated if status is failed

## Example: Successful Completion

yamltask_id: 001-research-mcp-serversworker_id: worker-1status: completedoutput:
  # MCP Servers Overview    #

# What are MCP Servers    Model Context Protocol MCP servers are specialized services that enable AI applications  to access external data sources, tools, and capabilities through a standardized interface.  They act as bridges between AI models and various systems, providing context and functionality  beyond the models training data.    #

# Popular MCP Servers

1. Filesystem MCP: Provides secure file system access with read/write capabilities

2. Database MCP: Enables SQL queries across various database systems

3. Web Search MCP: Integrates web search APIs for real-time information retrieval

4. GitHub MCP: Offers Git

Hub API integration for repository management

5. Memory MCP: Persistent storage for conversation context and user preferences

6. Browser MCP: Controlled web browser automation for data extraction

7. Slack MCP: Integration with Slack workspaces for communication    #

# Integration  Use Cases    MCP servers integrate with AI applications through a standardized protocol that defines  tools, resources, and prompts. Common use cases include:
  - Code Assistants: Accessing codebases, running tests, managing git repositories

- Research Tools: Web search, document analysis, data aggregation

- Productivity Apps: Calendar management, email integration, task tracking

- Data Analysis: Database queries, visualization, report generation    The protocols standardization allows AI applications to work with any MCP server  without custom integration code, making it easy to extend capabilities modularly.    Word Count: 247 wordsmetadata:
  execution_time_minutes: 11  approach: Web research across official MCP docs, Git

Hub repos, and community discussions. Synthesized findings into structured overview.  sources_consulted: 8  challenges_encountered: None

- straightforward research task with good source availability  quality_notes: Met all requirements. Output is well-structured, includes 7 servers as requested, and falls within target word count.completed_at: 2025-10-20T10:52:00Zerror: null

## Example: Failed Task

yamltask_id: 042-analyze-feedbackworker_id: worker-2status: failedoutput: nullmetadata:
  execution_time_minutes: 8  approach: Attempted to access feedback-log.json from specified location. Tried 3 alternative paths.  sources_consulted: 0  challenges_encountered: Unable to locate the required input file feedback-log.json. Checked: ./feedback-log.json, ./data/feedback-log.json, /.dollhouse/data/feedback-log.json. All returned file not found errors.  quality_notes: N/A

- could not complete due to missing inputcompleted_at: 2025-10-20T10:48:00Zerror: File not found: feedback-log.json. Task requires orchestrator to provide correct file path or alternative data source. Suggest: 1 Verify file exists and provide absolute path, 2 Provide data inline in task instructions, or 3 Use different data source.

## Metadata Best Practices

### execution_time_minutes

Track actual working time excluding wait times. Helps orchestrator estimate task complexity.

### approach

Briefly describe your method. Examples:
  - Web research → synthesis → validation

- Code analysis → pattern identification → documentation

- Data load → filtering → statistical analysis → visualization

### sources_consulted

Number or list of sources:
  - Research tasks: Number of articles/docs read

- Code tasks: Number of files analyzed

- Analysis tasks: Data sources examined

### challenges_encountered

Be honest about issues:
  - None

- straightforward task

- API rate limiting

- waited 2 min and retried successfully

- Ambiguous requirements

- interpreted X to mean Y

- Missing dependency

- installed and proceeded

### quality_notes

Self-assess your work:
  - Exceeded requirements

- added extra context

- Met all requirements as specified

- Partial completion

- completed 3/5 requirements due to data limitations

- Output quality high

- validated against multiple sources

## Status Guidelines

### When to Mark completed✅ All requirements met✅ Output formatted correctly✅ Quality meets expectations✅ Validated your work

### When to Mark failed❌ Missing required inputs/data❌ Cannot complete due to technical limitations❌ Requirements are ambiguous/contradictory❌ Encountered unrecoverable errors

## Output Formatting

### Match the Task RequirementsIf task says markdown format → provide markdown

If task says YAML structure → provide YAMLIf task says Python code → provide code with comments

### Be Complete

Include everything asked for:
  - All sections mentioned in requirements

- Expected word counts or size guidelines

- Examples, quotes, or evidence as requested

### Be Professional

- Clean formatting

- Proper grammar and spelling

- Structured and organized

- Easy to read

## Error Reporting Best Practices

### Good Error Message ✅Unable to access data source after 3 retry attempts. API returned 403 Forbidden.Attempted alternatives:
  1. Primary endpoint: https://api.example.com/data →

4032. Backup endpoint: https://backup.example.com/data → timeout

3. Cached version: ./cache/data.json → file not found

Task requires orchestrator to:
  - Provide valid API credentials, OR

- Supply alternative data source, OR

- Adjust task requirements to work with available data

### Poor Error Message ❌Didnt work.

## Quality Self-AssessmentRate your own work honestly:Excellent: Exceeded requirements, added value, high confidence

Good: Met all requirements, solid work, minor concernsAcceptable: Completed basics, could be better, some gaps

Needs Improvement: Partial work, quality issues, unsure if meets requirements

## Common Mistakes to Avoid❌ Empty output on failure: Always explain what went wrong❌ Incomplete output: Dont submit partial work as completed❌ No metadata: Include execution details for tracking❌ Wrong format: Match the output format requested in task❌ No validation: Check your work before submitting

## Validation Checklist

Before submitting, verify:- [ ] Task ID matches the task you worked on- [ ] Your worker ID is correct- [ ] Status accurately reflects outcome completed vs failed- [ ] Output includes everything requested in requirements- [ ] Output format matches task specifications- [ ] Metadata is complete and accurate- [ ] Timestamp is current- [ ] If failed, error message is clear and actionable---Remember: Your result is the only way the orchestrator knows what you did. Make it clear, complete, and professional. Quality results = smooth swarm operation.
