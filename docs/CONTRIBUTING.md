# Contributing to DollhouseMCP Collection

## Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm package manager

### Installation
```bash
npm install
```

### Code Quality

#### Pre-commit Hooks Setup (Recommended)

To ensure code quality and catch issues before committing, we recommend setting up pre-commit hooks:

1. **Install husky** (if not already installed):
```bash
npm install --save-dev husky
```

2. **Add pre-commit hook**:
```bash
npx husky add .husky/pre-commit "npm run lint && npm run test && npm run security:check"
```

3. **Add pre-push hook** (optional):
```bash
npx husky add .husky/pre-push "npm run build && npm run test:integration"
```

#### Manual Quality Checks

Before submitting a PR, run these commands locally:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm run test

# Security checks
npm run security:check

# Build verification
npm run build
```

### Code Standards

#### TypeScript
- Use strict type checking
- Avoid `any` types - use `unknown` for truly unknown types
- Prefer interfaces over types for object shapes
- Use proper error handling with typed catch blocks

#### ESLint Configuration
- All security rules are enforced (`no-eval`, `no-implied-eval`, etc.)
- TypeScript-specific rules are mandatory
- Use `const` over `let` where possible
- Prefer explicit return types for exported functions

#### Security Requirements
- No hardcoded secrets or credentials
- All external inputs must be validated
- Use secure file operations
- Follow principle of least privilege

### Testing

#### Unit Tests
```bash
npm run test:unit
```

#### Integration Tests
```bash
npm run test:integration
```

#### Security Tests
```bash
npm run test:security
```

### Content Validation

When adding new content (personas, skills, tools):

```bash
npm run validate:content path/to/your/content.md
```

### Branch Protection

This repository uses branch protection rules that require:
- All CI checks to pass
- Code review approval
- Up-to-date branches

The security-check script is part of the CI pipeline and ensures:
- All security configuration files are present
- No vulnerable dependencies
- Content passes security validation
- ESLint rules are satisfied

## Submission Guidelines

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following the code standards
4. **Run quality checks** locally
5. **Submit a pull request** with a clear description

## Questions?

- Check the [Security Guidelines](./SECURITY.md)
- Review the [Validation Documentation](./VALIDATION.md)
- Open an issue for questions or clarifications