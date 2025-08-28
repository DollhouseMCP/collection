# DollhouseMCP Collection

<div align="center">

📚 **The Official Content Collection for [DollhouseMCP](https://github.com/DollhouseMCP/mcp-server)** 📚

## Status & Quality
[![GitHub Views](https://komarev.com/ghpvc/?username=DollhouseMCP&repo=collection&label=Repository+Views&style=flat)](https://github.com/DollhouseMCP/collection)
[![Version](https://img.shields.io/badge/version-v1.0.3-blue)](https://github.com/DollhouseMCP/collection/releases)
[![GitHub Pages](https://img.shields.io/badge/Catalog-Live-success)](https://dollhousemcp.github.io/collection/)
[![Build Status](https://github.com/DollhouseMCP/collection/actions/workflows/build-collection-index.yml/badge.svg)](https://github.com/DollhouseMCP/collection/actions/workflows/build-collection-index.yml)
[![Security Scan](https://img.shields.io/badge/Security-Validated-green)](https://github.com/DollhouseMCP/collection/security)
[![Validation](https://img.shields.io/badge/Elements-100%25%20Validated-brightgreen)](docs/VALIDATION.md)

## Compatibility & Technology
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green)](https://github.com/DollhouseMCP/mcp-server)
[![Claude Desktop](https://img.shields.io/badge/Claude%20Desktop-Tested-purple)](https://claude.ai/desktop)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522.0.0-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Collection Stats
[![Elements](https://img.shields.io/badge/Elements-44-blue)](library/)
[![Active Categories](https://img.shields.io/badge/Active%20Categories-4-success)](library/)
[![Coming Soon](https://img.shields.io/badge/Coming%20Soon-3-yellow)](docs/ROADMAP.md)
[![Contributors](https://img.shields.io/github/contributors/DollhouseMCP/collection)](https://github.com/DollhouseMCP/collection/graphs/contributors)

## Documentation & Resources
[![Documentation](https://img.shields.io/badge/Docs-Available-blue)](docs/)
[![API Reference](https://img.shields.io/badge/API-Reference-orange)](https://dollhousemcp.github.io/collection/api)
[![Quick Start](https://img.shields.io/badge/Quick%20Start-Guide-green)](docs/QUICK_START.md)
[![Examples](https://img.shields.io/badge/Examples-Available-blueviolet)](docs/examples/)
[![Roadmap](https://img.shields.io/badge/Roadmap-2025-yellow)](docs/ROADMAP.md)

## Legal & Community
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Content License](https://img.shields.io/badge/Content%20License-Custom-green.svg)](LICENSE-CONTENT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

## 🌟 What is the DollhouseMCP Collection?

The DollhouseMCP Collection is a comprehensive library of AI-enhancing content including personas, skills, agents, prompts, templates, tools, and ensembles. Built for the Model Context Protocol (MCP), it provides a secure, curated ecosystem for AI augmentation.

### 📦 Content Types

#### ✅ Active Categories
- **🎭 Personas** (6 available) - AI behavioral profiles and character definitions
- **📄 Templates** (10 available) - Document and workflow templates
- **🤖 Agents** (6 available) - Autonomous AI agents for specific tasks
- **🛠️ Skills** (11 available) - Functional capabilities and specialized abilities

#### 🚧 Coming Soon
- **💬 Prompts** (1 in development) - Optimized prompt templates and chains
- **🧠 Memories** (3 in development) - Persistent context and knowledge storage
- **👥 Ensembles** (6 in development) - Curated collections for complex workflows
- **🔧 Tools** (1 in development) - MCP-compatible tools and utilities

## 📈 Live Statistics

<div align="center">

### Collection Growth
<!-- These will be dynamically updated -->
**Total Elements**: 44 | **Last Updated**: 2025-08-28

### Recent Additions
- 🆕 Full-Stack Developer Ensemble
- 🆕 React Expert Agent  
- 🆕 API Documentation Template
- 🆕 Code Review Skill
- 🆕 Creative Writer Persona

[View Full Catalog →](https://dollhousemcp.github.io/collection/)

</div>

## 🚀 Quick Start

### Browse Content

Content is organized in three main areas:

1. **✨ Showcase** - Featured and recommended content
2. **📚 Library** - Free community-contributed content
3. **💎 Catalog** - Premium content (coming soon)

### Using with DollhouseMCP

When using the DollhouseMCP server with Claude or another AI assistant:

```bash
# Browse all content
browse_collection

# Browse specific category
browse_collection "personas"

# Search for content
search_collection "creative writing"

# Get details
get_collection_item "persona" "creative-writer-pro"

# Create and submit new content (coming soon!)
create_persona "My Expert Helper" "A specialized assistant for..."
validate_content "My Expert Helper"
submit_to_collection "My Expert Helper"
```

The MCP server handles all the complexity - just describe what you want to create!

## 🏗️ Repository Structure

```
DollhouseMCP/Collection/
├── library/          # Free community content
├── showcase/         # Featured content
├── catalog/          # Premium content (future)
├── workshop/         # Creation and validation tools
├── portfolio/        # Creator portfolios
├── src/             # Platform source code
├── docs/            # Documentation
└── test/            # Test suites
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Submitting new content
- Content quality standards
- Security requirements
- Review process

### Submission Methods

#### 1. Direct MCP Server Submission (Recommended)
Soon, you'll be able to contribute directly while chatting with Claude or any AI using the DollhouseMCP server:
```
create_content "My Amazing Persona" "persona" "A helpful assistant that..." 
submit_to_collection "My Amazing Persona"
```
The AI will guide you through the process, validate your content, and submit it for review - all within your chat session!

#### 2. Build Your Own Tools
Our validation system is open source! You can create your own tools to:
- Bulk import existing personas, prompts, or tools
- Generate content programmatically
- Integrate with your workflow
- Submit PRs automatically

The validation API ensures all content meets quality and security standards:
```typescript
import { ContentValidator } from '@dollhousemcp/collection';
const validator = new ContentValidator();
const result = await validator.validateContent('my-content.md');
```

#### 3. Traditional GitHub Flow
1. Fork the repository
2. Create your content following our templates
3. Run validation: `npm run validate`
4. Submit a pull request

## 🔒 Security

All content undergoes strict security validation to ensure safety. See our [Security Policy](SECURITY.md) for details.

## 📜 Licensing

This project uses a dual licensing model:

- **Platform Code**: [AGPL-3.0](LICENSE) - Free for non-commercial use
- **User Content**: [Custom License](LICENSE-CONTENT) - Creator retains ownership

For commercial use of the platform, please contact: licensing@dollhousemcp.com

## 🗺️ Architecture

<details>
<summary>Click to view the element submission flow</summary>

```mermaid
graph TD
    A[User Creates Element] -->|Using MCP Server| B[Local Portfolio]
    B -->|Validate & Test| C[Personal GitHub Portfolio]
    C -->|Submit Issue| D[DollhouseMCP Collection]
    D -->|Review Process| E{Quality Check}
    E -->|Pass| F[Merge to Collection]
    E -->|Fail| G[Request Changes]
    F -->|Available| H[Community Downloads]
    H -->|Install| B
```

</details>

## 🌐 Links

- 🏠 [DollhouseMCP Server](https://github.com/DollhouseMCP/mcp-server) - Core MCP implementation
- 📖 [API Documentation](https://dollhousemcp.github.io/collection/api) - JSON endpoint reference
- 🎯 [Quick Start Guide](docs/QUICK_START.md) - Get started in 5 minutes
- 📝 [Examples](docs/examples/) - Sample implementations
- 🗓️ [Roadmap](docs/ROADMAP.md) - Future features and timeline

## 📅 Changelog

### [v1.0.3] - 2025-08-28
- 📚 Added comprehensive documentation (ROADMAP, VALIDATION, SECURITY, QUICK_START)
- 🎯 Enhanced README with professional badges and organization
- 📝 Created examples directory with implementation guides
- ✨ Improved collection statistics and live data sections

### [v1.0.2] - 2025-08-28
- 🚀 Added GitHub Pages deployment
- 📄 HTML catalog generation
- 🔒 XSS protection and content security
- 📦 JSON API endpoint at /collection-index.json

### [v1.0.1] - 2025-08-27  
- ✨ Initial collection structure
- 🛡️ Security validation system
- 📚 44 founding elements

[Full Changelog →](CHANGELOG.md)

## 🏆 Security & Trust

<div align="center">

### Security Features
- 🛡️ **100% Content Validation** - Every element scanned for security issues
- 🔍 **Pattern Detection** - AI injection & malicious prompt prevention
- ✅ **Automated Testing** - 197+ security tests on every submission
- 📊 **Audit Logging** - Complete security event tracking

[Security Documentation →](docs/SECURITY.md)

</div>

---

<div align="center">

### Contributing

We welcome contributions! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

For PR submission walkthrough, visit our [Contribution Tutorial](https://dollhousemcp.github.io/collection/contribute)

</div>

---

<div align="center">
Made with ❤️ by the DollhouseMCP Team

[Report Issue](https://github.com/DollhouseMCP/collection/issues) | [Request Feature](https://github.com/DollhouseMCP/collection/issues/new?labels=enhancement) | [Join Discussion](https://github.com/DollhouseMCP/collection/discussions)
</div>