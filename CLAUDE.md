# Claude Context Notes - DollhouseMCP Collection Repository

## Current Status: Post-PR #27, Handling Dependabot Updates

### Recent Accomplishments (July 16, 2025)
- ✅ **PR #27 Merged**: Comprehensive integration test suite (32 tests)
- ✅ **Windows CI Fixed**: Refactored CLI tests to use direct imports instead of spawn
- ✅ **Claude Review Issues Created**: Issues #28-31 for test improvements
- ✅ **High Priority Issues Created**: Issues #32-34 for main tasks

### Active Work: Dependabot PRs

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

### High Priority Tasks (GitHub Issues)
1. **Issue #32**: Fix library content validation issues (5 files)
2. **Issue #33**: Write comprehensive security tests for all patterns
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
```

### Session History
- **July 16 AM**: Fixed Windows CLI tests, created follow-up issues
- **July 16 PM**: Investigated Dependabot PRs, solved Zod v4 compatibility

### Next Session Focus
1. Apply Zod fix and merge PR #5
2. Review and merge PRs #1 and #2 (simple action updates)
3. Start on Issue #32 (library content fixes)

### Important Reminders
- PR #35 is our test PR - close it after handling Dependabot PRs
- CI doesn't run on Dependabot branches (security feature)
- All tests pass locally with our Zod v4 fix
- The one-line fix maintains full backward compatibility