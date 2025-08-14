# Automated Roundtrip Test - Single Prompt

Copy this entire prompt to Claude Desktop to run all tests automatically:

```
I need you to run a complete automated roundtrip workflow test for the Safe Roundtrip Tester skill. Please execute all steps sequentially and create a comprehensive test report. Save all results to a file at the end.

## Test Execution Plan

### Phase 1: Installation and Setup
1. Run: browse_collection "skills" and confirm Safe Roundtrip Tester is visible
2. Run: install_collection_element "skills/safe-roundtrip-tester.md" and note the version
3. Run: list_elements --type skills and verify Safe Roundtrip Tester appears
4. Record: Initial version number

### Phase 2: Portfolio Upload Without Auto-Submit
1. Run: configure_collection_submission autoSubmit: false
2. Run: get_collection_submission_config to verify disabled
3. Try: submit_content "Safe Roundtrip Tester" (note if this fails)
4. If failed, try: submit_content "safe-roundtrip-tester" (note workaround needed)
5. Record: Portfolio URL, whether issue was created (should be NO)

### Phase 3: Verify GitHub Upload
1. Check portfolio_status and note the skill count
2. If count is wrong, note as "portfolio_status broken"
3. Manually verify the file exists on GitHub if possible

### Phase 4: Modify Element
1. Run: edit_element "Safe Roundtrip Tester" --type skills version "1.0.1"
2. Add modification note with current timestamp
3. Verify changes saved and note actual version (may differ from requested)

### Phase 5: Portfolio Upload With Auto-Submit
1. Run: configure_collection_submission autoSubmit: true
2. Run: get_collection_submission_config to verify enabled
3. Try: submit_content "Safe Roundtrip Tester" (or use filename if needed)
4. Record: Portfolio URL, Issue URL, Labels applied

### Phase 6: Feature Testing
1. Test error handling: submit_content "This Skill Does Not Exist"
   - Note if error message mentions correct content type
2. Test browse: browse_collection "skills"
   - Count total skills, confirm Safe Roundtrip Tester visible
3. Test search: search_collection "safe" and search_collection "roundtrip"
   - Note if any results found (currently broken)
4. Test clean install:
   - Delete local Safe Roundtrip Tester
   - Run: install_collection_element "skills/safe-roundtrip-tester.md"
   - Note version downloaded

### Phase 7: Cleanup and Report
1. Run: configure_collection_submission autoSubmit: false
2. Generate comprehensive test report

## Test Report Format

Create a JSON file at /tmp/roundtrip-test-results.json with:

{
  "test_date": "2025-08-14",
  "test_run_id": "unique_timestamp",
  "results": {
    "installation": {
      "success": true/false,
      "version": "1.0.0",
      "errors": []
    },
    "submit_without_auto": {
      "success": true/false,
      "required_workaround": "filename_instead_of_name",
      "issue_created": false,
      "portfolio_url": "url"
    },
    "submit_with_auto": {
      "success": true/false,
      "issue_created": true,
      "issue_url": "url",
      "labels": ["list"]
    },
    "feature_tests": {
      "search_working": false,
      "browse_working": true,
      "error_handling_correct": false,
      "portfolio_status_accurate": false
    },
    "version_management": {
      "requested": "1.0.1",
      "actual": "1.0.2",
      "correct": false
    }
  },
  "critical_failures": [
    "search_completely_broken",
    "submit_content_requires_filename",
    "portfolio_status_shows_wrong_count",
    "error_messages_wrong_type"
  ],
  "workarounds_used": [
    "filename_for_submit",
    "manual_github_verification"
  ],
  "tests_passed": 6,
  "tests_failed": 6,
  "success_rate": "50%",
  "overall_assessment": "FAIL - Not production ready"
}

After creating the JSON file, also provide:
1. A summary of critical issues found
2. Count of tests that required workarounds
3. List of completely broken features
4. Overall recommendation (PASS/FAIL/NEEDS_WORK)

Please execute all tests now and generate the complete report.
```