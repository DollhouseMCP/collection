# Quick Start Guide - DollhouseMCP Collection

Get started with the DollhouseMCP Collection in under 5 minutes!

## Prerequisites

- Node.js ≥22.0.0
- [DollhouseMCP Server](https://github.com/DollhouseMCP/mcp-server) installed
- Claude Desktop or compatible MCP client

## Installation

### 1. Install DollhouseMCP Server

```bash
npm install -g @dollhousemcp/mcp-server
```

### 2. Configure Your MCP Client

For Claude Desktop, add to your configuration:

```json
{
  "mcpServers": {
    "dollhouse": {
      "command": "dollhouse-mcp",
      "args": ["--collection"]
    }
  }
}
```

## Basic Usage

### Browse Available Content

```bash
# View all available elements
browse_collection

# Browse specific category
browse_collection "personas"

# Search for specific content
search_collection "creative writing"
```

### Use an Element

```bash
# Get details about an element
get_collection_item "persona" "creative-writer-pro"

# Apply a persona
apply_persona "creative-writer-pro"

# Use a template
use_template "api-documentation"
```

### Download Elements to Your Portfolio

```bash
# Download an element for local use
download_element "persona" "creative-writer-pro"

# View your local portfolio
list_portfolio
```

## Next Steps

- 📚 [Browse the Full Collection](https://dollhousemcp.github.io/collection/)
- 🤝 [Contribute Your Own Elements](../CONTRIBUTING.md)
- 📖 [Read the Developer Guide](DEVELOPER_GUIDE.md)
- 🔒 [Understand Security Features](SECURITY.md)

## Common Tasks

### Finding the Right Element

1. Browse by category to discover available content
2. Use search to find specific capabilities
3. Preview elements before downloading

### Creating Custom Elements

```bash
# Create your own persona
create_persona "My Expert" "A specialized assistant for..."

# Validate your content
validate_content "My Expert"

# Submit to collection (coming soon)
submit_to_collection "My Expert"
```

### Managing Your Portfolio

```bash
# View downloaded elements
list_portfolio

# Update an element
update_element "creative-writer-pro"

# Remove an element
remove_element "creative-writer-pro"
```

## Troubleshooting

### Element Not Found
- Ensure you're using the correct category and name
- Check spelling and case sensitivity
- Browse the category to see available options

### Validation Errors
- Review the [validation requirements](VALIDATION.md)
- Check for security patterns that might trigger warnings
- Ensure proper metadata format

### Connection Issues
- Verify MCP server is running
- Check network connectivity
- Review server logs for errors

## Get Help

- 📖 [Documentation](../docs/)
- 💬 [GitHub Discussions](https://github.com/DollhouseMCP/collection/discussions)
- 🐛 [Report Issues](https://github.com/DollhouseMCP/collection/issues)
- 📧 [Contact Support](mailto:support@dollhousemcp.com)

---

Ready to explore? Start with `browse_collection` to see all available content!