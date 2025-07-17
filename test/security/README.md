# Security Testing Infrastructure

This directory contains a safe testing infrastructure for security patterns that avoids using real malicious content.

## Overview

To prevent triggering security systems during development and testing, we use a placeholder-based approach:

1. **Placeholder Patterns**: Instead of real malicious patterns, we use safe placeholders like `OVERRIDE_PREVIOUS_INSTRUCTIONS`
2. **Mock Scanner**: For testing the test infrastructure itself, we use a mock scanner that recognizes placeholders
3. **Real Pattern Mapping**: The actual patterns are stored separately and only loaded during real security scans

## Structure

```
test/security/
├── README.md                    # This file
├── test-data/
│   └── security-test-patterns.json  # Safe placeholder patterns
├── helpers/
│   └── safe-test-helpers.ts    # Test infrastructure utilities
├── safe-pattern-infrastructure.test.ts  # Tests for the infrastructure
└── [category].test.ts          # Category-specific security tests
```

## Adding New Test Cases

1. Add the test case to `test-data/security-test-patterns.json`:
```json
{
  "id": "PI003",
  "description": "New pattern description",
  "placeholder": "NEW_PATTERN_PLACEHOLDER",
  "realPattern": "[REDACTED - See documentation]",
  "expectedCategory": "prompt_injection",
  "expectedSeverity": "high"
}
```

2. The placeholder should:
   - Be in SCREAMING_SNAKE_CASE
   - Be descriptive but safe
   - Not contain actual malicious content

3. Document the real pattern mapping separately (not in the codebase)

## Running Tests

```bash
# Run all security tests
npm run test:security

# Run specific test file
npm run test:security -- safe-pattern-infrastructure.test.ts

# Run with coverage
npm run test:security -- --coverage
```

## Safety Guidelines

1. **Never commit real malicious patterns** to the repository
2. **Use placeholders** for all test cases
3. **Document real patterns** in a secure location outside the codebase
4. **Review all changes** to ensure no accidental inclusion of harmful content
5. **Test incrementally** to avoid triggering multiple security alerts

## Pattern Categories

- **prompt_injection**: Attempts to override AI instructions
- **jailbreaking**: Attempts to bypass safety restrictions  
- **command_execution**: Attempts to execute system commands
- **data_exfiltration**: Attempts to extract or leak data
- **credential_phishing**: Attempts to obtain sensitive credentials
- **obfuscation**: Attempts to hide malicious intent
- **resource_exhaustion**: Attempts to cause performance issues

## Mock Scanner vs Real Scanner

The infrastructure provides two scanning modes:

1. **Mock Scanner** (for testing):
   - Recognizes placeholder patterns
   - Returns predictable results
   - Safe for development

2. **Real Scanner** (for production):
   - Uses actual security patterns
   - Provides real threat detection
   - Should be used carefully in testing