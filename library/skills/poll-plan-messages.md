---
name: poll-plan-messages
description: >-
  Scans plan folders for new messages targeted at a specific assistant, filtered
  by last read timestamp
version: 1.0.0
created: '2025-10-23T16:41:42.769Z'
modified: '2025-10-23T16:41:42.769Z'
tags:
  - polling
  - plans
  - messages
  - communication
dependencies:
  - generate-message-timestamp
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_poll-plan-messages_anonymous_20251023-164142
type: skill
author: DollhouseMCP
capabilities:
  - general-purpose
---
## Skill: Poll Plan Messages### PurposeScans plan folders for new messages that an assistant needs to process. Filters by receiver and timestamp to show only unread messages.### UsageAssistants coder, designer, etc. use this to check for new work assignments, questions, and updates.### Parameters- plan_id: Specific plan to check, or all for all active plans- receiver: Filter for messages addressed to this role e.g., coder, designer, or all- last_read_timestamp: Only show messages newer than this timestamp ISO format### Implementationbash#/bin/bash# Poll for new plan messagesPLAN_ID=1RECEIVER=2LAST_READ=3:-1970-01-01T00:00:00.000Z  # Default to epoch if not provided# Base path for memoriesMEMORY_BASE=HOME/.dollhouse/portfolio/memories# Function to find plan foldersfind_plans   if [ PLAN_ID = all ] then    # Find all plan folders in date directories    find MEMORY_BASE -type d -name plan-  sort  else    # Find specific plan folder    find MEMORY_BASE -type d -name PLAN_ID  sort  fi# Function to check if message is newer than last readis_newer   local msg_timestamp=1  # Simple string comparison works with ISO format  [[ msg_timestamp  LAST_READ ]]# Function to extract timestamp from filenameget_timestamp_from_filename   local filename=1  # Extract YYYYMMDD-HHMMSS-mmm from filename  local ts_part=echo filename  grep -oE ^[0-9]8-[0-9]6-[0-9]3    if [ -n ts_part ] then    # Convert to ISO format: YYYYMMDD-HHMMSS-mmm - YYYY-MM-DDTHH:MM:SS.mmmZ    local year=ts_part:0:4    local month=ts_part:4:2    local day=ts_part:6:2    local hour=ts_part:9:2    local min=ts_part:11:2    local sec=ts_part:13:2    local ms=ts_part:16:3        echo year-month-dayThour:min:sec.msZ  fi# Function to check if message matches receivermatches_receiver   local filename=1  local msg_receiver=echo filename  grep -oE receiver-[a-z-]+  cut -d- -f2-    # Match if receiver is all or matches our role  [[ msg_receiver = all ]]  [[ msg_receiver = RECEIVER ]]  [[ RECEIVER = all ]]# Main logicecho echo   messages: [FIRST=truefind_plans  while read -r plan_folder do  plan_name=basename plan_folder    # Find all YAML files in this plan folder  if [ -d plan_folder ] then    find plan_folder -maxdepth 1 -name .yaml -o -name .yml  sort  while read -r msg_file do      filename=basename msg_file            # Extract timestamp from filename      msg_timestamp=get_timestamp_from_filename filename            # Check if newer than last read      if is_newer msg_timestamp then        # Check if matches receiver        if matches_receiver filename then          # Output message info          if [ FIRST = true ] then            FIRST=false          else            echo     ,          fi                    echo               echo       plan: plan_name,          echo       filename: filename,          echo       path: msg_file,          echo       timestamp: msg_timestamp          echo             fi      fi    done  fidoneecho   ]echo ### Usage ExamplesCheck for new messages in specific plan:bashbash poll-plan-messages.sh plan-2025-10-23-auth-system coder 2025-10-23T12:00:00.000ZCheck all plans for messages to me:bashbash poll-plan-messages.sh all coder 2025-10-23T12:00:00.000ZCheck all messages first time startup:bashbash poll-plan-messages.sh all coder ### Using with DollhouseMCP ToolsAlternative implementation using MCP search:bash# Search for unread messages using portfolio searchmcp__DollhouseMCP__search_portfolio   --query plan-auth-system receiver-coder   --type memories# Or search by message typemcp__DollhouseMCP__search_portfolio   --query type-question receiver-coder   --type memories### Return Formatjson  messages: [          plan: plan-2025-10-23-auth-system,      filename: 20251023-121500-001-plan.yaml,      path: /Users/user/.dollhouse/portfolio/memories/2025-10-23/plan-2025-10-23-auth-system/20251023-121500-001-plan.yaml,      timestamp: 2025-10-23T12:15:00.001Z    ,          plan: plan-2025-10-23-auth-system,      filename: 20251023-122500-004-question-planner.yaml,      path: /Users/user/.dollhouse/portfolio/memories/2025-10-23/plan-2025-10-23-auth-system/20251023-122500-004-question-planner.yaml,      timestamp: 2025-10-23T12:25:00.004Z      ]### Integration with Read ReceiptsAfter processing messages, update the read receipt:bash# Get latest timestamp from polled messagesLATEST=jq -r .messages[-1].timestamp poll-results.json# Update read receiptbash mark-message-read.sh coder LATEST### Benefits✅ Pull-based: Assistants check when ready, no push needed  ✅ Filtered: Only see messages meant for you  ✅ Efficient: Timestamp filtering reduces re-processing  ✅ Broadcast-aware: Handles receiver-all messages  ✅ Sorted: Returns messages in chronological order### Notes- Relies on timestamp-based filenames from generate-message-timestamp- Can be called periodically or on-demand- Works with both specific plans and all plans scanning- Compatible with DollhouseMCP search for alternative discovery
