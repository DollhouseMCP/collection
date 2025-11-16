---
category: professional
description: Standard template for creating swarm task memories with all required fields
examples: []
includes: []
name: swarm-task-template
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0
unique_id: unknown_swarm-task-template_anonymous_20251025-191021
type: template
author: DollhouseMCP
format: markdown
---
# Swarm Task Template

Use this template when creating new tasks for the swarm.

## Memory Name Formatswarm-task-task-id

Examples:
  - swarm-task-001-research-ai-trends

- swarm-task-042-analyze-feedback

- swarm-task-099-write-summary

## Template Content

yamltask_id: unique-task-idstatus: pendingpriority: highmediumlowassigned_to: nulltask_type: researchwriteanalyzecodetestreviewinstructions:
  Detailed task instructions here    Requirements:
  1. Requirement 1

2. Requirement 2

3. Requirement 3    Expected output format:
  Describe the format/structure expected    Estimated time: X-Y minutesinputs:
  input_key: input_valuecreated_at: ISO timestampclaimed_at: nullcompleted_at: null

## Field Descriptions

- task_id: Unique identifier matches memory name

- status: Current state pending, claimed, in-progress, completed, failed

- priority: Urgency level high, medium, low

- assigned_to: Worker ID once claimed null until then

- task_type: Cate

gory of work for routing/filtering

- instructions: Detailed, self-contained description of work to do

- inputs: Any data, URLs, files, or context needed

- created_at: ISO timestamp when task was created

- claimed_at: ISO timestamp when worker claimed it

- completed_at: ISO timestamp when completed

## Example Task

yamltask_id: 001-research-mcp-serversstatus: pendingpriority: highassigned_to: nulltask_type: researchinstructions:
  Research and create a comprehensive summary of Model Context Protocol MCP servers.    Requirements:
  1. Define what MCP servers are and their purpose

2. List 5-7 popular MCP servers with descriptions

3. Explain how they integrate with AI applications

4. Include benefits and use cases

5. Provide markdown formatted output 300-500 words    Expected output format:
  # MCP Servers Overview    #

# What are MCP Servers  [Definition and purpose]    #

# Popular MCP Servers  1. [Name]: [Description]  [Continue for all servers]    #

# Integration  Use Cases  [Explanation]    Estimated time: 10-12 minutesinputs:
  research_depth: comprehensive  output_format: markdown  min_sources: 5created_at: 2025-10-20T10:30:00Zclaimed_at: nullcompleted_at: null

## Task Sizing Guidelines

### Too Small Dont Create

- Single file read

- Simple yes/no check

- Trivial computation

Combine these into larger tasks.

### Just Right ✅

- Research a topic and summarize

- Analyze data and extract insights

- Write documentation section

- Generate code with tests

- Review and provide feedback

Target: 5-15 minute completion time

### Too Large Break Down

- Analyze entire codebase

- Write complete documentation

- Research everything about XBreak into multiple tasks with clear scope.

## Priority Guideline

sHigh Priority:
  - Blocking other work

- Time-sensitive deliverable

- Critical path item

- Urgent requestMedium Priority:
  - Important but not urgent

- Can wait 30-60 minutes

- Supporting work

- Enhancement

Low Priority:
  - Nice-to-have

- Background task

- No deadline

- Optimization

## Task Type Cate

gories

- research: Gather information, analyze sources, summarize findings

- write: Create documentation, articles, reports, content

- analyze: Process data, identify patterns, extract insights

- code: Write or modify code, create scripts

- test: Write tests, validate functionality, QA

- review: Evaluate code/content, provide feedback, assess quality

## Best Practices

1. Self-contained: Include ALL needed context and inputs

2. Clear requirements: Be specific about what done means

3. Expected output: Describe format and structure

4. Estimated time: Help workers prioritize

5. Validation criteria: How will quality be assessed

## Common Mistakes to Avoid❌ Vague instructions: Do some research on AI✅ Clear instructions: Research AI agent coordination patterns, focusing on communication protocols, task distribution, and conflict resolution. Output 500-word markdown summary.❌ Missing context: Analyze the data✅ Complete context: Analyze the user feedback data in feedback-log.json. Identify top 5 themes, provide frequency counts and example quotes.❌ Unclear output: Write something about MCP✅ Defined output: Write a 300-word introduction to MCP servers in markdown format with sections: Definition, Benefits, Use Cases❌ Unrealistic scope: Create a complete AI agent system✅ Achievable scope: Create a Python script that polls a directory for new files and logs their names---Remember: Good tasks are clear, complete, and achievable. Workers should know exactly what to do without asking questions.
