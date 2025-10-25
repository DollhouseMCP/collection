---
name: Test Hotfix Template
description: Testing template variable substitution for PR
type: template
version: 1.0.0
variables:
  - name: test_name
    description: Name to substitute
    required: true
  - name: test_value
    description: Value to substitute
    required: false
    default: default-value
unique_id: templates_test-hotfix-template_anonymous_20251025-191021
author: DollhouseMCP
format: markdown
category: professional
---

# Test Template for Hotfix

## Variables Test

Name: {{test_name}}
Value: {{test_value}}
Date: {{date}}

## Edge Cases

Empty brackets: {{}}
Unknown variable: {{unknown_var}}
Nested: {{test_{{nested}}}}

This template tests if variables are properly substituted after the hotfix.
