---
name: create-plan-message
description: >-
  Helper to create properly formatted message memories in plan folders with
  automatic timestamp generation
version: 1.0.0
created: '2025-10-23T16:42:54.583Z'
modified: '2025-10-23T16:42:54.583Z'
tags:
  - creation
  - plans
  - messages
  - formatting
dependencies:
  - generate-message-timestamp
  - message-template
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_create-plan-message_anonymous_20251023-164254
type: skill
author: DollhouseMCP
capabilities:
  - general-purpose
security_exceptions:
  - pattern: "xss"
    reason: "Contains HTML examples and event handlers for documentation/template purposes - sanitized in actual usage"
---
## Skill: Create Plan Message### PurposeHelper skill to create properly formatted message memories in plan folders. Automatically generates timestamps, constructs filenames, and formats YAML content according to the messaging protocol.### UsageUse this whenever creating a new message in a plan acknowledgment, status update, question, answer, completion, etc.. This ensures consistent formatting and automatic timestamp generation.### Parameters- plan_id: The plan folder name e.g., plan-2025-10-23-auth-system- message_type: Type of message planackstatusquestionanswercompletionblockerinfo- sender: Sender role plannercoderdesignerwriteretc- receiver: Receiver role specific role or all for broadcast- subject: Brief description for the message- content: Full message content markdown- parent_message: optional Filename of parent message for threading### Message Types- plan: Initial plan always first message, seq 00- ack: Assistant acknowledges receipt- status: Progress update- question: Blocker or clarification needed- answer: Response to a question- completion: Task finished- blocker: Hard stop, needs intervention- info: FYI, cross-team communication### Implementationbash#/bin/bash# Create a plan message with proper formattingPLAN_ID=1MESSAGE_TYPE=2SENDER=3RECEIVER=4SUBJECT=5CONTENT=6PARENT_MESSAGE=7:-# Validate message typeVALID_TYPES=plan ack status question answer completion blocker infoif  echo VALID_TYPES  grep -wq MESSAGE_TYPE then  echo Error: Invalid message type MESSAGE_TYPE  echo Valid types: VALID_TYPES  exit 1fi# Generate timestampTIMESTAMP_DATA=bash generate-message-timestamp.shPREFIX=echo TIMESTAMP_DATA  jq -r .filenamePrefixISO_TIMESTAMP=echo TIMESTAMP_DATA  jq -r .isoTimestamp# Construct filenameFILENAME=PREFIX-MESSAGE_TYPE-SENDER.yaml# Find plan folder search in date-based memory structureMEMORY_BASE=HOME/.dollhouse/portfolio/memoriesPLAN_FOLDER=find MEMORY_BASE -type d -name PLAN_ID  head -1if [ -z PLAN_FOLDER ] then  echo Error: Plan folder PLAN_ID not found  exit 1fi# Full path for new messageMESSAGE_PATH=PLAN_FOLDER/FILENAME# Create YAML contentcat  MESSAGE_PATH EOFname: FILENAME%.yamldescription: SUBJECTversion: 1.0.0tags:  - plan-message  - PLAN_ID  - type-MESSAGE_TYPE  - sender-SENDER  - receiver-RECEIVERmetadata:  plan_id: PLAN_ID  sequence: PREFIX  sender: SENDER  receiver: RECEIVER  message_type: MESSAGE_TYPE  timestamp: ISO_TIMESTAMP[ -n PARENT_MESSAGE ]  echo   parent_message: PARENT_MESSAGEcontent:   # MESSAGE_TYPE^: SUBJECT    From: SENDER  To: RECEIVER  Re: PLAN_ID  Type: MESSAGE_TYPE  Time: date +%Y-%m-%d %I:%M %p    CONTENTEOF# Output resultecho ✅ Created message: FILENAMEecho    Path: MESSAGE_PATHecho    Plan: PLAN_IDecho    Type: MESSAGE_TYPEecho    From: SENDER → To: RECEIVER### Usage ExamplesCreate initial plan:bashbash create-plan-message.sh   plan-2025-10-23-auth-system   plan   planner   coder   Implement user authentication system   ## ContextWe need a secure user authentication system...## Tasks1. [ ] Set up user model2. [ ] Create login endpoint3. [ ] Add JWT tokensCreate acknowledgment:bashbash create-plan-message.sh   plan-2025-10-23-auth-system   ack   coder   planner   Acknowledged and starting work   ## AcknowledgmentIve received the plan and will begin implementation.## Estimated TimelineApproximately 2-3 hours for all tasks.Create status update:bashbash create-plan-message.sh   plan-2025-10-23-auth-system   status   coder   all   Task 1 complete: User model created   ## Progress- [x] Task 1: User model- [ ] Task 2: Login endpoint- [ ] Task 3: JWT tokens## Next StepsMoving to Task 2 login endpointCreate question with parent reference:bashbash create-plan-message.sh   plan-2025-10-23-auth-system   question   coder   planner   Password hashing algorithm choice   ## QuestionShould I use bcrypt or argon2 for password hashing## ContextArgon2 is newer and more secure, but bcrypt is more widely supported.## RecommendationI suggest argon2 unless theres a compatibility concern.   20251023-121500-001-planCreate answer:bashbash create-plan-message.sh   plan-2025-10-23-auth-system   answer   planner   coder   Use argon2 for password hashing   ## AnswerYes, use argon2. Were targeting modern Node.js so compatibility isnt a concern.## Additional ContextMake sure to use appropriate cost parameters for production.   20251023-122500-004-question-coderCreate completion:bashbash create-plan-message.sh   plan-2025-10-23-auth-system   completion   coder   planner   All tasks completed successfully   ## SummaryAll three tasks completed and tested.## Deliverables- ✅ User model with argon2 hashing- ✅ Login endpoint with JWT generation- ✅ Token validation middleware## TestsAll tests passing coverage: 98%## Ready ForCode review and deployment### Using with DollhouseMCP ToolsAlternative: Use MCP create_element directly:bash# The skill can also use DollhouseMCP toolsmcp__DollhouseMCP__create_element   --type memories   --name PREFIX-MESSAGE_TYPE-SENDER   --description SUBJECT   --content FULL_CONTENT### Benefits✅ Automatic timestamps: No manual sequence management  ✅ Consistent format: All messages follow protocol  ✅ Tag generation: Proper tags for searchability  ✅ Threading support: Parent message references  ✅ Validation: Checks message type and plan existence  ✅ Simple interface: Easy to use from personas/agents### Integration with Other SkillsThis skill combines:- generate-message-timestamp for sequencing- Message template formatting- File system operations- Tag and metadata generation### Notes- Validates message types before creation- Searches for plan folder automatically- Supports message threading via parent_message- Compatible with both bash and MCP implementations- Errors gracefully if plan folder not found
