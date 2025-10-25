---
category: general
description: >-
  Template for AI agents creating bug report issues with reproduction steps,
  expected vs actual behavior, and environment details
examples: []
includes: []
name: github-issue-bug-report
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# Git

Hub Issue Bug Report TemplateAUDIENCE: This template is for AI agents and coding assistants creating bug report issues, NOT for human users. Verbosity and specificity are intentional and beneficial.

## Pre-Creation Checklist MANDATORYBEFORE creating any bug report issue:
  1. Read all available labels:
  ba

sh   gh label list --limit 100 --json name,description

2. Check for existing bug reports:
  ba

sh   gh issue list --search keywords --label bug --limit 20   gh issue list --search keywords --label bug --state closed --limit 10

3. Verify this is actually a bug:
  - Bug = Something that should work doesnt work

- NOT a bug = Feature request, enhancement, or documentation improvement

## Bug Report Structure

### Title FormatBe specific about whats broken and where. Use format: [Component] Brief description of bug

Good Examples:
  - ConfigManager: Hot-reload cra

shes when config file deleted

- EnhancedIndex: Memory leak in verb extraction with large files

- OAuth: Token refre

sh fails with 401 on Windows

- Docker: Container fails to start on ARM64 architecture

Bad Examples:
  - Its broken too vague

- Error in code what error where

- Fix the bug what bug

- Cra

shes sometimes when where

### Summary REQUIRED1-2 sentences describing the bug and its impact.Example:markdown

## SummaryConfig

Manager cra

shes when config file is deleted while server is running with hot-reload enabled. This causes the entire MCP server to terminate unexpectedly, losing all active sessions.

### Bug Description REQUIREDClear explanation of:
  - Whats broken

- When it happens

- What the impact is

- Who it affects

Example:markdown

## DescriptionWhen hot-reload is enabled in ConfigManager and the config file /.dollhouse/config.yaml is deleted while the server is running, the file watcher triggers a reload that attempts to read the now-missing file. This causes an unhandled exception that cra

shes the entire MCP server process.This affects users who:
  - Have hot-reload enabled default: disabled

- Accidentally delete or move their config file

- Use tools that temporarily remove files during editing

Impact: Complete server cra

sh, all active MCP sessions lost.

### Reproduction Steps REQUIREDCRITICAL: Must be EXACT, step-by-step instructions that reliably reproduce the bug.Format:markdown

## Steps to Reproduce

1. Start DollhouseMCP server with hot-reload enabled:
  ba

sh   DOLLHOUSE_CONFIG_HOTRELOAD=true npx @dollhousemcp/mcp-server

2. Verify server is running look for Server started message

3. In another terminal, delete the config file:
  ba

sh   rm /.dollhouse/config.yaml

4. Observe server cra

sh in original terminalReproduction Rate: 100% happens every time

Key Requirements:
  - Number each step

- Include exact commands with all flags/options

- Specify timing if relevant e.g., Wait 5 seconds before...

- Include reproduction rate 100%, 50%, occasional

- If requires specific data/files, include examples or specify where to get them

### Expected Behavior REQUIREDWhat SHOULD happen correct behavior.Example:markdown

## Expected BehaviorWhen config file is deleted:
  1. Config

Manager should detect file deletion

2. Log a warning: Config file deleted, using in-memory configuration

3. Continue operating with last known valid configuration

4. Server should remain running

5. When config file is recreated, hot-reload should pick it up

### Actual Behavior REQUIREDWhat DOES happen the bug.Example:markdown

## Actual BehaviorWhen config file is deleted:
  1. Config

Manager file watcher triggers

2. Attempts to read non-existent file

3. Throws unhandled exception: Error: ENOENT: no such file or directory

4. Exception propagates to main process

5. Entire MCP server cra

shes

6. All active sessions lost

7. Error message: Uncaught Exception: Cannot read config file

### Environment REQUIREDSystem details where bug occurs. Use this script to gather:ba

sh

# Gather environment infocat  /tmp/bug-env.txt EOFDollhouseMCP Version: npm list @dollhousemcp/mcp-server  grep @dollhousemcp/mcp-server  head -1Node Version: node --versionnpm Version: npm --versionOperating System: uname -s uname -rArchitecture: uname -mMCP Client: [Claude Desktop  Claude Code  VS Code  Other]Installation Method: [npm  npx  git clone  docker]EOFcat /tmp/bug-env.txt

Example:markdown

## EnvironmentDollhouseMCP Version: 1.9.18Node Version: v20.11.0npm Version: 10.2.4Operating System: Darwin 24.6.0 macOS SequoiaArchitecture: arm64MCP Client: Claude Desktop 1.2.3Installation Method: npx

