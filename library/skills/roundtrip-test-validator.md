---
name: Roundtrip Test Validator
description: A test skill for validating the MCP roundtrip workflow - helps verify element submission, installation, and processing
type: skill
version: 1.0.0
author: dollhousemcp-test
created_date: '2025-08-14'
category: professional
tags:
  - testing
  - validation
  - workflow
  - mcp
  - roundtrip
unique_id: skill_roundtrip-test-validator_dollhousemcp-test_20250814-170000
capabilities:
  - workflow_validation
  - element_testing
  - submission_verification
  - installation_checking
parameters:
  test_mode:
    type: boolean
    default: true
    description: Enable test mode for validation
  verbosity:
    type: string
    enum: ['minimal', 'normal', 'detailed']
    default: 'normal'
    description: Level of output detail
  workflow_step:
    type: string
    enum: ['browse', 'search', 'install', 'submit', 'validate']
    default: 'validate'
    description: Which workflow step to validate
---

# Roundtrip Test Validator Skill

A specialized skill designed to validate the complete MCP roundtrip workflow. This skill helps test and verify that elements can be successfully browsed, searched, installed, and submitted through the collection system.

## Purpose

This skill serves as a test element for validating the roundtrip workflow:
- **Browse Testing**: Verify this skill appears in collection browsing
- **Search Testing**: Confirm this skill is findable via search
- **Install Testing**: Test local portfolio installation
- **Submit Testing**: Validate submission back to collection
- **Workflow Verification**: Ensure all steps work end-to-end

## Core Functionality

### 1. Workflow Step Validation

The skill can validate each step of the roundtrip workflow:

```typescript
interface WorkflowValidator {
  validateBrowse(): ValidationResult;
  validateSearch(query: string): ValidationResult;
  validateInstall(path: string): ValidationResult;
  validateSubmit(element: string): ValidationResult;
  validateComplete(): ValidationResult;
}
```

### 2. Test Markers

This skill includes specific markers to verify it's working:

```yaml
test_markers:
  browse_marker: "ROUNDTRIP_TEST_BROWSE_OK"
  search_marker: "ROUNDTRIP_TEST_SEARCH_OK"
  install_marker: "ROUNDTRIP_TEST_INSTALL_OK"
  submit_marker: "ROUNDTRIP_TEST_SUBMIT_OK"
```

### 3. Validation Checks

When activated, this skill performs these checks:

1. **Environment Check**
   - Verify MCP server is running
   - Check portfolio directory exists
   - Confirm collection is accessible

2. **Tool Availability**
   - Check browse_collection tool exists
   - Check search_collection tool exists
   - Check install_content tool exists
   - Check submit_content tool exists

3. **Workflow Execution**
   - Track each step's success/failure
   - Log timestamps for performance
   - Generate validation report

## Usage Instructions

### Step 1: Browse for This Skill

```
Browse the collection for skills and look for "Roundtrip Test Validator"
```

Expected: This skill should appear in the skills listing

### Step 2: Search for This Skill

```
Search for "roundtrip test validator" or "workflow validation"
```

Expected: This skill should appear in search results

### Step 3: Install This Skill

```
Install the skill from path "library/skills/roundtrip-test-validator.md"
```

Expected: Skill installed to local portfolio

### Step 4: Verify Installation

```
List installed skills in the portfolio
```

Expected: This skill appears in portfolio listing

### Step 5: Submit Back to Collection

```
Submit the "Roundtrip Test Validator" skill from portfolio to collection
```

Expected: Submission created successfully

## Validation Output Format

When this skill runs validation, it produces output like:

```json
{
  "validation_timestamp": "2025-08-14T17:00:00Z",
  "workflow_step": "complete",
  "results": {
    "browse": {
      "status": "passed",
      "marker_found": true,
      "duration_ms": 150
    },
    "search": {
      "status": "passed",
      "marker_found": true,
      "duration_ms": 200
    },
    "install": {
      "status": "passed",
      "marker_found": true,
      "duration_ms": 500
    },
    "submit": {
      "status": "passed",
      "marker_found": true,
      "duration_ms": 1000
    }
  },
  "overall_status": "passed",
  "test_markers_verified": 4,
  "total_duration_ms": 1850
}
```

## Test Scenarios

### Positive Test Cases

1. **Normal Flow**: Browse → Search → Install → Submit
2. **Search First**: Search → Install → Submit
3. **Direct Install**: Install by path → Submit
4. **Re-install**: Install → Install again (should handle gracefully)

### Negative Test Cases

1. **Invalid Path**: Try to install from wrong path
2. **Missing Element**: Search for non-existent skill
3. **Duplicate Submit**: Submit same element twice
4. **No Portfolio**: Install without portfolio directory

## Integration Points

This skill integrates with:
- **MCP Server**: Via standard MCP tools
- **Collection Repository**: As a library skill
- **Portfolio System**: For local storage
- **GitHub Actions**: For submission processing
- **Validation Scripts**: For quality checks

## Success Criteria

The roundtrip test is successful when:
1. ✅ Skill appears in browse results
2. ✅ Skill found via search
3. ✅ Skill installs to portfolio
4. ✅ Skill appears in portfolio listing
5. ✅ Skill can be submitted back
6. ✅ All test markers are verified
7. ✅ No errors in any step

## Troubleshooting

If validation fails:

1. **Browse fails**: Check collection structure
2. **Search fails**: Verify search index
3. **Install fails**: Check portfolio permissions
4. **Submit fails**: Verify GitHub authentication
5. **Markers missing**: Skill content may be corrupted

## Test Execution Command

To run a complete validation:

```
Activate the Roundtrip Test Validator skill and run validation for all workflow steps
```

## Notes

- This is a TEST skill for workflow validation
- Contains special markers for automated testing
- Should NOT be used in production environments
- Version 1.0.0 is the baseline test version
- Created specifically for roundtrip workflow testing

---

**Test Marker**: ROUNDTRIP_TEST_ELEMENT_COMPLETE
**Validation ID**: roundtrip-test-validator-v1
**Test Date**: 2025-08-14