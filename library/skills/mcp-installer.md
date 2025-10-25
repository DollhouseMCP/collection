---
name: mcp-installer
description: >-
  Install MCP servers using the install-mcp tool by parsing config JSON from
  documentation and adding servers to any MCP client
author: Mick Darling
version: 1.0.0
created: '2025-10-11T15:19:00.846Z'
modified: '2025-10-11T15:19:00.846Z'
tags:
  - mcp
  - installation
  - configuration
  - tools
  - automation
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
# MCP Installer Skill

## PurposeParse MCP server configuration JSON from Git

Hub repos, documentation and install servers to any MCP client Claude Desktop, Claude Code, Cursor, VS Code, etc. using the install-mcp tool.

## Triggers

- install mcp server

- add mcp server

- use install-mcp

- add this mcp server to [client]

- User pastes MCP config JSON

## Input Formats Accepted

### Full Config Block

json  mcp

Servers:
  server-name:
  command: npx,      args: [-y, @org/package, --flag, value]      #

## Server Block Only

json  command: npx,  args: [@modelcontextprotocol/server-filesystem, /path/to/dir]

### Simple Package Name@modelcontextprotocol/server-filesystem

### URLhttps://api.example.com/mcp

## Execution Steps

###

1. Parse Input

- Identify input format

- Extract server name from JSON key or infer from package/URL

- Extract command and arguments

- Extract environment variables if present

- Extract headers if present for URL-based servers

###

2. Pre-Execution Checks

bash

# Verify npx is availablewhich npx  echo ERROR: npx not found. Install Node.js first.

# Determine target client

# Ask user if not specified: Which client claude, claude-code, cursor, vscode, etc.

###

3. Build install-mcp CommandFor package-based servers:ba

shnpx install-mcp package-name --client client --name server-name --yes

For URL-based servers:ba

shnpx install-mcp url --client client --name server-name --yes [--oauth yes/no]With environment variables:Note: install-mcp doesnt directly handle env vars

- these must be manually added to config after installation.With custom arguments:ba

shnpx install-mcp npx package args --client client --name server-name --yes

###

4. Execute Installation

bash

# Run the commandnpx install-mcp constructed-command

# Capture output and any errors

###

5. Verify Installation

bash

# Check the config file was updated

# Location depends on client:
  #

- Claude Desktop: /Library/Application Support/Claude/claude_desktop_config.json macOS

#

- Claude Code: /.claude.json

#

- Cursor: /.cursor/mcp.json

#

- VS Code: /Library/Application Support/Code/User/settings.json macOS

# Search for server name in configcat config-path  grep -q server-name  echo ✅ Verified  echo ⚠️ Not found

###

6. Post-Installation

- Show success message with server name and command

- If environment variables were in original config, remind user to add them manually

- IMPORTANT: Remind user to restart the target application to activate the server

## Example Execution

### User Input:pastes  mcp

Servers:
  filesystem:
  command: npx,      args: [-y, @modelcontextprotocol/server-filesystem, /Users/mick/Documents],      env:
  SOME_VAR: value            Add this to Claude Code

### Skill Actions:
  1. Parse: server-name=filesystem, package=@modelcontextprotocol/server-filesystem, args=/Users/mick/Documents

2. Build command: npx install-mcp @modelcontextprotocol/server-filesystem /Users/mick/Documents --client claude-code --name filesystem --yes

3. Execute installation

4. Verify: Check /.claude.json contains filesystem

5. Report:✅ Installed MCP server filesystem to Claude CodeServer name: filesystemPackage: @modelcontextprotocol/server-filesystem

Arguments: /Users/mick/Documents⚠️ Note: Environment variable SOME_VAR needs to be added manually to /.claude.json🔄 Restart Claude Code to activate the server

## Error Handling

### Common Errors:
  - npx not found: Install Node.js

- Invalid client name: Show list of supported clients

- Config file not writable: Check permissions

- Server name conflict: Server already exists in config

- Parse error: Could not extract server details from input

### For Each Error:
  - Show clear error message

- Provide actionable next steps

- Do not leave config in broken state

## Supported Clients

- claude Claude Desktop

- claude-code Claude Code

- cursor

- vscode

- cline

- roo-cline

- windsurf

- witsy

- enconvo

- gemini-cli

- goose

- zed

- warp special handling

- outputs config to copy/paste

- codex

## Limitations

- Environment variables must be added manually after installation

- OAuth flow for remote servers requires user interaction

- Restart of target application required for changes to take effect

- Warp requires manual config copy/paste cloud-based settings

## Best Practices

- Always use --yes flag to skip confirmation prompts

- Verify installation before reporting success

- Provide clear restart instructions

- Warn about manual steps env vars, OAuth

- Use full command with args when package needs specific arguments

## Notes

- Uses install-mcp tool from: https://github.com/supermemoryai/install-mcp or mickdarling fork

- Config merging is automatic

- preserves existing servers

- Cross-platform: Works on macOS, Windows, Linux

- Local and global configs supported use --local flag for project-specific