Config:
  - Hot-reload enabled: Yes DOLLHOUSE_CONFIG_HOTRELOAD=true

- Config location: /.dollhouse/config.yaml

- Custom endpoint: No

### Error Logs REQUIRED if applicable

Include relevant error messages, stack traces, or console output.Format:markdown

## Error LogsConsole Output:[2025-10-15T14:23:45.123Z] INFO  Server started[2025-10-15T14:24:12.456Z] INFO  ConfigManager: Hot-reload enabled[2025-10-15T14:25:03.789Z] ERROR ConfigManager: Error reading config file[2025-10-15T14:25:03.790Z] FATAL Uncaught ExceptionError: ENOENT: no such file or directory, open /Users/mick/.dollhouse/config.yaml    at Object.openSync node:fs:601:3    at Object.readFileSync node:fs:469:35    at ConfigManager.loadConfig src/config/ConfigManager.ts:142:28    at FSWatcher.anonymous src/config/ConfigManager.ts:89:14Process exited with code 1Relevant Log Files:- /.dollhouse/logs/mcp-server.log last 50 lines

Important:
  - Sanitize any sensitive data API keys, tokens, usernames, file paths with personal info

- Include timestamps if available

- Include full stack traces helpful for debugging

- Mark the error location in code if known

### Workaround OPTIONAL but RECOMMENDEDIf theres a way to avoid the bug, document it.Example:markdown

## WorkaroundTemporary Fix:Disable hot-reload in config or environment variable:ba

shDOLLHOUSE_CONFIG_HOTRELOAD=false npx @dollhousemcp/mcp-server

Alternative:Dont delete config file while server is running. Instead:
  1. Stop server

2. Modify or delete config

3. Restart server

### Root Cause Analysis OPTIONAL

- AI agents can attempt

If you understand the root cause, explain it.Example:markdown

## Root Cause AnalysisLocation: src/config/ConfigManager.ts:142Issue: File watcher callback uses synchronous fs.readFileSync without error handling:typescriptthis.watcher.onchange,  =   const content = fs.readFileSyncthis.configPath, utf8 // ← No try/catch  this.parseConfigcontentFix Required: Wrap in try/catch and handle ENOENT gracefully:typescriptthis.watcher.onchange,  =   try     const content = fs.readFileSyncthis.configPath, utf8    this.parseConfigcontent   catch error     if error.code === ENOENT       logger.warn

Config file deleted, using in-memory configuration      return // Keep using last known config        throw error // Rethrow unexpected errors  #

## Proposed Fix OPTIONAL

- Phase-based, NO time estimates

If you can suggest a fix, outline phases.Format:markdown

## Proposed Fix

### Phase 1: Error Handling- [ ] Add try/catch around file read in Config

Manager.ts:142- [ ] Handle ENOENT error specifically- [ ] Log warning but dont cra

sh- [ ] Continue with last known valid configuration

### Phase 2: Testing depends on Phase 1- [ ] Add unit test for config file deletion- [ ] Add unit test for config file recreation- [ ] Test hot-reload with missing file- [ ] Test hot-reload when file reappears

### Phase 3: Documentation can parallel Phase 2- [ ] Document hot-reload behavior in README- [ ] Add FAQ entry for config file management- [ ] Document recovery process

### Additional Context OPTIONALAny other relevant information:
  - When did this start regression or longstanding

- Related issues or PRs

- Screen

shots or videos

- Configuration files sanitized

## Label Selection for Bug ReportsRequired Labels:
  - bug always

- One priority:
  label

- At least one area:
  label component where bug occurs

- status: needs-triage for new bugsPriority Guidelines:
  - priority: critical

- Server cra

shes, data loss, security vulnerability

- priority: high

- Feature completely broken, affects many users

- priority: medium

- Feature partially broken, has workaround

- priority: low

- Minor issue, cosmetic, rare edge case

Common Combinations:ba

sh

# Critical cra

sh bug--label bug,priority: critical,area: security,status: needs-triage

# Platform-specific issue--label bug,priority: high,area: platform-compat,area: docker

# Test failure--label bug,priority: medium,area: testing,area: ci/cd

# Documentation error--label bug,priority: low,documentation

## Issue Creation Command

bash

# Write to temp file for complex bugscat  /tmp/bug-report.md EOF

## Summary[Bug summary]

## Description[Full description]

## Steps to Reproduce

1. Step one

2. Step two

## Expected Behavior[What should happen]

## Actual Behavior[What actually happens]

## Environment

DollhouseMCP Version: 1.9.18[Rest of environment details]

## Error Logs[Error output]EOF

# Create issuegh issue create   --title [Config

Manager] Hot-reload cra

shes when config file deleted   --label bug,priority: critical,area: tooling,status: needs-triage   --body-file /tmp/bug-report.md

