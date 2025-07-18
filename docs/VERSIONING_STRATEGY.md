# DollhouseMCP Versioning & Timestamp Strategy

*Last Updated: July 18, 2025*

## Overview

This document defines the versioning and timestamp strategy for the DollhouseMCP Collection, balancing human readability, computer parseability, and practical content management needs.

## The Challenge

Content in the collection consists of text files (Markdown with YAML frontmatter) that may be:
- Edited frequently for typos or minor improvements
- Created by both automated systems and human contributors
- Accessed via git, APIs, and file systems
- Subject to naming restrictions on various platforms

## Versioning Strategy

### 1. Unique Identifier (unique_id)

**Format**: `{type}_{content-name}_{author}_{datetime}`

**Examples**:
- `persona_creative-writer_dollhousemcp_20250718-143025`
- `skill_debugging-assistant_alice_20250719-091500`
- `tool_task-prioritizer_anon_20250720-120000`

**Datetime Format**: `YYYYMMDD-HHMMSS` (filesystem safe, no colons)

**Rationale**:
- **Content type prefix**: Immediately identifies what kind of content
- **Datetime stamps**: Provides precise creation time and natural chronological sorting
- **Filesystem safe**: No colons or special characters that cause issues
- **Human readable**: Clear what it is, who made it, and when
- **Anti-spoofing**: Different timestamps make impersonation attempts obvious

### 2. Date and Time Tracking

**Comprehensive timestamp approach**:

```yaml
# In frontmatter
created_date: 2025-07-15               # Date for human readability
created_time: 2025-07-15T14:30:25Z     # Full ISO 8601 timestamp
updated_date: 2025-07-18               # Date of last significant update
updated_time: 2025-07-18T09:15:00Z     # Full timestamp of last update
version: "1.2.0"                       # Version tracking
```

**Benefits**:
- **Dual format**: Date for humans, full timestamp for systems
- **created_date/time**: Immutable, set once during initial creation
- **updated_date/time**: Changes only on meaningful updates (not typo fixes)
- **Precise ordering**: Full timestamps enable exact chronological sorting
- **API compatibility**: Systems can use either format as needed

### 3. Version History Tracking

For detailed history, rely on:
1. **Git commits**: Precise timestamps and change details
2. **GitHub API**: Access to full history programmatically
3. **PR metadata**: Review dates, approvals, and discussions

## Implementation Guidelines

### Content Creation Flow

1. **User submits content** (via MCP server or PR):
   ```yaml
   name: "My Cool Persona"
   author: "alice"  # or "anon" if not provided
   ```

2. **Validation process adds**:
   ```yaml
   unique_id: "persona_my-cool-persona_alice_20250718-143025"
   created_date: 2025-07-18
   created_time: 2025-07-18T14:30:25Z
   version: "1.0.0"
   ```

3. **Timestamp generation**:
   - Server-side generation prevents client manipulation
   - Uses UTC time for consistency
   - Format: YYYYMMDD-HHMMSS (filesystem safe)

### Update Classification

**Patch Version (1.0.x)**: Typos, formatting, minor clarifications
- Don't update `updated_date`
- Increment patch version

**Minor Version (1.x.0)**: New capabilities, expanded content
- Update `updated_date`
- Increment minor version

**Major Version (x.0.0)**: Breaking changes, complete rewrites
- Update `updated_date`
- Increment major version
- Consider new unique_id if fundamentally different

## Best Practices

### 1. For Content Creators
- Don't manually set timestamps or sequence numbers
- Use descriptive names that work as slugs
- Include your author identifier or use "anon"

### 2. For System Implementers
- Generate unique_ids during validation
- Preserve timestamps during migrations
- Use git history for audit trails

### 3. For API Consumers
- Parse unique_id components with underscores as delimiters
- Sort by created_date for chronological ordering
- Use version for compatibility checking

## Examples

### New Persona Submission
```yaml
# User provides:
name: "Data Scientist"
author: "dr_smith"
description: "Analytical data science expert"

# System generates:
unique_id: "persona_data-scientist_dr-smith_20250718-162530"
created_date: 2025-07-18
created_time: 2025-07-18T16:25:30Z
version: "1.0.0"
```

### Typo Fix
```yaml
# Before:
version: "1.0.0"
description: "Helps with debuging code"  # typo

# After:
version: "1.0.1"  # Patch bump
description: "Helps with debugging code"
# updated_date: unchanged
```

### Feature Addition
```yaml
# Before:
version: "1.0.1"
capabilities: ["error_analysis"]

# After:
version: "1.1.0"  # Minor bump
updated_date: 2025-07-19  # Now updated
capabilities: ["error_analysis", "performance_profiling"]
```

## Migration Path

For existing content:
1. Keep existing unique_ids for backward compatibility
2. New content uses full datetime format with type prefix
3. Document both formats in schemas
4. Validation accepts both patterns:
   - Legacy: `{name}_{YYYYMMDD}-{HHMMSS}_{author}`
   - New: `{type}_{name}_{author}_{YYYYMMDD}-{HHMMSS}`

## Benefits of This Approach

1. **Precise tracking**: Datetime stamps provide exact creation time
2. **Natural sorting**: Chronological order without additional indexes
3. **Anti-spoofing**: Timestamps make impersonation attempts obvious
4. **Type clarity**: Content type is immediately visible in ID
5. **Git integration**: Leverages existing version control for history
6. **Server-controlled**: Timestamps generated server-side prevent manipulation

## API Responses

When serving content via API, include:
```json
{
  "unique_id": "persona_creative-writer_dollhousemcp_20250715-143025",
  "version": "1.2.3",
  "created_date": "2025-07-15",
  "created_time": "2025-07-15T14:30:25Z",
  "updated_date": "2025-07-18",
  "updated_time": "2025-07-18T09:15:00Z",
  "git_commit": "abc123...",  // Optional: latest commit
  "download_url": "https://...",
  "history_url": "https://..."  // Link to git history
}
```

This strategy provides precise datetime-based identifiers with server-side generation to prevent manipulation, while maintaining full version history through git. The combination of immutable creation timestamps and selective update timestamps prevents unnecessary version churn from minor edits.