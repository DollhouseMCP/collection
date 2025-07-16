# Security Policy

## Security-First Repository Design

This repository prioritizes security at every level of development and deployment. Our approach ensures that all contributions meet strict security standards before being merged.

## Branch Protection Requirements

### Required Security Files

The following files are **mandatory** and cannot be made optional:

#### `.github/workflows/security-scan.yml`
- **Purpose**: Automated security scanning for all PRs
- **Requirement**: Essential for branch protection
- **Impact**: Prevents malicious code from entering the repository
- **Documentation**: [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)

#### `.github/dependabot.yml`
- **Purpose**: Automated dependency vulnerability monitoring
- **Requirement**: Critical for supply chain security
- **Impact**: Ensures timely security updates
- **Documentation**: [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)

### Why We Don't Make Security Files Optional

**Public Repository Considerations:**
- Open source projects require consistent security standards
- Contributors may not understand security implications
- Branch protection relies on consistent CI/CD validation

**Security-First Approach:**
- Every PR must pass comprehensive security validation
- No exceptions for missing security infrastructure
- Better to fail fast than allow security gaps

**Compliance Requirements:**
- Automated scanning prevents human oversight errors
- Audit trails for all security validations
- Consistent enforcement across all contributions

## Development Security Standards

### Code Quality Requirements

#### TypeScript Type Safety
- `@typescript-eslint/no-explicit-any` set to `error` (not `warn`)
- All types must be explicitly defined
- No `any` types allowed in production code

#### ESLint Security Rules (Enforced)
- `no-eval`: Prevents code injection attacks
- `no-implied-eval`: Blocks setTimeout/setInterval string execution
- `no-new-func`: Disallows Function constructor
- `no-script-url`: Prevents javascript: URL usage
- `no-with`: Eliminates scope manipulation attacks

#### Package.json Security Validation
- Detection of dangerous npm scripts (`postinstall`, `preinstall`)
- Pattern matching for suspicious commands (`curl|sh`, `wget|sh`)
- Validation of security-related metadata fields

### Enhanced Security Validation

Our security-check script performs comprehensive validation:

1. **File Existence Validation**
   - Required security configuration files
   - Helpful error messages with setup guidance
   - Clear explanation of security requirements

2. **Dependency Security**
   - High/critical vulnerability detection
   - Automated security update verification
   - Supply chain integrity checks

3. **Content Security**
   - Pattern matching for malicious content
   - Input validation for all user-supplied data
   - Safe file operation practices

4. **Configuration Security**
   - Package.json script analysis
   - Environment variable validation
   - Secure default configurations

## CI/CD Security Pipeline

### Automated Checks (All Required)

1. **Build & Test** - All platforms (Ubuntu, Windows, macOS)
2. **Security Scan** - CodeQL analysis and content validation
3. **Dependency Audit** - Vulnerability assessment
4. **Code Quality** - ESLint with security rules
5. **Type Safety** - Strict TypeScript compilation

### Manual Security Review

For community contributions:
- Human review required for persona/skill submissions
- Security team approval for workflow changes
- Maintainer oversight for sensitive modifications

## Incident Response

### Security Issue Reporting
- Use GitHub Security Advisories for vulnerabilities
- Email security@dollhousemcp.org for urgent issues
- Follow responsible disclosure practices

### Response Timeline
- **Critical**: 24 hours
- **High**: 72 hours  
- **Medium**: 1 week
- **Low**: Next release cycle

## Compliance and Auditing

### Audit Requirements
- All security validations logged
- Failed checks recorded and analyzed
- Regular security posture assessments
- Compliance reporting for enterprise users

### Continuous Improvement
- Regular security rule updates
- Community feedback integration
- Industry best practice adoption
- Threat model evolution

---

**Remember**: Security is everyone's responsibility. When in doubt, err on the side of caution and ask for security team review.