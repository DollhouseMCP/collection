# Complete Safe Roundtrip Workflow Test Guide

This is the comprehensive, security-safe test of the entire collection workflow system. Follow each step exactly.

## Test Element Information

**Skill Name**: Safe Roundtrip Tester
**File**: `library/skills/safe-roundtrip-tester.md`
**Version**: 1.0.0 (starting version)
**Purpose**: Test the complete workflow without triggering security alerts

---

## PART 1: Claude Desktop Setup (Start Here)

Start in Claude Desktop with these exact prompts:

### Prompt 1: Browse and Install from Collection
First, browse the skills available in the collection using: browse_collection "skills"

Then install the Safe Roundtrip Tester using: install_collection_element "skills/safe-roundtrip-tester.md"

Tell me if it downloaded successfully and what version it shows.

### Prompt 2: Verify Installation
Please list all skills in my portfolio using list_elements --type skills and tell me if you see "Safe Roundtrip Tester" in the list. Also tell me what version number it shows.

### Prompt 3: Check Current Configuration
Show me my current collection submission configuration using get_collection_submission_config and tell me if auto-submit is enabled or disabled.

### Prompt 4: Test WITHOUT Auto-Submit
First disable auto-submit by running: configure_collection_submission autoSubmit: false

Then verify it's disabled with: get_collection_submission_config

Finally, submit the Safe Roundtrip Tester to my portfolio using: submit_content "Safe Roundtrip Tester"

Tell me:
1. Was it uploaded to my GitHub portfolio?
2. What's the portfolio URL?
3. Was a collection issue created? (Should be NO)
4. Did you get a manual submission link?

### Prompt 5: Verify Portfolio Upload
Please check my GitHub portfolio and tell me if you can see the safe-roundtrip-tester.md file in the skills folder. What version does it show?

### Prompt 6: Make a Modification
Please modify the Safe Roundtrip Tester by using: edit_element "Safe Roundtrip Tester" --type skills version "1.0.1"

Also add a note at the end saying "Modified via Claude Desktop test on [today's date]"

Then verify the changes were saved by showing me the updated version.

### Prompt 7: Test WITH Auto-Submit
Now enable auto-submit by running: configure_collection_submission autoSubmit: true

Verify it's enabled with: get_collection_submission_config

Then submit the modified skill again using: submit_content "Safe Roundtrip Tester"

Tell me:
1. Was it updated in my GitHub portfolio?
2. Was a collection issue created this time?
3. What's the issue URL?
4. What labels were applied to the issue?

### Prompt 8: Test Error Handling
Try submitting a skill that doesn't exist: submit_content "This Skill Does Not Exist"

What error message did you get? Was it helpful?

### Prompt 9: Browse Collection Directly
Browse the skills in the collection using: browse_collection "skills"

Can you see other skills available? List the first 3 you see. Do you see the Safe Roundtrip Tester?

### Prompt 10: Search Collection
Search for test-related content in the collection using: search_collection "safe" or search_collection "roundtrip"

What results do you find? Do you see the Safe Roundtrip Tester skill?

### Prompt 11: Clean Install from Collection
Let's test installing a fresh skill from the collection. First, delete the local Safe Roundtrip Tester if it exists.

Then install it fresh using: install_collection_element "skills/safe-roundtrip-tester.md"

Did it download successfully? What version did you get?

### Prompt 12: Reset Configuration
Please disable auto-submit for normal use by running: configure_collection_submission autoSubmit: false

Then verify with: get_collection_submission_config

The test is complete. Please summarize what worked and what didn't.

---

## PART 2: Terminal Verification (Optional)

If you have a verification script, run it. Otherwise, manually check:

### Check Portfolio Directory
ls ~/.dollhouse/portfolio/skills/safe-roundtrip-tester.md
cat ~/.dollhouse/portfolio/skills/safe-roundtrip-tester.md | head -20

### Verify Version
grep "version:" ~/.dollhouse/portfolio/skills/safe-roundtrip-tester.md

---

## PART 3: GitHub Verification

Open your browser and check:

### 1. Your Portfolio Repository
- Navigate to your GitHub portfolio repository
- Go to `/skills/safe-roundtrip-tester.md`
- Check the version number (should be 1.0.1 after modification)
- Check for the modification note you added

### 2. Collection Issues (if auto-submit was enabled)
- Go to the DollhouseMCP collection issues page
- Look for an issue titled "[skills] Add Safe Roundtrip Tester by @[your-username]"
- Check it has labels: `contribution`, `pending-review`, `skills`
- Verify the issue body contains your portfolio URL

---

## PART 4: Success Checklist

After all steps, you should have verified:

- [ ] Skill downloads from collection
- [ ] Manual modifications work via Claude Desktop
- [ ] Portfolio upload works without auto-submit
- [ ] Manual submission link provided when auto-submit is off
- [ ] Portfolio upload + issue creation works with auto-submit
- [ ] Issue has correct format and labels
- [ ] Error handling provides helpful messages
- [ ] Browse collection shows available elements
- [ ] Search collection finds content
- [ ] Install from collection works
- [ ] Complete roundtrip successful

---

## What Success Looks Like

1. **Version Progression**: 1.0.0 (collection) → 1.0.1 (manual edit)
2. **Two Portfolio Commits**: One without issue, one with issue
3. **One Collection Issue**: Created only when auto-submit was enabled
4. **All Metadata Preserved**: Throughout the entire journey
5. **Clean Error Messages**: When testing invalid operations

---

## Test Markers to Verify

The Safe Roundtrip Tester includes these markers that should be present:
- BROWSE_MARKER: SAFE_ROUNDTRIP_BROWSE_OK
- SEARCH_MARKER: SAFE_ROUNDTRIP_SEARCH_OK
- INSTALL_MARKER: SAFE_ROUNDTRIP_INSTALL_OK
- SUBMIT_MARKER: SAFE_ROUNDTRIP_SUBMIT_OK
- COMPLETE_MARKER: SAFE_ROUNDTRIP_ALL_OK

---

## Troubleshooting

### If Browse Fails
- Check that the collection repository is accessible
- Verify the skills directory exists in the collection
- Ensure the safe-roundtrip-tester.md file is in library/skills/

### If Search Fails
- Try different search terms like "test" or "validation"
- Check if search functionality is enabled
- Verify the skill has proper metadata

### If Install Fails
- Check portfolio directory permissions
- Verify ~/.dollhouse/portfolio/skills/ exists
- Ensure no file conflicts

### If Submit Fails
- Check GitHub authentication
- Verify portfolio repository exists
- Ensure proper permissions

### If Auto-Submit Doesn't Create Issue
- Verify auto-submit is actually enabled
- Check GitHub token permissions
- Ensure collection repository accepts issues

---

## Quick Reference

### Key MCP Commands
- `list_elements --type skills` - List all skills
- `browse_collection "skills"` - Browse collection
- `search_collection "term"` - Search collection
- `install_collection_element "skills/safe-roundtrip-tester.md"` - Install from collection
- `submit_content "Safe Roundtrip Tester"` - Submit to portfolio
- `configure_collection_submission autoSubmit: true/false` - Toggle auto-submit
- `get_collection_submission_config` - Check config
- `edit_element "Safe Roundtrip Tester" --type skills` - Edit a skill

### Key Paths
- Collection: `library/skills/safe-roundtrip-tester.md`
- Portfolio: `~/.dollhouse/portfolio/skills/safe-roundtrip-tester.md`

### Expected Outcomes
- Without auto-submit: Portfolio update only, manual submission link
- With auto-submit: Portfolio update + collection issue creation
- Version should progress from 1.0.0 to 1.0.1
- All metadata should be preserved

---

## Important Notes

1. **This uses a SAFE test skill** - No code blocks that trigger security
2. **Follow prompts exactly** - Copy and paste for best results  
3. **Check each step** - Don't skip verification
4. **Reset when done** - Disable auto-submit after testing
5. **Document issues** - Note any failures for debugging

---

*This comprehensive test validates every part of the MCP collection workflow!*