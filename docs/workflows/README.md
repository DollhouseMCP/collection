# Workflow Documentation

This directory contains documentation for GitHub Actions workflows used in the DollhouseMCP Collection repository.

## Available Workflows

### 1. [Claude Review Setup](./claude-review-setup.md)
Automated code review using Claude AI with blocking status checks and manual triggers for community contributions.

### 2. Core Build & Test
Runs tests across multiple platforms and Node.js versions.

### 3. Security Validation
Validates content for security patterns and potential vulnerabilities.

### 4. Performance Monitoring
Tracks performance benchmarks across different environments.

## Workflow Categories

### Automated Workflows
- **Claude Review** - Auto-runs for authorized users
- **Build & Test** - Runs on all PRs
- **Security Scans** - Validates content security

### Manual Workflows
- **Claude Review (Manual)** - Triggered by `@claude review` comment
- **Performance Benchmarks** - Can be run on-demand

## Key Concepts

### Branch Protection
Using status checks instead of required reviews for single-maintainer efficiency.

### API Cost Management
Community PRs don't auto-trigger Claude reviews to conserve API usage.

### Override Capabilities
Admins can bypass failed checks when needed (configure in branch protection).