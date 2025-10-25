---
category: general
description: >-
  Template for AI agents creating documentation issues - simpler structure for
  docs improvements, additions, and fixes
examples: []
includes: []
name: github-issue-documentation
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# Git

Hub Issue Documentation TemplateAUDIENCE: This template is for AI agents and coding assistants creating documentation issues, NOT for human users. This template is intentionally shorter than bug/feature templates since documentation issues are typically simpler.

## Pre-Creation Checklist MANDATORYBEFORE creating any documentation issue:
  1. Read available labels:
  ba

sh   gh label list --limit 100 --json name,description

2. Check for existing documentation issues:
  ba

sh   gh issue list --search keywords --label documentation --limit 20

3. Verify this is documentation not code:
  - Documentation = README, guides, API docs, comments, tutorials

- NOT documentation = Code changes, bug fixes, features

## Documentation Issue Structure

### Title FormatBe specific about what documentation needs work and where.Patterns:
  - Docs: [Action] [specific documentation]- [File/Section]: [Action] [what needs work]Good Examples:
  - Docs: Add MCP Registry submission guide

- README: Update installation instructions for Windows

- API Docs: Document OperationalTelemetry class

- FAQ: Add section on telemetry privacy

- Tutorial: Create guide for custom element creation

Bad Examples:
  - Fix docs what docs

- Documentation too vague

- Update README update what specifically

- Add docs add where and for what

### Summary REQUIRED1-2 sentences explaining what documentation needs work and why.Example:markdown

## Summary

Add comprehensive guide for submitting DollhouseMCP to the MCP Registry, covering prerequisites, authentication, publication process, and trouble

shooting. Currently, theres no documentation for this critical release step.

### Problem REQUIREDWhat documentation is missing, outdated, unclear, or incorrect

Example:markdown

## ProblemUsers attempting to submit MCP servers to the registry have no guidance on:
  - Required metadata format server.json

- Authentication workflow GitHub OAuth vs PAT

- Publication commands and expected outputs

- Common errors and trouble

shooting

- Post-publication validation

This is causing:
  - Support requests from confused users

- Failed submissions due to incorrect metadata

- Time wasted debugging common issues

- Reduced adoption due to complexity

### Proposed Solution REQUIREDWhat documentation should be created, updated, or fixed

Example:markdown

## Proposed Solution

Create docs/development/MCP_REGISTRY_SUBMISSION_GUIDE.md with:
  - Pre-submission checklist

- Step-by-step submission process

- Metadata file examples

- Authentication instructions

- Trouble

shooting section with 7+ common errors

- Post-submission testing procedures

- CI/CD integration examples

### Implementation Plan PHASE-BASED

- Simplified for Docs

Most documentation issues are simple and dont need elaborate phases. Use simplified structure:Simple Documentation Issue typo, small update:markdown

## Implementation Plan- [ ] Fix typo in README.md line 42- [ ] Verify no other instances of same typo- [ ] Update related documentation if needed

Complex Documentation Issue new guide, major update:markdown

## Implementation Plan

### Phase 1: Content Creation- [ ] Draft guide structure and outline- [ ] Write core content sections- [ ] Create code examples- [ ] Add diagrams or screen

shots if needed

### Phase 2: Review and Poli

sh depends on Phase 1- [ ] Technical review for accuracy- [ ] Edit for clarity and consistency- [ ] Check all links and references- [ ] Verify code examples work

### Phase 3: Integration depends on Phase 2- [ ] Add to documentation index/TOC- [ ] Update related docs with cross-references- [ ] Add to README if user-facing- [ ] Update changelog

Note: NO time estimates. But docs are typically faster than code, so fewer phases are normal.

### Documentation Location REQUIREDSpecify exactly where documentation should go.Examples:markdown

## LocationPrimary File: docs/development/MCP_REGISTRY_SUBMISSION_GUIDE.md

Related Updates Needed:
  - README.md

- Add link in Documentation section

- docs/README.md

- Add to development guides index

- CONTRIBUTING.md

- Reference in release process section

### Success Criteria REQUIRED but Simplified

Clear, measurable outcomes. For docs, focus on completeness and clarity.Example:markdown

## Success Criteria- [ ] Guide covers all steps from prerequisites to post-publication- [ ] All code examples are tested and work- [ ] All external links are valid- [ ] Trouble

shooting covers 7+ common errors- [ ] Guide is linked from main README- [ ] At least one external user successfully uses guide- [ ] Markdown formatting is correct no broken syntax- [ ] Spelling and grammar checked

### References OPTIONALLink to related docs, issues, or external resources.Example:markdown

## ReferencesRelated Issues:- #1351

