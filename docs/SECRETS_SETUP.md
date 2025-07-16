# Repository Secrets Setup Guide

This guide explains how to configure the necessary secrets for full functionality of the DollhouseMCP Collection repository.

## Required Secrets

### 1. ANTHROPIC_API_KEY (High Priority)

**Purpose**: Enables Claude AI to automatically review pull requests

**Setup Steps**:
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Navigate to API Keys section
3. Create a new API key
4. In GitHub: Settings → Secrets and variables → Actions
5. Click "New repository secret"
6. Name: `ANTHROPIC_API_KEY`
7. Value: Your API key from Anthropic

**Benefits**:
- 🤖 Automated PR reviews
- 🔒 Security vulnerability detection
- 📝 Code quality suggestions
- 🎯 Best practices enforcement

### 2. ADD_TO_PROJECT_PAT (Optional but Recommended)

**Purpose**: Automatically adds issues and PRs to the DollhouseMCP organization project

**Setup Steps**:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "DollhouseMCP Project Integration"
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `project` (Full control of projects)
5. Generate token and copy it
6. In repository: Settings → Secrets and variables → Actions
7. Click "New repository secret"
8. Name: `ADD_TO_PROJECT_PAT`
9. Value: Your generated PAT

**Benefits**:
- 📊 Automatic project tracking
- 🗂️ Unified roadmap integration
- 📈 Better visibility across repos

## Verification

### Check Claude Bot
After adding `ANTHROPIC_API_KEY`:
1. Create a test PR
2. Wait for Claude's review comment
3. Claude should provide feedback within 2-3 minutes

### Check Project Integration
After adding `ADD_TO_PROJECT_PAT`:
1. Create a test issue
2. Check the [DollhouseMCP Roadmap](https://github.com/orgs/DollhouseMCP/projects/1)
3. Issue should appear automatically

## Troubleshooting

### Claude Bot Not Working
- Verify secret name is exactly `ANTHROPIC_API_KEY`
- Check the API key is valid and has credits
- Review workflow runs in Actions tab
- Ensure PR author is authorized (check `.github/workflows/claude.yml` for authorized users)

### Project Integration Failing
- Verify PAT has `project` scope
- Check PAT hasn't expired
- Ensure PAT is from an org member
- Review workflow error messages

## Security Notes

- 🔐 Never commit secrets to the repository
- 🔑 Rotate secrets periodically
- 👤 Use fine-grained PATs when possible
- 📋 Audit secret usage regularly

## Status Checks

Run this workflow to verify setup:
```bash
gh workflow run claude-setup-check.yml
```

This will create an issue if any configuration is missing.

---

For questions or issues, create a discussion in the repository.