# MCP Roundtrip Workflow Test Guide

## Overview

This guide provides step-by-step instructions for testing the complete MCP (Model Context Protocol) roundtrip workflow in Claude Desktop. The workflow demonstrates browsing, installing, and submitting elements to the DollhouseMCP collection.

## Prerequisites

- Claude Desktop with DollhouseMCP server configured
- Access to terminal for verification commands
- GitHub CLI (`gh`) installed for checking issues

## Test Steps

### Step 1: Browse the Collection

**Command to paste in Claude Desktop:**
```
Please browse the DollhouseMCP collection to show me available elements. Use the browse_collection tool to show me what's in the library section.
```

**Expected Result:**
- List of available elements organized by type (personas, skills, agents, templates)
- Should show element names and descriptions

**Verification:**
```bash
# In terminal, verify collection exists
ls -la ~/Developer/Organizations/DollhouseMCP/active/collection/library/
```

---

### Step 2: Search for Specific Elements

**Command to paste in Claude Desktop:**
```
Search the collection for "code review" related elements using the search_collection tool.
```

**Alternative searches to try:**
```
Search for "creative writer" elements
Search for "task management" elements
Search for "template" elements
```

**Expected Result:**
- Search results matching the query
- Elements from different categories that match

**Verification:**
```bash
# Manual search in terminal
find ~/Developer/Organizations/DollhouseMCP/active/collection/library -name "*.md" | xargs grep -l "code review"
```

---

### Step 3: Get Element Details

**Command to paste in Claude Desktop:**
```
Show me the details of the code reviewer agent using get_collection_content with the path "library/agents/code-reviewer.md"
```

**Other elements to try:**
```
Get details for "library/agents/task-manager.md"
Get details for "library/skills/python-expert.md"
Get details for "library/templates/meeting-notes.md"
```

**Expected Result:**
- Full content of the element
- Metadata (name, description, author, type)
- Complete instructions/implementation

**Verification:**
```bash
# View file directly
cat ~/Developer/Organizations/DollhouseMCP/active/collection/library/agents/code-reviewer.md
```

---

### Step 4: Install Element to Portfolio

**Command to paste in Claude Desktop:**
```
Install the code reviewer agent to my local portfolio using install_content with the path "library/agents/code-reviewer.md"
```

**Expected Result:**
- Success message confirming installation
- Element copied to `~/.dollhouse/portfolio/agents/`
- Unique ID generated for the local copy

**Verification:**
```bash
# Check portfolio directory
ls -la ~/.dollhouse/portfolio/agents/
# Or if portfolio is elsewhere
ls -la ~/.dollhouse/portfolio/
```

---

### Step 5: List Local Portfolio

**Command to paste in Claude Desktop:**
```
Show me what elements I have in my local portfolio. List the contents of my portfolio directory.
```

**Alternative commands:**
```
List all my installed personas
Show my portfolio agents
What elements have I installed locally?
```

**Expected Result:**
- List of all installed elements
- Organized by type
- Shows metadata for each element

**Verification:**
```bash
# Check all portfolio subdirectories
for dir in ~/.dollhouse/portfolio/*/; do
  echo "=== $(basename $dir) ==="
  ls -la "$dir" 2>/dev/null | grep -E "\.md$"
done
```

---

### Step 6: Prepare for Submission

**Command to paste in Claude Desktop:**
```
I want to submit an element to the collection. Can you help me prepare the code reviewer agent I just installed for submission back to the collection as a test? Show me what the submission process looks like.
```

**Expected Result:**
- Explanation of submission process
- Validation checks performed
- Preparation of element for submission

---

### Step 7: Submit to Collection (Test)

**Command to paste in Claude Desktop:**
```
Submit the code reviewer agent from my portfolio to the collection using the submit_content tool. This is just a test submission to verify the workflow works.
```

**Expected Result:**
- GitHub issue created for submission
- Link to the created issue
- Confirmation of submission

**Verification:**
```bash
# Check for new issues
gh issue list --repo DollhouseMCP/collection --limit 5

# Check for issues with "submission" label
gh issue list --repo DollhouseMCP/collection --label "element-submission"
```

---

### Step 8: Check Submission Status

**Command to paste in Claude Desktop:**
```
Can you check if my test submission was created successfully? What's the status of the submission?
```

**Expected Result:**
- Status of the GitHub issue
- Any automated workflow results
- Next steps in the process

---

## Diagnostic Commands

### Check Available Tools

```
Show me what MCP tools are available. List all available tools.
```

### Check Server Status

```
What's the status of the DollhouseMCP server? Is it running properly?
```

### Check Cache Health

