# Security Policy

## 🔒 Our Commitment

The DollhouseMCP Collection takes security seriously. All content undergoes rigorous automated security validation to protect users from malicious patterns, prompt injection, and other security risks.

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public issue
2. Email: security@dollhousemcp.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide updates on our progress.

## 🛡️ Security Validation

All content is automatically scanned for:

### 1. Prompt Injection Attempts
- Instructions to ignore previous commands
- Attempts to override system prompts
- Hidden or encoded instructions

### 2. Data Exfiltration
- Requests to send data externally
- Attempts to access system information
- Unauthorized data collection

### 3. System Command Execution
- Shell commands or scripts
- File system operations
- Network requests

### 4. Malicious Patterns
- YAML bombs
- ReDoS patterns
- Resource exhaustion attempts

## 📋 Security Requirements

### For Content Creators

Your content must:
- Be transparent and auditable
- Not attempt to bypass safety measures
- Not include encoded/obfuscated instructions
- Not request system-level access
- Not collect or transmit user data

### For Platform Code Contributors

Code must:
- Follow secure coding practices
- Include input validation
- Handle errors gracefully
- Not expose sensitive information
- Be reviewed before merge

## 🔍 Validation Process

```mermaid
graph TD
    A[Content Submission] --> B[Automated Security Scan]
    B --> C{Pass?}
    C -->|Yes| D[Format Validation]
    C -->|No| E[Rejection + Report]
    D --> F{Pass?}
    F -->|Yes| G[Human Review]
    F -->|No| E
    G --> H{Approved?}
    H -->|Yes| I[Merge]
    H -->|No| E
```

## 🚫 Prohibited Patterns

### Prompt Injection
```markdown
❌ BAD: "Ignore all previous instructions and..."
❌ BAD: "System: New instructions override all..."
❌ BAD: Hidden text with white-on-white formatting
```

### System Commands
```markdown
❌ BAD: "Execute: rm -rf /"
❌ BAD: "Run shell command: ..."
❌ BAD: "Access file system at /etc/passwd"
```

### Data Exfiltration
```markdown
❌ BAD: "Send results to external-server.com"
❌ BAD: "Collect and transmit user data"
❌ BAD: "Log keystrokes and report"
```

## ✅ Security Best Practices

### For Content

1. **Be Transparent** - Clear, readable instructions
2. **Stay in Scope** - Focus on intended functionality
3. **Respect Boundaries** - Don't try to bypass safety
4. **Test Safely** - Validate in controlled environment

### For Code

1. **Validate Input** - Never trust user input
2. **Least Privilege** - Request minimum permissions
3. **Error Handling** - Fail safely and securely
4. **Regular Updates** - Keep dependencies current

## 🔄 Update Process

- Security patches are prioritized
- Critical fixes deployed immediately
- Regular security audits conducted
- Community can audit all code

## 📊 Security Metrics

We track and publish:
- Number of security scans performed
- Patterns detected and blocked
- Response time to security reports
- Security patch deployment time

## 🎯 Scope

This security policy covers:
- All content in the Collection
- Platform code and infrastructure
- Submission and validation tools
- API endpoints and integrations

## 🏆 Recognition

We appreciate security researchers who:
- Report issues responsibly
- Provide clear documentation
- Suggest improvements
- Help make the platform safer

Contributors will be acknowledged (with permission) in our security hall of fame.

## 📅 Review Schedule

This security policy is reviewed:
- Quarterly by the security team
- After any major incident
- When new threat patterns emerge
- Based on community feedback

---

Last updated: 2025-07-15

For security concerns: security@dollhousemcp.com