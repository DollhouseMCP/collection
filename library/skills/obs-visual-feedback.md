---
name: obs-visual-feedback
description: >-
  Real-time visual feedback and screenshot verification for OBS Studio scene
  configuration
author: mickdarling
version: 1.0.0
created: '2025-09-06T18:18:39.283Z'
modified: '2025-09-06T18:18:39.283Z'
tags: []
dependencies:
  - OBS Studio 30.0+
  - macOS screencapture
custom: {}
languages: []
complexity: intermediate
domains:
  - visual
  - obs
  - monitoring
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_obs-visual-feedback_mickdarling_20250906-181839
type: skill
capabilities:
  - general-purpose
---
# OBS Visual Feedback

Real-time visual feedback skill for verifying OBS scene configuration and layout.

## Capabilities

- Screen

shot automation: Capture OBS window from correct display

- Scene verification: Visual confirmation of scene layouts

- Source boundary detection: Identify red outline measurements

- Multi-monitor support: Handle LG portrait + Samsung landscape setup

- Layout validation: Check source positioning and scaling

## Display Configuration

### Monitor Setup

- Display 1: Samsung 3840x2160 VS Code

- Display 2: LG 3384x6016 rotated 90° OBS Studio

### Screen

shot Commands

bash

# Capture OBS on Display 2screencapture -x -D 2 obs_screen

shot.png

# Capture with timestampscreencapture -x -D 2 screen

shots/obs_date +%Y%m%d_%H%M%S.png

## Visual Analysis

When active, I can:
  - Take screen

shots of the correct OBS monitor

- Read pixel measurements from red source outlines

- Verify scene composition and layout

- Detect black screens or missing sources

- Compare preview vs program in Studio Mode

- Track visual changes during scene switches

## Source Measurement

Reading red outline boundaries:
  - Top/Bottom/Left/Right pixel distances

- Source dimensions within canvas

- Scaling and position verification

- Layer order confirmation

## IntegrationWorks with:
  - macOS screencapture for Display 2

- OBS Web

Socket for scene state

- Visual analysis of captured images