# Clean uprm /tmp/bug-report.md

## Quality Checklist

Before submitting, verify:- [ ] Read available labels gh label list- [ ] Checked for duplicate bug reports- [ ] Title includes component and brief description- [ ] Reproduction steps are exact and complete- [ ] Reproduction rate is specified- [ ] Expected vs actual behavior clearly contrasted- [ ] Environment details included- [ ] Error logs included if applicable- [ ] Sensitive data sanitized- [ ] Workaround documented if exists- [ ] Appropriate priority label selected- [ ] Status label needs-triage added

## Complete Example Bug Reportmarkdown

## SummaryConfig

Manager cra

shes when config file is deleted while server is running with hot-reload enabled, causing complete MCP server termination and loss of all active sessions.

## DescriptionWhen hot-reload is enabled in ConfigManager and the config file /.dollhouse/config.yaml is deleted while the server is running, the file watcher triggers a reload that attempts to read the now-missing file. This causes an unhandled ENOENT exception that cra

shes the entire MCP server process.This affects users who:
  - Have hot-reload enabled default: disabled

- Accidentally delete or move their config file during editing

- Use tools that temporarily remove files some IDEs do this on save

Impact: Critical

- Complete server cra

sh, all active MCP sessions lost, no graceful degradation.

## Steps to Reproduce

1. Create a config file:
  ba

sh   mkdir -p /.dollhouse   echo telemetry:
  enabled: false  /.dollhouse/config.yaml

2. Start DollhouseMCP server with hot-reload enabled:
  ba

sh   DOLLHOUSE_CONFIG_HOTRELOAD=true npx @dollhousemcp/mcp-server

3. Verify server is running look for Server started message in logs

4. In another terminal, delete the config file:
  ba

sh   rm /.dollhouse/config.yaml

5. Observe server cra

sh in original terminal

Reproduction Rate: 100% happens every time on macOS, Linux, Windows

## Expected BehaviorWhen config file is deleted:
  1. Config

Manager detects file deletion via watcher

2. Logs warning: Config file deleted, using last known configuration

3. Continues operating with in-memory configuration from before deletion

4. Server remains running without interruption

5. If config file is recreated, hot-reload picks it up automatically

6. No active sessions are lost

## Actual BehaviorWhen config file is deleted:
  1. ConfigManager file watcher triggers change event

2. Change handler attempts to read non-existent file with fs.readFileSync

3. Throws unhandled exception: Error: ENOENT: no such file or directory

4. Exception propagates to main event loop

5. Node.js uncaught

Exception handler default terminates process

6. Entire MCP server cra

shes immediately

7. All active MCP sessions terminated abruptly

8. No cleanup or graceful shutdown

9. Exit code: 1

## EnvironmentDollhouseMCP Version: 1.9.18Node Version: v20.11.0npm Version: 10.2.4Operating System: Darwin 24.6.0 macOS Sequoia 15.1Architecture: arm64 Apple SiliconMCP Client: Claude Desktop 1.2.3Installation Method: npxConfiguration:
  - Hot-reload enabled: Yes DOLLHOUSE_CONFIG_HOTRELOAD=true

- Config location: /.dollhouse/config.yaml

- Log level: INFO

- Telemetry: Disabled

Additional Context:
  - Happens on clean install no custom configuration

- Also tested on Linux Ubuntu 22.04

- same behavior

- Issue does NOT occur when hot-reload is disabled

## Error LogsConsole Output:[2025-10-15T14:23:45.123Z] INFO  DollhouseMCP v1.9.18 starting[2025-10-15T14:23:45.234Z] INFO  ConfigManager: Loading config from /Users/mick/.dollhouse/config.yaml[2025-10-15T14:23:45.245Z] INFO  ConfigManager: Hot-reload enabled[2025-10-15T14:23:45.345Z] INFO  MCP Server started on stdio transport[2025-10-15T14:23:45.456Z] INFO  47 tools registered[2025-10-15T14:25:03.789Z] DEBUG ConfigManager: File watcher triggered change event[2025-10-15T14:25:03.790Z] ERROR ConfigManager: Error reading config file[2025-10-15T14:25:03.791Z] FATAL Uncaught ExceptionError: ENOENT: no such file or directory, open /Users/mick/.dollhouse/config.yaml    at Object.openSync node:fs:601:3    at Object.readFileSync node:fs:469:35    at ConfigManager.loadConfig /Users/mick/.npm/_npx/abc123/node_modules/@dollhousemcp/mcp-server/dist/config/ConfigManager.js:142:28    at FSWatcher.anonymous /Users/mick/.npm/_npx/abc123/node_modules/@dollhousemcp/mcp-server/dist/config/Config

