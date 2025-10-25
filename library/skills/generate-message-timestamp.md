---
name: generate-message-timestamp
description: >-
  Generates timestamp-based sequence IDs for plan message files using system
  clock to avoid LLM counting errors
version: 1.0.0
created: '2025-10-23T16:41:07.476Z'
modified: '2025-10-23T16:41:07.476Z'
tags:
  - timestamp
  - messaging
  - plans
  - system-clock
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_generate-message-timestamp_anonymous_20251023-164107
type: skill
author: DollhouseMCP
capabilities:
  - general-purpose
---
## Skill: Generate Message Timestamp### PurposeGenerates timestamp-based sequence IDs for plan message files. Uses system clock instead of manual counting to avoid LLM sequencing errors.### UsageCall this skill whenever creating a new message file in a plan folder. It returns both the filename prefix and ISO timestamp for metadata.### Implementationjavascript// Returns timestamp-based filename prefix and metadata timestampfunction generateMessageTimestamp   const now = new Date    // Format: YYYYMMDD-HHMMSS-mmm  const year = now.getFullYear  const month = Stringnow.getMonth + 1.padStart2, 0  const day = Stringnow.getDate.padStart2, 0  const hours = Stringnow.getHours.padStart2, 0  const minutes = Stringnow.getMinutes.padStart2, 0  const seconds = Stringnow.getSeconds.padStart2, 0  const milliseconds = Stringnow.getMilliseconds.padStart3, 0    const filenamePrefix = yearmonthday-hoursminutesseconds-milliseconds  const isoTimestamp = now.toISOString    return     filenamePrefix,    isoTimestamp,    fullExample: filenamePrefix-type-sender.yaml  // Example output:// //   filenamePrefix: 20251023-121500-001,//   isoTimestamp: 2025-10-23T12:15:00.001Z,//   fullExample: 20251023-121500-001-type-sender.yaml// ### Bash ImplementationFor Claude Code to execute:bash#/bin/bash# Generate timestamp-based sequence ID# Get current timestamp componentsTIMESTAMP=date +%Y%m%d-%H%M%SMILLIS=date +%3N  # 3-digit milliseconds# Combine into filename prefixPREFIX=TIMESTAMP-MILLIS# Get ISO timestamp for metadataISO_TIMESTAMP=date -u +%Y-%m-%dT%H:%M:%S.%3NZ# Output as JSON for easy parsingcat EOF  filenamePrefix: PREFIX,  isoTimestamp: ISO_TIMESTAMP,  fullExample: PREFIX-type-sender.yamlEOF### Usage in Message CreationWhen creating a new message:1. Call generate-message-timestamp to get the prefix2. Construct full filename: prefix-message-type-sender.yaml3. Use isoTimestamp in the message metadataExample:bash# Get timestampTIMESTAMP_DATA=bash generate-timestamp.shPREFIX=echo TIMESTAMP_DATA  jq -r .filenamePrefixISO=echo TIMESTAMP_DATA  jq -r .isoTimestamp# Create message fileFILENAME=PREFIX-status-coder.yaml### Benefits✅ No LLM counting errors: System clock is authoritative  ✅ Chronological sorting: Files sort naturally by name  ✅ Collision-resistant: Millisecond precision prevents duplicates  ✅ Human-readable: Format is easy to parse visually  ✅ Metadata consistency: ISO timestamp matches filename### Notes- Milliseconds provide collision resistance for rapid message creation- Format is sortable both as string and numerically- Compatible with filesystem naming conventions- Works across platforms with minor date command variations
