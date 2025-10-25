---
name: git-worktree-automation
description: >-
  Expert knowledge for automatic git worktree management, including creation,
  isolation, cleanup, and parallel session coordination
author: mick
version: 1.0.0
created: '2025-10-07T20:33:19.035Z'
modified: '2025-10-07T20:33:19.035Z'
tags:
  - git
  - worktree
  - automation
  - parallel-sessions
  - claude-code
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
# Git Worktree Automation Skill

## Core Capabilities

### Automatic Worktree Creation

- Smart naming: Generate worktree directories based on branch name and timestamp

- Location strategy: Create worktrees as siblings to main repo consistent, predictable

- Branch association: Track which worktree corresponds to which branch/session

- Validation: Check for conflicts, existing worktrees, disk space

### Session Isolation

- Independent state: Each worktree has its own working directory, index, and checked-out files

- Shared .git: All worktrees share same commit database efficient

- Build artifacts: Each worktree maintains separate node_modules, dist/, build/ directories

- Process isolation: Tests, builds, and dev servers run independently per worktree

### Automatic Cleanup

- Session end detection: Remove worktree when Claude session closes or switches contexts

- Orphan detection: Find and remove worktrees from cra

shed sessions

- Graceful shutdown: Ensure no running processes before cleanup

- Safety checks: Never remove worktrees with uncommitted changes without confirmation

### Parallel Session Coordination

- Session registry: Track active worktrees and their purposes

- Collision avoidance: Prevent duplicate worktrees for same branch

- Resource management: Limit number of concurrent worktrees

- Status monitoring: Quick overview of all active worktrees and their states

## Command Patterns

### Create Worktree for New Session

bash

# Pattern: worktree-branch-name-short-ha

shBRANCH_NAME=feature/new-apiWORKTREE_DIR=../dollhouse-wt-echo BRANCH_NAME  sed s///-/g-date +%s  tail -c 5git worktree add WORKTREE_DIR BRANCH_NAMEcd WORKTREE_DIR

### List Active Worktrees

bashgit worktree list --porcelain

### Check Worktree Status

bash

# For each worktree, check if it has:
  #

- Uncommitted changes

#

- Running processes lsof, ps

#

- Recent activity file mtimesgit worktree list  while read -r path commit branch do  if [ -d path ] then    echo === branch ===    cd path  git status -s  fidone

### Safe Cleanup

bash

#

1. Check for uncommitted changes

#

2. Check for running processes

#

3. Remove worktreeWORKTREE_PATH=../dollhouse-wt-feature-api-12345if [ -d WORKTREE_PATH ] then  cd WORKTREE_PATH  if [ -z git status -s ] then    # No changes, safe to remove    cd ..    git worktree remove WORKTREE_PATH  else    echo ⚠️  Worktree has uncommitted changes    git status -s  fifi

### Prune Stale Worktrees

bash

# Remove worktree references for deleted directoriesgit worktree prune --verbose

## Best Practices

### Naming Conventions

- Format: project-wt-branch-slug-unique-id

- Example: dollhouse-wt-feature-api-v2-a3f9c

- Location: Sibling to main repo, not nested within it

- Avoid: Spaces, special characters, ambiguous names

### Lifecycle Management

1. Create: On session start or branch switch request

2. Validate: Confirm setup npm install if needed

3. Work: Normal development operations

4. Monitor: Track activity and health

5. Cleanup: Remove when session ends or becomes stale

### Safety Rules- ✅ Always check for uncommitted changes before removal- ✅ Verify no running processes dev servers, tests- ✅ Keep worktrees outside main project directory- ✅ Log worktree creation/deletion for debugging- ❌ Never remove worktrees with uncommitted work without explicit permission- ❌ Dont create unlimited worktrees disk space management

### Integration with Claude Code

- Session isolation: Each Claude session works in dedicated worktree

- Parallel testing: Run tests in one worktree while developing in another

- Comparison work: Compare implementations across branches side-by-side

- CI simulation: Test multiple branches locally before pu

shing

## Common Patterns

### Pattern 1: New Feature Branch Session

bash

# Create branch and worktree atomicallyBRANCH=feature/new-capabilityWORKTREE=../dollhouse-wt-new-capability-date +%s  tail -c 5git worktree add -b BRANCH WORKTREE developcd WORKTREEnpm install  # Or whatever setup is needed

### Pattern 2: Switch Between Active Sessions

bash

# List sessions and their statusgit worktree list

# Jump to specific sessioncd ../dollhouse-wt-feature-api-12345

### Pattern 3: Emergency Cleanup

bash

# Remove all worktrees except maingit worktree list  grep -v git rev-parse --show-toplevel    awk print 1  xargs -I  git worktree remove  --force

### Pattern 4: Stale Session Detection

bash

# Find worktrees with no recent activity 7+ daysfind .. -maxdepth 1 -name dollhouse-wt- -type d -mtime +7

## Trouble

shooting

### Issue: Worktree already exists

Solution: Remove or reuse existing worktree

bashgit worktree list  # Find existinggit worktree remove path/to/worktree

### Issue: Uncommitted changes on cleanup

Solution: Offer to commit, sta

sh, or preserve

bashgit status -s

# Then: git add .  git commit, or git sta

sh, or cancel cleanup

### Issue: Running processes prevent cleanup

Solution: Gracefully stop processes first

bash

# Find node processes in worktreelsof +D path/to/worktree  grep node

# Kill if safe, or wait for completion

### Issue: Disk space concerns

Solution: Limit concurrent worktrees, cleanup aggressively

bash

# Set policy: max 3-5 active worktrees

# Clean up after 24 hours of inactivity

## Metrics to Track

- Number of active worktrees

- Disk space per worktree

- Last activity timestamp

- Uncommitted changes count

- Running processes count

## Advanced: Worktree Registry

Keep a JSON file tracking active worktrees:json  worktrees: [          path: ../dollhouse-wt-feature-api-12345,      branch: feature/new-api,      created: 2025-10-07T16:15:00Z,      session_id: claude-session-789,      purpose: Parallel API development      ]

## Integration Points

- Git hooks for automatic cleanup

- Claude Code session lifecycle hooks

- File watchers for activity detection

- Process monitors for running tasks