Manager.js:89:14    at FSWatcher.emit node:events:518:28    at FSWatcher._handle.onchange node:internal/fs/watchers:247:12Process exited with code 1No other log files available server cra

shed before writing to /.dollhouse/logs/

## Workaround

Temporary Fix 1: Disable hot-reload

bash

# Via environment variableDOLLHOUSE_CONFIG_HOTRELOAD=false npx @dollhousemcp/mcp-server

# Or in config before starting serverecho config:
  hotReload: false  /.dollhouse/config.yamlTemporary Fix 2: Dont delete config file while server is runningIf you need to reset configuration:
  1. Stop server gracefully Ctrl+C

2. Delete or modify config file

3. Restart server

Temporary Fix 3: Always have a backup config

bash

# Keep a backup that you copy over instead of deletingcp /.dollhouse/config.yaml.backup /.dollhouse/config.yaml

## Root Cause AnalysisLocation: src/config/ConfigManager.ts:89-95Problem: File watcher callback uses synchronous fs.readFileSync without try/catch error handling:typescript// Current buggy code:this.watcher = fs.watchthis.configPath, eventType =   if eventType === change     logger.debugConfigManager: File watcher triggered    const content = fs.readFileSyncthis.configPath, utf8 // ← No error handling    this.parseConfigcontent  Why it fails:
  1. File watcher triggers on change event even for deletions on some platforms

2. Synchronous file read assumes file exists

3. ENOENT exception is unhandled

4. Node.js default behavior: uncaught exceptions terminate processAdditional Issue: File watcher behavior differs by platform:
  - macOS: Triggers change on deletion

- Linux: Triggers rename on deletion may not trigger at all

- Windows: Triggers rename on deletion

Current code only listens for change, missing rename events.

## Proposed Fix

### Phase 1: Error Handling- [ ] Add try/catch around fs.readFileSync in Config

Manager.ts:92- [ ] Check for error.code === ENOENT specifically- [ ] On ENOENT: Log warning, keep using last valid configuration- [ ] On other errors: Log error, keep using last valid configuration- [ ] Add error handler for file watcher itself

### Phase 2: Enhanced File Watching depends on Phase 1- [ ] Listen for both change and rename events- [ ] On rename: Check if file still exists before reading- [ ] On file deletion: Set flag configFile

Deleted = true- [ ] On file recreation: Detect via watcher, load new config, clear flag- [ ] Add tests for platform-specific watcher behavior

### Phase 3: Testing depends on Phases 1-2- [ ] Add unit test: config file deleted during hot-reload- [ ] Add unit test: config file recreated after deletion- [ ] Add unit test: config file moved rename without recreation- [ ] Add integration test: server continues operating with in-memory config- [ ] Test on macOS, Linux, Windows platform-specific behavior- [ ] Add test for rapid file changes debouncing

### Phase 4: Documentation can parallel Phases 1-3- [ ] Document hot-reload behavior in README- [ ] Add FAQ entry: What happens if config file is deleted- [ ] Document platform differences in watcher behavior- [ ] Add trouble

shooting guide for config issues- [ ] Update API docs for Config

Manager

## Additional ContextWhen did this start

- Issue present since hot-reload feature added in v1.9.0

- Not a regression, longstanding bugRelated Issues:- #1129

- ConfigManager: Add hot-reload support original feature implementation

- None found for this specific cra

shWhy wasnt this caught earlier

- Hot-reload is disabled by default

- Most users dont delete config files while server is running

- Not tested in CI test coverage gapSecurity Implications:
  - No security risk cra

shes are annoying but not exploitable

- Does not expose sensitive data

- No privilege escalation possibleSeverity Justification for Critical Priority:
  - Causes complete server cra

sh not graceful failure

- Loses all active user sessions

- No recovery possible without manual restart

- Easy to trigger accidentally common editor behavior

- Affects any user with hot-reload enabledSimilar Bugs in Other Projects:
  - VS Code had similar issue with settings file watcher VSCode #12345

- webpack-dev-server handles this gracefully see their Config

Watcher class---

## For AI Agents: Additional ContextWhen to use this template:
  - User reports something is broken

- Automated test failure needs issue

- Error logs indicate a problem

- Behavior doesnt match expectedTemplate philosophy:
  - Detailed reproduction steps are CRITICAL

- Environment details help with platform-specific bugs

- Expected vs actual contrast clarifies the bug

- Root cause analysis speeds up fixes

Critical rules:
  1. ALWAYS include exact reproduction steps

2. ALWAYS sanitize sensitive data in logs

3. ALWAYS specify reproduction rate

4. ALWAYS include environment details

5. Check for duplicates FIRSTThis template is designed for AI consumption and usage, not human reading. Thoroughness helps developers fix bugs faster.
