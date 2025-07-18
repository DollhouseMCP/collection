# Security and Validation Strategy

*Last Updated: July 18, 2025*

## Overview

This document defines the comprehensive security scanning, validation, and naming strategies for the DollhouseMCP ecosystem to protect user privacy and maintain content integrity.

## 1. Secrets Scanning Strategy

### Two-Layer Protection
1. **Local scanning** (MCP Server) - Prevents secrets from leaving user's machine
2. **Cloud scanning** (GitHub Actions) - Final safety net before public exposure

### Severity Levels

#### REJECT (Critical) - Block Submission
These patterns indicate high-risk secrets that must never be published:

```typescript
// API Keys & Tokens
'api_key_generic': /[A-Za-z0-9_\-]{32,64}/  // Context-dependent
'stripe_secret': /sk_live_[A-Za-z0-9]{24,}/
'stripe_test': /sk_test_[A-Za-z0-9]{24,}/
'google_api': /AIza[0-9A-Za-z\-_]{35}/
'github_pat': /ghp_[A-Za-z0-9]{36}/
'github_oauth': /gho_[A-Za-z0-9]{36}/
'github_app': /ghs_[A-Za-z0-9]{36}/
'aws_access_key': /AKIA[0-9A-Z]{16}/
'aws_secret': /[A-Za-z0-9/+=]{40}/  // When near AWS context
'openai_key': /sk-[A-Za-z0-9]{48}/
'jwt_token': /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/

// Authentication
'basic_auth': /[A-Za-z0-9+/]{40,}=/  // Base64 encoded credentials
'bearer_token': /bearer\s+[A-Za-z0-9\-._~+/]+=*/i

// Private Keys
'rsa_private': /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/
'ssh_private': /-----BEGIN OPENSSH PRIVATE KEY-----/
'pgp_private': /-----BEGIN PGP PRIVATE KEY BLOCK-----/

// Database & Connection Strings
'connection_string': /(?:mongodb|postgresql|mysql|redis):\/\/[^:]+:[^@]+@/
'database_url': /DATABASE_URL\s*=\s*["']?[^"'\s]+/

// Financial Data
'credit_card_visa': /4[0-9]{12}(?:[0-9]{3})?/
'credit_card_mastercard': /5[1-5][0-9]{14}/
'credit_card_amex': /3[47][0-9]{13}/
'credit_card_discover': /6(?:011|5[0-9]{2})[0-9]{12}/
'bank_routing': /\b\d{9}\b/  // US routing numbers

// Government IDs
'ssn_dashed': /\b\d{3}-\d{2}-\d{4}\b/
'ssn_plain': /\b\d{9}\b/  // Context-dependent
'ein': /\b\d{2}-\d{7}\b/  // Employer ID
```

#### WARN (Medium) - Flag for Review
These patterns might be intentional but should prompt user confirmation:

```typescript
// Personal Information
'email': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
'phone_us': /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/
'phone_intl': /\+[0-9]{1,3}[-.\s]?[0-9]{1,14}/

// Network Information
'ipv4_private': /\b(?:10|172\.(?:1[6-9]|2[0-9]|3[0-1])|192\.168)\.[0-9]{1,3}\.[0-9]{1,3}\b/
'ipv4_public': /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/
'ipv6': /(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/
'mac_address': /(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}/

// URLs with Credentials
'url_with_password': /https?:\/\/[^:]+:[^@]+@/

// Potential Secrets (context-dependent)
'generic_secret': /(?:secret|password|passwd|pwd)\s*[:=]\s*["']?[^"'\s]+/i
'env_variable': /(?:export\s+)?[A-Z_]{2,}=["']?[^"'\s]+["']?/
```

#### INFO (Low) - Log but Allow
These patterns are logged for audit but don't block submission:

```typescript
'uuid': /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
'base64_long': /[A-Za-z0-9+/]{50,}={0,2}/  // Might be encoded data
'hex_string': /\b[0-9a-fA-F]{32,}\b/  // Could be hash or key
```

### Implementation

#### Local Validation (MCP Server)
```typescript
interface SecretScanResult {
  found: boolean;
  severity: 'critical' | 'warning' | 'info';
  findings: Array<{
    type: string;
    pattern: string;
    line: number;
    preview: string;  // Redacted preview
  }>;
}

async function scanForSecrets(content: string): Promise<SecretScanResult> {
  const lines = content.split('\n');
  const findings = [];
  
  for (const [severity, patterns] of Object.entries(SECRET_PATTERNS)) {
    for (const [name, pattern] of Object.entries(patterns)) {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          findings.push({
            type: name,
            severity,
            line: index + 1,
            preview: redactSecret(line, pattern)
          });
        }
      });
    }
  }
  
  return {
    found: findings.length > 0,
    severity: getHighestSeverity(findings),
    findings
  };
}
```