- PR that will use this documentationExternal Documentation:- [MCP Registry Official Docs]https://registry.modelcontextprotocol.io- [VS Code Marketplace Publi

shing]https://code.visualstudio.com/api/working-with-extensions/publi

shing-extension

Existing Related Docs:
  - docs/development/RELEASE_PROCESS.md

- Should link to new guide

## Label Selection for Documentation IssuesRequired Labels:
  - documentation always

- One priority:
  labelOptional Labels:
  - good first issue

- If simple typo or small update

- help wanted

- If complex and could use community help

- area:
  - If relates to specific area

- type: task

- If part of larger projectPriority Guidelines:
  - priority: critical

- Blocking release, contains wrong information that could cause harm

- priority: high

- User-facing docs missing or confusing, frequently requested

- priority: medium

- Internal docs, moderate impact

- priority: low

- Nice to have, poli

sh, minor improvements

Common Combinations:ba

sh

# User-facing guide--label documentation,priority: high

# API documentation--label documentation,priority: medium,area: tooling

# Simple typo fix--label documentation,priority: low,good first issue

# Complex tutorial--label documentation,priority: high,help wanted

## When to Skip Full Template Very Simple DocsFor trivial documentation changes, use minimal format:Simple Changes:
  - Typo fixes single word

- Broken link fixes

- Formatting fixes missing backticks, etc.

- Version number updates

Minimal Format:ba

shgh issue create   --title Docs: Fix typo in README line 42   --label documentation,priority: low,good first issue   --body Line 42 says recieve but should be receive

## Issue Creation Command

bash

# For complex documentation issuescat  /tmp/doc-issue.md EOF

## Summary[Brief overview]

## Problem[Whats missing or wrong]

## Proposed Solution[What to create/update]

## Implementation Plan- [ ] Task 1- [ ] Task 2

## Location

Primary File: docs/path/to/file.md

## Success Criteria- [ ] Criterion 1- [ ] Criterion 2EOFgh issue create   --title Docs: Add MCP Registry submission guide   --label documentation,priority: high   --body-file /tmp/doc-issue.mdrm /tmp/doc-issue.md

## Quality Checklist

Before submitting:- [ ] Read available labels- [ ] Checked for duplicate documentation issues- [ ] Title clearly indicates what documentation and action- [ ] Exact file location specified- [ ] Implementation plan is appropriate for scope- [ ] Success criteria include verification method- [ ] Appropriate priority assigned- [ ] Related docs identified for cross-referencing

## Complete Example Documentation Issuemarkdown

## Summary

Add comprehensive guide for submitting DollhouseMCP to the MCP Registry, covering prerequisites, authentication, publication process, and trouble

shooting. Currently, theres no documentation for this critical release step.

## ProblemUsers attempting to submit MCP servers to the registry have no guidance on:
  - Required metadata format server.json structure and fields

- Authentication workflow GitHub OAuth vs PAT, device flow

- Publication commands and expected outputs

- Common errors and trouble

shooting 7+ error types

- Post-publication validation and testing

- CI/CD integration for automated publi

shingThis is causing:
  - Support requests from confused potential publi

shers

- Failed submissions due to incorrect or incomplete metadata

- Time wasted debugging common issues that should be documented

- Reduced adoption as barrier to entry is high

- No institutional knowledge capture for future releases

Specific Gap: PR #1351 will add the metadata files but doesnt document how to actually use them for publication.

## Proposed SolutionCreate docs/development/MCP_REGISTRY_SUBMISSION_GUIDE.md with:Section 1: Prerequisites

- NPM package publi

shed

- Professional email addresses set up

- GitHub organization profile complete

- Dual licensing framework in place

- All metadata files validatedSection 2: Installation

- Install mcp-publi

sher CLI tool

- Platform-specific instructions macOS, Linux, Windows

- Version requirementsSection 3: Authentication

- GitHub OAuth device flow recommended

- Personal Access Token alternative

- Permission requirements

- Trouble

shooting authentication issuesSection 4: Publication Process

- Validate server.json before submission

- Execute publication command

- Expected output and timing

- Verification stepsSection 5: Trouble

shooting- 7+ common error scenarios with solutions

- Schema validation errors

- Authentication failures

- Network issues

- Rate limitingSection 6: Post-Publication

- Verify listing in registry

- Test installation in Claude Desktop/Code

- Validate all tools appear

- Monitor for issuesSection 7: CI/CD Integration

- GitHub Actions example

- Automated validation

- Conditional publication only on version tags

- Secret management

Section 8: Version Updates

- How to publi

sh new versions

- Deprecation process

- Breaking change notifications

## Implementation Plan

### Phase 1: Content Creation- [ ] Draft guide structure and outline 8 sections- [ ] Write prerequisites checklist- [ ] Document installation process for all platforms- [ ] Write authentication section with device flow walkthrough- [ ] Document publication process step-by-step- [ ] Create trouble

