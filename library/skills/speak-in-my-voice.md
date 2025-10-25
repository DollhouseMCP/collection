---
name: speak-in-my-voice
description: Synthesize text in your own voice using F5-TTS and SuperWhisper recordings
author: Mick
version: 1.0.0
created: '2025-09-23T16:48:13.788Z'
modified: '2025-09-23T16:48:13.788Z'
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
unique_id: unknown_speak-in-my-voice_mick_20250923-164813
type: skill
capabilities:
  - general-purpose
---
#

# Skill: Speak in My Voice

When the user asks you to speak something out loud or say something in their voice, use this skill to synthesize the text using their cloned voice.

### How to Use This Skill

1. When user says things like:
  - Say this out loud: [text]

- Speak: [text]

- Read this in my voice: [text]

- Can you say [text]

2. Navigate to the McVoice project and run the synthesis:ba

shcd /Users/mick/Developer/Mc

Voicesource venv/bin/activate

python f5_tts_natural.py [text to speak]afplay output/natural.wav

3. For better quality, use the smooth variant:ba

shpython f5_tts_natural.py [text to speak] --variantsafplay output/variant_smooth.wav

### ExamplesUser: Say Hello world in my voiceYou: Ill synthesize Hello world in your voice.[Run the synthesis commands]✅ Now playing your voice saying Hello world

User: Read this email greeting out loud: Dear colleagues, I hope this message finds you well.You: Ill read that email greeting in your voice.[Run synthesis with the smooth variant for better quality]✅ Playing the email greeting in your voice

### Tips

- Use the natural synthesis script for better cadence

- For longer texts, use the smooth variant --variants flag

- The system automatically selects good reference recordings

- Synthesis takes about 10-15 seconds per sentence
