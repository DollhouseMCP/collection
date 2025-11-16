---
category: professional
description: >-
  Ready-to-use bash scripts for managing git worktree sessions - create, list,
  cleanup, and monitor parallel development environments
examples: []
includes: []
name: worktree-session-manager
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0
unique_id: unknown_worktree-session-manager_anonymous_20251025-191021
type: template
author: DollhouseMCP
format: markdown
security_exceptions:
  - pattern: "command-injection"
    reason: "Documentation contains command-line examples and shell syntax for educational purposes - not executed directly"
  - pattern: "xss"
    reason: "Contains HTML examples and event handlers for documentation/template purposes - sanitized in actual usage"
---
# Worktree Session Manager Template

## Quick Start Commands

### Create New Session Worktree

bash#/bin/ba

sh

# Usage: create-session-worktree.sh branch-name [base-branch]BRANCH_NAME=1:Branch name requiredBASE_BRANCH=2:-developTIMESTAMP=date +%s  tail -c 5BRANCH_SLUG=echo BRANCH_NAME  sed s///-/gWORKTREE_DIR=../dollhouse-wt-BRANCH_SLUG-TIMESTAMPecho 📂 Creating worktree for branch: BRANCH_NAME

# Create worktreeif git rev-parse --verify BRANCH_NAME /dev/null 21 then  # Branch exists, check it out  git worktree add WORKTREE_DIR BRANCH_NAMEelse  # Create new branch from base  git worktree add -b BRANCH_NAME WORKTREE_DIR BASE_BRANCHficd WORKTREE_DIR  exit 1echo ✅ Worktree created at: WORKTREE_DIRecho 📍 Current location: pwdecho 🌿 Branch: git branch --show-current

# Optional: Run setupif [ -f package.json ] then  echo 📦 Installing dependencies...  npm installfiecho echo 🚀 Ready to work You are now in the worktree.

### List All Sessions

bash#/bin/ba

sh

# Usage: list-sessions.shecho === Active Worktree Sessions ===echo git worktree list  while IFS= read -r line do  WORKTREE_PATH=echo line  awk print 1  BRANCH=echo line  awk print 3  sed s/[[]]//g    if [ -d WORKTREE_PATH ] then    echo 📂 WORKTREE_PATH    echo    🌿 Branch: BRANCH        # Check for changes    CHANGES=cd WORKTREE_PATH  git status -s  wc -l  xargs    if [ CHANGES -gt 0 ] then      echo    ⚠️  CHANGES uncommitted changes    else      echo    ✅ Clean working tree    fi        # Check last activity    LAST_MODIFIED=find WORKTREE_PATH -type f -not -path /node_modules/ -not -path /.git/ -exec stat -f %m %N   2/dev/null  sort -rn  head -1  awk print 1    if [ -n LAST_MODIFIED ] then      CURRENT_TIME=date +%s      AGE=CURRENT_TIME

- LAST_MODIFIED      HOURS=AGE / 3600      echo    🕒 Last activity: HOUR

Sh a

go    fi        echo   fidone

### Cleanup Session

bash#/bin/ba

sh

# Usage: cleanup-session.sh worktree-pathWORKTREE_PATH=1:Worktree path requiredif [  -d WORKTREE_PATH ] then  echo ❌ Worktree not found: WORKTREE_PATH  exit 1fiecho 🔍 Checking worktree: WORKTREE_PATH

# Check for uncommitted changescd WORKTREE_PATH  exit 1CHANGES=git status -sif [ -n CHANGES ] then  echo ⚠️  Uncommitted changes found:
  git status -s  echo   read -p What to do [c]ommit, [s]ta

sh, [a]bort:
  choice    case choice in    c      read -p Commit message:
  msg      git add .      git commit -m msg          s      git sta

sh pu

sh -m Auto-sta

sh from cleanup on date          a      echo ❌ Cleanup aborted      exit 1                echo ❌ Invalid choice      exit 1        esacfi

# Check for running processesecho 🔍 Checking for running processes...PROCESSES=lsof +D WORKTREE_PATH 2/dev/null  grep -v COMMAND  trueif [ -n PROCESSES ] then  echo ⚠️  Running processes detected:
  echo PROCESSES  read -p Stop processes and continue [y/N]:
  confirm  if [[  confirm = ^[Yy] ]] then    echo ❌ Cleanup aborted    exit 1  fifi

# Remove worktreecd ..echo 🗑️  Removing worktree...git worktree remove WORKTREE_PATH --forceecho ✅ Worktree removed successfully

