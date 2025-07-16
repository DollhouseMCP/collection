# DollhouseMCP Collection

<div align="center">

📚 **The Official Content Collection for [DollhouseMCP](https://github.com/DollhouseMCP/mcp-server)** 📚

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Content License](https://img.shields.io/badge/Content%20License-Custom-green.svg)](LICENSE-CONTENT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Enabled-purple.svg)](https://github.com/apps/claude-code)

</div>

## 🌟 What is the DollhouseMCP Collection?

The DollhouseMCP Collection is a comprehensive library of AI-enhancing content including personas, skills, agents, prompts, templates, tools, and ensembles. Built for the Model Context Protocol (MCP), it provides a secure, curated ecosystem for AI augmentation.

### 📦 Content Types

- **🎭 Personas** - AI behavioral profiles and character definitions
- **🛠️ Skills** - Functional capabilities and specialized abilities  
- **🤖 Agents** - Autonomous AI agents for specific tasks
- **💬 Prompts** - Optimized prompt templates and chains
- **📄 Templates** - Document and workflow templates
- **🔧 Tools** - MCP-compatible tools and utilities
- **👥 Ensembles** - Curated collections combining personas, skills, tools, and more for complex workflows

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

## 🌐 Links

- [DollhouseMCP Server](https://github.com/DollhouseMCP/mcp-server)
- [Documentation](https://docs.dollhousemcp.com)
- [Discord Community](https://discord.gg/dollhousemcp)
- [Website](https://dollhousemcp.com)

## 📊 Stats

- Total Items: 0 (Just launched!)
- Categories: 7
- Contributors: 0

---

<div align="center">
Made with ❤️ by the DollhouseMCP Team
</div>