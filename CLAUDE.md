# Claude Context Notes - DollhouseMCP Collection Repository

## Current Status: TDD Security Test Implementation (July 17, 2025)

### Today's Progress
- ✅ **PR #38-40, #42-43, #45, #48 Merged**: Completed 7/8 security test PRs
- ✅ **ReDoS Vulnerability Fixed**: Critical security fix in PR #42
- ✅ **Performance Benchmarks Added**: ~0.019ms per pattern average
- ⚠️ **PR #50 Created**: Performance optimization - 4 BUILD TESTS FAILING IN CI

### Recent Accomplishments (July 16-17, 2025)
- ✅ **TDD Security Tests**: 190+ security tests implemented
- ✅ **Pattern Documentation**: Added inline regex comments
- ✅ **Type Safety**: Eliminated all unsafe `any` usage
- ✅ **Performance Optimization**: Added optimized scanner with pattern ordering
- ✅ **Future Enhancement Issues**: Created #49, #51, #52, #53

#### PR #5 - Zod v3.24.1 → v4.0.5 ✅ SOLVED
**Solution Found**: One-line backward compatibility fix
```typescript
// Line 237 in src/validators/content-validator.ts
const isMissingField = err.code === 'invalid_type' && 
  (('received' in err && err.received === 'undefined') || 
   (!('received' in err) && err.message.includes('received undefined')));
```
**Status**: Ready to merge with this fix applied

#### PR #2 - GitHub Action Update (peter-evans/create-pull-request)
**Status**: Not reviewed yet, low risk

#### PR #1 - GitHub Action Update (tj-actions/changed-files)
**Status**: Not reviewed yet, low risk

### 🚨 CRITICAL: PR #50 Has 4 Failing Build Tests
**Status**: All tests pass locally but CI builds are failing
**Issue**: Unknown CI-specific failure - needs immediate debugging

### Security Test Implementation Progress (7/8 Complete)
1. ✅ PR #38: Fix prompt injection tests  
2. ✅ PR #39: Safe test infrastructure
3. ✅ PR #40: Jailbreaking patterns
4. ✅ PR #42: Command execution patterns
5. ✅ PR #43: Data exfiltration patterns
6. ✅ PR #45: Context awareness patterns
7. ✅ PR #48: Remaining categories
8. ⚠️ PR #50: Performance optimization (FAILING IN CI)

### High Priority Tasks (GitHub Issues)
1. **Issue #32**: Fix library content validation issues (5 files)
2. **Issue #33**: Write comprehensive security tests ✅ IN PROGRESS
3. **Issue #34**: Create proper CLI validation tool with enhanced features

### Medium Priority Tasks (From Claude Reviews)
1. **Issue #28**: Improve CLI test robustness with timeouts
2. **Issue #29**: Make security test assertions more specific
3. **Issue #30**: Add flexible content validation handling
4. **Issue #31**: Clean up magic numbers

### Key Technical Context

#### Windows CLI Fix Pattern (PR #27)
Instead of using spawn() which fails on Windows:
```typescript
// Import and call directly
import { main as validateContent } from '../../dist/src/cli/validate-content.js';
const exitCode = await validateContent(args);
```

#### Security Pattern Context
This project detects AI/LLM security issues, NOT traditional web security:
- ✅ Prompt injection, command execution, jailbreaking
- ❌ SQL injection, XSS, traditional vulnerabilities

### Project Structure
```
/Users/mick/Developer/MCP-Servers/DollhouseMCP-Collection/
├── src/
│   ├── validators/
│   │   ├── content-validator.ts    # Main validator (Zod schemas)
│   │   └── security-patterns.ts    # AI security patterns
│   └── cli/
│       └── validate-content.ts     # CLI tool
├── test/
│   ├── integration/                # Integration tests (from PR #27)
│   ├── unit/                      # Unit tests
│   └── security/                  # Security tests (placeholder)
├── library/                       # Content library (5 files failing)
└── docs/
    └── session-plans/            # Session notes

```

### Quick Commands
```bash
# Check PR status
gh pr list

# Run all tests
npm run test:all

# Check failing library content
npm run validate:content library/**/*.md

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:security

# Run specific security test
npm run test:security -- test/security/data-exfiltration.test.ts

# Check for ReDoS vulnerabilities
# Look for patterns with *, +, or {n,} without upper bounds
grep -E '(\*|\+|\{[0-9]+,\})' src/validators/security-patterns.ts
```

### Session History
- **July 16 AM**: Fixed Windows CLI tests, created follow-up issues
- **July 16 PM**: Investigated Dependabot PRs, solved Zod v4 compatibility
- **July 17 AM**: Implemented TDD security tests (PRs #38-40, #42), fixed ReDoS vulnerability
- **July 17 PM**: Completed PRs #43, #45, #48 - 173 security tests passing!

### Next Session Focus
1. PR #8 - Performance optimization (last security PR)
2. Issue #32 - Fix library content validation issues
3. Issue #34 - Create proper CLI validation tool
4. Address Dependabot PRs (#1, #2, #5) when time permits

### 🚨 CRITICAL DEBUGGING COMMANDS FOR PR #50
```bash
# Check exact CI failure
gh run list --workflow "Build & Test" --limit 5
gh run view [latest-run-id] --log-failed

# Type safety checks
npm run lint
npm run typecheck  # if available
CI=true npm run test:all

# Check for circular dependencies
npx madge --circular src/

# Verify build output
npm run build
```

### Important Reminders
- **TYPE SAFETY CRITICAL**: No `any` types - use proper interfaces (CI fails on this)
- **PR Review**: Push code + description together for visibility
- **ReDoS Prevention**: Avoid unbounded repetition in regex patterns
- **Test Categories**: Use consistent category names (e.g., 'jailbreak' not 'jailbreaking')
- **Performance**: Keep pattern matching under 0.1ms average
- **Security Testing Safety**: Use placeholders first - real patterns can trigger exits!
- **Pattern Conflicts**: Check for overlapping patterns (e.g., exec in multiple patterns)
- **Schema Validation**: Placeholders must match `^[A-Z_]+$` (no numbers!)
- **CI vs Local**: Tests may pass locally but fail in CI - check environment differences