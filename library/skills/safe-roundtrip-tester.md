---
name: Safe Roundtrip Tester
description: A security-safe test skill for validating the complete MCP roundtrip workflow without triggering security alerts
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
  - safe
unique_id: skill_safe-roundtrip-tester_dollhousemcp-test_20250814-180000
capabilities:
  - workflow_validation
  - safe_testing
  - no_code_blocks
---

# Safe Roundtrip Tester Skill

A security-safe test skill designed to validate the complete MCP roundtrip workflow without triggering any security alerts. This skill avoids code blocks and uses only safe content.

## Purpose

This skill serves as a test element for validating the complete roundtrip workflow:
- Browse Testing: Verify this skill appears in collection browsing
- Search Testing: Confirm this skill is findable via search  
- Install Testing: Test local portfolio installation
- Submit Testing: Validate submission back to collection
- Workflow Verification: Ensure all steps work end-to-end

## Test Markers

This skill includes specific markers to verify each step:

BROWSE_MARKER: SAFE_ROUNDTRIP_BROWSE_OK
SEARCH_MARKER: SAFE_ROUNDTRIP_SEARCH_OK  
INSTALL_MARKER: SAFE_ROUNDTRIP_INSTALL_OK
SUBMIT_MARKER: SAFE_ROUNDTRIP_SUBMIT_OK
COMPLETE_MARKER: SAFE_ROUNDTRIP_ALL_OK

## Testing Instructions

### Part 1: Browse and Install

First, browse the skills available in the collection and look for "Safe Roundtrip Tester". 
Then install it to your local portfolio.

Expected: The skill should download successfully with version 1.0.0

### Part 2: Verify Installation

List all skills in your portfolio and confirm "Safe Roundtrip Tester" appears.

Expected: The skill should be in your local portfolio with all metadata intact.

### Part 3: Check Configuration

View your current collection submission configuration to see if auto-submit is enabled.

Expected: Configuration should show current auto-submit status.

### Part 4: Test WITHOUT Auto-Submit

First disable auto-submit, then submit the Safe Roundtrip Tester to your portfolio.

Expected Results:
1. Upload to GitHub portfolio succeeds
2. Portfolio URL is provided
3. No collection issue created
4. Manual submission link provided

### Part 5: Verify Portfolio Upload

Check your GitHub portfolio to confirm the safe-roundtrip-tester.md file exists in the skills folder.

Expected: File should exist with version 1.0.0

### Part 6: Modify the Skill

Edit the Safe Roundtrip Tester skill to change the version to 1.0.1 and add a modification note.

Expected: Changes should be saved locally.

### Part 7: Test WITH Auto-Submit

Enable auto-submit, then submit the modified skill again.

Expected Results:
1. Update in GitHub portfolio succeeds
2. Collection issue is created
3. Issue URL is provided
4. Proper labels applied

### Part 8: Error Handling Test

Try submitting a skill that doesn't exist to test error handling.

Expected: Clear, helpful error message.

### Part 9: Browse Collection

Browse the skills in the collection to see available options.

Expected: List of skills including this test skill.

### Part 10: Search Collection

Search for "safe" or "roundtrip" in the collection.

Expected: This skill appears in search results.

### Part 11: Clean Install

Delete the local skill if it exists, then install fresh from collection.

Expected: Fresh download with original version.

### Part 12: Reset Configuration

Disable auto-submit for normal use and verify the configuration.

Expected: Auto-submit disabled successfully.

## Success Checklist

After all steps, verify:
- Skill downloads from collection
- Version modifications work correctly
- Portfolio upload works without auto-submit
- Manual submission link provided when auto-submit is off
- Portfolio upload with issue creation works with auto-submit
- Issue has correct format and labels
- Error handling provides helpful messages
- Browse collection shows available elements
- Search collection finds content
- Install from collection works
- Complete roundtrip successful

## What Success Looks Like

1. Version progression: 1.0.0 (collection) to 1.0.1 (modified)
2. Two portfolio commits: One without issue, one with issue
3. One collection issue: Created only when auto-submit was enabled
4. All metadata preserved: Throughout the entire journey
5. Clean error messages: When testing invalid operations

## Key URLs for Verification

Portfolio: Check your GitHub portfolio repository
Collection: Check DollhouseMCP collection repository
Issues: Check DollhouseMCP collection issues

## Validation Results Format

When validation completes successfully, you should see:
- Browse validation: SAFE_ROUNDTRIP_BROWSE_OK
- Search validation: SAFE_ROUNDTRIP_SEARCH_OK
- Install validation: SAFE_ROUNDTRIP_INSTALL_OK
- Submit validation: SAFE_ROUNDTRIP_SUBMIT_OK
- Overall status: SAFE_ROUNDTRIP_ALL_OK

## Troubleshooting

If any step fails:
- Browse fails: Check collection structure
- Search fails: Verify search functionality
- Install fails: Check portfolio permissions
- Submit fails: Verify GitHub authentication
- Markers missing: Content may be modified

## Important Notes

- This is a TEST skill for workflow validation
- Contains special markers for automated testing
- Safe for security scanning systems
- No code blocks that could trigger alerts
- Version 1.0.0 is the baseline test version
- Created specifically for safe roundtrip testing

---

Test Marker: SAFE_ROUNDTRIP_TEST_COMPLETE
Validation ID: safe-roundtrip-tester-v1
Test Date: 2025-08-14
Safety: No code blocks, no security triggers