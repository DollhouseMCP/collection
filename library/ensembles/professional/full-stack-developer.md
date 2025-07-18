---
type: ensemble
name: Full-Stack Developer Ensemble
description: Complete development environment combining personas, tools, and skills for professional software development
unique_id: full-stack-developer-ensemble_20250715-100600_dollhousemcp
author: dollhousemcp
category: professional
version: 1.0.0
created_date: 2025-07-15
tags: [development, programming, full-stack, software-engineering]
license: MIT
components:
  personas:
    - software-architect
    - code-reviewer
    - debug-detective
  skills:
    - git-workflow-automation
    - docker-containerization
    - api-design-patterns
  tools:
    - code-formatter
    - security-scanner
    - dependency-analyzer
  prompts:
    - code-review-checklist
    - architecture-decision-record
    - bug-report-template
  templates:
    - project-readme
    - api-documentation
    - test-plan
coordination_strategy: Task-based activation with context sharing
use_cases:
  - Building production applications
  - Code review and quality assurance
  - System architecture design
  - Debugging complex issues
dependencies:
  - Git version control
  - Docker (optional)
  - Node.js or Python runtime
---

# Full-Stack Developer Ensemble

A comprehensive collection of AI capabilities for professional software development, combining multiple specialized personas, tools, and resources.

## Overview

This ensemble brings together everything needed for full-stack development work:
- **Multiple specialized personas** that can be activated based on the task
- **Professional tools** for code quality and security
- **Proven templates** for documentation and planning
- **Contextual prompts** for common development scenarios

## Components

### Personas

1. **Software Architect** (`software-architect`)
   - System design and architecture decisions
   - Technology stack selection
   - Scalability planning

2. **Code Reviewer** (`code-reviewer`)
   - Code quality assessment
   - Best practices enforcement
   - Constructive feedback

3. **Debug Detective** (`debug-detective`)
   - Root cause analysis
   - Systematic debugging approach
   - Performance troubleshooting

### Skills

1. **Git Workflow Automation** (`git-workflow-automation`)
   - Branch management strategies
   - Commit message formatting
   - PR/MR workflows

2. **Docker Containerization** (`docker-containerization`)
   - Container best practices
   - Multi-stage builds
   - Security considerations

3. **API Design Patterns** (`api-design-patterns`)
   - RESTful principles
   - GraphQL schemas
   - Versioning strategies

### Tools

1. **Code Formatter** (`code-formatter`)
   - Language-specific formatting
   - Configuration management
   - Team standards enforcement

2. **Security Scanner** (`security-scanner`)
   - Vulnerability detection
   - Dependency auditing
   - OWASP compliance

3. **Dependency Analyzer** (`dependency-analyzer`)
   - License compliance
   - Version management
   - Update strategies

### Prompts & Templates

Includes battle-tested prompts for code reviews, architecture decisions, and bug reports, plus templates for documentation, API specs, and test plans.

## Usage Patterns

### For New Projects
1. Activate Software Architect persona for initial design
2. Use project-readme template for documentation
3. Apply api-design-patterns skill for backend planning

### For Code Reviews
1. Activate Code Reviewer persona
2. Use code-review-checklist prompt
3. Run security-scanner tool on changes

### For Debugging
1. Activate Debug Detective persona
2. Use bug-report-template for issue tracking
3. Apply systematic debugging methodology

### For Documentation
1. Use api-documentation template
2. Generate architecture-decision-record
3. Create comprehensive test-plan

## Integration

This ensemble works best when:
- Integrated with your development workflow
- Used consistently across team members
- Customized for your specific tech stack
- Combined with CI/CD pipelines

## Customization

Feel free to:
- Add or remove components based on your needs
- Fork and create language-specific versions
- Extend with your team's best practices
- Integrate with your existing tools