#### Cloud Validation (GitHub Actions)
- Runs same patterns with stricter enforcement
- Blocks PR merge on critical findings
- Posts detailed comment with remediation steps

## 2. Naming and Versioning Strategy

### Unique ID Format
```
{type}_{name}_{author}_{YYYYMMDD}-{HHMMSS}
```

**Examples**:
```
persona_creative-writer_johndoe_20250718-143025
skill_debugging-assistant_alice_20250719-091500
tool_task-prioritizer_anon_20250720-120000
```

**Components**:
- `type`: Content type (persona, skill, agent, prompt, template, tool, ensemble)
- `name`: Slugified content name
- `author`: Username or "anon"
- `datetime`: YYYYMMDD-HHMMSS format (filesystem safe)

### Deduplication Process

```yaml
# Submission attempt
submitted_id: persona_creative-writer_johndoe_20250718-143025

# Server-side validation:
1. Check if unique_id exists
2. If exists:
   a. Compare content hash (SHA-256)
   b. If identical: Reject as duplicate
   c. If different: Generate new timestamp
      new_id: persona_creative-writer_johndoe_20250719-153000

3. Store metadata:
   content_hash: "sha256:abc123..."
   server_timestamp: "2025-07-19T15:30:00Z"
   client_timestamp: "2025-07-18T14:30:25Z"
```

## 3. Additional Security Measures

### Bad Actor Detection

#### Known Bad IPs
```typescript
// Check against threat intelligence feeds
const BAD_IP_RANGES = [
  '185.220.100.0/24',  // TOR exit nodes
  '192.42.116.0/24',   // Known botnet
  // Updated from threat feeds
];

function checkIPReputation(ip: string): RiskLevel {
  // Check against:
  // - Known bad IP ranges
  // - GeoIP suspicious locations
  // - Recent abuse reports
}
```

#### Username Squatting Prevention
```typescript
const PROTECTED_USERNAMES = [
  'dollhousemcp',
  'anthropic',
  'openai',
  'admin',
  'system'
];

const HOMOGRAPH_MAP = {
  'o': ['0', 'о'],  // Latin o, zero, Cyrillic o
  'l': ['1', 'I', 'і'],  // Lowercase L, one, uppercase i, Cyrillic i
  'a': ['а', '@'],  // Latin a, Cyrillic a, at symbol
};

function detectHomographs(username: string): string[] {
  // Return list of similar protected usernames
}
```

### Content Security Policies

#### Malicious Patterns
Beyond secrets, scan for:
- Phishing URLs
- Malware distribution links
- Encoded payloads
- Script injection attempts
- NSFW content markers

#### Rate Limiting
- Max 10 submissions per hour per user
- Max 50 validations per hour per IP
- Exponential backoff on repeated failures

## 4. Progressive Implementation

### Phase 1: Core Security (Launch)
- Basic secrets scanning (API keys, credit cards)
- Simple deduplication
- Critical severity only

### Phase 2: Enhanced Detection (Next)
- Full pattern library
- Warning levels
- IP reputation checking

### Phase 3: Advanced Protection (Future)
- ML-based anomaly detection
- Behavioral analysis
- Cross-reference with breach databases

## 5. User Experience

### Clear Messaging
```
❌ BLOCKED: API key detected on line 23
   This appears to be a Stripe secret key (sk_live_...)
   Remove all sensitive data before submitting.

⚠️  WARNING: Email address detected on line 45
   user@example.com
   Personal information will be publicly visible.
   Continue anyway? [Yes/No]

ℹ️  INFO: UUID detected but allowed
   This appears to be a non-sensitive identifier.
```

### Remediation Guidance
- Provide specific line numbers
- Suggest safe alternatives
- Link to security best practices
- Offer scrambling tools for test data

## 6. Audit and Compliance

### Logging
- All security findings (anonymized)
- Submission attempts with risk scores
- Pattern effectiveness metrics

### Privacy
- Never log actual secrets found
- Redact sensitive parts in previews
- Delete scan results after 30 days

### Metrics
- False positive rate by pattern
- Secrets caught vs missed
- User remediation success rate

## 7. Future Enhancements

### AI-Powered Detection
- Context-aware scanning
- Natural language secrets ("my password is...")
- Semantic analysis for sensitive topics

### Integration Options
- Pre-commit hooks for developers
- IDE plugins with real-time scanning
- CI/CD integration beyond GitHub

### Community Protection
- Shared threat intelligence
- User-reported patterns
- Collaborative blocklists

This comprehensive approach ensures user privacy, prevents accidental exposure, and maintains the integrity of the DollhouseMCP Collection.