---
type: tool
name: Task Prioritizer
description: MCP tool for intelligent task prioritization using multiple frameworks
unique_id: task-prioritizer_20250715-100400_dollhousemcp
author: dollhousemcp
category: personal
version: 1.0.0
created_date: 2025-07-15
tags: [productivity, task-management, prioritization, planning]
license: MIT
mcp_version: 1.0.0
mcp_config:
  tool_name: prioritize_tasks
  parameters:
    - name: tasks
      type: array
      description: List of tasks to prioritize
      required: true
    - name: method
      type: string
      description: Prioritization method (eisenhower, moscow, rice, value-effort)
      default: eisenhower
    - name: context
      type: object
      description: Additional context (deadlines, resources, goals)
      required: false
---

# Task Prioritizer Tool

An MCP tool that helps prioritize tasks using various proven frameworks.

## Tool Configuration

```typescript
{
  name: "prioritize_tasks",
  description: "Intelligently prioritize tasks using various frameworks",
  inputSchema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            deadline: { type: "string", format: "date" },
            effort: { type: "number", min: 1, max: 10 },
            value: { type: "number", min: 1, max: 10 }
          }
        }
      },
      method: {
        type: "string",
        enum: ["eisenhower", "moscow", "rice", "value-effort"]
      }
    }
  }
}
```

## Prioritization Methods

### 1. Eisenhower Matrix
Categorizes tasks by urgency and importance:
- **Do First**: Urgent & Important
- **Schedule**: Important but not Urgent
- **Delegate**: Urgent but not Important
- **Eliminate**: Neither Urgent nor Important

### 2. MoSCoW Method
- **Must Have**: Critical for success
- **Should Have**: Important but not critical
- **Could Have**: Nice to have
- **Won't Have**: Not a priority now

### 3. RICE Scoring
Calculates score based on:
- **Reach**: How many people affected
- **Impact**: How much it helps
- **Confidence**: How sure we are
- **Effort**: How much work required

### 4. Value vs Effort Matrix
- **Quick Wins**: High value, low effort
- **Major Projects**: High value, high effort
- **Fill-ins**: Low value, low effort
- **Avoid**: Low value, high effort

## Usage Example

```javascript
const result = await prioritize_tasks({
  tasks: [
    {
      title: "Write project proposal",
      deadline: "2025-07-20",
      effort: 7,
      value: 9
    },
    {
      title: "Update website",
      deadline: "2025-08-01",
      effort: 5,
      value: 6
    }
  ],
  method: "value-effort"
});
```

## Output Format

```json
{
  "prioritized_tasks": [
    {
      "task": "Write project proposal",
      "priority": 1,
      "category": "Major Project",
      "score": 85,
      "reasoning": "High value despite high effort"
    }
  ],
  "summary": {
    "total_tasks": 2,
    "method_used": "value-effort",
    "recommendations": ["Focus on quick wins first"]
  }
}
```

## Integration

This tool can be integrated with:
- Task management systems
- Calendar applications
- Project planning tools
- Personal productivity workflows

## Best Practices

1. Review priorities weekly
2. Consider multiple methods
3. Adjust for changing contexts
4. Balance short and long-term goals
5. Don't over-prioritize