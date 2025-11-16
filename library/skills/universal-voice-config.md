---
name: universal-voice-config
description: Universal skill for configuring voice synthesis that works across any LLM
author: Mick
version: 1.0.0
created: '2025-09-23T16:56:37.521Z'
modified: '2025-09-23T16:56:37.521Z'
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
unique_id: unknown_universal-voice-config_mick_20250923-165637
type: skill
capabilities:
  - general-purpose
---
#

# Universal Voice Configuration Skill

This skill enables any LLM with DollhouseMCP to configure F5-TTS voice synthesis settings.

### Activation Triggers

When users say:
  - Configure my voice settings

- Adjust voice parameters

- Fix voice quality

- Make voice sound more [natural/smooth/quick]

- Show voice configuration

- Voice sounds [weird/robotic/choppy]

### Standard Responses

####

1. Show Current Configuration

bashcd /Users/mick/Developer/Mc

Voicesource venv/bin/activate

python voice_config.py --show

####

2. Apply Quality Fixes

For weird or robotic voice:ba

shpython voice_config.py --preset natural

# This sets: speed=0.95, nfe_step=48, cfg_strength=2.5For best quality:ba

shpython voice_config.py --preset smooth

# This sets: speed=0.9, nfe_step=64, cfg_strength=3.0For faster synthesis:ba

shpython voice_config.py --preset quick

# This sets: speed=1.1, nfe_step=24, cfg_strength=1.8

####

3. Adjust Specific Parameters

bash

# Read current configcat voice_config.json

# Modify specific value example: adjust speed

python -c import jsonconfig = json.loadopenvoice_config.jsonconfig[speed] = 0.95  # Adjust this value

json.dumpconfig, openvoice_config.json, w, indent=2print✅ Updated speed to, config[speed]

####

4. Test Configuration

Always test after changes:ba

shpython voice_tuned.py Testing the new voice configurationafplay output/tuned.wav

### Parameter Quick Reference Parameter  Range  Default  Effect -----------------------------------

- speed  0.5-2.0  1.0  Lower = slower/clearer  nfe_step  8-128  32  Higher = smoother  cfg_strength  0.5-5.0  2.0  Higher = stronger guidance  target_rms  0.05-0.3  0.1  Volume normalization  cross_fade  0.0-0.5  0.15  Transition smoothness #

## Common Issues  Solutions

Issue: Voice sounds robotic

- Solution: python voice_config.py --preset natural

- Or increase nfe_step to 48-64Issue: Synthesis too slow

- Solution: Reduce nfe_step to 24-32

- Or increase speed to 1.1Issue: Choppy transitions

- Solution: Increase cross_fade_duration to 0.2-0.3Issue: Volume too low/high

- Solution: Adjust target_rms 0.1 normal, 0.15 louder, 0.08 quieter

### Making Settings Portable

To share configuration between LLMs:ba

sh

# Exportcat /Users/mick/Developer/Mc

Voice/voice_config.json

# Import on new systemcat  /Users/mick/Developer/Mc

Voice/voice_config.json  EOF[paste configuration here]EOF

### Interactive ConfigurationFor detailed tuning:ba

shcd /Users/mick/Developer/McVoicesource venv/bin/activate

python voice_config.py  # Opens interactive menu

This provides:
  - Visual parameter display

- Real-time adjustment

- Preset selection

- Test synthesis

- Save/load configurations
