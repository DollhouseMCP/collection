---
category: general
description: >-
  Comprehensive parameter optimization guide for all DollhouseMCP personas,
  including temperature, max tokens, reasoning effort, and BoltAI custom
  assistant configurations
examples: []
includes: []
name: persona-parameter-optimization-guide
output_format: markdown
tags: []
usage_count: 0
variables: []
version: 1.0.0

---
# Persona Parameter Optimization Guide for BoltAI + DollhouseMCP

## 📊 Complete Persona Parameter Table Persona Name  Cate

gory  Temperature  Max Tokens  Reasoning Effort  Rationale -----------------------------------------------------------------------------

- Creative Writer 4 variants  Creative  0.7-0.8  8192  Medium-High  High creativity needed, long narrative outputs  alex-sterling  Technical  0.3-0.4  6144  High  Technical excellence with collaborative precision  Security Analyst  Security  0.1-0.3  8192  Maximum  Critical security analysis requires highest precision  codeql-security-analyst  Security  0.2-0.3  6144  Maximum  Static analysis expertise needs detailed technical output  code-review-companion  Technical  0.2-0.4  6144  High  Educational code review requires structured analysis  J.A.R.V.I.S.  Assistant  0.4-0.5  4096  Medium  Witty personality with reliable assistance  Friday  Assistant  0.3-0.4  4096  Medium  Direct, efficient communication style  ELI5 Explainer  Educational  0.5-0.6  6144  Medium-High  Creative analogies for complex topics  Debug Detective  Technical  0.2-0.3  6144  Maximum  Systematic trouble

shooting requires precision  Business Consultant  Business  0.3-0.4  6144  High  Strategic ROI-focused analysis  Technical Analyst  Technical  0.1-0.3  8192  Maximum  Deep technical analysis with evidence-based solutions  MCP Expert Full Stack Developer  Technical  0.2-0.4  8192  Maximum  Complex MCP architecture requires detailed responses  blog-copy-editor  Content  0.4-0.5  6144  Medium  Balanced creativity with editorial precision  copy-editor-professional  Content  0.3-0.4  6144  Medium-High  Language refinement requires careful precision  session-notes-writer  Documentation  0.2-0.3  8192  High  Comprehensive documentation needs accuracy  git-flow-master  Technical  0.2-0.4  6144  High  Git workflows require technical precision  dollhouse-expert  Guide  0.3-0.5  6144  High  System knowledge with helpful guidance  executive-assistant-pro  Assistant  0.3-0.4  6144  Medium-High  Professional assistance with detail orientation  linkedin-content-strategist  Content  0.4-0.6  6144  Medium  Professional content with engagement focus  linkedin-profile-analyst  Analysis  0.3-0.4  6144  High  Personalized analysis requires detailed insight  reddit-content-creator  Content  0.5-0.7  6144  Medium  Community engagement needs creative flair  reddit-content-strategist  Content  0.4-0.6  6144  Medium  Community-focused content optimization  hackernews-content-strategist  Content  0.3-0.5  6144  Medium-High  Technical community requires balanced approach  travel-planner  Planning  0.4-0.6  6144  Medium-High  Creative itineraries with practical details  screenwriting-suite-01-professional-screenwriter  Creative  0.6-0.8  8192  Medium-High  Creative storytelling with industry knowledge  screenwriting-suite-02-tv-development-assistant  Creative  0.5-0.7  8192  Medium-High  Interactive development with creative structure  open-source-business-strategist  Business  0.3-0.5  6144  High  Strategic business models require analytical depth  obs-director  Technical  0.3-0.4  6144  Medium-High  Technical streaming setup with creative direction  audio-narrator  Creative  0.4-0.5  4096  Medium  Clear narration with professional tone  link-validator  Technical  0.1-0.3  4096  High  Technical validation requires precision  verification-specialist  Analysis  0.2-0.3  6144  High  Quality assurance needs meticulous accuracy  tough-love-coach  Coaching  0.3-0.5  4096  Medium  Balanced coaching with firm guidance  three-laws-of-robotics  Specialized  0.2-0.4  4096  High  Ethical framework requires careful consideration  Timestamped Assistant  Assistant  0.3-0.4  4096  Medium  Structured assistance with tracking  Timestamped Code Analyst  Technical  0.2-0.3  6144  High  Technical analysis with precise tracking  persona-activator  Meta  0.3-0.5  6144  Medium-High  Persona discovery requires balanced recommendations #

