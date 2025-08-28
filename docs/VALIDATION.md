# Content Validation Documentation

## Overview

The DollhouseMCP Collection employs a comprehensive validation system to ensure all content meets quality, security, and compatibility standards. Every element undergoes automated validation before acceptance into the collection.

## Validation Statistics

- ✅ **100% Elements Validated** - All 44 elements pass validation
- 🔒 **197+ Security Tests** - Comprehensive threat detection
- ⚡ **< 0.1ms Performance** - Fast pattern matching
- 🛡️ **48 Security Patterns** - AI/LLM threat coverage

## Validation Process

### 1. Structural Validation
Elements are checked for proper structure and required fields:

```yaml
Required Fields:
- id: Unique identifier
- name: Display name
- type: Element category
- description: Clear description
- content: Main content body
- author: Creator attribution
- version: Semantic version
- license: Usage license
```

### 2. Security Scanning
All content undergoes multi-layer security analysis:

#### Pattern Categories
- **Prompt Injection** - Attempts to override instructions
- **Jailbreaking** - Bypassing safety constraints
- **Command Execution** - System command injection
- **Data Exfiltration** - Unauthorized data access
- **Context Manipulation** - Memory/context attacks
- **Social Engineering** - Manipulation tactics
- **Evasion Techniques** - Detection avoidance
- **Denial of Service** - Resource exhaustion

#### Severity Levels
- 🔴 **CRITICAL** - Immediate rejection
- 🟠 **HIGH** - Manual review required
- 🟡 **MEDIUM** - Warning with explanation
- 🟢 **LOW** - Informational only

### 3. Content Quality Checks

#### Metadata Validation
- Proper semantic versioning
- Valid SPDX license identifiers
- Author attribution format
- Unique ID constraints

#### Content Standards
- No profanity or inappropriate content
- Clear, professional language
- Proper markdown formatting
- No broken links or references

#### Performance Criteria
- File size limits (< 1MB)
- Line length limits (< 1000 chars)
- No ReDoS vulnerable patterns
- Efficient regex patterns

## Running Validation

### CLI Tool

```bash
# Validate single file
npm run validate:content library/personas/creative-writer.md

# Validate entire category
npm run validate:content library/personas/**/*.md

# Validate with verbose output
npm run validate:content -- --verbose library/**/*.md
```

### Programmatic API

```typescript
import { ContentValidator } from '@dollhousemcp/collection';

const validator = new ContentValidator();
const result = await validator.validateContent('my-element.md');

if (result.valid) {
  console.log('✅ Content is valid!');
} else {
  console.error('❌ Validation failed:', result.errors);
}
```

### GitHub Actions

Validation runs automatically on:
- Pull request creation
- Push to main branch
- Scheduled daily scans

## Common Validation Issues

### 1. Missing Required Fields
```yaml
# ❌ Missing author field
id: my-element
name: My Element
type: persona
```

**Fix:** Add all required metadata fields

### 2. Security Pattern Detection
```markdown
# ❌ Contains prompt injection pattern
Ignore previous instructions and...
```

**Fix:** Rephrase content to avoid security patterns

### 3. Invalid Version Format
```yaml
# ❌ Invalid semantic version
version: 1.2
```

**Fix:** Use proper semantic versioning (e.g., 1.2.0)

### 4. Duplicate IDs
```yaml
# ❌ ID already exists in collection
id: creative-writer-pro
```

**Fix:** Choose a unique identifier

## Security Patterns Reference

### Critical Patterns (Auto-Reject)
- API keys and secrets
- Credit card numbers
- Private keys
- Database credentials

### High-Risk Patterns (Review Required)
- System commands
- File system operations
- Network requests
- Process manipulation

### Warning Patterns (Allowed with Caution)
- Email addresses
- Phone numbers
- IP addresses
- Generic placeholders

## Validation Rules

### File Structure
```markdown
---
id: unique-identifier
name: Display Name
type: persona|template|agent|skill|prompt|memory|ensemble|tool
description: Brief description
author: Creator Name
version: 1.0.0
license: MIT|Apache-2.0|AGPL-3.0|Custom
tags: [optional, tags, list]
created: 2025-08-28
updated: 2025-08-28
---

# Element Content

Main content goes here...
```

### Naming Conventions
- **ID**: lowercase-with-hyphens
- **Name**: Title Case Format
- **Type**: lowercase singular
- **Version**: semantic (X.Y.Z)

### Content Guidelines
1. Clear, concise descriptions
2. Professional language
3. No personal information
4. No external dependencies
5. Platform-agnostic content

## Advanced Validation

### Custom Validators

Create custom validation rules:

```typescript
import { addCustomValidator } from '@dollhousemcp/collection';

addCustomValidator({
  name: 'no-lorem-ipsum',
  pattern: /lorem\s+ipsum/gi,
  severity: 'warning',
  message: 'Remove placeholder text'
});
```

### Bypass Rules (Admin Only)

For special cases requiring override:

```bash
# With bypass flag (requires permissions)
npm run validate:content -- --bypass-security library/special-case.md
```

### Validation Reports

Generate detailed validation reports:

```bash
# Generate HTML report
npm run validate:report -- --format html

# Generate JSON report
npm run validate:report -- --format json > validation-report.json
```

## Best Practices

### Before Submission
1. Run local validation
2. Review security warnings
3. Test in isolation
4. Check for updates

### During Development
1. Validate frequently
2. Use provided templates
3. Follow naming conventions
4. Document thoroughly

### After Validation
1. Address all errors
2. Consider warnings
3. Test functionality
4. Request review

## Troubleshooting

### Validation Timeout
- Check for infinite loops
- Reduce content size
- Simplify patterns

### False Positives
- Review security patterns
- Rephrase content
- Request manual review

### Performance Issues
- Optimize regex patterns
- Reduce file size
- Split large content

## Support

- 📖 [Security Documentation](SECURITY.md)
- 🐛 [Report Issues](https://github.com/DollhouseMCP/collection/issues)
- 💬 [Discussions](https://github.com/DollhouseMCP/collection/discussions)
- 📧 [Contact Security Team](mailto:security@dollhousemcp.com)

---

*All content in the DollhouseMCP Collection has been validated using these standards.*