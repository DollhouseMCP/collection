---
name: Roundtrip Test Template
description: Interactive checklist template for MCP roundtrip workflow testing
type: template
version: 1.0.0
author: dollhousemcp-test
created_date: '2025-08-14'
category: testing
tags:
  - testing
  - validation
  - checklist
  - roundtrip
unique_id: template_roundtrip-test-template_dollhousemcp-test_20250814-220000
---

# MCP Roundtrip Test Checklist

## Test Information
- Date: [Fill in date]
- Tester: [Your name]
- Test Element: Safe Roundtrip Tester
- Session ID: [Generate unique ID]

## Phase 1: Installation and Setup

### 1.1 Browse Collection
Command: browse_collection "skills"
- [ ] Executed successfully
- [ ] Safe Roundtrip Tester visible
- Result: PASS / FAIL
- Notes: _______________

### 1.2 Install from Collection
Command: install_collection_element "skills/safe-roundtrip-tester.md"
- [ ] Installation successful
- [ ] Version noted: _______
- Result: PASS / FAIL
- Notes: _______________

### 1.3 Verify Installation
Command: list_elements --type skills
- [ ] Skill appears in list
- [ ] Version confirmed: _______
- Result: PASS / FAIL
- Notes: _______________

## Phase 2: Configuration Testing

### 2.1 Check Config
Command: get_collection_submission_config
- [ ] Config retrieved
- [ ] Auto-submit status: ENABLED / DISABLED
- Result: PASS / FAIL

### 2.2 Disable Auto-Submit
Command: configure_collection_submission autoSubmit: false
- [ ] Setting changed
- [ ] Verified disabled
- Result: PASS / FAIL

## Phase 3: Submit WITHOUT Auto-Submit

### 3.1 Submit by Name
Command: submit_content "Safe Roundtrip Tester"
- [ ] Command attempted
- [ ] Success: YES / NO
- [ ] Error if failed: _______________
- Result: PASS / FAIL
- Critical Issue: YES / NO

### 3.2 Submit by Filename (if needed)
Command: submit_content "safe-roundtrip-tester"
- [ ] Command executed
- [ ] Success: YES / NO
- [ ] Portfolio URL: _______________
- [ ] Issue created: YES / NO (should be NO)
- Result: PASS / FAIL
- Workaround Required: YES / NO

### 3.3 Portfolio Status
Command: portfolio_status
- [ ] Shows correct count: YES / NO
- [ ] Reported: ___ Actual: ___
- Result: PASS / FAIL
- Critical Issue: YES / NO

## Phase 4: Modification

### 4.1 Modify Version
Command: edit_element "Safe Roundtrip Tester" --type skills version "1.0.1"
- [ ] Update successful
- [ ] Requested: 1.0.1
- [ ] Actual: _______
- Result: PASS / FAIL
- Version Mismatch: YES / NO

### 4.2 Add Note
Action: Add modification note with timestamp
- [ ] Content updated
- [ ] Changes saved
- Result: PASS / FAIL

## Phase 5: Submit WITH Auto-Submit

### 5.1 Enable Auto-Submit
Command: configure_collection_submission autoSubmit: true
- [ ] Setting changed
- [ ] Verified enabled
- Result: PASS / FAIL

### 5.2 Submit Modified
Command: submit_content (use name or filename)
- [ ] Upload successful
- [ ] Portfolio URL: _______________
- [ ] Issue created: YES / NO (should be YES)
- [ ] Issue URL: _______________
- [ ] Labels: _______________
- Result: PASS / FAIL

## Phase 6: Feature Testing

### 6.1 Error Handling
Command: submit_content "This Does Not Exist"
- [ ] Error received
- [ ] Correct type mentioned: YES / NO
- [ ] Actual error: _______________
- Result: PASS / FAIL
- Critical Issue: YES / NO

### 6.2 Browse
Command: browse_collection "skills"
- [ ] Browse works
- [ ] Skills visible: ___
- [ ] Test skill visible: YES / NO
- Result: PASS / FAIL

### 6.3 Search
Commands: search_collection with "safe", "roundtrip", "test"
- [ ] Results found: YES / NO
- [ ] Count: ___
- Result: PASS / FAIL
- Critical Issue: YES / NO

### 6.4 Clean Install
Action: Delete and reinstall
- [ ] Deletion successful
- [ ] Fresh install works
- [ ] Version: _______
- Result: PASS / FAIL

## Phase 7: Cleanup

### 7.1 Reset Config
Command: configure_collection_submission autoSubmit: false
- [ ] Auto-submit disabled
- [ ] Verified
- Result: PASS / FAIL

## Summary

### Statistics
- Tests Run: ___ / 21
- Passed: ___ 
- Failed: ___
- Success Rate: ___%

### Critical Failures
- [ ] Search broken
- [ ] Submit needs filename
- [ ] Portfolio status wrong
- [ ] Error messages wrong type
- [ ] Version mismatch
- [ ] Other: _______________

### Workarounds Used
1. _______________
2. _______________
3. _______________

### Feature Status

| Feature | Works | Critical |
|---------|-------|----------|
| Browse | Y/N | Y/N |
| Install | Y/N | Y/N |
| Submit Name | Y/N | Y/N |
| Submit File | Y/N | Y/N |
| Portfolio | Y/N | Y/N |
| Search | Y/N | Y/N |
| Errors | Y/N | Y/N |
| Version | Y/N | Y/N |

### Overall Grade
- [ ] A (90-100%) Ready
- [ ] B (80-89%) Minor issues
- [ ] C (70-79%) Needs work
- [ ] D (60-69%) Major issues
- [ ] F (Below 60%) Not ready

### Recommendation
- [ ] PASS - Production ready
- [ ] CONDITIONAL - Fix minor issues
- [ ] NEEDS WORK - Fix major issues
- [ ] FAIL - Critical failures

### Priority Fixes
1. _______________
2. _______________
3. _______________

### Evidence
Error messages:
_______________

GitHub links:
- Commit 1: _______________
- Commit 2: _______________
- Issue: _______________

### Notes
_______________

Test Complete: [Time]