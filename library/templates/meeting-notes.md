---
name: Meeting Notes
description: Structured template for capturing and organizing meeting information
type: template
version: 1.0.0
author: dollhousemcp
created_date: '2025-07-23'
category: professional
tags:
  - meeting
  - notes
  - documentation
  - collaboration
variables:
  - meeting_title
  - meeting_date
  - attendees
  - meeting_type
  - duration
outputFormats:
  - markdown
  - html
  - pdf
includes: []
unique_id: template_meeting-notes_dollhousemcp_20250723-165719
format: markdown
---

# {{meeting_title}}

**Date:** {{meeting_date}}  
**Time:** {{meeting_time}}  
**Duration:** {{duration}}  
**Type:** {{meeting_type}}  

## Attendees
{{#each attendees}}
- {{name}} {{#if role}}({{role}}){{/if}}
{{/each}}

## Agenda
{{#if agenda_items}}
{{#each agenda_items}}
1. {{topic}} {{#if time_allocation}}({{time_allocation}}){{/if}}
{{/each}}
{{else}}
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]
{{/if}}

## Meeting Notes

### Key Discussion Points
{{#if discussion_points}}
{{#each discussion_points}}
- **{{topic}}**: {{summary}}
  {{#if details}}
  - {{details}}
  {{/if}}
{{/each}}
{{else}}
- **[Topic]**: [Summary of discussion]
  - [Key point 1]
  - [Key point 2]
{{/if}}

### Decisions Made
{{#if decisions}}
{{#each decisions}}
1. **{{decision}}**
   - Rationale: {{rationale}}
   - Impact: {{impact}}
   {{#if dissenting_opinions}}- Dissenting opinions: {{dissenting_opinions}}{{/if}}
{{/each}}
{{else}}
1. **[Decision]**
   - Rationale: [Why this decision]
   - Impact: [What changes]
{{/if}}

### Action Items
{{#if action_items}}
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
{{#each action_items}}
| {{action}} | {{owner}} | {{due_date}} | {{priority}} |
{{/each}}
{{else}}
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| [Task description] | [Name] | [Date] | High/Medium/Low |
{{/if}}

### Questions & Concerns
{{#if questions}}
{{#each questions}}
- **Q:** {{question}}
  - **A:** {{#if answer}}{{answer}}{{else}}[Pending]{{/if}}
{{/each}}
{{else}}
- **Q:** [Question]
  - **A:** [Answer or "Pending"]
{{/if}}

### Next Steps
{{#if next_steps}}
{{#each next_steps}}
1. {{step}} {{#if responsible}}({{responsible}}){{/if}}
{{/each}}
{{else}}
1. [Next step 1]
2. [Next step 2]
3. Schedule follow-up meeting
{{/if}}

### Resources & References
{{#if resources}}
{{#each resources}}
- [{{title}}]({{url}}) {{#if description}}- {{description}}{{/if}}
{{/each}}
{{else}}
- [Document/Link title](URL)
{{/if}}

## Follow-up
**Next Meeting:** {{#if next_meeting_date}}{{next_meeting_date}}{{else}}TBD{{/if}}  
**Meeting Recording:** {{#if recording_link}}[Link]({{recording_link}}){{else}}N/A{{/if}}  
**Additional Notes:** {{#if additional_notes}}{{additional_notes}}{{else}}None{{/if}}

---
*Notes taken by: {{note_taker}}*  
*Reviewed by: {{#if reviewer}}{{reviewer}}{{else}}Pending review{{/if}}*
