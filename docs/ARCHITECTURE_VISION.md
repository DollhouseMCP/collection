# DollhouseMCP Architecture Vision

*Last Updated: July 18, 2025*

## Overview

The DollhouseMCP ecosystem consists of two complementary but distinctly separate components with clear responsibilities:

1. **DollhouseMCP Collection** - A cloud-only content repository
2. **DollhouseMCP Server** - A local/cloud MCP runtime for content interaction

## Core Architectural Principles

### 1. Cloud-Only Collection
The DollhouseMCP Collection lives entirely on GitHub. It contains no runtime code that users need to execute. All processing, validation, and automation happens through GitHub Actions in the cloud.

### 2. Local/Cloud MCP Server
The DollhouseMCP Server is the active component that users install and run. It handles all content creation, browsing, and integration with AI assistants like Claude.

### 3. Clean Separation of Concerns
- **Collection**: Static content + cloud validation
- **Server**: Runtime operations + content management

## Component Architecture

### DollhouseMCP Collection (GitHub Repository)

**Purpose**: Centralized content repository with quality and security validation

**Key Directories**:
```
/library/         # Free community content
  /personas/      # AI personality configurations
  /skills/        # Specialized capabilities
  /agents/        # Autonomous AI agents
  /prompts/       # Reusable prompt templates
  /templates/     # Document templates
  /tools/         # AI-enhanced tools
  /ensembles/     # Curated collections

/showcase/        # Featured high-quality content
/catalog/         # Premium content (future)

/.github/workflows/  # All cloud processing
/src/               # Validation tools (GitHub Actions only)
/docs/              # Documentation
```

**Cloud Processing (GitHub Actions)**:
- `validate-content.yml` - Content quality validation
- `content-security-validation.yml` - Security scanning
- `claude-review.yml` - AI-powered code review
- `release.yml` - Automated releases
- `update-registry.yml` - Registry maintenance

**Important Files**:
- `/src/content/content-validator.ts` - Content validation logic
- `/src/security/security-patterns.ts` - 77+ security patterns
- `/docs/CONTENT_SPEC.md` - Content format specifications
- `/REGISTRY.md` - Auto-generated content registry

**Content Identification**:
- Unique ID format: `{type}_{name}_{author}_{YYYYMMDD}-{HHMMSS}`
- Example: `persona_creative-writer_johndoe_20250718-143025`
- Server-generated timestamps prevent manipulation

### DollhouseMCP Server (MCP Runtime)

**Purpose**: Local/cloud runtime for content interaction and creation

**Key Components**:
```
/src/
  /persona-manager.ts    # Local persona management
  /persona-submitter.ts  # Content submission to collection
  /marketplace-browser.ts # Browse collection content
  /tools/               # MCP tool implementations

/personas/             # Local persona storage
```

**Integration Points**:
- GitHub API for content browsing
- Local file system for content storage
- MCP protocol for AI assistant integration
- Future: Direct collection API

## Content Flow Architecture

### 1. Content Creation Flow
```
User → MCP Server → Create Content → Validate Locally → Submit PR → Collection
                                                           ↓
                                                    GitHub Actions
                                                           ↓
                                                    Validation Suite
                                                           ↓
                                                    Human Review
                                                           ↓
                                                    Merge to Collection
```

### 2. Content Consumption Flow
```
User → MCP Server → Browse Collection → Download Content → Local Storage
                          ↓
                    GitHub API
                          ↓
                 Collection Repository
```

### 3. Validation Pipeline (Cloud-Only)
```
PR Created → Trigger GitHub Actions
                    ↓
            Content Validation
            Security Scanning
            Format Checking
            Quality Analysis
                    ↓
            Pass/Fail Status
                    ↓
            PR Comment with Results
```

## Key Architectural Decisions

### 1. No Local Runtime in Collection
The TypeScript/Node.js code in the collection is exclusively for GitHub Actions. Users never need to:
- Clone the collection repository
- Run npm install
- Execute any collection code locally

### 2. GitHub as Processing Engine
All content processing happens via GitHub Actions:
- Validation and security scanning
- Registry generation
- Future: Username/portfolio management
- Future: Content valuation and metrics

### 3. MCP Server as User Interface
All user interactions go through the MCP Server:
- Content creation and editing
- Browsing and downloading
- Submission to collection
- Local portfolio management

## Integration Requirements

### Current Gaps to Address

1. **Update MCP Server Integration**
   - File: `/src/marketplace-browser.ts`
   - Change: Point to `DollhouseMCP/collection` instead of `DollhouseMCP/personas`
   - Update paths for new structure (library/showcase/catalog)

2. **Expand Content Type Support**
   - Currently: Only personas implemented
   - Needed: Skills, agents, prompts, templates, tools, ensembles

3. **Improve Submission Pipeline**
   - Current: Creates GitHub issues
   - Needed: Create PRs with properly formatted content

### Future Enhancements

1. **Collection API**
   - RESTful endpoints for content access
   - Webhook notifications for updates
   - Programmatic submission interface

2. **Web Interface**
   - Browse collection without MCP server
   - Submit content via web forms
   - Manage user profiles and portfolios

3. **Advanced GitHub Actions**
   - Automated content curation
   - Performance metrics tracking
   - Revenue split calculations

## Security Architecture

### Collection Security (Cloud)
- 77+ prompt injection patterns
- 62+ YAML security patterns
- Command execution detection
- Data exfiltration prevention
- Context awareness protection

### Server Security (Local)
- Sandboxed content execution
- Local validation before submission
- Secure GitHub API integration
- User permission management

## Scalability Considerations

### Collection Scalability
- Hierarchical organization ready for 10,000+ items
- GitHub Actions parallel processing
- Efficient validation caching
- Registry partitioning by type

### Server Scalability
- Local caching of frequently used content
- Paginated API requests
- Async content operations
- Background synchronization

## Summary

The DollhouseMCP architecture achieves a clean separation between content (Collection) and runtime (Server). The Collection leverages GitHub's infrastructure for all processing, while the Server provides the user interface and local operations. This design ensures:

1. **No unnecessary downloads** - Users only get the MCP Server
2. **Cloud-scale processing** - GitHub Actions handle all validation
3. **Clean separation** - Content and runtime never mix
4. **Future flexibility** - Easy to add web interfaces or APIs

The architecture is designed to scale from individual users to a large community marketplace while maintaining security, quality, and performance.