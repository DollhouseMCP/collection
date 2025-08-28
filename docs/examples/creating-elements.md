# Creating Elements - Examples

## Creating a Persona

### Basic Persona Structure
```markdown
---
id: technical-writer-expert
name: Technical Writer Expert
type: persona
description: A specialized persona for creating clear technical documentation
author: Jane Developer
version: 1.0.0
license: MIT
tags: [documentation, technical-writing, api-docs]
created: 2025-08-28
updated: 2025-08-28
---

# Technical Writer Expert

## Core Identity
You are an expert technical writer with 15 years of experience creating documentation for complex software systems.

## Expertise Areas
- API documentation
- Developer guides
- System architecture documentation
- Code examples and tutorials

## Communication Style
- Clear and concise language
- Active voice preferred
- Examples-driven explanations
- Progressive disclosure of complexity

## Best Practices
1. Start with the problem being solved
2. Provide concrete examples
3. Include edge cases and error handling
4. Link to related concepts
```

## Creating a Template

### Document Template Example
```markdown
---
id: pr-description-template
name: PR Description Template
type: template
description: Comprehensive pull request description template
author: DevOps Team
version: 2.1.0
license: Apache-2.0
tags: [github, pull-request, documentation]
---

# Pull Request: [Feature/Fix Name]

## Summary
Brief description of what this PR accomplishes.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## Creating an Agent

### Code Review Agent
```markdown
---
id: code-review-agent
name: Code Review Agent
type: agent
description: Automated code review with focus on security and best practices
author: Security Team
version: 1.3.0
license: AGPL-3.0
tags: [code-review, security, automation]
---

# Code Review Agent

## Capabilities
- Static code analysis
- Security vulnerability detection
- Performance optimization suggestions
- Style guide enforcement

## Review Process

### Step 1: Security Scan
Check for common vulnerabilities:
- SQL injection risks
- XSS vulnerabilities
- Authentication issues
- Authorization bypasses

### Step 2: Code Quality
Evaluate code structure:
- Function complexity
- Code duplication
- Test coverage
- Documentation completeness

### Step 3: Performance
Identify optimization opportunities:
- Database query optimization
- Caching opportunities
- Algorithm efficiency
- Resource usage

## Output Format
```json
{
  "severity": "high|medium|low",
  "issues": [...],
  "suggestions": [...],
  "metrics": {...}
}
```
```

## Creating a Skill

### Data Analysis Skill
```markdown
---
id: data-analysis-skill
name: Data Analysis Skill
type: skill
description: Advanced data analysis and visualization capabilities
author: Data Science Team
version: 1.0.0
license: MIT
tags: [data-analysis, visualization, statistics]
---

# Data Analysis Skill

## Capabilities

### Statistical Analysis
- Descriptive statistics
- Hypothesis testing
- Regression analysis
- Time series analysis

### Data Visualization
- Chart selection
- Interactive dashboards
- Data storytelling
- Export formats

### Data Processing
- Data cleaning
- Feature engineering
- Outlier detection
- Missing value handling

## Usage Example

```python
# Analyze dataset
results = analyze_data(df, {
    'statistics': ['mean', 'median', 'std'],
    'visualizations': ['histogram', 'scatter'],
    'tests': ['normality', 'correlation']
})

# Generate report
create_report(results, format='html')
```

## Requirements
- pandas >= 1.3.0
- numpy >= 1.21.0
- matplotlib >= 3.4.0
- seaborn >= 0.11.0
```

## Validation Before Submission

Always validate your elements before submission:

```bash
# Validate a single element
npm run validate:content my-element.md

# Check for security issues
npm run validate:security my-element.md

# Run full validation suite
npm run validate:all my-element.md
```

## Common Mistakes to Avoid

### ❌ Missing Metadata
```markdown
---
name: My Element  # Missing: id, type, version, etc.
---
```

### ❌ Security Patterns
```markdown
# Don't include actual credentials
API_KEY: sk-1234567890  # This will be rejected
```

### ❌ Invalid Version
```markdown
version: 1  # Should be: 1.0.0
```

### ✅ Correct Format
```markdown
---
id: my-element-id
name: My Element Name
type: persona
description: Clear description
author: Your Name
version: 1.0.0
license: MIT
---

# Content goes here
```

## Next Steps

1. Create your element following these examples
2. Validate locally using the CLI tools
3. Test in your local environment
4. Submit via pull request or MCP interface
5. Monitor review feedback

## Resources

- [Element Templates](../templates/)
- [Validation Guide](../VALIDATION.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Security Best Practices](../SECURITY.md)