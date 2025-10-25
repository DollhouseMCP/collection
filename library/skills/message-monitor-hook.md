---
name: message-monitor-hook
description: >-
  A hook-style element that monitors all messages and triggers reactions based
  on configurable conditions
version: 1.0.0
created: '2025-08-09T14:03:37.453Z'
modified: '2025-08-09T14:03:37.453Z'
tags: []
dependencies: []
custom: {}
languages:
  - any
complexity: intermediate
domains:
  - development
  - automation
  - workflow
prerequisites:
  - basic understanding of hooks
  - workflow automation concepts
parameters: []
examples: []
proficiency_level: 0
---
# Message Monitor Hook

## Purpose

Provides software development hook-like functionality to monitor all conversation messages and trigger conditional reactions based on configurable patterns and rules.

## Core Functionality

### Message Monitoring

- Passive observation of all incoming messages

- Pattern matching against configured triggers

- Context-aware condition evaluation

- Silent operation unless triggered

### Conditional Triggering

- Keyword-based triggers exact match, regex, semantic

- Context-sensitive conditions technical depth, project phase, urgency

- User behavior patterns repeated questions, f

rustration indicators

- Time-based triggers session duration, inactivity

### Reaction System

- Automated responses for common patterns

- Proactive suggestions based on context

- Resource recommendations

- Workflow automation triggers

## Configuration Patterns

### Trigger Types

yamltriggers:
  keywords: [error, help, stuck, problem]  patterns:
  - regex: how do I .

- semantic: user expressing confusion  conditions:
  - technical_depth  7

- session_duration  30min

- repeated_topic: true

### Reaction Definitions

yamlreactions:
  offer_documentation:
  trigger: API questions    action: Suggest relevant docs    debugging_assistance:
  trigger: error patterns    action: Activate debugging persona      break_suggestion:
  trigger: session_duration  2hours    action: Suggest taking a break

## Implementation Hooks

### Message Lifecycle Events

- on_message_received: Initial message processing

- on_pattern_match: When trigger conditions met

- on_context_change: When conversation shifts topics

- on_session_milestone: Time or progress based triggers

### Reaction Lifecycle

- evaluate_conditions: Check if reaction should trigger

- prepare_response: Gather context for reaction

- execute_reaction: Perform the configured action

- post_reaction_cleanup: Update state after reaction

## Usage Examples

### Development Debugging HookTrigger: User mentions not working, error, bug

Reaction: Automatically suggest debugging checklist

### Learning Progress Hook  Trigger: User asks similar questions 3+ times

Reaction: Offer deeper explanation or alternative approach

### Productivity HookTrigger: Session  90 minutes without break

Reaction: Gentle reminder about taking breaks

### Project Milestone HookTrigger: Technical decision points reached

Reaction: Auto-save session state and offer documentation

## Integration Points

### With Other Elements

- Personas: Can trigger persona switches based on context

- Agents: Can activate agents for specific scenarios

- Templates: Can auto-populate templates when patterns match

- Memories: Can store triggered patterns for learning

### With External Systems

- File system monitoring for code changes

- Git hook integration for commit-based triggers

- IDE integration for development workflow hooks

## Benefits

- Proactive assistance without interruption

- Consistent workflow enforcement

- Automated knowledge capture

- Reduced cognitive load on users

- Pattern recognition and learning

## Configuration

The hook system should be configurable through:
  - YAML configuration files

- Runtime configuration updates

- User preference learning

- Project-specific rule sets
