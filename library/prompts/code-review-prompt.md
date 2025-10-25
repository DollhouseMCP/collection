---
type: prompt
name: Code Review Prompt
description: Systematic code review checklist for quality, security, and best practices assessment
unique_id: prompt_code-review-prompt_dollhousemcp_20251025-100000
author: dollhousemcp
category: development
version: 1.0.0
tags:
  - code-review
  - quality-assurance
  - security
  - best-practices
  - development
license: MIT
parameters:
  - name: review_focus
    type: string
    options:
      - comprehensive
      - security-focused
      - performance-focused
      - maintainability-focused
      - quick-scan
    default: comprehensive
  - name: severity_threshold
    type: string
    options:
      - critical-only
      - high-and-above
      - all-issues
    default: all-issues
  - name: language
    type: string
    options:
      - javascript
      - typescript
      - python
      - java
      - go
      - rust
      - any
    default: any
created: 2025-10-25T00:00:00.000Z
---

# Code Review Prompt

A comprehensive framework for conducting systematic code reviews covering quality, security, performance, and maintainability.

## Prompt Template

Conduct a {review_focus} code review reporting issues at {severity_threshold} level for {language} code.

Analyze through these dimensions:

### 1. CODE QUALITY
- Variable and function names clear and descriptive
- DRY principles followed
- Single responsibility functions
- Manageable complexity
- No code smells or anti-patterns

### 2. SECURITY
- Inputs validated and sanitized
- Authentication/authorization correct
- No SQL injection vulnerabilities
- No hardcoded secrets
- Sensitive data encrypted
- Dependencies secure and updated

### 3. PERFORMANCE
- No obvious bottlenecks
- Database queries optimized
- Caching used appropriately
- Async operations properly handled
- Memory management efficient

### 4. ERROR HANDLING
- Errors properly caught and handled
- Error messages informative
- Edge cases considered
- Logging appropriate
- Fail-safe mechanisms present

### 5. TESTING
- Code testable
- Sufficient unit tests
- Edge cases covered
- Integration points tested
- Adequate test coverage

### 6. DOCUMENTATION
- Code self-documenting where possible
- Complex sections commented
- API documentation present
- Assumptions documented

### 7. MAINTAINABILITY
- Logical code structure
- Minimal dependencies
- Project conventions followed
- Easy for others to modify
- Technical debt documented

Provide:
1. Summary of findings
2. Critical issues (must fix)
3. Important improvements (should fix)
4. Nice-to-have suggestions
5. Positive observations

## Example Output

CODE REVIEW SUMMARY
===================

Overall Assessment: GOOD with minor concerns
Review Type: Comprehensive

CRITICAL ISSUES (Must Fix): 0
HIGH PRIORITY (Should Fix): 2
MEDIUM PRIORITY (Consider): 4
LOW PRIORITY (Nice to Have): 3

HIGH PRIORITY:

1. [SECURITY] Missing input validation on user_email parameter
   Location: auth.js, line 45
   Risk: Email injection vulnerability
   Recommendation: Use email validation library

2. [PERFORMANCE] N+1 query in user fetch loop
   Location: users.js, lines 78-82
   Impact: Database performance degradation
   Recommendation: Use JOIN or batch fetch

POSITIVE OBSERVATIONS:
- Excellent test coverage (94%)
- Clear naming conventions
- Good separation of concerns
- Comprehensive error handling
