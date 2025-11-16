---
name: obs-audio-configurator
description: >-
  Professional audio configuration and mixing for OBS Studio with noise
  suppression and level optimization
author: mickdarling
version: 1.0.0
created: '2025-09-06T18:18:20.639Z'
modified: '2025-09-06T18:18:20.639Z'
tags: []
dependencies:
  - OBS Studio 30.0+
  - Scarlett Solo
custom: {}
languages: []
complexity: intermediate
domains:
  - audio
  - obs
  - recording
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_obs-audio-configurator_mickdarling_20250906-181820
type: skill
capabilities:
  - general-purpose
---
# OBS Audio Configurator

Professional audio configuration skill for optimal recording quality in OBS Studio.

## Capabilities

- Multi-source mixing: Balance microphone, desktop, and application audio

- Noise suppression: Advanced filtering for clean audio

- Level optimization: Automatic gain control and compression

- Sync correction: Fix audio/video sync issues

- Audio monitoring: Real-time level monitoring and alerts

## Audio Setup Profile

### Microphone Configuration

- Input: Scarlett Solo mono

- Noise suppression: -30dB thre

shold

- Gain: Auto-adjusted to -12dB peaks

- Compressor: 3:1 ratio above -18dB

### Desktop Audio

- Capture: System audio

- Duck under voice: -6dB when speaking

- Remove system sounds: Filtered

## OBS Audio Settings

json  sampleRate: 48000,  channel

Setup: mono,  filters: [    noise_suppress_filter,    compressor_filter,    gain_filter  ]

## Usage

When active, I can:
  - Configure optimal audio settings for your Scarlett Solo

- Set up noise gates and suppression

- Balance multiple audio sources

- Monitor and alert on audio issues

- Apply broadcast-quality processing
