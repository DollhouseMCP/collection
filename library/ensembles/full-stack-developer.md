---
type: ensemble
name: Full-Stack Developer Ensemble
description: >-
  Complete development environment combining personas, tools, and skills for
  professional software development
unique_id: ensemble_full-stack-developer-ensemble_dollhousemcp_20250715-100600
author: DollhouseMCP
category: professional
version: 1.0.0
tags:
  - development
  - programming
  - full-stack
  - software-engineering
license: MIT
activation_strategy: conditional
conflict_resolution: priority
context_sharing: selective
elements:
  - element_name: software-architect
    element_type: persona
    role: primary
    priority: 100
    activation: always
    purpose: System design and architecture decisions
  - element_name: code-reviewer
    element_type: persona
    role: support
    priority: 90
    activation: on-demand
    purpose: Code quality assessment and best practices
  - element_name: debug-detective
    element_type: persona
    role: support
    priority: 85
    activation: conditional
    condition: debugging_requested || error_investigation
    purpose: Root cause analysis and systematic debugging
  - element_name: git-workflow-automation
    element_type: skill
    role: support
    priority: 80
    activation: on-demand
    purpose: Branch management and PR workflows
  - element_name: docker-containerization
    element_type: skill
    role: support
    priority: 70
    activation: on-demand
    purpose: Container best practices and multi-stage builds
  - element_name: api-design-patterns
    element_type: skill
    role: support
    priority: 75
    activation: on-demand
    purpose: RESTful and GraphQL API design
  - element_name: code-formatter
    element_type: skill
    role: support
    priority: 65
    activation: on-demand
    purpose: Language-specific formatting and team standards
  - element_name: security-scanner
    element_type: skill
    role: support
    priority: 80
    activation: on-demand
    purpose: Vulnerability detection and dependency auditing
  - element_name: dependency-analyzer
    element_type: skill
    role: support
    priority: 60
    activation: on-demand
    purpose: License compliance and version management
  - element_name: code-review-checklist
    element_type: template
    role: support
    priority: 70
    activation: on-demand
    purpose: Structured code review process
  - element_name: architecture-decision-record
    element_type: template
    role: support
    priority: 65
    activation: on-demand
    purpose: Architecture decision documentation
  - element_name: bug-report-template
    element_type: template
    role: support
    priority: 60
    activation: on-demand
    purpose: Standardized issue tracking
  - element_name: project-readme
    element_type: template
    role: support
    priority: 70
    activation: on-demand
    purpose: Project documentation
  - element_name: api-documentation
    element_type: template
    role: support
    priority: 65
    activation: on-demand
    purpose: API specification and documentation
  - element_name: test-plan
    element_type: template
    role: support
    priority: 60
    activation: on-demand
    purpose: Test planning and coverage documentation
created: '2025-07-15'
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