# Prune stale referencesgit worktree prune --verbose

### Cleanup Stale Sessions

bash#/bin/ba

sh

# Usage: cleanup-stale-sessions.sh [max-age-hours]MAX_AGE_HOURS=1:-24MAX_AGE_SECONDS=MAX_AGE_HOURS  3600CURRENT_TIME=date +%secho 🔍 Finding stale worktrees inactive for MAX_AGE_HOURS+ hours...echo git worktree list  grep -v git rev-parse --show-toplevel  awk print 1  while read -r WORKTREE_PATH do  if [ -d WORKTREE_PATH ] then    # Find most recent file modification    LAST_MODIFIED=find WORKTREE_PATH -type f -not -path /node_modules/ -not -path /.git/ -exec stat -f %m   2/dev/null  sort -rn  head -1        if [ -n LAST_MODIFIED ] then      AGE=CURRENT_TIME

- LAST_MODIFIED            if [ AGE -gt MAX_AGE_SECONDS ] then        HOURS=AGE / 3600        echo 🗑️  Stale worktree found HOUR

Sh old:
  echo    📂 WORKTREE_PATH                # Check for uncommitted changes        CHANGES=cd WORKTREE_PATH  git status -s  wc -l  xargs                if [ CHANGES -gt 0 ] then          echo    ⚠️  Has CHANGES uncommitted changes

- SKIPPING        else          read -p    Remove [y/N]:
  confirm          if [[ confirm = ^[Yy] ]] then            git worktree remove WORKTREE_PATH            echo    ✅ Removed          fi        fi        echo       fi    fi  fidonegit worktree prune --verbose

### Session Status Da

shboard

bash#/bin/ba

sh

# Usage: session-da

shboard.shecho ╔════════════════════════════════════════════════════════════╗echo ║          Git Worktree Session Da

shboard                   ║echo ╚════════════════════════════════════════════════════════════╝echo MAIN_REPO=git rev-parse --show-toplevelTOTAL_WORKTREES=git worktree list  wc -l  xargsACTIVE_SESSIONS=TOTAL_WORKTREES - 1  # Exclude main repoecho 📊 Summary:echo    Total worktrees: TOTAL_WORKTREESecho    Active sessions: ACTIVE_SESSIONSecho if [ ACTIVE_SESSIONS -eq 0 ] then  echo ✨ No active sessions  exit 0fiecho 📂 Active Sessions:echo git worktree list  grep -v MAIN_REPO  while IFS= read -r line do  WORKTREE_PATH=echo line  awk print 1  BRANCH=echo line  awk print 3  sed s/[[]]//g    if [ -d WORKTREE_PATH ] then    echo ┌─ basename WORKTREE_PATH    echo │  🌿 Branch: BRANCH        # Status    CHANGES=cd WORKTREE_PATH  git status -s  wc -l  xargs    if [ CHANGES -gt 0 ] then      echo │  📝 CHANGES files changed    else      echo │  ✅ Clean    fi        # Disk usage    SIZE=du -sh WORKTREE_PATH 2/dev/null  awk print 1    echo │  💾 Size: SIZE        # Age    CREATED=stat -f %B WORKTREE_PATH 2/dev/null    if [ -n CREATED ] then      CURRENT_TIME=date +%s      AGE=CURRENT_TIME

- CREATED      HOURS=AGE / 3600      echo │  🕒 Age: HOUR

Sh    fi        echo └─    echo   fidone

# Disk usage summaryTOTAL_SIZE=du -sh ../dollhouse-wt- 2/dev/null  awk sum+=1 END print sumif [ -n TOTAL_SIZE ] then  echo 💾 Total worktree disk usage: TOTAL_SIZEMBfi

## Quick Reference Command  Purpose -----------------

- create-session-worktree.sh feature/my-feature  Create new session  list-sessions.sh  List all active sessions  cleanup-session.sh ../dollhouse-wt-my-feature-12345  Clean up specific session  cleanup-stale-sessions.sh 24  Clean up sessions inactive 24+ hours  session-da

shboard.sh  View status of all sessions #

# Installation

Save these scripts to a scripts/worktree/ directory in your project:ba

shmkdir -p scripts/worktree

# Save each scriptchmod +x scripts/worktree/.sh

Add to your PATH or create aliases:ba

shalias wt-new=./scripts/worktree/create-session-worktree.shalias wt-list=./scripts/worktree/list-sessions.shalias wt-clean=./scripts/worktree/cleanup-session.shalias wt-da

shboard=./scripts/worktree/session-da

shboard.sh
