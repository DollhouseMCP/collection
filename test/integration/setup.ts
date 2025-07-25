/**
 * Integration Test Global Setup
 * 
 * Prepares the test environment for integration tests.
 * Based on DollhouseMCP/mcp-server patterns.
 */

import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';

export default async function globalSetup() {
  console.log('🧪 Setting up integration test environment...');
  
  // Test directories
  const testDir = '.test-tmp';
  const testContentDir = join(testDir, 'content');
  const testLibraryDir = join(testDir, 'library');
  
  try {
    // Clean up any existing test directories
    await rm(testDir, { recursive: true, force: true });
    
    // Create test directory structure
    await mkdir(testDir, { recursive: true });
    await mkdir(testContentDir, { recursive: true });
    await mkdir(testLibraryDir, { recursive: true });
    
    // Create subdirectories for each content type
    const contentTypes = ['personas', 'skills', 'agents', 'prompts', 'templates', 'tools', 'ensembles'];
    
    for (const type of contentTypes) {
      await mkdir(join(testLibraryDir, type), { recursive: true });
    }
    
    // Create test fixture files
    await createTestFixtures(testLibraryDir);
    
    // Set environment variables for integration tests
    process.env.NODE_ENV = 'test';
    process.env.TEST_MODE = 'integration';
    process.env.TEST_CONTENT_DIR = testContentDir;
    process.env.TEST_LIBRARY_DIR = testLibraryDir;
    process.env.SUPPRESS_LOGS = 'true';
    
    console.log('✅ Integration test environment ready');
    console.log(`📁 Test directory: ${testDir}`);
    console.log(`📚 Test library: ${testLibraryDir}`);
    
  } catch (error) {
    console.error('❌ Failed to setup integration test environment:', error);
    throw error;
  }
}

/**
 * Create test fixture files for each content type
 */
async function createTestFixtures(libraryDir: string) {
  const fixtures = [
    {
      type: 'personas',
      category: 'test-category',
      filename: 'test-persona.md',
      content: createPersonaFixture()
    },
    {
      type: 'skills',
      category: 'test-category', 
      filename: 'test-skill.md',
      content: createSkillFixture()
    },
    {
      type: 'agents',
      category: 'test-category',
      filename: 'test-agent.md',
      content: createAgentFixture()
    },
    {
      type: 'prompts',
      category: 'test-category',
      filename: 'test-prompt.md',
      content: createPromptFixture()
    },
    {
      type: 'templates',
      category: 'test-category',
      filename: 'test-template.md',
      content: createTemplateFixture()
    },
    {
      type: 'tools',
      category: 'test-category',
      filename: 'test-tool.md',
      content: createToolFixture()
    },
    {
      type: 'ensembles',
      category: 'test-category',
      filename: 'test-ensemble.md',
      content: createEnsembleFixture()
    }
  ];
  
  for (const fixture of fixtures) {
    const filePath = join(libraryDir, fixture.type, fixture.filename);
    await writeFile(filePath, fixture.content, 'utf8');
  }
}

function createPersonaFixture(): string {
  return `---
unique_id: test-persona-integration
name: Test Persona for Integration
description: A test persona used for integration testing
type: persona
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - automation
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Test Persona for Integration

This is a test persona created for integration testing purposes.

## Personality Traits

- Helpful and informative
- Focused on testing scenarios
- Methodical and precise

## Example Interactions

**User:** How do you approach testing?

**Assistant:** I approach testing systematically, ensuring comprehensive coverage of both positive and negative scenarios.
`;
}

function createSkillFixture(): string {
  return `---
unique_id: test-skill-integration
name: Test Skill for Integration
description: A test skill used for integration testing
type: skill
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - validation
capabilities:
  - content-validation
  - test-execution
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Test Skill for Integration

This skill demonstrates integration testing capabilities.

## Capabilities

- Validates content structure
- Executes test scenarios
- Reports test results

## Usage

Use this skill to validate that integration tests are working correctly.
`;
}

function createAgentFixture(): string {
  return `---
unique_id: test-agent-integration
name: Test Agent for Integration
description: A test agent used for integration testing
type: agent
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - automation
capabilities:
  - test-orchestration
  - result-reporting
persona_id: test-persona-integration
skills:
  - test-skill-integration
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Test Agent for Integration

This agent orchestrates integration testing workflows.

## Capabilities

- Coordinates test execution
- Manages test data
- Reports comprehensive results

## Integration

Works with the test persona and skill to provide complete testing coverage.
`;
}

function createPromptFixture(): string {
  return `---
unique_id: test-prompt-integration
name: Test Prompt for Integration
description: A test prompt used for integration testing
type: prompt
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - validation
use_case: integration-testing
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Test Prompt for Integration

You are a testing assistant focused on integration test validation.

## Instructions

1. Analyze the provided test scenario
2. Execute the test steps methodically
3. Report any issues or failures
4. Provide recommendations for improvement

## Output Format

Provide clear, structured responses with:
- Test status (PASS/FAIL)
- Detailed findings
- Recommendations
`;
}

function createTemplateFixture(): string {
  return `---
unique_id: test-template-integration
name: Test Template for Integration
description: A test template used for integration testing
type: template
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - template
variables:
  - test_name
  - test_scenario
  - expected_result
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Integration Test Template

## Test: {{test_name}}

### Scenario
{{test_scenario}}

### Expected Result
{{expected_result}}

### Execution Steps

1. Prepare test environment
2. Execute test scenario
3. Validate results
4. Clean up test data

### Result
[ ] PASS
[ ] FAIL

### Notes
_Add any observations or issues here_
`;
}

function createToolFixture(): string {
  return `---
unique_id: test-tool-integration
name: Test Tool for Integration
description: A test tool used for integration testing
type: tool
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - utility
interfaces:
  - cli
  - api
requirements:
  - Node.js >= 18.0.0
  - Jest testing framework
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Test Tool for Integration

A utility tool for integration testing workflows.

## Features

- Test data generation
- Result validation
- Report generation
- Environment setup

## Usage

\`\`\`bash
npm run test:integration
\`\`\`

## Configuration

Set environment variables:
- \`TEST_MODE=integration\`
- \`TEST_VERBOSE=true\`
`;
}

function createEnsembleFixture(): string {
  return `---
unique_id: test-ensemble-integration
name: Test Ensemble for Integration
description: A test ensemble combining multiple components for integration testing
type: ensemble
category: test-category
version: 1.0.0
tags:
  - test
  - integration
  - ensemble
  - complete-workflow
components:
  personas:
    - test-persona-integration
  skills:
    - test-skill-integration
  agents:
    - test-agent-integration
  prompts:
    - test-prompt-integration
  templates:
    - test-template-integration
  tools:
    - test-tool-integration
author: Test Suite
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
---

# Complete Integration Test Ensemble

This ensemble demonstrates a complete integration testing workflow using all content types.

## Components

### Core Components
- **Persona**: Test-focused AI assistant personality
- **Agent**: Test orchestration and management
- **Skills**: Testing capabilities and validation

### Supporting Components  
- **Prompts**: Testing instruction templates
- **Templates**: Test report and documentation templates
- **Tools**: Testing utilities and helpers

## Workflow

1. **Setup**: Initialize test environment using tools
2. **Execution**: Agent coordinates testing using skills and persona
3. **Validation**: Apply prompts to validate results
4. **Reporting**: Generate reports using templates

## Integration Benefits

This ensemble demonstrates how different content types work together to create comprehensive testing solutions.
`;
}