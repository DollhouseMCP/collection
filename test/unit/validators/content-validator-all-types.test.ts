/**
 * Content Validator Tests for All Content Types
 * 
 * Tests validation for all 7 content types defined in the schema:
 * - Personas
 * - Skills
 * - Agents
 * - Prompts
 * - Templates
 * - Tools
 * - Ensembles
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { ContentValidator } from '../../../src/validators/content-validator';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('ContentValidator - All Content Types', () => {
  let validator: ContentValidator;
  const testDir = join(process.cwd(), '.test-content-types');
  
  beforeEach(() => {
    validator = new ContentValidator();
    // Create test directory
    try {
      mkdirSync(testDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  });

  afterEach(() => {
    // Clean up test directory
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Skill validation', () => {
    it('should validate a valid skill file', async () => {
      const validSkill = `---
unique_id: test-skill-001
name: Data Analysis Skill
description: Advanced data analysis and visualization capabilities
type: skill
version: 1.0.0
tags:
  - data
  - analysis
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: professional
capabilities:
  - "Statistical analysis"
  - "Data visualization"
  - "Predictive modeling"
requirements:
  - "Python 3.8+"
  - "pandas library"
compatibility:
  - "Jupyter notebooks"
  - "VS Code"
---

# Data Analysis Skill

This skill provides comprehensive data analysis capabilities including:

- Statistical analysis and hypothesis testing
- Interactive data visualizations
- Machine learning model development
- Automated reporting

## Usage

Enable this skill to enhance data analysis capabilities.
`;

      const testFile = join(testDir, 'valid-skill.md');
      writeFileSync(testFile, validSkill);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should fail validation for skill missing required capabilities', async () => {
      const invalidSkill = `---
unique_id: test-skill-002
name: Invalid Skill
description: Skill without capabilities
type: skill
version: 1.0.0
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: professional
---

# Invalid Skill

This skill is missing the required capabilities field.
`;

      const testFile = join(testDir, 'invalid-skill.md');
      writeFileSync(testFile, invalidSkill);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(false);
      expect(result.issues.some(issue => 
        issue.type === 'missing_field' && issue.details.includes('capabilities')
      )).toBe(true);
    });
  });

  describe('Agent validation', () => {
    it('should validate a valid agent file', async () => {
      const validAgent = `---
unique_id: test-agent-001
name: Research Assistant Agent
description: An agent that helps with research tasks
type: agent
version: 1.0.0
tags:
  - research
  - assistant
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: educational
capabilities:
  - "Web search"
  - "Document summarization"
  - "Citation management"
tools_required:
  - "search_api"
  - "pdf_reader"
model_requirements: "GPT-4 or Claude 3"
---

# Research Assistant Agent

This agent assists with academic and professional research tasks.

## Capabilities

- Searches academic databases
- Summarizes research papers
- Manages citations and references
- Generates research outlines
`;

      const testFile = join(testDir, 'valid-agent.md');
      writeFileSync(testFile, validAgent);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Prompt validation', () => {
    it('should validate a valid prompt file', async () => {
      const validPrompt = `---
unique_id: test-prompt-001
name: Code Review Prompt
description: A prompt for conducting thorough code reviews
type: prompt
version: 1.0.0
tags:
  - code-review
  - development
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: professional
input_variables:
  - "code_snippet"
  - "programming_language"
  - "context"
output_format: "markdown"
examples:
  - "Review this Python function for performance"
  - "Check this JavaScript code for security issues"
---

# Code Review Prompt

Please review the following code and provide feedback on:

1. Code quality and readability
2. Potential bugs or issues
3. Performance optimizations
4. Security concerns
5. Best practices

\`\`\`{programming_language}
{code_snippet}
\`\`\`

Context: {context}
`;

      const testFile = join(testDir, 'valid-prompt.md');
      writeFileSync(testFile, validPrompt);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Template validation', () => {
    it('should validate a valid template file', async () => {
      const validTemplate = `---
unique_id: test-template-001
name: Project README Template
description: A comprehensive template for project documentation
type: template
version: 1.0.0
tags:
  - documentation
  - readme
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: professional
format: "markdown"
variables:
  - "project_name"
  - "description"
  - "installation_steps"
use_cases:
  - "Open source projects"
  - "Internal documentation"
---

# {project_name}

{description}

## Installation

{installation_steps}

## Usage

[Add usage instructions here]

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]
`;

      const testFile = join(testDir, 'valid-template.md');
      writeFileSync(testFile, validTemplate);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Tool validation', () => {
    it('should validate a valid tool file', async () => {
      const validTool = `---
unique_id: test-tool-001
name: Weather API Tool
description: Fetches current weather data for any location
type: tool
version: 1.0.0
tags:
  - weather
  - api
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: professional
mcp_version: "1.0.0"
parameters:
  location:
    type: string
    description: "City name or coordinates"
    required: true
  units:
    type: string
    description: "Temperature units (celsius/fahrenheit)"
    default: "celsius"
returns: "WeatherData object with temperature, conditions, etc."
---

# Weather API Tool

This MCP tool provides real-time weather data.

## Usage

\`\`\`json
{
  "tool": "weather",
  "parameters": {
    "location": "San Francisco",
    "units": "celsius"
  }
}
\`\`\`

## Response Format

Returns current weather conditions including temperature, humidity, and forecast.
`;

      const testFile = join(testDir, 'valid-tool.md');
      writeFileSync(testFile, validTool);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Ensemble validation', () => {
    it('should validate a valid ensemble file', async () => {
      const validEnsemble = `---
unique_id: test-ensemble-001
name: Complete Research Suite
description: A comprehensive ensemble for academic research
type: ensemble
version: 1.0.0
tags:
  - research
  - academic
  - comprehensive
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: educational
components:
  personas:
    - "research-assistant-persona"
    - "academic-writer-persona"
  skills:
    - "data-analysis-skill"
    - "citation-management-skill"
  agents:
    - "research-assistant-agent"
  prompts:
    - "literature-review-prompt"
    - "hypothesis-generation-prompt"
  tools:
    - "scholar-search-tool"
    - "pdf-reader-tool"
coordination_strategy: "Sequential workflow with feedback loops"
use_cases:
  - "PhD research"
  - "Academic paper writing"
  - "Literature reviews"
dependencies:
  - "Academic database access"
  - "PDF processing capability"
---

# Complete Research Suite Ensemble

This ensemble combines multiple components to create a comprehensive research assistant.

## Components

### Personas
- Research Assistant: Helps with research methodology
- Academic Writer: Assists with paper structure and writing

### Skills
- Data Analysis: Statistical analysis and visualization
- Citation Management: Formats and organizes references

### Agents
- Research Assistant Agent: Coordinates research activities

### Tools
- Scholar Search: Searches academic databases
- PDF Reader: Extracts text from research papers

## Workflow

1. Use research assistant persona to plan research
2. Search for papers using scholar tool
3. Analyze data with data analysis skill
4. Write paper with academic writer persona
`;

      const testFile = join(testDir, 'valid-ensemble.md');
      writeFileSync(testFile, validEnsemble);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should validate ensemble with partial components', async () => {
      const partialEnsemble = `---
unique_id: test-ensemble-002
name: Simple Writing Ensemble
description: A minimal ensemble for writing tasks
type: ensemble
version: 1.0.0
tags:
  - writing
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: creative
components:
  personas:
    - "creative-writer-persona"
  prompts:
    - "story-starter-prompt"
    - "character-development-prompt"
---

# Simple Writing Ensemble

A lightweight ensemble focused on creative writing with just personas and prompts.
`;

      const testFile = join(testDir, 'partial-ensemble.md');
      writeFileSync(testFile, partialEnsemble);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Cross-type validation', () => {
    it('should reject content with mismatched type', async () => {
      const mismatchedContent = `---
unique_id: mismatched-001
name: Mismatched Content
description: Content where type doesn't match structure
type: skill
version: 1.0.0
author: Test Author
created_date: 2024-01-01T00:00:00Z
updated_date: 2024-01-01T00:00:00Z
category: professional
# This is persona-specific field on a skill type
triggers:
  - "hello"
  - "hi"
---

# Mismatched Content

This content has persona fields but claims to be a skill.
`;

      const testFile = join(testDir, 'mismatched.md');
      writeFileSync(testFile, mismatchedContent);
      
      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(false);
      expect(result.issues.some(issue => 
        issue.type === 'missing_field' || issue.type === 'invalid_metadata'
      )).toBe(true);
    });
  });
});