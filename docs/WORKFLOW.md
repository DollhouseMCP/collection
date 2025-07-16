# DollhouseMCP Collection Development Workflow

## Overview

The DollhouseMCP Collection follows a pull request (PR) based workflow to ensure code quality, maintain history, and enable collaborative review. All changes, regardless of author, must go through the PR process.

## Workflow Steps

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# For features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description

# For documentation
git checkout -b docs/what-you-are-documenting

# For configuration/setup
git checkout -b setup/what-you-are-setting-up

# Important: Always branch from main unless otherwise specified
git checkout main
git pull origin main
git checkout -b your-branch-name
```

### 2. Make Your Changes

- Write code/content following our guidelines
- Test locally using available tools
- Commit with meaningful messages

### 3. Push Your Branch

```bash
git push -u origin your-branch-name
```

### 4. Create a Pull Request

```bash
# Using GitHub CLI (recommended)
gh pr create --title "Your PR title" --body "Description"

# Or visit the URL provided after pushing
```

## Branch Naming Conventions

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New features | `feature/add-validation-rule` |
| `fix/` | Bug fixes | `fix/security-scan-error` |
| `docs/` | Documentation | `docs/api-reference` |
| `content/` | New content | `content/productivity-agent` |
| `setup/` | Configuration | `setup/ci-improvements` |
| `refactor/` | Code refactoring | `refactor/validation-system` |
| `test/` | Test additions | `test/security-patterns` |

## Commit Message Format

Follow the Conventional Commits specification:

```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `content`: New content additions

Example:
```
feat: add support for ensemble validation

- Add new validation rules for ensemble components
- Update schema to include component references
- Add tests for ensemble validation

Closes #123
```

## Pull Request Process

### 1. PR Creation

Your PR should include:
- Clear title following commit message format
- Description of changes
- Related issue numbers
- Testing performed
- Screenshots (if UI changes)

### 2. Automated Checks

Once created, your PR will automatically:
- Run security scans
- Validate any content
- Run tests
- Get added to the DollhouseMCP project roadmap
- Receive a Claude AI review (if configured)

### 3. Review Process

- Wait for all automated checks to pass
- Address any feedback from automated tools
- Request review from maintainers if needed
- Make requested changes
- Maintain a clean commit history

### 4. Merging

Once approved and all checks pass:
- PRs are typically squash-merged to maintain clean history
- The PR author or maintainer can merge
- Branch is automatically deleted after merge

## Project Integration

All issues and PRs are automatically added to the [DollhouseMCP Roadmap](https://github.com/orgs/DollhouseMCP/projects/1) project for unified tracking across all repositories.

### Issue Creation

Use our issue templates:
1. **Content Submission** - For submitting new content
2. **Bug Report** - For reporting bugs
3. **Feature Request** - For suggesting features

All issues will be:
- Added to the organization project
- Labeled with `collection-repo`
- Assigned appropriate priority

### Labels

Common labels used across DollhouseMCP:
- `priority: critical/high/medium/low`
- `type: feature/bug/enhancement`
- `area: content/validation/security/docs`
- `collection-repo` (automatically added)

## Working with Dependabot

Dependabot automatically creates PRs for:
- npm dependency updates
- GitHub Actions updates

To handle Dependabot PRs:
1. Review the changelog
2. Check for breaking changes
3. Ensure CI passes
4. Merge if safe

## Content Contribution Workflow

### 1. Create Content Locally

Follow the templates in `/docs/DEVELOPER_GUIDE.md`

### 2. Validate Content

```bash
npm run validate:content your-content.md
```

### 3. Submit via PR

1. Create branch: `git checkout -b content/your-content-name`
2. Add your content file
3. Commit: `git commit -m "content: add [type] - [name]"`
4. Push and create PR

### 4. Address Feedback

- Security validation results
- Quality checks
- Reviewer suggestions

## CI/CD Integration

Our CI/CD pipeline includes:

1. **On Every PR**:
   - Security scanning
   - Content validation
   - Code quality checks
   - Automated tests

2. **On Merge to Main**:
   - All PR checks
   - Documentation building
   - Release preparation (if tagged)

## Tips for Success

1. **Keep PRs Small**: Easier to review and less likely to have conflicts
2. **Test Locally**: Run validation before pushing
3. **Update Documentation**: If your change affects usage
4. **Link Issues**: Use "Fixes #123" in PR descriptions
5. **Responsive to Feedback**: Address reviews promptly

## Getting Help

- Check existing PRs for examples
- Ask in PR comments if unsure
- Review failed check logs
- Create a discussion for broader questions

## Future Enhancements

We're planning to add:
- **Automated changelog generation** (Q3 2025) - *help wanted*
- **Release automation** (Q3 2025)
- **Performance benchmarks in CI** (Q4 2025) - *help wanted*
- **Visual regression testing for docs** (Q4 2025)

**Want to help?** Look for issues labeled `help wanted` or propose your own enhancements via PR!

---

Remember: The PR process helps maintain quality and creates a record of all changes. It's not bureaucracy - it's collaboration! 🤝