```
Get the collection cache health status using get_collection_cache_health tool.
```

---

## Validation Scripts Testing

After installing an element, you can test the validation scripts:

### Run Security Scanner

```bash
cd ~/Developer/Organizations/DollhouseMCP/active/collection
node scripts/pr-validation/security-scanner.mjs ~/.dollhouse/portfolio/agents/code-reviewer.md
```

### Run Quality Analyzer

```bash
cd ~/Developer/Organizations/DollhouseMCP/active/collection
node scripts/pr-validation/quality-analyzer.mjs ~/.dollhouse/portfolio/agents/code-reviewer.md
```

### Run Integration Tester

```bash
cd ~/Developer/Organizations/DollhouseMCP/active/collection
node scripts/pr-validation/integration-tester.mjs ~/.dollhouse/portfolio/agents/code-reviewer.md
```

---

## Expected Workflow Results

### Success Indicators

1. ✅ **Browse/Search Works**: Can see and search collection elements
2. ✅ **Installation Works**: Elements copied to local portfolio
3. ✅ **Portfolio Management**: Can list and manage local elements
4. ✅ **Submission Works**: Creates GitHub issue for review
5. ✅ **Validation Passes**: Scripts run without critical errors

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Tool not found" | Check MCP server configuration in Claude Desktop |
| "Portfolio directory not found" | Create with `mkdir -p ~/.dollhouse/portfolio` |
| "Permission denied" | Check file permissions on portfolio directory |
| "GitHub authentication failed" | Run `gh auth login` |
| "Collection not found" | Verify path to collection repository |

---

## Reporting Results

For each step, please report:

1. **Step Number**: Which step were you testing?
2. **Command Used**: Exact text you pasted
3. **Success**: Did it work? (Yes/No/Partial)
4. **Output**: What was the response?
5. **Errors**: Any error messages?
6. **Verification**: Result of terminal verification commands

### Report Template

```markdown
## Step X: [Step Name]

**Status**: ✅ Success / ⚠️ Partial / ❌ Failed

**Command Used:**
```
[Paste exact command]
```

**Output:**
```
[Paste Claude's response]
```

**Verification:**
```bash
[Terminal command results]
```

**Notes:**
- [Any observations or issues]
```

---

## Advanced Testing

### Test Different Element Types

```
# Personas
Install "library/personas/creative-writer.md"

# Skills  
Install "library/skills/python-expert.md"

# Templates
Install "library/templates/meeting-notes.md"

# Ensembles
Install "library/ensembles/development-team.md"
```

### Test Batch Operations

```
Install multiple elements at once:
1. Install the code reviewer agent
2. Install the task manager agent
3. Install the python expert skill
Then list my entire portfolio
```

### Test Error Handling

```
# Try installing non-existent element
Install "library/agents/does-not-exist.md"

# Try submitting without installation
Submit "nonexistent-element" to the collection
```

---

## GitHub Actions Workflow

Once a submission is created, the automated workflow will:

1. **Validate Security**: Check for malicious patterns
2. **Analyze Quality**: Score content quality and completeness
3. **Run Integration Tests**: Verify element structure and compatibility
4. **Generate Reports**: Create comprehensive review reports
5. **Auto-approve or Flag**: Based on validation results

Monitor the workflow:
```bash
# Watch the latest workflow run
gh run list --repo DollhouseMCP/collection --limit 1
gh run watch --repo DollhouseMCP/collection
```

---

## Cleanup After Testing

```bash
# Remove test submissions
rm -rf ~/Developer/Organizations/DollhouseMCP/active/collection/test-submissions/

# Clean portfolio (careful - this removes all installed elements)
rm -rf ~/.dollhouse/portfolio/agents/test-*

# Remove test reports
rm -f ~/Developer/Organizations/DollhouseMCP/active/collection/*-report.json
rm -f ~/Developer/Organizations/DollhouseMCP/active/collection/*-report.md
```

---

## Next Steps

After successful testing:

1. **Review Created Issues**: Check GitHub for any test submissions
2. **Close Test Issues**: Clean up test submissions
3. **Document Findings**: Note any issues or improvements needed
4. **Real Submission**: Try submitting an actual new element

---

## Support

If you encounter issues:

1. Check the MCP server logs
2. Verify Claude Desktop configuration
3. Check file permissions
4. Review GitHub authentication
5. Check network connectivity to GitHub

For help:
- MCP Server Issues: Check `/active/mcp-server/docs/`
- Collection Issues: Check `/active/collection/docs/`
- GitHub Actions: Check workflow logs in GitHub

---

*Last Updated: August 2024*
*Version: 1.0.0*