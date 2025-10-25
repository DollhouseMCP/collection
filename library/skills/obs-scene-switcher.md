---
name: obs-scene-switcher
description: >-
  Dynamic scene switching skill for seamless OBS transitions during demo
  recordings with context detection and audio feedback
author: mickdarling
version: 1.0.0
created: '2025-09-06T18:18:03.347Z'
modified: '2025-09-06T18:18:03.347Z'
tags: []
dependencies:
  - OBS Studio 30.0+
  - obs-websocket-js
custom: {}
languages: []
complexity: intermediate
domains:
  - automation
  - obs
  - streaming
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_obs-scene-switcher_mickdarling_20250906-181803
type: skill
capabilities:
  - general-purpose
---
# OBS Scene Switcher

Dynamic scene switching skill for seamless OBS transitions during DollhouseMCP demo recordings.

## Capabilities

- Context-aware switching: Automatically detects active application and switches scenes

- Transition management: Multiple transition styles with variable timing

- Scene queueing: Queue multiple scene changes with delays

- Audio feedback: Announces scene changes via TTS

- History tracking: Logs all scene switches for analysis

## Scene Detection Rules

javascript// Auto-switch based on active windowconst scene

Rules =   1

- Introduction: [Starting demo, Welcome screen],  2

- Main Demo: [General workflow, Multiple windows],    3

- Code Focus: [VS Code active, Code editing],  4

- Claude Desktop: [Claude active, AI interaction],  5

- Split View: [Side-by-side, Claude + VS Code]

## Usage

When this skill is active, I can:
  - Switch scenes based on context

- Queue scene transitions for demos

- Apply smooth transitions between scenes

- Track scene usage patterns

- Provide audio narration of changes

## IntegrationWorks with:
  - OBS Web

Socket for programmatic control

- macOS TTS for audio feedback

- System events for context detection
