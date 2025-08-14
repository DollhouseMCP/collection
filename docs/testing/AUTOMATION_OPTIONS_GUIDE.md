# Roundtrip Test Automation Options

## Overview

We've created three different approaches to automate the roundtrip testing process, eliminating the need for manual copy-paste of 12 prompts.

## Option 1: Testing Agent (RECOMMENDED) 🤖

**File**: `library/agents/roundtrip-test-agent.md`

### How It Works
This is a specialized agent that Claude Desktop with DollhouseMCP can activate to run all tests automatically.

### Usage
1. In Claude Desktop with DollhouseMCP installed:
   ```
   Install the Roundtrip Test Agent from the collection:
   install_collection_element "agents/roundtrip-test-agent.md"
   
   Then activate it:
   activate_element "Roundtrip Test Agent" --type agents
   
   Then ask it to run tests:
   Run the complete roundtrip test suite for Safe Roundtrip Tester and save results to /tmp/roundtrip-results.json
   ```

2. The agent will:
   - Execute all 12 test scenarios automatically
   - Collect results in structured format
   - Generate comprehensive report
   - Save results to JSON file
   - Provide summary assessment

### Advantages
- ✅ Fully integrated with DollhouseMCP
- ✅ Can be activated like any other agent
- ✅ Reusable for different test elements
- ✅ Generates structured output
- ✅ No external dependencies

### Output Format
```json
{
  "test_run_id": "timestamp",
  "phases": {
    "installation": {...},
    "portfolio_upload": {...},
    "feature_tests": {...}
  },
  "critical_failures": [],
  "overall_score": "50%",
  "recommendation": "FAIL"
}
```

---

## Option 2: Single Comprehensive Prompt 📋

**File**: `docs/testing/AUTOMATED_TEST_PROMPT.md`

### How It Works
A single, comprehensive prompt that tells Claude Desktop to run all tests sequentially.

### Usage
1. Open the file `AUTOMATED_TEST_PROMPT.md`
2. Copy the entire prompt content
3. Paste into Claude Desktop
4. Claude will execute all tests and generate report

### Advantages
- ✅ Simple - just copy and paste once
- ✅ No installation required
- ✅ Works with any Claude Desktop instance
- ✅ Clear, explicit instructions

### Disadvantages
- ❌ Still requires one manual copy-paste
- ❌ Less reusable than agent approach
- ❌ Output format may vary

---

## Option 3: Node.js Test Orchestrator 🔧

**File**: `scripts/automated-roundtrip-test.mjs`

### How It Works
A Node.js script that simulates the test execution and generates reports.

### Usage
```bash
# Make executable
chmod +x scripts/automated-roundtrip-test.mjs

# Run the tests
./scripts/automated-roundtrip-test.mjs

# Results saved to:
# - test-results/roundtrip-test-[timestamp].json
# - test-results/roundtrip-test-[timestamp].md
```

### Advantages
- ✅ Can be run from command line
- ✅ Generates both JSON and Markdown reports
- ✅ Can be integrated into CI/CD
- ✅ Consistent output format

### Disadvantages
- ❌ Currently simulates MCP tools (needs integration)
- ❌ Requires Node.js environment
- ❌ Not integrated with actual Claude Desktop

### Future Enhancement
Could be modified to actually call MCP tools via API or command line integration.

---

## Option 4: MCP Test Server (Future) 🚀

### Concept
Build a dedicated MCP server for testing that:
- Provides test orchestration tools
- Records all interactions
- Generates test reports
- Can be connected to Claude Desktop

### Implementation
```json
{
  "mcpServers": {
    "test-runner": {
      "command": "node",
      "args": ["/path/to/test-runner-server.js"]
    }
  }
}
```

### Tools It Would Provide
- `run_roundtrip_test` - Execute complete test suite
- `get_test_results` - Retrieve results
- `compare_test_runs` - Compare multiple runs
- `generate_test_report` - Create reports

---

## Recommendation

**For immediate use**: Option 1 (Testing Agent)
- Most integrated with existing system
- Reusable and maintainable
- Provides structured output

**For CI/CD integration**: Option 3 (Node.js script)
- Can be automated in pipelines
- Consistent, predictable output

**For quick one-off tests**: Option 2 (Single prompt)
- Simple and straightforward
- No setup required

---

## Next Steps

1. **Install the Testing Agent**:
   ```
   cd /Users/mick/Developer/Organizations/DollhouseMCP/active/collection
   # Agent is already created at library/agents/roundtrip-test-agent.md
   ```

2. **Test with Claude Desktop**:
   - Install and activate the agent
   - Run automated tests
   - Review generated reports

3. **Fix Critical Issues**:
   Based on test results, prioritize fixing:
   - Search functionality (100% broken)
   - submit_content element type detection
   - portfolio_status accuracy
   - Error message types

4. **Create CI/CD Integration**:
   - Enhance Node.js script to call real MCP tools
   - Add to GitHub Actions workflow
   - Run on every PR

---

## Expected Results

All automation options will identify the same critical issues:
- 🔴 Search completely broken (0% functional)
- 🔴 submit_content requires filename workaround
- 🔴 portfolio_status shows false data
- 🔴 Error messages show wrong content type
- 🟡 Version management doesn't respect input

Success rate: ~50% (6/12 tests pass without workarounds)

---

*Choose the option that best fits your workflow and testing needs!*