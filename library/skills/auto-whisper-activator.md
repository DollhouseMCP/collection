---
name: auto-whisper-activator
description: >-
  Automatically activates SuperWhisper dictation after audio summaries complete,
  enabling seamless voice-to-text workflow with proper timing delays
author: Claude
version: 1.0.5
created: '2025-10-20T16:41:18.371Z'
modified: '2025-10-20T16:41:18.371Z'
tags:
  - audio
  - dictation
  - automation
  - accessibility
  - voice-input
  - superwhisper
dependencies: []
custom: {}
languages: []
complexity: intermediate
domains:
  - productivity
  - accessibility
  - automation
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_auto-whisper-activator_claude_20251020-164118
type: skill
capabilities:
  - general-purpose
---
# Auto-Whisper Activator

Automatically activates SuperWhisper dictation after audio summaries complete using the custom hotkey configuration (Option+Command+3 / Key Code 20).

## Core Implementation

After each audio summary via `say` command, automatically triggers SuperWhisper with proper timing delay.

### Activation Command

```bash
# Wait for audio to complete, then activate SuperWhisper
sleep 1.5 && osascript -e 'tell application "System Events" to key code 20 using {command down, option down}'
```

**Why Key Code 20:**
- Maps to the "3" key at hardware level
- Matches user's custom SuperWhisper configuration (Option+Command+3)
- More reliable than keystroke simulation
- From SuperWhisper preferences: key code 20, modifiers 2304

## Usage Pattern

```bash
# Step 1: Audio summary
say -r 170 "Your message here"

# Step 2: Auto-activate SuperWhisper (1.5 second delay)
sleep 1.5 && osascript -e 'tell application "System Events" to key code 20 using {command down, option down}'
```

## Timing

- **1.5 seconds delay**: Prevents microphone from capturing tail end of audio
- Adjustable based on message length and speech rate
- Accounts for audio system latency

## Integration with conversation-audio-summarizer

These two skills work together:
1. conversation-audio-summarizer generates audio feedback
2. auto-whisper-activator triggers SuperWhisper for user response
3. Creates seamless voice interaction loop

## Troubleshooting

```bash
# Check if SuperWhisper is running
pgrep -i superwhisper

# Clear lock if stuck
rmdir /tmp/sw_debounce_lock

# Test activation manually
osascript -e 'tell application "System Events" to key code 20 using {command down, option down}'
```

## Complete Workflow Example

```bash
# Full cycle: audio summary → activate dictation
say -r 170 "Task complete. All tests passing. Ready for your next command." && sleep 1.5 && osascript -e 'tell application "System Events" to key code 20 using {command down, option down}'
```
