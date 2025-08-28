# DollhouseMCP Collection Examples

This directory contains example implementations and usage patterns for the DollhouseMCP Collection.

## Example Categories

### 📝 [Creating Elements](creating-elements.md)
Learn how to create your own personas, templates, agents, and skills.

### 🔧 [Using Elements](using-elements.md)
Examples of how to use collection elements in your projects.

### 🤝 [Contributing](contributing-example.md)
Step-by-step example of contributing to the collection.

### 🔒 [Validation](validation-example.md)
Examples of content that passes and fails validation.

## Quick Examples

### Using a Persona
```bash
# Browse available personas
browse_collection "personas"

# Get details about a specific persona
get_collection_item "persona" "creative-writer-pro"

# Apply the persona
apply_persona "creative-writer-pro"
```

### Creating a Template
```bash
# Create a new template
create_template "API Documentation" "api-docs" "A comprehensive API documentation template"

# Validate the template
validate_content "api-docs"

# Submit for review
submit_to_collection "api-docs"
```

### Building an Agent
```bash
# Define agent capabilities
create_agent "Code Reviewer" "Reviews code for best practices and security issues"

# Add agent skills
add_skill "code-analysis"
add_skill "security-scanning"

# Test the agent
test_agent "Code Reviewer" "sample-code.js"
```

## Full Examples

- [Complete Persona Creation](persona-creation.md)
- [Template Development Guide](template-guide.md)
- [Agent Architecture](agent-architecture.md)
- [Skill Implementation](skill-implementation.md)

## Integration Examples

### With Claude Desktop
```json
{
  "mcpServers": {
    "dollhouse": {
      "command": "dollhouse-mcp",
      "args": ["--collection", "--portfolio", "./my-portfolio"]
    }
  }
}
```

### With Custom Applications
```javascript
import { DollhouseCollection } from '@dollhousemcp/collection';

const collection = new DollhouseCollection();
const persona = await collection.getElement('persona', 'creative-writer-pro');
```

## Best Practices

1. **Start Simple** - Begin with basic elements before creating complex ones
2. **Test Locally** - Always validate locally before submission
3. **Follow Templates** - Use provided templates for consistency
4. **Document Well** - Clear descriptions help others use your elements

## Need Help?

- 📖 [Documentation](../)
- 💬 [GitHub Discussions](https://github.com/DollhouseMCP/collection/discussions)
- 🎯 [Quick Start Guide](../QUICK_START.md)