shooting section with 7+ common errors- [ ] Write post-publication verification procedures- [ ] Add CI/CD integration example Git

Hub Actions

### Phase 2: Examples and Code depends on Phase 1- [ ] Create example server.json sanitized from real one- [ ] Add authentication flow screen

shots or ASCII diagrams- [ ] Write example Git

Hub Actions workflow- [ ] Add example commands with expected outputs- [ ] Create trouble

shooting decision tree

### Phase 3: Review and Validation depends on Phase 2- [ ] Technical review for accuracy- [ ] Test all commands and examples- [ ] Verify all external links are valid- [ ] Check code blocks have correct syntax highlighting- [ ] Edit for clarity and consistency- [ ] Spell check and grammar review

### Phase 4: Integration and Cross-Referencing depends on Phase 3- [ ] Add to docs/README.md in development guides section- [ ] Link from main README.md in documentation section- [ ] Add reference in CONTRIBUTING.md release process- [ ] Update docs/development/RELEASE_PROCESS.md to reference guide- [ ] Add to PR #1351 description- [ ] Create quick-reference one-pager separate issue after this

## LocationPrimary File: docs/development/MCP_REGISTRY_SUBMISSION_GUIDE.mdRelated Updates Needed:
  - README.md

- Add link in Documentation section line 89

- docs/README.md

- Add to development guides index

- CONTRIBUTING.md

- Reference in Release Process section

- docs/development/RELEASE_PROCESS.md

- Add step referencing this guide

- docs/FAQ.md

- Add entry: How do I publi

sh to MCP Registry

Directory Structure:docs/  development/    MCP_REGISTRY_SUBMISSION_GUIDE.md  ← New file    RELEASE_PROCESS.md                ← Update  FAQ.md                              ← Update  README.md                           ← UpdateREADME.md                             ← UpdateCONTRIBUTING.md                       ← Update

## Success CriteriaCompleteness:- [ ] Guide covers all steps from prerequisites through post-publication- [ ] All 8 planned sections are complete- [ ] Trouble

shooting covers minimum 7 common error types- [ ] CI/CD integration example is complete and testedAccuracy:- [ ] All commands are tested and work as documented- [ ] All external links are valid no 404s- [ ] Screen

shots or diagrams if added are current- [ ] Code examples use correct syntax and run successfullyQuality:- [ ] Markdown formatting is correct renders properly in GitHub- [ ] Code blocks have appropriate syntax highlighting- [ ] Spelling and grammar checked no typos- [ ] Consistent terminology throughout- [ ] Clear headings and navigation structureIntegration:- [ ] Guide is linked from main README- [ ] Added to docs index- [ ] Cross-referenced from related docs- [ ] Changelog entry added

Validation:- [ ] At least one external user successfully uses guide user testing- [ ] Guide covers all steps in PR #1351 metadata files- [ ] Addresses common questions from support requests

## ReferencesRelated Issues:- #1351

- PR adding MCP Registry metadata files needs this documentationRelated PRs:- #1350

- Commercial licensing framework prerequisite documentationExternal Documentation:- [MCP Registry Documentation]https://registry.modelcontextprotocol.io- [VS Code Marketplace Publi

shing Guide]https://code.visualstudio.com/api/working-with-extensions/publi

shing-extension similar process- [NPM Publi

shing Guide]https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry prerequisiteExisting Related Docs:
  - docs/development/RELEASE_PROCESS.md

- Should link to this guide

- CONTRIBUTING.md

- Release section should reference this

- README.md

- Installation section users need to know its publi

shedTools Referenced:
  - mcp-publi

sher CLI tool

- GitHub OAuth device flow

- GitHub Personal Access TokensIndustry Examples to Reference:
  - VS Code extension publi

shing similar workflow

- NPM package publi

shing prerequisite step

- Git

Hub Marketplace app submission analo

gous process---

## For AI Agents: Additional ContextWhen to use this template:
  - User says document this, add docs, update README

- Missing documentation identified

- Documentation is outdated or incorrect

- New feature needs documentationDocumentation-Specific Considerations:
  - Documentation changes are usually safer less risk than code

- Can often be done without deep technical knowledge

- Good for good first issue labels if simple

- Should always include examples where possible

- Must be tested links work, code examples runCritical rules:
  1. ALWAYS specify exact file location

2. ALWAYS update related docs cross-references

3. ALWAYS test code examples

4. ALWAYS check links are valid

5. Keep implementation phases simple docs are faster than code

This template is designed for AI consumption and usage, not human reading. Documentation issues are typically simpler than code issues, so this template is intentionally less complex than the bug/feature templates.
