---
name: dollhouse-diagnostic-tool
description: >-
  Advanced diagnostic tool for troubleshooting DollhouseMCP indexing issues,
  file parsing problems, and system health monitoring
version: 1.0.0
created: '2025-08-25T13:41:00.780Z'
modified: '2025-08-25T13:41:00.780Z'
tags: []
dependencies:
  - filesystem_access
  - dollhousemcp_tools
custom: {}
languages: []
complexity: intermediate
domains:
  - diagnostics
  - troubleshooting
  - system_health
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# DollhouseMCP Diagnostic Tool

## Purpose

Advanced diagnostic skill for identifying and resolving DollhouseMCP system issues including:
  - Persona indexing failures

- File parsing problems

- System health monitoring

- Cache synchronization issues

- Metadata validation errors

## Diagnostic Procedures

###

1. File System Analysis

- Compare filesystem contents with DollhouseMCP index

- Identify orphaned files exist on disk but not indexed

- Detect missing files indexed but not on disk

- Analyze file permissions and access issues

- Check for encoding problems or invisible characters

###

2. Metadata Validation

- Parse YAML frontmatter for syntax errors

- Validate required fields and data types

- Check for malformed unique_ids or timestamps

- Identify version conflicts or duplicate entries

- Verify author and attribution formats

###

3. Index Health Check

- Compare element counts between filesystem and index

- Identify elements that fail to load during reload

- Monitor cache coherence and synchronization

- Check for stale index entries

- Analyze loading performance metrics

###

4. Content Structure Analysis

- Validate persona content structure

- Check for required sections and formatting

- Identify potential parsing conflicts

- Analyze trigger word patterns

- Verify content flags and metadata consistency

## Usage Examples

### Basic File Discrepancy Check

1. List filesystem contents in personas directory

2. Compare with DollhouseMCP list_elements output

3. Identify missing or extra files

4. Report discrepancies with recommendations

### Deep Metadata Analysis

1. Read all persona files directly from filesystem

2. Parse YAML frontmatter independently

3. Validate against DollhouseMCP schema

4. Report parsing errors and validation issues

### System Health Report

1. Check index coherence across all element types

2. Validate cache synchronization

3. Test reload functionality

4. Generate comprehensive system health summary

## Trouble

shooting Workflow

1. Identify the Problem: Use filesystem tools to compare actual files with indexed elements

2. Isolate the Cause: Parse problematic files manually to identify specific issues

3. Validate Solutions: Test fixes by monitoring reload and indexing behavior

4. Generate Report: Provide actionable recommendations for resolving issues

This diagnostic tool should be used whenever there are discrepancies between filesystem contents and DollhouseMCP indexing behavior.
