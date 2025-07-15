# Session Plan: Claude Bot Authentication Fix
**Date:** 2025-07-15
**Session:** 002
**Topic:** Switching from OAuth to API Key Authentication

## Context

The Claude Code GitHub App installation experienced issues:
- `/install-github-app` tool was freezing/failing silently
- OAuth token authentication not working despite organization-wide authorization
- Need to switch to API key authentication for now

## Issue Details

### OAuth Token Problems
1. `CLAUDE_CODE_OAUTH_TOKEN` was not configured
2. GitHub App installation tool appears to have connection issues
3. Organization-wide OAuth authorization exists but isn't working for Collection repo

### Error Encountered
```
Error: Environment variable validation failed:
- Either ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN is required when using direct Anthropic API.
```

## Solution

Switching from OAuth token to API key authentication in the Claude workflow.

### Changes Made
1. Updated `.github/workflows/claude.yml`:
   - Changed from `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}`
   - To `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`

### Next Steps
1. Commit and push the fix
2. Create PR for the change
3. Set up `ANTHROPIC_API_KEY` secret in repository settings
4. Test @claude mentions once deployed

## Long-term Considerations

- OAuth token approach is cleaner (no API key management)
- Should investigate why GitHub App installation failed
- MCP server appears to be using OAuth successfully
- May need to troubleshoot organization permissions

## Testing Plan

Once deployed:
1. Mention @claude in a PR comment
2. Verify Claude responds successfully
3. Test on multiple PRs including Dependabot

## Related Work
- PR #12: Initial Claude Code integration (using OAuth)
- PR #279 in MCP server: Similar setup (draft, uses OAuth)
- Issue #13: Documents the OAuth token configuration issue