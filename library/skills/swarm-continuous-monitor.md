---
name: swarm-continuous-monitor
description: >-
  Skill for maintaining continuous autonomous monitoring of distributed agent
  swarm using background process
version: 1.0.0
created: '2025-10-20T15:26:11.970Z'
modified: '2025-10-20T15:26:11.970Z'
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
unique_id: unknown_swarm-continuous-monitor_anonymous_20251020-152611
type: skill
author: DollhouseMCP
capabilities:
  - general-purpose
---
# Swarm Continuous Monitoring Skill

## Purpose

Maintain autonomous, continuous monitoring of distributed agent swarm without manual intervention.

## Technical Approach

### Background Process Strategy

Instead of relying on Claude to remember to keep checking, launch a background Node.js/Python script that:
  1. Watches the memory directory for changes

2. Aggregates swarm status every 30-60 seconds

3. Writes status to a da

shboard memory

4. Claude reads the da

shboard when needed

### ImplementationStep 1: Create monitoring script

javascript// swarm-monitor.jsconst fs = requirefsconst path = requirepathconst  execSync  = requirechild_processconst MEMORY_DIR = path.joinprocess.env.HOME, .dollhouse/portfolio/memoriesconst CHECK_INTERVAL = 30000 // 30 secondsfunction scanSwarmActivitysessionFolder   const tasks = []  const claims = []  const results = []  const progress = []    // Scan session folder for swarm files  const files = fs.readdirSyncsessionFolder    files.forEachfile =     if file.startsWithswarm-task

- tasks.pu

shfile    if file.startsWithswarm-claim

- claims.pu

shfile    if file.startsWithswarm-result

- results.pu

shfile    if file.startsWithswarm-progress

- progress.pu

shfile      return  tasks, claims, results, progress, timestamp: new Date.toISOString function updateDa

shboardstatus   // Use DollhouseMCP MCP tool to update da

shboard memory  const command = mcp__DollhouseMCP__edit_element --name swarm-da

shboard --type memories --field content --value JSON.stringifystatus  try     execSynccommand   catch err     console.errorFailed to update da

shboard:, err.message  async function monitorLoopsessionFolder   console.log🔍 Starting continuous monitoring of sessionFolder    setInterval =     const status = scanSwarmActivitysessionFolder    updateDa

shboardstatus    console.log✅ [status.timestamp] Tasks: status.tasks.length, Results: status.results.length  , CHECK_INTERVAL// Start monitoringconst sessionFolder = process.argv[2]  path.joinMEMORY_DIR, new Date.toISOString.splitT[0], swarm-session-001monitorLoopsessionFolder

Step 2: Launch background monitor

bash

# Start monitoring in backgroundnode swarm-monitor.js /.dollhouse/portfolio/memories/2025-10-20/swarm-session-001 # Monitor updates da

shboard memory every 30 seconds

# Orchestrator just reads swarm-da

shboard memory when needed

Step 3: Read da

shboard instead of polling

bash

# Orchestrator workflow:
  #

1. Read da

shboard: mcp__DollhouseMCP__get_element_details --name swarm-da

shboard --type memories

#

2. See aggregated status

#

3. Take action if needed

#

4. Wait 60 seconds, repeat

## Benefits- ✅ True continuous monitoring background process- ✅ Orchestrator becomes reactive, not active- ✅ Scales to many workers- ✅ Event-driven can use fs.watch for real-time- ✅ Orchestrator can pause/restart without losing state

## Skill Usage

When activated, this skill guides you to:
  1. Create the monitoring script

2. Launch it in background

3. Read da

shboard periodically

4. Take orchestration actions based on da

shboard state

## Alternative: Python + fswatch

pythonimport timeimport subprocessfrom pathlib import Pathdef monitor_swarmsession_folder:
  while True:
  # Scan for activity        tasks = listPathsession_folder.globswarm-task-.yaml        results = list

Pathsession_folder.globswarm-result-.yaml                # Update da

shboard via MCP        subprocess.run[            mcp__DollhouseMCP__edit_element,            --name, swarm-da

shboard,            --type, memories,            --field, content,            --value, ftasks=lentasks, results=lenresults        ]                time.sleep30if __name__ == __main__:
  monitor_swarm/path/to/session

## Decision Point

Should the monitoring script:
  - Run as separate process decoupled, reliable

- Run within Claude Code integrated, may pause

Recommendation: Separate process for true autonomy.