# 🎯 Cate

gory-Based Optimization Presets

### 🔒 Security  AnalysisTemperature: 0.1-0.3Max Tokens: 6144-8192Reasoning: MaximumModels: Claude 3.5 Sonnet preferred

Use Case: Vulnerability analysis, threat detection, compliance

### 💻 Technical DevelopmentTemperature: 0.2-0.4Max Tokens: 6144-8192Reasoning: High-Maximum

Models: Claude 3.5 Sonnet, GPT-4Use Case: Code review, architecture, debugging

### 🎨 Creative ContentTemperature: 0.6-0.8Max Tokens: 8192Reasoning: Medium-High

Models: Claude 3.5 Sonnet, GPT-4Use Case: Writing, storytelling, creative ideation

### 📝 Professional ContentTemperature: 0.4-0.6Max Tokens: 6144Reasoning: Medium-HighModels: Claude 3.5 Sonnet preferred

Use Case: Business writing, social media, marketing

### 🤖 AI AssistantsTemperature: 0.3-0.5Max Tokens: 4096-6144Reasoning: Medium

Models: Claude 3.5 Sonnet, GPT-4Use Case: General assistance, task management

### 📊 Analysis  DocumentationTemperature: 0.2-0.4Max Tokens: 6144-8192Reasoning: HighModels: Claude 3.5 Sonnet preferred

Use Case: Research, documentation, reporting

## 🛠️ BoltAI Custom Assistant Templates

### High-Precision Technical Assistant

json  name: Technical Precision,  model: claude-3-5-sonnet,  temperature: 0.2,  max_tokens: 8192,  reasoning_effort: maximum,  system: Technical analysis with maximum precision and detailed explanations

### Creative Content Generator

json  name: Creative Content,  model: claude-3-5-sonnet,   temperature: 0.7,  max_tokens: 8192,  reasoning_effort: medium-high,  system: Creative content generation with engaging narratives

### Professional Business Assistant

json  name: Business Professional,  model: claude-3-5-sonnet,  temperature: 0.4,  max_tokens: 6144,  reasoning_effort: high,  system: Professional business communication and strategic analysis

### Security Analysis Specialist

json  name: Security Specialist,  model: claude-3-5-sonnet,  temperature: 0.1,  max_tokens: 8192,  reasoning_effort: maximum,  system: Maximum precision security analysis and threat assessment

## 📋 Quick Reference Guide

### 🚨 Critical Tasks Temperature: 0.1-0.3

- Security analysis

- Vulnerability assessment

- Code debugging

- Technical documentation

- Quality assurance

### ⚖️ Balanced Tasks Temperature: 0.3-0.5

- Business strategy

- Professional writing

- General assistance

- Educational content

- System guidance

### 🎨 Creative Tasks Temperature: 0.5-0.8

- Creative writing

- Content ideation

- Marketing copy

- Social media content

- Storytelling

## 🎯 Optimization Tips

1. Start Conservative: Begin with lower temperature, increase if needed

2. Task Matching: Match complexity to reasoning effort requirements

3. Token Planning: Estimate output length needs in advance

4. Model Selection: Claude 3.5 Sonnet optimal for most DollhouseMCP use cases

5. Context Awareness: Adjust based on conversation length and complexity

## 🔄 Dynamic Adjustment Strategies

### Conversation Evolution

- Start: Medium settings for exploration

- Focus: Lower temperature for precision

- Creation: Higher temperature for ideation

- Finalization: Lowest temperature for accuracy

### Task Complexity Scaling

- Simple: Lower reasoning effort, fewer tokens

- Moderate: Balanced settings across parameters

- Complex: Maximum reasoning, higher token limits

- Critical: Minimum temperature, maximum precision

## 📱 BoltAI Integration Workflow

1. Identify Task Type → Reference cate

gory table

2. Select Custom Assistant → Use pre-configured template

3. Activate Appropriate Persona → DollhouseMCP handles behavior

4. Monitor Output Quality → Adjust parameters if needed

5. Save Successful Configurations → Create new custom assistants

This guide provides scientifically-optimized parameter recommendations for maximum effectiveness with your DollhouseMCP persona collection in BoltAI.
