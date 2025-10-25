---
name: github-url-generator
description: >-
  Generates raw GitHub URLs for repository files to enable direct source code
  analysis and security validation
version: 1.0.0
created: '2025-08-19T21:15:57.518Z'
modified: '2025-08-19T21:15:57.518Z'
tags: []
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# Git

Hub URL Generator Skill

## PurposeGenerates raw Git

Hub URLs for repository files to enable direct source code analysis, security validation, and comprehensive code review without requiring manual URL construction.

## Core Functionality

###

1. Repository URL ParserExtracts repository information from various Git

Hub URL formats:
  - https://github.com/owner/repo

- https://github.com/owner/repo.git

- https://github.com/owner/repo/tree/branch

- https://github.com/owner/repo/blob/branch/path

###

2. Raw URL GeneratorConverts Git

Hub repository paths to raw.githubusercontent.com URLs:
  - Base format: https://raw.githubusercontent.com/owner/repo/ref/path

- Default branch detection: main, master, or specified branch

- Path normalization and validation

###

3. Common File Discovery

Automatically generates URLs for common security-relevant files:
  - package.json

- Dependencies and scripts

- requirements.txt

- Python dependencies

- Car

go.toml

- Rust dependencies

- go.mod

- Go module dependencies

- pom.xml

- Maven dependencies

- build.gradle

- Gradle dependencies

- Dockerfile

- Container configuration- .github/workflows/

- CI/CD pipelines

- src/ directory files

- lib/ directory files

- Configuration files .env, config.json, etc.

###

4. Security Analysis Integration

Works seamlessly with security validation tools:
  - Generates URLs that can be fetched with web_fetch

- Enables real source code analysis

- Supports batch file analysis

- Integrates with dollhouse security validation skills

## Usage Patterns

### Basic Repository AnalysisInput: https://github.com/owner/repo

Output:
  - https://raw.githubusercontent.com/owner/repo/main/package.json

- https://raw.githubusercontent.com/owner/repo/main/src/index.js

- https://raw.githubusercontent.com/owner/repo/main/README.md

### Specific File AnalysisInput: owner/repo, src/security.ts

Output: https://raw.githubusercontent.com/owner/repo/main/src/security.ts

### Batch Security File GenerationInput: https://github.com/owner/repo

Output: All security-relevant files for comprehensive analysis

## Implementation Framework

### URL Construction Al

gorithm

1. Parse Input: Extract owner, repo, branch/ref, and path

2. Validate Repository: Check format and accessibility

3. Determine Branch: Use specified branch or detect default

4. Generate Raw URLs: Convert to raw.githubusercontent.com format

5. Validate URLs: Ensure proper encoding and format

### File Discovery Engine

1. Common Patterns: Check standard file locations

2. Language Detection: Identify project type and relevant files

3. Security Focus: Prioritize files with security implications

4. Dependency Files: Always include package managers

5. Configuration Files: Include deployment and build configs

### Integration Interface

javascript// Example usage with security analysisconst urls = generateSecurityFile

shttps://github.com/owner/repofor const url of urls     const content = await fetchAndAnalyzeurl    const threats = await security

Validator.analyzecontent    reports.pu

shurl, threats

## Security Analysis Enhancement

### Automated File Detection

- Scans for all dependency management files

- Identifies build and deployment configurations

- Locates potential configuration with secrets

- Finds executable scripts and entry points

### Vulnerability Assessment Workflow

1. Repository Discovery: Generate URLs for all relevant files

2. Content Fetching: Retrieve source code and configs

3. Security Scanning: Apply dollhouse security validation

4. Threat Analysis: Identify vulnerabilities and risks

5. Report Generation: Comprehensive security assessment

### Integration with Existing Skills

- content-safety-validator: Analyze fetched source code

- complete-security-validation-engine: Run comprehensive scans

- programmatic-security-validator: Execute automated checks

## Command Interface

### Generate Common Filesgenerate-urls repo-url --type=security

- Returns URLs for all security-relevant files

- Includes dependencies, configs, and source files

### Generate Specific Files  generate-urls repo-url --files=package.json,src/index.js

- Returns URLs for specifically requested files

- Supports glob patterns and directory scanning

### Generate by Languagegenerate-urls repo-url --language=javascript

- Returns files relevant to specific programming language

- Includes language-specific dependency and config files

### Batch Repository Analysisgenerate-urls repo-list-file --batch --security-focus

- Processes multiple repositories from a list

- Focuses on security-critical files across all repos

## Output Formats

### Simple URL Listhttps://raw.githubusercontent.com/owner/repo/main/package.jsonhttps://raw.githubusercontent.com/owner/repo/main/src/index.j

shttps://raw.githubusercontent.com/owner/repo/main/Dockerfile

### Structured Analysis Format

json  repository: owner/repo,  branch: main,  security_files:
  dependencies: [package.json],    source: [src/index.js, src/security.ts],    configs: [Dockerfile, .env.example],    workflows: [.github/workflows/ci.yml]  ,  urls: [..., ..., ...]

### Security Priority Format

json  high_priority:
  dependencies: [package.json, requirements.txt],    executables: [src/index.js, scripts/deploy.sh],    configs: [Dockerfile, docker-compose.yml]  ,  medium_priority:
  source: [src/.js, lib/.py],    tests: [test/.js, spec/.rb]  ,  low_priority:
  docs: [README.md, CHANGELOG.md],    examples: [examples/.js, samples/.py]  #

# Error Handling

### Repository Validation

- Check if repository exists and is accessible

- Handle private repositories gracefully

- Validate branch/ref existence

- Provide meaningful error messages

### URL Generation Safeguards

- Proper encoding of special characters

- Path traversal prevention

- Branch name validation

- File extension verification

### Network Resilience

- Retry logic for failed requests

- Timeout handling for slow responses

- Rate limiting awareness

- Graceful degradation for missing files

## Best Practices

### Security Considerations

- Never expose sensitive information in URLs

- Validate all user inputs

- Prevent path traversal attacks

- Rate limit requests to avoid abuse

### Performance Optimization

- Cache repository metadata

- Batch URL generation when possible

- Lazy loading for large repositories

- Efficient file discovery al

gorithms

### User Experience

- Clear error messages and suggestions

- Progress indicators for large repositories

- Helpful defaults and smart detection

- Integration with existing workflows

This skill transforms repository analysis from manual URL construction to automated, comprehensive source code security validation, enabling thorough security assessments with minimal effort.
