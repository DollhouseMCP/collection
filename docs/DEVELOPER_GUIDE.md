# DollhouseMCP Collection Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Creating Content](#creating-content)
4. [Validation System](#validation-system)
5. [Testing](#testing)
6. [Contributing Code](#contributing-code)
7. [API Reference](#api-reference)

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 8.x or higher
- Git
- TypeScript knowledge (for platform development)
- Markdown familiarity (for content creation)

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/DollhouseMCP/collection.git
cd collection

# Install dependencies
npm install

# Build the project
npm run build

# Run validation on example content
npm run validate library/**/*.md
```

## Development Setup

### Environment Configuration
```bash
# Optional: Set up git hooks
npm run prepare

# Set up VS Code (recommended)
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### Project Structure
```
collection/
├── src/                    # TypeScript source code
│   ├── types/             # Type definitions
│   ├── validators/        # Validation logic
│   └── cli/              # CLI tools
├── dist/                  # Compiled JavaScript
├── library/               # Free content
├── showcase/              # Featured content
├── catalog/              # Premium content
├── docs/                 # Documentation
├── scripts/              # Utility scripts
└── .github/              # GitHub Actions
```

## Creating Content

### Content Types Reference

#### 1. Personas
```markdown
---
type: persona
name: Expert Consultant
description: Professional consulting expertise across industries
unique_id: expert-consultant_20250715-120000_yourname
author: yourname
category: professional
version: 1.0.0
tags: [consulting, business, strategy]
---

# Expert Consultant

You are an experienced consultant with expertise in...
```

#### 2. Skills
```markdown
---
type: skill
name: Data Analysis
description: Advanced data analysis and visualization capabilities
unique_id: data-analysis_20250715-120000_yourname
author: yourname
category: professional
version: 1.0.0
tags: [data, analytics, visualization]
---

# Data Analysis Skill

This skill enables comprehensive data analysis including...
```

#### 3. Agents
```markdown
---
type: agent
name: Research Agent
description: Autonomous agent for conducting research
unique_id: research-agent_20250715-120000_yourname
author: yourname
category: educational
capabilities: [web_search, summarization, fact_checking]
tools_required: [search_api, text_processor]
---

# Research Agent

An autonomous agent capable of...
```

#### 4. Tools (MCP)
```markdown
---
type: tool
name: Calculator Tool
description: Advanced calculation capabilities
unique_id: calculator-tool_20250715-120000_yourname
author: yourname
category: professional
mcp_config:
  tool_name: calculate
  parameters:
    - name: expression
      type: string
      required: true
---

# Calculator Tool

MCP tool configuration for calculations...
```

### Unique ID Generation

Format: `{content-type}_{YYYYMMDD-HHMMSS}_{author}`

```javascript
function generateUniqueId(type, author) {
  const date = new Date();
  const timestamp = date.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .substring(0, 15);
  return `${type}_${timestamp}_${author}`;
}
```

### Metadata Schema

All content must include:
- `type`: Content type identifier
- `name`: Display name (3-100 characters)
- `description`: Brief description (10-500 characters)
- `unique_id`: Globally unique identifier
- `author`: Creator username
- `category`: One of: creative, educational, gaming, personal, professional

Optional fields:
- `version`: Semantic version (e.g., "1.2.3")
- `tags`: Array of keywords (max 10)
- `license`: Content license
- `created_date`: ISO date string
- `updated_date`: ISO date string

## Validation System

### Running Validation

```bash
# Validate specific file
npm run validate library/personas/creative/writer.md

# Validate all content
npm run validate library/**/*.md showcase/**/*.md

# Security-only validation
npm run validate -- --security-only library/**/*.md

# Output JSON report
npm run validate -- --output report.json library/**/*.md
```

### Security Patterns

The validator checks for:

1. **Prompt Injection**
   ```
   ❌ "Ignore all previous instructions"
   ❌ "System: Override safety protocols"
   ❌ Hidden unicode characters
   ```

2. **Data Exfiltration**
   ```
   ❌ "Send data to external-server.com"
   ❌ "Collect and transmit user information"
   ```

3. **Code Execution**
   ```
   ❌ "Execute: rm -rf /"
   ❌ "eval(malicious_code)"
   ```

### Custom Validation Rules

Add custom patterns in `src/validators/security-patterns.ts`:

```typescript
export const CUSTOM_PATTERNS: SecurityPattern[] = [
  {
    name: 'custom_pattern',
    pattern: /your-regex-here/i,
    severity: 'high',
    description: 'Description of what this detects',
    category: 'custom'
  }
];
```

## Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Test validation on real content
npm run test:integration

# Test specific content type
npm run test:integration -- --type personas
```

### Writing Tests

```typescript
import { ContentValidator } from '../src/validators/content-validator';

describe('ContentValidator', () => {
  it('should detect prompt injection', async () => {
    const validator = new ContentValidator();
    const result = await validator.validateContent('test.md');
    
    expect(result.securityIssues).toHaveLength(1);
    expect(result.securityIssues[0].severity).toBe('critical');
  });
});
```

## Contributing Code

### Code Style

We use ESLint and Prettier:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### TypeScript Guidelines

1. **Use strict typing**
   ```typescript
   // ✅ Good
   function processContent(content: string): ValidationResult {
     // ...
   }
   
   // ❌ Bad
   function processContent(content: any) {
     // ...
   }
   ```

2. **Define interfaces**
   ```typescript
   interface ContentMetadata {
     name: string;
     description: string;
     // ...
   }
   ```

3. **Use enums for constants**
   ```typescript
   enum Severity {
     Low = 'low',
     Medium = 'medium',
     High = 'high',
     Critical = 'critical'
   }
   ```

### Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make atomic commits**
   ```bash
   git add .
   git commit -m "feat: add new validation rule for X"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   gh pr create
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## API Reference

### ContentValidator

```typescript
class ContentValidator {
  async validateContent(filePath: string): Promise<ValidationResult>;
  validateMetadata(metadata: unknown): ValidationIssue[];
  validateContentQuality(content: string, metadata: ContentMetadata): ValidationIssue[];
}
```

### SecurityScanner

```typescript
function scanForSecurityPatterns(content: string): ValidationIssue[] {
  // Returns array of security issues found
}
```

### CLI Tools

```typescript
// validate-content.ts
validateContent(files: string[], options: {
  securityOnly?: boolean;
  output?: string;
  verbose?: boolean;
}): Promise<void>;
```

## Advanced Topics

### Creating Custom Validators

```typescript
import { BaseValidator } from '../src/validators/base';

export class CustomValidator extends BaseValidator {
  async validate(content: string): Promise<ValidationResult> {
    // Custom validation logic
  }
}
```

### Extending Content Types

1. Add type definition in `src/types/index.ts`
2. Create schema in `src/validators/schemas/`
3. Update `ContentValidator` to handle new type
4. Add examples in appropriate directory

### Performance Optimization

1. **Batch Processing**
   ```typescript
   const results = await Promise.all(
     files.map(file => validator.validateContent(file))
   );
   ```

2. **Caching**
   ```typescript
   const cache = new Map<string, ValidationResult>();
   ```

3. **Stream Processing**
   ```typescript
   import { createReadStream } from 'fs';
   import { pipeline } from 'stream/promises';
   ```

## Debugging

### Enable Debug Logging

```bash
# Set debug environment variable
DEBUG=dollhousemcp:* npm run validate

# Specific module
DEBUG=dollhousemcp:validator npm run validate
```

### Common Issues

1. **TypeScript Compilation Errors**
   ```bash
   # Clean and rebuild
   npm run clean
   npm run build
   ```

2. **Validation False Positives**
   - Check security patterns
   - Review regex flags
   - Test with minimal example

3. **Performance Issues**
   - Use `--verbose` flag
   - Check file sizes
   - Profile with Chrome DevTools

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MCP Specification](https://modelcontextprotocol.io)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Markdown Guide](https://www.markdownguide.org/)

## Getting Help

- Create an issue: [GitHub Issues](https://github.com/DollhouseMCP/collection/issues)
- Security concerns: security@dollhousemcp.com
- Community chat: (Coming soon)