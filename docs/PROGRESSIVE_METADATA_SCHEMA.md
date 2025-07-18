# Progressive Metadata Schema

*Last Updated: July 18, 2025 (v2)*

## Overview

This document defines a progressive metadata schema that starts minimal and can be enriched over time as tooling becomes available.

## Schema Tiers

### Tier 1: Minimal Required (Launch Ready)

**Required fields** - What we need to start:

```yaml
# Identity
name: "Creative Writer"
type: "persona"
author: "johndoe"
unique_id: "persona_creative-writer_johndoe_20250718-143025"

# Basic metadata
created_date: 2025-07-18
created_time: 2025-07-18T14:30:25Z
license: MIT
category: creative
description: "A persona specialized in creative writing"
```

### Tier 2: Enhanced Discovery (Optional)

**Optional fields** - Better user experience:

```yaml
# Discovery
tagline: "D&D Campaign Specialist"  # One-line hook
keywords: ["dnd", "fantasy", "worldbuilding"]

# Version tracking
version: "1.0"  # Optional version string
updated_date: 2025-07-19
updated_time: 2025-07-19T10:15:00Z
version_label: "combat-enhanced"  # Human-friendly version name
parent_version: "persona_creative-writer_johndoe_20250718-140000"  # Track lineage
```

### Tier 3: Performance Tracking (Future)

**Advanced optional fields** - For optimization tools:

```yaml
# Performance metrics (flexible labeled data)
metrics:
  - label: "coherence_score"
    value: 0.92
    type: "score"
  - label: "domain_accuracy"
    value: 0.95
    type: "score"
  - label: "response_time_ms"
    value: 234
    type: "duration"

# Generation metadata  
generation_batch: "combat-optimization-2025-07-18"
test_batch_id: "combat-opt-20250718"
optimized_for: "D&D 5e combat narratives"
optimization_tags: ["combat-optimized", "fast-response", "batch-42"]
is_batch_winner: true  # Best performer from batch
```

### Tier 4: Community Features (Future)

**Community optional fields** - Social features:

```yaml
# Community
rating: 4.8
review_count: 127
download_count: 1543
last_reviewed: 2025-07-15

# Trust signals
verified_author: true
featured: true
staff_pick: true
```

## Implementation Strategy

### Phase 1: Launch (Now)
- Validate only Tier 1 required fields
- Accept but don't validate optional fields
- Server-generated unique_id: `{type}_{name}_{author}_{YYYYMMDD}-{HHMMSS}`

### Phase 2: Discovery (Next)
- Add Tier 2 validation
- Build search/filter on keywords and taglines
- Display enhanced descriptions

### Phase 3: Optimization (Later)
- Add performance metric tools
- Automated testing frameworks
- Batch generation tracking

### Phase 4: Community (Future)
- Rating and review system
- Download tracking
- Trust indicators

## Validation Rules

### Required Field Validation (Tier 1)
```typescript
interface RequiredMetadata {
  name: string;           // 1-100 chars
  type: ContentType;      // enum: persona|skill|agent|etc
  author: string;         // alphanumeric + underscore
  unique_id: string;      // {type}_{name}_{author}_{YYYYMMDD}-{HHMMSS}
  created_date: string;   // YYYY-MM-DD
  created_time: string;   // ISO 8601: YYYY-MM-DDTHH:MM:SSZ
  description: string;    // 10-500 chars
  license: License;       // enum: MIT|Apache-2.0|etc
  category: Category;     // enum: creative|professional|etc
}
```

### Optional Field Validation (All Tiers)
- If present, must meet format requirements
- Missing optional fields don't fail validation
- Unknown fields are preserved (forward compatibility)

## Examples

### Minimal Valid Content (Tier 1 Only)
```yaml
name: Task Prioritizer
type: tool
author: alice
unique_id: tool_task-prioritizer_alice_20250718-092500
created_date: 2025-07-18
created_time: 2025-07-18T09:25:00Z
description: "Helps prioritize tasks based on urgency and importance"
license: MIT
category: personal
```

### Enhanced Content (Tier 1 + 2)
```yaml
name: Task Prioritizer
type: tool
author: alice
unique_id: tool_task-prioritizer_alice_20250719-141500
created_date: 2025-07-18
created_time: 2025-07-18T09:25:00Z
description: "GTD-based task prioritization with context awareness"
license: MIT
category: personal

# Enhanced discovery (Tier 2)
tagline: "GTD-inspired task management assistant"
keywords: ["productivity", "gtd", "planning"]
version: "2.0"
updated_date: 2025-07-19
updated_time: 2025-07-19T14:15:00Z
version_label: "gtd-enhanced"
parent_version: "tool_task-prioritizer_alice_20250718-092500"
```

### Future Rich Content (All Tiers)
```yaml
name: Task Prioritizer
type: tool
author: alice
unique_id: tool_task-prioritizer_alice_20250719-162530
created_date: 2025-07-18
created_time: 2025-07-18T09:25:00Z
description: "ML-powered task prioritization for knowledge workers"
license: MIT
category: personal

# Enhanced discovery (Tier 2)
tagline: "AI-powered GTD task orchestrator"
keywords: ["productivity", "gtd", "ai", "planning"]
version: "42.0"
updated_date: 2025-07-19
updated_time: 2025-07-19T16:25:30Z
version_label: "ml-optimization-winner"
parent_version: "tool_task-prioritizer_alice_20250719-161500"

# Performance tracking (Tier 3)
metrics:
  - label: "task_completion_rate"
    value: 0.94
    type: "score"
  - label: "user_satisfaction"
    value: 0.91
    type: "score"
  - label: "time_saved_hours_per_week"
    value: 2.3
    type: "metric"
generation_batch: "ml-productivity-2025-07-19"
test_batch_id: "ml-prod-20250719"
optimized_for: "knowledge workers with 50+ daily tasks"
optimization_tags: ["ml-enhanced", "high-volume", "batch-winner"]
is_batch_winner: true

# Community features (Tier 4)
rating: 4.9
review_count: 342
download_count: 15430
verified_author: true
featured: true
```

## Migration Path

1. **Existing content**: Already has Tier 1 fields ✓
2. **New content**: Start with Tier 1 minimum
3. **Enrichment**: Add optional fields as tools develop
4. **No breaking changes**: Only add, never remove fields

## Benefits

- **Launch ready**: Can ship with minimal metadata
- **Future proof**: Schema grows with capabilities
- **Tool friendly**: Automation can add rich metadata later
- **User friendly**: Optional fields don't block contributions
- **Backward compatible**: Old content remains valid

This progressive approach lets us launch now and enhance later without breaking changes.