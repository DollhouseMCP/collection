---
name: mark-message-read
description: >-
  Tracks which messages an assistant has processed by updating their read
  receipt state file
version: 1.0.0
created: '2025-10-23T16:42:12.201Z'
modified: '2025-10-23T16:42:12.201Z'
tags:
  - state
  - tracking
  - read-receipts
  - persistence
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_mark-message-read_anonymous_20251023-164212
type: skill
author: DollhouseMCP
capabilities:
  - general-purpose
---
## Skill: Mark Message Read### PurposeTracks which messages an assistant has processed by maintaining a read receipt state file. Prevents re-processing of already-handled messages.### UsageAfter an assistant processes messages from poll-plan-messages, update their read receipt with the latest timestamp.### Parameters- assistant_role: The role name e.g., coder, designer, planner- last_read_timestamp: ISO timestamp of the last message read### State File Location/.dollhouse/state/  coder-read-receipts.json  designer-read-receipts.json  planner-read-receipts.json### Implementationbash#/bin/bash# Mark messages as read for an assistantASSISTANT_ROLE=1LAST_READ_TIMESTAMP=2# State directorySTATE_DIR=HOME/.dollhouse/statemkdir -p STATE_DIR# Receipt fileRECEIPT_FILE=STATE_DIR/ASSISTANT_ROLE-read-receipts.json# Create or update receipt fileif [ -f RECEIPT_FILE ] then  # Read existing file  EXISTING=cat RECEIPT_FILE    # Update last_read timestamp  echo EXISTING  jq     --arg timestamp LAST_READ_TIMESTAMP     .last_read = timestamp  .updated_at = now  .read_count += 1      RECEIPT_FILE.tmp    mv RECEIPT_FILE.tmp RECEIPT_FILEelse  # Create new receipt file  cat  RECEIPT_FILE EOF  assistant_role: ASSISTANT_ROLE,  last_read: LAST_READ_TIMESTAMP,  created_at: date -u +%Y-%m-%dT%H:%M:%S.000Z,  updated_at: date -u +%Y-%m-%dT%H:%M:%S.000Z,  read_count: 1EOFfi# Output confirmationcat RECEIPT_FILE### Usage ExamplesMark messages read after processing:bash# Process messagesMESSAGES=bash poll-plan-messages.sh all coder cat /.dollhouse/state/coder-read-receipts.json  jq -r .last_read# Get latest timestampLATEST=echo MESSAGES  jq -r .messages[-1].timestamp# Mark as readbash mark-message-read.sh coder LATESTFirst-time initialization:bash# Set initial read timestampbash mark-message-read.sh coder 2025-10-23T12:00:00.000Z### State File Formatjson  assistant_role: coder,  last_read: 2025-10-23T12:30:00.123Z,  created_at: 2025-10-23T12:00:00.000Z,  updated_at: 2025-10-23T12:30:15.456Z,  read_count: 42### Helper: Get Last Read Timestampbash#/bin/bash# Get the last read timestamp for an assistantASSISTANT_ROLE=1STATE_DIR=HOME/.dollhouse/stateRECEIPT_FILE=STATE_DIR/ASSISTANT_ROLE-read-receipts.jsonif [ -f RECEIPT_FILE ] then  jq -r .last_read RECEIPT_FILEelse  # Return epoch if no receipt exists first run  echo 1970-01-01T00:00:00.000Zfi### Integration PatternTypical assistant polling workflow:bash#/bin/bash# Assistant polling routineROLE=coder# 1. Get last read timestampLAST_READ=bash get-last-read.sh ROLE# 2. Poll for new messagesNEW_MESSAGES=bash poll-plan-messages.sh all ROLE LAST_READ# 3. Process each messageecho NEW_MESSAGES  jq -c .messages[]  while read -r message do  PATH=echo message  jq -r .path    # Read and process the message  echo Processing: PATH  # ... handle message logic ...  done# 4. Update read receipt with latest timestampLATEST=echo NEW_MESSAGES  jq -r .messages[-1].timestampif [ LATEST = null ]  [ -n LATEST ] then  bash mark-message-read.sh ROLE LATESTfi### Benefits✅ Persistent state: Survives across sessions  ✅ No duplicates: Prevents re-processing messages  ✅ Simple: Single JSON file per assistant  ✅ Auditable: Tracks read count and timestamps  ✅ Fast: No need to parse message files to check read status### Alternative: Plan-Specific Read ReceiptsIf you need per-plan tracking instead of global:json  assistant_role: coder,  plans:     plan-2025-10-23-auth-system:       last_read: 2025-10-23T12:30:00.123Z,      updated_at: 2025-10-23T12:30:15.456Z    ,    plan-2025-10-23-landing-page:       last_read: 2025-10-23T13:15:00.789Z,      updated_at: 2025-10-23T13:15:10.012Z      ,  created_at: 2025-10-23T12:00:00.000ZThis allows assistants to track progress independently per plan.### Notes- Uses simple JSON for easy manipulation- State directory created automatically if missing- Read count useful for debugging/monitoring- Compatible with both global and per-plan tracking patterns- Atomic updates via temp file + mv for safety
