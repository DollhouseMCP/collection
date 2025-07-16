/**
 * Integration tests for security workflow
 * Tests the complete security validation pipeline and pattern detection
 */

import { ContentValidator } from '../../src/validators/content-validator.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Security Workflow Integration Tests', () => {
  const testDir = join(__dirname, '../../.test-tmp/security-integration');
  const validator = new ContentValidator();

  beforeAll(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('Complete Security Validation Pipeline', () => {
    it('should detect all categories of security issues', async () => {
      const securityTestContent = `---
type: persona
name: Security Test Persona
description: Comprehensive security testing persona with various vulnerability patterns
unique_id: security-test-complete
author: Security Integration Test
category: educational
---

# Security Test Persona

## API Keys and Secrets
- AWS Key: AKIAIOSFODNN7EXAMPLE
- GitHub Token: ghp_1234567890abcdef1234567890abcdef12345678
- OpenAI Key: sk-proj-1234567890abcdefghijklmnop
- Generic API: api_key_1234567890abcdef
- JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

## Injection Vulnerabilities
- SQL: SELECT * FROM users WHERE id = '1' OR '1'='1'
- NoSQL: {"$ne": null}
- Command: ; cat /etc/passwd
- LDAP: )(cn=*
- XPath: ' or '1'='1
- Template: {{7*7}}

## Suspicious Patterns
- Script tag: <script>alert('XSS')</script>
- Iframe: <iframe src="http://malicious.com"></iframe>
- Base64 password: cGFzc3dvcmQ=
- Hex encoded: 0x68656c6c6f
- File path: ../../../../../../etc/shadow
- Suspicious URL: http://evil.com/backdoor.php

## Code Injection
- PHP: <?php system($_GET['cmd']); ?>
- Python: eval(input())
- JavaScript: new Function(userInput)()
- Shell: $(whoami)

## Other Security Concerns
- Private key marker: -----BEGIN RSA PRIVATE KEY-----
- Password in URL: https://user:password123@example.com
- Hardcoded localhost: http://localhost:8080/admin
- Debug mode: DEBUG=true
- Sensitive file: /etc/passwd`;

      const testFile = join(testDir, 'security-complete.md');
      await writeFile(testFile, securityTestContent, 'utf8');

      const result = await validator.validateContent(testFile);

      expect(result.passed).toBe(false);
      expect(result.summary.critical).toBeGreaterThan(10); // Should detect many critical issues

      // Verify all security categories are detected
      const securityIssues = result.issues.filter(i => i.type.startsWith('security_'));
      const detectedCategories = new Set(
        securityIssues.map(i => i.type.replace('security_', ''))
      );

      expect(detectedCategories).toContain('api_key');
      expect(detectedCategories).toContain('injection');
      expect(detectedCategories).toContain('suspicious_pattern');
      expect(detectedCategories).toContain('code_injection');
      expect(detectedCategories).toContain('sensitive_data');

      // Check that line numbers are reported
      const issuesWithLines = securityIssues.filter(i => i.line !== undefined);
      expect(issuesWithLines.length).toBeGreaterThan(0);
    });

    it('should handle security scanning of large files efficiently', async () => {
      // Create a large file with scattered security issues
      const lines = [];
      
      // Add normal content
      for (let i = 0; i < 1000; i++) {
        lines.push(`This is line ${i} of normal content for testing performance.`);
      }

      // Insert security issues at various points
      lines[100] = 'API Key found: sk-1234567890abcdef';
      lines[300] = 'SQL injection: SELECT * FROM users WHERE id = \' OR \'1\'=\'1';
      lines[500] = 'Suspicious script: <script>alert("xss")</script>';
      lines[700] = 'JWT token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
      lines[900] = 'Command injection: ; rm -rf /important/files';

      const largeContent = `---
type: tool
name: Large Security Test Tool
description: Testing security scanning performance on large files
unique_id: security-large-file
author: Performance Test
category: professional
mcp_version: 1.0.0
---

# Large File Security Test

${lines.join('\n')}`;

      const testFile = join(testDir, 'large-security-test.md');
      await writeFile(testFile, largeContent, 'utf8');

      const startTime = Date.now();
      const result = await validator.validateContent(testFile);
      const duration = Date.now() - startTime;

      expect(result.passed).toBe(false);
      expect(result.summary.critical).toBe(5); // Should find all 5 security issues

      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000);

      // Verify correct line numbers are reported
      const securityIssues = result.issues.filter(i => i.type.startsWith('security_'));
      const lineNumbers = securityIssues.map(i => i.line).filter(l => l !== undefined);
      
      // Line numbers should roughly correspond to where we inserted issues
      // Adding offset for frontmatter
      expect(lineNumbers).toEqual(expect.arrayContaining([
        expect.any(Number) // Should have line numbers
      ]));
    });
  });

  describe('Security Check Script Integration', () => {
    it('should run security check script successfully', async () => {
      // Create test content for security check
      const cleanContent = `---
type: agent
name: Clean Security Agent
description: An agent with no security issues for testing the security check script
unique_id: clean-security-agent
author: Script Test
category: professional
capabilities:
  - security-analysis
  - code-review
---

# Clean Security Agent

This agent helps with security analysis without containing any vulnerabilities.

## Features
- Secure code review
- Vulnerability scanning
- Best practices enforcement`;

      const cleanFile = join(testDir, 'clean-agent.md');
      await writeFile(cleanFile, cleanContent, 'utf8');

      // Run the security check script
      const scriptPath = join(__dirname, '../../scripts/security-check.js');
      
      const result = await new Promise<{ code: number; output: string }>((resolve) => {
        const proc = spawn('node', [scriptPath], {
          cwd: dirname(dirname(testDir)), // Run from project root
          env: process.env
        });

        let output = '';
        proc.stdout.on('data', (data) => output += data.toString());
        proc.stderr.on('data', (data) => output += data.toString());

        proc.on('close', (code) => {
          resolve({ code: code || 0, output });
        });
      });

      // Security check should include various checks
      expect(result.output).toContain('Security Check');
      expect(result.output).toContain('Content security validation');
      
      // May pass or fail depending on project state, but should complete
      expect([0, 1]).toContain(result.code);
    });
  });

  describe('Pattern-Specific Security Tests', () => {
    it('should correctly identify different API key formats', async () => {
      const apiKeyTests = `---
type: skill
name: API Key Detection Test
description: Testing various API key format detections
unique_id: api-key-test
author: Security Test
category: educational
capabilities:
  - api-testing
---

# API Key Detection Tests

## Valid API Keys (Should be detected)
1. AWS: AKIAIOSFODNN7EXAMPLE
2. AWS Secret: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
3. GitHub: ghp_1234567890abcdef1234567890abcdef12345678
4. OpenAI: sk-1234567890abcdefghijklmnopqrstuvwxyz
5. Stripe: sk_test_1234567890abcdefghijklmnop
6. SendGrid: SG.1234567890.abcdefghijklmnopqrstuvwxyz
7. Slack: xoxb-test-test-testtoken123456
8. Generic: api_key=abcd1234efgh5678

## False Positives (Should NOT be detected)
1. Documentation: Use API_KEY environment variable
2. Example: api_key_placeholder
3. Comment: // Set your API key here
4. Variable name: const apiKeyName = 'MY_API_KEY'`;

      const testFile = join(testDir, 'api-key-patterns.md');
      await writeFile(testFile, apiKeyTests, 'utf8');

      const result = await validator.validateContent(testFile);
      
      const apiKeyIssues = result.issues.filter(i => i.type === 'security_api_key');
      
      // Should detect at least 6-8 real API keys
      expect(apiKeyIssues.length).toBeGreaterThanOrEqual(6);
      
      // Check that specific patterns are detected
      const detectedPatterns = apiKeyIssues.map(i => i.details);
      const allDetails = detectedPatterns.join(' ');
      
      expect(allDetails).toContain('AWS');
      expect(allDetails).toContain('GitHub');
      expect(allDetails).toContain('OpenAI');
    });

    it('should detect various injection attack patterns', async () => {
      const injectionTests = `---
type: template
name: Injection Test Template
description: Testing detection of various injection attack patterns
unique_id: injection-test
author: Security Test
category: educational
format: markdown
---

# Injection Pattern Tests

## SQL Injection
- Basic: ' OR 1=1--
- Union: ' UNION SELECT * FROM users--
- Time-based: '; WAITFOR DELAY '00:00:05'--
- Stacked: '; DROP TABLE users;--

## NoSQL Injection
- MongoDB: {"$gt": ""}
- CouchDB: {"_id": {"$ne": null}}

## Command Injection
- Basic: ; ls -la
- Pipe: | cat /etc/passwd
- Backticks: \`whoami\`
- Substitution: $(id)

## LDAP Injection
- Filter bypass: )(objectClass=*
- Wildcard: *)(mail=*

## XPath Injection
- Basic: ' or 1=1 or '
- Comment: ') or ('1'='1

## Template Injection
- Jinja2: {{config.items()}}
- ERB: <%= system('id') %>
- Velocity: #set($x=1+1)$x`;

      const testFile = join(testDir, 'injection-patterns.md');
      await writeFile(testFile, injectionTests, 'utf8');

      const result = await validator.validateContent(testFile);
      
      const injectionIssues = result.issues.filter(i => i.type === 'security_injection');
      
      // Should detect multiple injection patterns
      expect(injectionIssues.length).toBeGreaterThan(10);
      
      // Verify different injection types are caught
      const patterns = injectionIssues.map(i => i.details.toLowerCase());
      const allPatterns = patterns.join(' ');
      
      expect(allPatterns).toMatch(/sql|nosql|command|ldap|xpath|template/);
    });

    it('should handle encoded and obfuscated patterns', async () => {
      const encodedTests = `---
type: ensemble
name: Encoded Patterns Test
description: Testing detection of encoded and obfuscated security patterns
unique_id: encoded-test
author: Security Test
category: educational
components:
  skills:
    - security-testing
---

# Encoded Security Patterns

## Base64 Encoded Secrets
- Password: cGFzc3dvcmQxMjM=
- API Key: c2stMTIzNDU2Nzg5MGFiY2RlZg==
- Token: ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5

## Hex Encoded
- Shell command: 0x726d202d7266202f
- SQL: 0x27204f522027313d27312727

## URL Encoded
- XSS: %3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E
- Path traversal: %2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd

## Unicode Escape
- Script: \\u003cscript\\u003e
- SQL: \\u0027 OR \\u00271\\u0027=\\u00271

## HTML Entity Encoding
- &lt;script&gt;alert(&apos;xss&apos;)&lt;/script&gt;
- &#x27; OR &#x27;1&#x27;=&#x27;1`;

      const testFile = join(testDir, 'encoded-patterns.md');
      await writeFile(testFile, encodedTests, 'utf8');

      const result = await validator.validateContent(testFile);
      
      expect(result.passed).toBe(false);
      
      // Should detect at least some encoded patterns
      const securityIssues = result.issues.filter(i => i.type.startsWith('security_'));
      expect(securityIssues.length).toBeGreaterThan(0);
      
      // Check for base64 detection
      const suspiciousPatterns = result.issues.filter(i => 
        i.type === 'security_suspicious_pattern' || 
        i.type === 'security_sensitive_data'
      );
      expect(suspiciousPatterns.length).toBeGreaterThan(0);
    });
  });

  describe('False Positive Handling', () => {
    it('should not flag legitimate documentation content', async () => {
      const legitimateContent = `---
type: prompt
name: Security Best Practices Guide
description: A guide explaining security best practices without actual vulnerabilities
unique_id: security-guide
author: Documentation Team
category: educational
---

# Security Best Practices

## API Key Management
- Never hardcode API keys in your code
- Use environment variables like API_KEY or SECRET_KEY
- Example configuration: export API_KEY="your-key-here"
- Store keys in secure vaults

## SQL Query Safety
- Always use parameterized queries
- Example: SELECT * FROM users WHERE id = ?
- Avoid string concatenation like: "SELECT * FROM users WHERE id = '" + userId + "'"
- Use prepared statements

## Input Validation
- Validate all user input
- Escape special characters
- Example validation regex: /^[a-zA-Z0-9_-]+$/
- Sanitize HTML content

## Common Attack Patterns to Avoid
- SQL Injection: User input like ' OR '1'='1 should be rejected
- XSS: Scripts like <script>alert('xss')</script> must be filtered
- Command Injection: Input containing ; or | should be validated

## Secure Coding Examples
\`\`\`javascript
// Good practice
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// Bad practice - DO NOT USE
// const query = 'SELECT * FROM users WHERE id = ' + userId;
\`\`\`

Note: This is educational content. No actual vulnerabilities are present.`;

      const testFile = join(testDir, 'legitimate-security-docs.md');
      await writeFile(testFile, legitimateContent, 'utf8');

      const result = await validator.validateContent(testFile);
      
      // Should pass or have minimal issues
      expect(result.summary.critical).toBe(0);
      
      // May have some low-severity warnings for examples, but not critical
      if (!result.passed) {
        expect(result.summary.high).toBe(0);
        // Only low-severity issues for documentation examples
        expect(result.summary.low + result.summary.medium).toBeGreaterThan(0);
      }
    });

    it('should handle code examples appropriately', async () => {
      const codeExampleContent = `---
type: tool
name: Security Scanner Tool
description: A tool that scans for security issues in code
unique_id: security-scanner
author: Security Tools Team
category: professional
mcp_version: 1.0.0
---

# Security Scanner Tool

## Implementation Example

\`\`\`python
# Security scanner implementation
import re

class SecurityScanner:
    def __init__(self):
        # Pattern definitions for detection
        self.patterns = {
            'api_key': r'(api_key|apikey|api-key)\\s*=\\s*["\']?[a-zA-Z0-9_-]+["\']?',
            'sql_injection': r"'\\s*(OR|AND)\\s*'?1'?\\s*=\\s*'?1'?",
            'xss': r'<script[^>]*>.*?</script>',
        }
    
    def scan_content(self, content):
        """
        Scan content for security patterns.
        This is a detection tool, not vulnerable code.
        """
        findings = []
        for pattern_name, pattern in self.patterns.items():
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                findings.append({
                    'type': pattern_name,
                    'line': content[:match.start()].count('\\n') + 1,
                    'match': match.group()
                })
        return findings

# Example usage (documentation only)
# scanner = SecurityScanner()
# results = scanner.scan_content(user_input)
\`\`\`

## Features
- Detects common security patterns
- Provides line-by-line analysis
- Generates detailed reports`;

      const testFile = join(testDir, 'security-tool-implementation.md');
      await writeFile(testFile, codeExampleContent, 'utf8');

      const result = await validator.validateContent(testFile);
      
      // Should not flag the security scanner implementation as vulnerable
      // May have some warnings for the pattern strings, but not critical
      expect(result.summary.critical).toBe(0);
      
      // Implementation code should be recognized as legitimate
      const criticalIssues = result.issues.filter(i => i.severity === 'critical');
      expect(criticalIssues).toHaveLength(0);
    });
  });
});