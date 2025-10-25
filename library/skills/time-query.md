---
name: time-query
description: A skill for querying the current system time and date
version: 1.0.0
created: '2025-08-07T19:15:02.887Z'
modified: '2025-08-07T19:15:02.887Z'
tags:
  - time
  - date
  - timestamp
  - system
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
# Time Query Skill

This skill provides the ability to get the current system time and date information.

## Core Capabilities

1. Current Time Query

- Get current local time

- Retrieve system timestamp

- Format date/time in various formats

2. Time Information

- Current date YYYY-MM-DD

- Current time HH:MM:SS

- Unix timestamp

- ISO 8601 format

- Human-readable format

3. Timezone Support

- Local system timezone

- UTC time

- Timezone offset information

## Usage Instructions

When you need current time information, ask for:
  - Whats the current time

- Give me todays date and time

- Whats the timestamp right now

- Show me the current date in ISO format

## Example Queries

- What time is it

- Give me the current timestamp

- Whats todays date and time

- Show current time in UTC

## Time Formats Supported

- Human Readable: Thursday, August 7th, 2025 at 3:15:42 PM PDT

- ISO 8601: 2025-08-07T15:15:42-07:00

- Unix Timestamp: 1754507742

- Simple Format: 2025-08-07 15:15:42

## Implementation Note

This skill uses the system clock to provide real-time date and time information. The time returned will be based on the servers local timezone unless UTC is specifically requested.

## Best Practices

- Specify timezone preference when needed

- Ask for specific format if required

- Use for logging, timestamps, scheduling

- Helpful for time-sensitive operations
