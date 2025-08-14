# Test Iteration Strategy for Roundtrip Testing

## Problem
Running multiple roundtrip tests creates conflicts:
- Duplicate GitHub issues (#120, #121, etc.)
- Version conflicts (same skill, different versions)
- Unclear which test run created which artifacts
- Portfolio accumulates test files

## Solution: Iterative Test Elements

### Strategy 1: Version-Based Naming
Create unique test elements for each run:
- `safe-roundtrip-tester-v1.md` - First test
- `safe-roundtrip-tester-v2.md` - Second test
- `safe-roundtrip-tester-v3.md` - Third test

### Strategy 2: Date-Based Naming
Use timestamps in element names:
- `roundtrip-test-20250814-1.md`
- `roundtrip-test-20250814-2.md`
- `roundtrip-test-20250814-3.md`

### Strategy 3: Session-Based Naming
Use session IDs:
- `roundtrip-test-session-001.md`
- `roundtrip-test-session-002.md`
- `roundtrip-test-session-003.md`

## Cleanup Procedure

### Before Each Test Run:

1. **Check Existing Portfolio**
   ```
   list_elements --type skills
   ```
   Note which test elements exist

2. **Remove Previous Test Elements**
   ```
   delete_element "Safe Roundtrip Tester" --type skills
   ```

3. **Check GitHub Issues**
   - Note last issue number
   - Close old test issues if needed

4. **Create Fresh Test Element**
   Either:
   - Use new version number
   - Use new element name
   - Modify unique_id in metadata

### After Each Test Run:

1. **Archive Test Results**
   - Save to `/test-results/` with timestamp
   - Include issue numbers created
   - Note portfolio commits

2. **Document Issues Created**
   - Issue number
   - Issue URL
   - Labels applied

3. **Optional: Clean Portfolio**
   ```
   # Remove test element from portfolio
   delete_element "[test element name]" --type skills
   ```

## Test Element Versioning

### For Collection Element
Maintain versioning in the source file:
```yaml
---
name: Safe Roundtrip Tester
version: 1.0.0  # Base version
test_iteration: 1  # Increment for each test
unique_id: skill_safe-roundtrip-tester_test-[iteration]_[timestamp]
---
```

### For Test Tracking
Create manifest file:
```yaml
# test-manifest.yaml
test_runs:
  - run_id: 001
    date: 2025-08-14
    element: safe-roundtrip-tester
    version_tested: 1.0.0
    issue_created: 120
    status: completed
    
  - run_id: 002
    date: 2025-08-14
    element: safe-roundtrip-tester
    version_tested: 1.0.1
    issue_created: 121
    status: completed
```

## Automated Cleanup Script

Create `scripts/cleanup-test-artifacts.sh`:
```bash
#!/bin/bash

echo "Cleaning test artifacts..."

# 1. Remove test elements from portfolio
echo "Removing test skills from portfolio..."
# List and remove test skills

# 2. Close test issues
echo "Checking for open test issues..."
gh issue list --label "test" --repo DollhouseMCP/collection

# 3. Archive results
echo "Archiving test results..."
mkdir -p test-results/archive
mv test-results/*.md test-results/archive/

echo "Cleanup complete!"
```

## Best Practices

1. **Always Start Fresh**
   - Clean portfolio before testing
   - Use unique element names/versions

2. **Track Everything**
   - Issue numbers
   - Commit hashes
   - Version numbers
   - Timestamps

3. **Label Test Issues**
   - Add "test" label to issues
   - Makes cleanup easier
   - Distinguishes from real submissions

4. **Use Consistent Naming**
   - Follow naming convention
   - Include iteration number
   - Add timestamp for uniqueness

## Example Test Sequence

### Test Run #1
1. Clean: Remove any existing test elements
2. Install: `safe-roundtrip-tester-001.md`
3. Test: Run full workflow
4. Result: Issue #120, commits abc123, def456
5. Archive: Save results as `test-001-results.md`

### Test Run #2
1. Clean: Remove `safe-roundtrip-tester-001.md`
2. Install: `safe-roundtrip-tester-002.md`
3. Test: Run full workflow
4. Result: Issue #121, commits ghi789, jkl012
5. Archive: Save results as `test-002-results.md`

This prevents conflicts and maintains clean test history!