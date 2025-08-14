# Rigorous MCP Roundtrip Test Protocol

## Test Element Details

**Element**: Roundtrip Test Validator Skill  
**Location**: `library/skills/roundtrip-test-validator.md`  
**Unique ID**: `skill_roundtrip-test-validator_dollhousemcp-test_20250814-170000`  
**GitHub Commit**: Pushed to main branch on 2025-08-14  
**Test Markers**: Contains specific validation markers for each step

---

## Step 1: Browse Collection for Skills

### EXACT Command to Copy/Paste:

```
Use the browse_collection tool with section "library" and type "skills" to show me all available skills in the collection.
```

### Expected Output:

You should see a list that includes:
- Multiple skills listed
- **MUST INCLUDE**: "Roundtrip Test Validator" skill
- Each skill should show name and description
- The test skill description should be: "A test skill for validating the MCP roundtrip workflow - helps verify element submission, installation, and processing"

### Verification Marker:
Look for: `ROUNDTRIP_TEST_BROWSE_OK` (this marker is in the skill content)

---

## Step 2: Search for the Test Skill

### EXACT Command to Copy/Paste:

```
Use the search_collection tool with query "roundtrip test validator" to find our test skill.
```

### Expected Output:

Search results should include:
- **Roundtrip Test Validator** skill
- Path shown as: `library/skills/roundtrip-test-validator.md`
- Match on keywords: roundtrip, test, validator, workflow

### Alternative Search Command:

```
Use the search_collection tool with query "workflow validation" to search for validation-related elements.
```

### Verification Marker:
Look for: `ROUNDTRIP_TEST_SEARCH_OK` (this marker is in the skill content)

---

## Step 3: Get Detailed Information

### EXACT Command to Copy/Paste:

```
Use the get_collection_content tool with path "library/skills/roundtrip-test-validator.md" to show me the full details of the Roundtrip Test Validator skill.
```

### Expected Output:

You should see:
1. **Metadata Block**:
   - name: Roundtrip Test Validator
   - type: skill
   - version: 1.0.0
   - author: dollhousemcp-test
   - unique_id: skill_roundtrip-test-validator_dollhousemcp-test_20250814-170000

2. **Full Content** including:
   - Purpose section
   - Core Functionality section
   - Usage Instructions
   - Test markers section
   - Validation Output Format

3. **Test Marker at End**:
   - Should see: "Test Marker: ROUNDTRIP_TEST_ELEMENT_COMPLETE"

---

## Step 4: Install to Local Portfolio

### EXACT Command to Copy/Paste:

```
Use the install_content tool with path "library/skills/roundtrip-test-validator.md" to install the Roundtrip Test Validator skill to my local portfolio.
```

### Expected Output:

- Success message confirming installation
- Path where installed (should be `~/.dollhouse/portfolio/skills/`)
- Confirmation that skill is ready to use
- May show the unique ID assigned to local copy

### Verification Marker:
Look for: `ROUNDTRIP_TEST_INSTALL_OK` confirmation

---

## Step 5: List Portfolio Contents

### EXACT Command to Copy/Paste:

```
List all elements in my local portfolio, specifically showing what skills I have installed.
```

### Expected Output:

Should show:
- Portfolio structure with different element types
- Under skills: **Roundtrip Test Validator** should be listed
- Should show it was recently installed
- May show metadata like version and author

---

## Step 6: Prepare for Submission

### EXACT Command to Copy/Paste:

```
I want to test submitting the Roundtrip Test Validator skill from my portfolio back to the collection. Can you prepare it for submission and show me what will be submitted?
```

### Expected Output:

- Explanation of submission process
- Show the skill that will be submitted
- Confirm it's the test validator skill
- May perform validation checks

---

## Step 7: Submit to Collection

### EXACT Command to Copy/Paste:

```
Use the submit_content tool with content "Roundtrip Test Validator" to submit this test skill from my portfolio to the collection. This is a test submission to validate the workflow.
```

### Expected Output:

- Confirmation that submission is being processed
- GitHub issue creation (or simulation)
- Issue number or link if created
- Success message

### Verification Marker:
Look for: `ROUNDTRIP_TEST_SUBMIT_OK` in submission confirmation

---

## Step 8: Verify Submission

### EXACT Command to Copy/Paste:

```
Check the status of my test submission for the Roundtrip Test Validator skill. Was the GitHub issue created successfully?
```

### Expected Output:

- Status of the submission
- GitHub issue details (if created)
- Any automated workflow triggers
- Next steps in the process

---

## Manual Terminal Verification Commands

After each step, you can verify in terminal:

### Check Collection (after Step 1):
```bash
ls -la ~/Developer/Organizations/DollhouseMCP/active/collection/library/skills/ | grep roundtrip
```
Expected: `roundtrip-test-validator.md` should exist

### Check Portfolio (after Step 4):
```bash
ls -la ~/.dollhouse/portfolio/skills/ | grep -i roundtrip
```
Expected: Should see the installed skill file

### Check GitHub Issues (after Step 7):
```bash
gh issue list --repo DollhouseMCP/collection --limit 5 | grep -i roundtrip
```
Expected: May see a new issue for the test submission

---

## Success Criteria Checklist

- [ ] **Step 1**: Skill appears in browse results
- [ ] **Step 2**: Skill found via search for "roundtrip test validator"
- [ ] **Step 3**: Full content displayed with test markers visible
- [ ] **Step 4**: Skill successfully installs to portfolio
- [ ] **Step 5**: Skill appears in portfolio listing
- [ ] **Step 6**: Submission prepared without errors
- [ ] **Step 7**: Submission completes (issue created or simulated)
- [ ] **Step 8**: Submission status confirmed

---

## Reporting Template

For each step, report:

```
STEP X: [Step Name]
Command Used: [Exact text you pasted]
Success: YES/NO/PARTIAL
Output Summary: [What Claude showed]
Marker Found: YES/NO [which marker]
Terminal Verification: [Result of terminal command]
Issues: [Any problems encountered]
```

---

## Troubleshooting

### If browse_collection doesn't show the skill:
- The GitHub sync might be delayed
- Try: Pull latest with `git pull` in collection directory
- Verify file exists: `cat ~/Developer/Organizations/DollhouseMCP/active/collection/library/skills/roundtrip-test-validator.md`

### If search doesn't find it:
- Try broader search: "validation" or "test"
- Check if search is case-sensitive

### If install fails:
- Check portfolio directory exists: `mkdir -p ~/.dollhouse/portfolio/skills`
- Check permissions: `ls -la ~/.dollhouse/`

### If submit fails:
- Check GitHub authentication: `gh auth status`
- Try: `gh issue create --repo DollhouseMCP/collection --title "Test" --body "Test"`

---

## Complete Test Should Take: 5-10 minutes

## Test Valid Until: Collection structure changes or skill is removed

---

**Ready to Start**: Copy Step 1 command exactly as shown and paste into Claude Desktop!