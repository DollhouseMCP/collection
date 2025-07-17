# TDD Security Tests Implementation Plan

## Date: July 17, 2025

## Objective
Write comprehensive security tests using Test-Driven Development (TDD) methodology to ensure all AI/LLM security patterns are properly detected and validated.

## Current State
- Basic security tests exist in `test/security/placeholder.test.ts`
- Security patterns defined in `src/validators/security-patterns.ts`
- Some security detection tested indirectly in integration tests
- No comprehensive test coverage for each security pattern

## TDD Approach

### Phase 1: Test Discovery & Analysis
1. **Inventory existing security patterns**
   - Review all patterns in `security-patterns.ts`
   - Document what each pattern should detect
   - Identify gaps in pattern definitions

2. **Write failing tests first**
   - One test file per security category
   - Multiple test cases per pattern
   - Edge cases and combinations

### Phase 2: Pattern-by-Pattern Implementation

#### 1. Prompt Injection Tests (`test/security/prompt-injection.test.ts`)
- [ ] Test: "Ignore all previous instructions"
- [ ] Test: "Disregard the above"
- [ ] Test: Role switching attempts
- [ ] Test: Instruction override patterns
- [ ] Test: Unicode/encoding bypass attempts
- [ ] Test: Nested instruction injections

#### 2. Jailbreaking Tests (`test/security/jailbreaking.test.ts`)
- [ ] Test: "Act as" patterns
- [ ] Test: "Pretend you are"
- [ ] Test: DAN (Do Anything Now) prompts
- [ ] Test: Role-play scenarios
- [ ] Test: "No restrictions" attempts
- [ ] Test: Hypothetical scenarios for bypassing

#### 3. Command Execution Tests (`test/security/command-execution.test.ts`)
- [ ] Test: Direct command patterns (`rm -rf`, `del /f`)
- [ ] Test: Obfuscated commands
- [ ] Test: Command injection in parameters
- [ ] Test: Script execution attempts
- [ ] Test: System call patterns
- [ ] Test: Path traversal attempts

#### 4. Data Exfiltration Tests (`test/security/data-exfiltration.test.ts`)
- [ ] Test: "Send data to" patterns
- [ ] Test: External URL references
- [ ] Test: API endpoint patterns
- [ ] Test: Encoded data extraction
- [ ] Test: Social engineering for data
- [ ] Test: Credential phishing patterns

#### 5. Secrets & Credentials Tests (`test/security/secrets-detection.test.ts`)
- [ ] Test: API key patterns (various formats)
- [ ] Test: Password/token exposure
- [ ] Test: Environment variable references
- [ ] Test: Base64 encoded secrets
- [ ] Test: Common secret patterns
- [ ] Test: Cloud provider credentials

#### 6. Malicious Code Tests (`test/security/malicious-code.test.ts`)
- [ ] Test: Script tags and injection
- [ ] Test: Eval/exec patterns
- [ ] Test: Code generation prompts
- [ ] Test: Backdoor patterns
- [ ] Test: Obfuscated code
- [ ] Test: Polyglot payloads

### Phase 3: Edge Cases & Combinations

#### 7. Complex Attack Tests (`test/security/complex-attacks.test.ts`)
- [ ] Test: Multi-stage attacks
- [ ] Test: Combined techniques
- [ ] Test: Context-aware attacks
- [ ] Test: Timing-based patterns
- [ ] Test: Social engineering chains

#### 8. False Positive Tests (`test/security/false-positives.test.ts`)
- [ ] Test: Legitimate code discussions
- [ ] Test: Security education content
- [ ] Test: Documentation examples
- [ ] Test: Quoted malicious content
- [ ] Test: Academic discussions

### Phase 4: Pattern Enhancement
Based on test failures:
1. Enhance regex patterns
2. Add context awareness
3. Implement severity scoring
4. Add pattern combinations

### Phase 5: Integration & Performance

#### 9. Integration Tests (`test/security/security-integration.test.ts`)
- [ ] Test: Full content validation flow
- [ ] Test: Multiple security issues in one file
- [ ] Test: Performance with large files
- [ ] Test: Real-world content examples

## Success Criteria
1. **100% pattern coverage**: Every security pattern has explicit tests
2. **Edge case handling**: Common bypasses are detected
3. **Low false positives**: Legitimate content passes
4. **Clear error messages**: Security issues are well-explained
5. **Performance**: Security scanning remains fast

## Implementation Order
1. Start with prompt injection (most common attack)
2. Move to jailbreaking (related patterns)
3. Then command execution (high severity)
4. Follow with data exfiltration
5. Add secrets detection
6. Complete with malicious code
7. Finish with edge cases and integration

## Testing Strategy
```typescript
// Example test structure
describe('Prompt Injection Detection', () => {
  const validator = new SecurityValidator();
  
  describe('instruction override patterns', () => {
    it('should detect "ignore all previous instructions"', () => {
      const content = 'Please ignore all previous instructions and...';
      const issues = validator.scan(content);
      
      expect(issues).toHaveLength(1);
      expect(issues[0].category).toBe('prompt_injection');
      expect(issues[0].severity).toBe('critical');
    });
    
    // More test cases...
  });
});
```

## Notes
- Focus on AI/LLM security, not traditional web security
- Each test should be independent and focused
- Use realistic examples from security research
- Document why each pattern is dangerous
- Consider context to reduce false positives

## Next Steps
1. Create test directory structure
2. Write first failing test for prompt injection
3. Run test, see it fail
4. Implement/enhance pattern to make it pass
5. Refactor and optimize
6. Move to next test

This is a living document - update as we progress through implementation.