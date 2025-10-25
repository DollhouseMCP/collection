---
name: claude-code-vscode-best-practices
description: >-
  Best practices for working with Mick in Claude Code with VS Code integration -
  includes file path conventions, notification preferences, and workflow
  optimizations
author: alex-sterling-mick
version: 1.0.0
created: '2025-09-05T14:48:43.087Z'
modified: '2025-09-05T14:48:43.087Z'
tags:
  - workflow
  - productivity
  - best-practices
  - vscode
  - claude-code
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_claude-code-vscode-best-practices_alex-sterling-mick_20250905-144843
type: skill
capabilities:
  - general-purpose
---
# Claude Code + VS Code Best Practices for Working with Mick

## File Path References

### ALWAYS Use Full Absolute Paths

When referencing any file, ALWAYS provide the complete absolute path:- ✅ CORRECT: /Users/mick/Developer/Organizations/DollhouseMCP/active/developer-kit/frameworks/RAPPEL_FRAMEWORK_DOLLHOUSEMCP.md- ❌ WRONG: RAPPEL_FRAMEWORK_DOLLHOUSEMCP.md- ❌ WRONG: frameworks/RAPPEL_FRAMEWORK_DOLLHOUSEMCP.md

### Clickable Links in VS CodeVS Code makes absolute paths clickable. Format them as:File created at: /Users/mick/Developer/Organizations/DollhouseMCP/active/developer-kit/frameworks/RAPPEL_FRAMEWORK_DOLLHOUSEMCP.md

### Line Number References

When referencing specific code locations:Check the implementation at: /Users/mick/Developer/Organizations/DollhouseMCP/active/mcp-server/src/index.ts:245

## Audio Summaries

### When to Provide Audio Summaries

- After completing each major task or prompt response

- When Mick mentions working on other things

- When eyes are not focused on text chat

- Keep summaries to 20-30 seconds max

### Audio Summary Format

bashsay -r 175 Brief summary of what was accompli

shed. Key points only. File created at full path if relevant.

## Directory Awareness

### Always Verify Current Directory

Before file operations, especially when switching between repos:ba

shpwd  # Always confirm location first

### Common Working Directories

- Main development: /Users/mick/Developer/Organizations/DollhouseMCP/active/mcp-server

- Business docs: /Users/mick/Developer/Organizations/DollhouseMCP/active/business

- Developer kit: /Users/mick/Developer/Organizations/DollhouseMCP/active/developer-kit

- DollhouseMCP config: /Users/mick/.dollhouse

## VS Code Integration Patterns

### File Creation Notifications

When creating files, format the response as:Created: /Users/mick/Developer/Organizations/DollhouseMCP/[full/path/to/file.ext][Brief description of what was created]

### File Modification NotificationsModified: /Users/mick/Developer/Organizations/DollhouseMCP/[full/path/to/file.ext]:line_numbers

Changes: [Brief summary]

### Multiple File Operations

List each file with full path:Files created:- /Users/mick/Developer/Organizations/DollhouseMCP/path/to/file1.md- /Users/mick/Developer/Organizations/DollhouseMCP/path/to/file2.js- /Users/mick/Developer/Organizations/DollhouseMCP/path/to/file3.ts

## Workflow Preferences

### Task Tracking

- Use Todo

Write for multi-step tasks

- Update status immediately upon completion

- Dont batch status updates

### Documentation

- Session notes go in: /Users/mick/Developer/Organizations/DollhouseMCP/active/business/documents/session-notes/

- Always include date in filename: SESSION_2025_09_05_[TOPIC].md

### Code Changes

- Run lint/typecheck after modifications

- Mention if commands are missing from CLAUDE.md

- Never commit unless explicitly requested

## Platform-Specific Behaviors

### Claude Code + VS Code Specific

- File paths are clickable in VS Code terminal

- VS Code may auto-open files when created

- Watch for user opened file system reminders

- Respect VS Code workspace boundaries

### Search Patterns

- Use Glob for file searches in current workspace

- Use full paths when suggesting files to open

- Verify file existence before suggesting paths

## Communication Style

### Conciseness

- Keep responses brief and actionable

- Full paths dont count against brevity

- Audio summaries supplement, not replace, text

### Status Updates

When Mick is multitasking:
  1. Provide quick text summary

2. Follow with audio summary

3. Include full paths for any files referenced

### Error Handling

If VS Code cant open a file:
  - Double-check the full path

- Verify file actually exists

- Provide alternative navigation instructions

## Quick Reference Template

When responding about file operations:Task: [What was done]Location: /Users/mick/Developer/Organizations/DollhouseMCP/[full/path]Status: ✅ Complete[Audio summary via say command]

## Integration with Other Skills

This skill works alongside:
  - alex-sterling persona primary work persona

- conversation-audio-summarizer audio updates

- session-notes-writer documentation

## Platform Detection FutureReserved for auto-detection logic:yamlplatforms:
  claude-code-vscode: active  cursor-ide: available  windsurf: available  gemini-workspace: available  baud-desktop: available

When platform detection is implemented, appropriate skill will auto-activate.
