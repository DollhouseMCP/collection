---
category: general
description: >-
  Template for documenting security incidents involving encoding-based jailbreak
  attempts
examples: []
includes: []
name: security-incident-report
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# Security Incident Report

- incident_type

- timestamp

## Incident Overview

- Incident ID: incident_id

- Detection Time: timestamp

- Incident Type: incident_type

- Risk Level: risk_level

- Status: status

## Encoding Analysis

- Method Detected: encoding_method

- Pattern Confidence: confidence_level%

- Encoded Content:
  encoded_content  #

# Decoded Content Analysis#if decoded_safely

- Decoding Method: decoding_method

- Decoded Text:
  decoded_text

- Malicious Indicators: malicious_indicatorselse

- Decoding Status: Blocked before decoding due to high risk indicators

- Risk Factors: risk_factors/if

## Jailbreak Assessment

- TIP Technique Detected: tip_technique

- Instruction Injection: instruction_injection

- Behavioral Modification Attempt: behavior_modification

- System Override Attempt: system_override

## Context Information

- Conversation Context: conversation_context

- User Behavior Patterns: user_behavior

- Previous Attempts: previous_attempts

- Session Duration: session_duration

## Security Response

- Action Taken: action_taken

- User Communication: user_communication

- Blocking Reason: blocking_reason

- Educational Response: educational_response

## Detection Patterns Matched#each patterns_matched

- Pattern: pattern_name

- Confidence: confidence%

- Cate

gory: cate

gory/each

## Learning Outcomes

- New Pattern Identified: new_pattern

- False Positive: false_positive

- Detection Accuracy: detection_accuracy

- Response Effectiveness: response_effectiveness

## Recommendations#each recommendations

- this/each

## Follow-up Actions#each follow_up_actions- [ ] action

- assigned_to

- due_date/each

## Technical Details

- Detection Agent: detection_agent

- Pattern Recognition Skill: pattern_skill

- Processing Time: processing_timems

- System Load: system_load

## Appendices

### Raw Message Dataraw_message

### Detection Logdetection_log

### Pattern Analysispattern_analysis---Report generated automatically by jailbreak-detection-agentClassification: classification_level

Distribution: distribution_list
