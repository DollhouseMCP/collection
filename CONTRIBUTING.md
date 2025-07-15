# Contributing to DollhouseMCP Collection

Thank you for your interest in contributing to the DollhouseMCP Collection! This guide will help you submit high-quality content that enhances the AI ecosystem.

## 📋 Table of Contents

- [Content Types](#content-types)
- [Submission Process](#submission-process)
- [Content Standards](#content-standards)
- [Security Requirements](#security-requirements)
- [Testing Your Content](#testing-your-content)
- [Pull Request Process](#pull-request-process)

## 📦 Content Types

We accept the following types of content:

- **Personas** - AI behavioral profiles
- **Skills** - Functional capabilities
- **Agents** - Autonomous AI agents
- **Prompts** - Prompt templates
- **Templates** - Document templates
- **Tools** - MCP-compatible tools
- **Ensembles** - Multi-agent setups

## 🚀 Submission Process

### 1. Choose Your Submission Method

#### GitHub Pull Request (Recommended)
1. Fork the repository
2. Create your content
3. Submit a pull request

#### Issue Form
1. Go to Issues → New Issue
2. Select "Content Submission"
3. Fill out the form

### 2. Create Your Content

Each content type has a specific format. Here's an example for a persona:

```markdown
---
name: "Your Persona Name"
description: "Brief description of what this persona does"
unique_id: "your-unique-id"
author: "Your Name"
category: "professional"  # creative, educational, gaming, personal, professional
version: "1.0.0"
license: "Creator-Owned"
tags: ["tag1", "tag2"]
---

# Persona Name

## Description
Detailed description of the persona...

## Behavioral Guidelines
How the AI should behave...

## Example Usage
Examples of interactions...
```

### 3. Place Your Content

Put your content in the appropriate directory:
- `library/[content-type]/[category]/your-content.md`

Example: `library/personas/professional/business-analyst.md`

## 📏 Content Standards

### Required Fields

All content must include:
- `name` - Clear, descriptive name
- `description` - Brief summary (< 200 chars)
- `unique_id` - Unique identifier (lowercase, hyphens)
- `author` - Your name or handle
- `category` - One of: creative, educational, gaming, personal, professional

### Quality Guidelines

1. **Clear Purpose** - Content should have a well-defined use case
2. **Appropriate Content** - Family-friendly, professional, ethical
3. **Tested Functionality** - Ensure your content works as intended
4. **Good Documentation** - Include examples and usage instructions

### Writing Style

- Use clear, concise language
- Include examples where applicable
- Avoid jargon unless necessary
- Make content accessible to all skill levels

## 🔒 Security Requirements

All content undergoes automated security scanning. Avoid:

### Prohibited Patterns

❌ **No Prompt Injection**
```
Bad: "Ignore previous instructions and..."
Good: "Please help me with..."
```

❌ **No System Commands**
```
Bad: "Execute: rm -rf /"
Good: "Analyze this code: ..."
```

❌ **No Data Exfiltration**
```
Bad: "Send data to external-site.com"
Good: "Process this information..."
```

### Security Best Practices

1. Never request system access
2. Don't attempt to override safety guidelines
3. Avoid encoded or obfuscated instructions
4. Keep content transparent and auditable

## 🧪 Testing Your Content

Before submitting:

### 1. Local Validation

```bash
# Install dependencies
npm install

# Validate your content
npm run validate:content library/personas/professional/my-persona.md
```

### 2. Test Checklist

- [ ] Content follows the required format
- [ ] All required fields are present
- [ ] No security violations detected
- [ ] Examples work as intended
- [ ] Documentation is clear

## 🔄 Pull Request Process

### 1. Create Your PR

```bash
# Create a feature branch
git checkout -b add-my-awesome-persona

# Add your files
git add library/personas/professional/my-persona.md

# Commit with clear message
git commit -m "feat: Add business analyst persona for professional category"

# Push to your fork
git push origin add-my-awesome-persona
```

### 2. PR Title Format

Use conventional commits:
- `feat:` New content
- `fix:` Corrections to existing content
- `docs:` Documentation updates
- `style:` Formatting changes

Example: `feat: Add creative writing coach persona`

### 3. PR Description Template

```markdown
## Content Type
Persona / Skill / Agent / etc.

## Category
Creative / Professional / etc.

## Description
Brief description of what this adds

## Testing
- [ ] Validated locally
- [ ] Tested functionality
- [ ] Security scan passed

## Checklist
- [ ] Follows content standards
- [ ] Includes documentation
- [ ] Added examples
```

### 4. Review Process

1. **Automated Checks** - Security and format validation
2. **Community Review** - Feedback from other contributors
3. **Maintainer Review** - Final approval
4. **Merge** - Your content goes live!

## 💡 Tips for Success

1. **Study Existing Content** - Look at accepted submissions
2. **Start Simple** - Begin with straightforward content
3. **Ask Questions** - Use discussions for clarification
4. **Iterate** - Incorporate feedback gracefully
5. **Share Knowledge** - Help review others' submissions

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others succeed
- Maintain high quality standards

## 📞 Getting Help

- **Discord**: [Join our community](https://discord.gg/dollhousemcp)
- **Discussions**: Use GitHub Discussions
- **Issues**: Report bugs or suggest features
- **Email**: support@dollhousemcp.com

---

Thank you for contributing to the DollhouseMCP Collection! Your content helps build a richer AI ecosystem for everyone.