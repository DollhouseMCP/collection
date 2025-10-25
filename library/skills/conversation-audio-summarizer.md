---
name: conversation-audio-summarizer
description: >-
  Intelligent conversation summarizer that identifies key decision points and
  generates audio summaries using macOS say command for hands-free updates
version: 1.0.7
created: '2025-09-03T21:53:20.597Z'
modified: '2025-09-05T21:00:00.000Z'
platform: macos
tags:
  - audio
  - tts
  - summarization
  - conversation
  - macos
dependencies: []
custom: {}
languages:
  - bash
  - natural_language
complexity: intermediate
domains:
  - productivity
  - accessibility
  - automation
prerequisites:
  - macOS with say command
parameters: []
examples: []
proficiency_level: 0
---
# Conversation Audio SummarizerA specialized skill for creating concise, audio-ready summaries of conversations at key decision points, delivered through macOSs built-in text-to-speech system using the default system voice.

## Core Capabilities

### Conversation Analysis

- Decision Point Detection: Identifies when user input would be valuable

- Context Extraction: Pulls key information, decisions, and action items

- Progress Tracking: Monitors whats been completed and whats pending

- Topic Clustering: Groups related discussion points for clarity

### Summary Generation

- Concise Formatting: Creates 30-60 second audio-friendly summaries

- Natural Speech Patterns: Formats text for optimal TTS pronunciation

- Priority Ordering: Presents most important information first

- Action Focus: Emphasizes what needs user attention

### Audio Delivery

- macOS Say Integration: Direct integration with system TTS using default voice

- Speech Rate Control: Adjusts speed for clarity 150-180 WPM

- Phonetic Optimization: Handles technical terms and acronyms

- Default Voice: Uses system default voice for consistency

## Implementation Process

### Step 1: Analyze Conversation State

bash

# Identify key points needing user attention

- What was accompli

shed

- What decisions are pending

- What questions remain

- What conflicts need resolution

### Step 2: Generate Summary Structuremarkdown

1. Opening Context 5-10 seconds   Heres your LinkedIn outreach update...

2. Completed Items 10-15 seconds   Weve found the Chris Penn materials and Linked

In post draft...

3. Decision Points 15-20 seconds   You need to decide on...

4. Recommended Actions 5-10 seconds   I recommend...

### Step 3: Format for Speech

- Replace technical abbreviations e.g., API → A P I

- Add pauses with commas for natural flow

- Simplify complex sentences

- Remove URLs and code snippets

- Convert lists to natural language

### Step 4: Generate Audio Command

bash

# Basic usage with default voice RECOMMENDEDsay Your summary text here

# With output to filesay -o /Desktop/summary.aiff Your summary text here

# With rate adjustment using default voicesay -r 160 Your summary text here

# Complete command with rate control default voicesay -r 160 -o /Desktop/conversation_summary.aiff Your summary text here

## Usage Examples

### Example 1: Project Status Update

bashsay -r 165 Good evening Mick. Heres your LinkedIn campaign status. Weve successfully located the Chris Penn outreach message and LinkedIn announcement post in the business repository. Both documents are poli

shed and ready to send. The Chris Penn message is under 100 words, focusing on AI strategy and frameworks. Your Linked

In post has been optimized for engagement with a strong hook about solving AI tool chaos. Youre ready to execute the outreach whenever youd like. Would you like to review any specific sections before sending

### Example 2: Decision Required

bashsay -r 170 Attention needed. You have three Linked

In message options for Chris Penn. Option one focuses on AI strategy alignment. Option two emphasizes the problem-solver approach. Option three, which I recommend, combines DollhouseMCP and AILIS in under 100 words. Please indicate which approach youd prefer, or if youd like me to refine any of them.

### Example 3: Work Completed

bashsay -r 160 Task complete. Ive activated the LinkedIn profile analyst and content strategist personas. These will provide specialized expertise for crafting personalized outreach and optimizing engagement. The conversation audio summarizer skill has been created and saved to DollhouseMCP. All systems are ready for your Linked

In campaign launch.

## Trigger Phrases

The skill activates when detecting:
  - Give me a summary

- Where are we at

- Audio update

- Whats the status

- Brief me

- Catch me up

- Natural pause points in complex tasks

## Audio Settings

### Optimal Settings

- Rate: 160-170 WPM for technical content

- Rate: 170-180 WPM for general updates

- Volume: System default user-controlled

- Voice: System default voice no voice specification needed

- Format: AIFF for quality, MP3 for sharing

## Advanced Features

### Background Delivery

bash

# Run in background while continuing worksay Your long summary here #

## Notification Integration

bash

# Combine with system notificationsosascript -e display notification Audio summary ready with title Conversation Update  say Your summary here

## Best Practices

### Content Optimization

1. Keep summaries under 60 seconds for optimal attention

2. Front-load important information in case user interrupts

3. Use natural pauses between topics comma = 200ms pause

4. Spell out acronyms for first mention

5. Avoid technical jar

gon unless necessary

### Timing Considerations

- Generate summaries at natural breakpoints

- Wait for task completion before summarizing

- Avoid interrupting active work

- Consider users timezone and work patterns

### Error Handling

- Verify say command availability before use

- Provide text fallback if audio fails

- Handle long text with chunking

## Integration with Other Skills

Works well with:
  - session-notes-writer: Summarize session notes

- linkedin-profile-analyst: Audio profile summaries

- todo-system-skills: Audio task status updates

## Command Reference

### Quick Commands

bash

# Test default voicesay Testing voice output

# Save to filesay -o summary.aiff Text here

# Adjust speech rate words per minutesay -r 200 Faster speechsay -r 120 Slower speech

# Using different audio formatssay -o summary.m4a --data-format=aac Text here

### Shell Function for Easy Use

bash

# Add to /.z

shrc or /.ba

shrcfunction audio_summary     local text=1    local rate=2:-165    say -r rate text

# Usageaudio_summary Your update text here 170

## Success Metrics

- Summary clarity and completeness

- Appropriate length 30-60 seconds

- Natural speech flow

- Actionable content

- User engagement with audio format
