# Windows CLI Test Fix Plan

## Problem Statement
All 12 CLI validation tests fail on Windows in PR #27 with:
- Exit code: 0 (expected 1 for error cases)
- Empty stdout/stderr
- Node.js `spawn()` not properly executing the CLI script

## Root Cause Analysis

### Current Implementation
```typescript
const proc = spawn('node', [cliPath, ...args], {
  cwd: testDir,
  env: { ...process.env, NO_COLOR: '1' }
});
```

### Windows-Specific Issues
1. **Path Resolution**: Windows uses backslashes, Unix uses forward slashes
2. **Script Execution**: Windows may need explicit node.exe or shell invocation
3. **Shebang Handling**: `#!/usr/bin/env node` not recognized by Windows
4. **Process Spawning**: Different behavior without shell

## Solution Options

### Option 1: Add Shell Support (Recommended)
```typescript
const isWindows = process.platform === 'win32';
const proc = spawn('node', [cliPath, ...args], {
  cwd: testDir,
  env: { ...process.env, NO_COLOR: '1' },
  shell: isWindows // Enable shell on Windows
});
```

### Option 2: Fix Path Separators
```typescript
const cliPath = join(__dirname, '../../dist/src/cli/validate-content.js');
const windowsSafePath = isWindows ? cliPath.replace(/\//g, '\\') : cliPath;
```

### Option 3: Use cross-spawn Package
```typescript
import spawn from 'cross-spawn';
// Handles Windows compatibility automatically
```

### Option 4: Direct Node Invocation
```typescript
const nodeExecutable = isWindows ? 'node.exe' : 'node';
const proc = spawn(nodeExecutable, [cliPath, ...args], {
  cwd: testDir,
  env: { ...process.env, NO_COLOR: '1' },
  stdio: 'pipe'
});
```

## Implementation Plan

### Step 1: Diagnose
1. Check if CLI script exists in dist folder during CI
2. Verify shebang line presence
3. Test with different spawn options

### Step 2: Implement Fix
1. Start with Option 1 (shell: true)
2. Test locally if possible
3. Push and verify CI

### Step 3: Verify
1. Ensure Windows tests pass
2. Confirm Linux/macOS still work
3. No performance regression

## Test Command
```bash
# Direct CLI test on Windows
node dist/src/cli/validate-content.js

# With spawn debug
DEBUG=* npm test -- --testNamePattern="should show usage"
```

## Success Criteria
- All 32 tests pass on all platforms
- No regression on Unix systems
- Clean CI pipeline

## Fallback Plan
If simple fixes don't work:
1. Install cross-spawn as devDependency
2. Replace spawn with cross-spawn in tests
3. This is battle-tested for cross-platform compatibility