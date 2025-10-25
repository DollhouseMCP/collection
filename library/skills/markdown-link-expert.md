---
name: markdown-link-expert
description: >-
  Specialized knowledge of markdown link syntax, relative paths, anchor links,
  and markdown-specific link validation tools
author: assistant
version: 1.0.0
created: '2025-09-03T19:28:35.738Z'
modified: '2025-09-03T19:28:35.738Z'
tags:
  - markdown
  - links
  - validation
  - documentation
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# Markdown Link Expert Skill

## Link Types Expertise

- Relative links: [text]../path/file.md

- Absolute links: [text]https://example.com

- Anchor links: [text]#heading-anchor

- Reference links: [text][ref] with [ref]: url

- Image links: [alt]image.png

## Path Resolution Knowledge

- How relative paths work from different directories

- Repository root vs subdirectory contexts

- Cross-repository linking patterns

- Git

Hubs automatic link transformations

## Validation Tools

### markdown-link-check

- Config file: mlc_config.json

- Replacement patterns for path resolution

- Ignore patterns for false positives

- HTTP status code configuration

### lychee

- Config file: lychee.toml

- Better performance for large repos

- Advanced filtering options

- Parallel checking capabilities

## Common Issues

1. Relative path from wrong context

- Link works locally but not in CI

2. Case sensitivity

- Works on Windows/Mac but fails on Linux

3. Anchor generation

- Different markdown processors generate anchors differently

4. URL encoding

- Spaces and special characters in paths

5. Private repositories

- Links that require authentication
