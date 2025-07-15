# DollhouseMCP Collection User Guide

Welcome to the DollhouseMCP Collection! This guide will help you discover, use, and get the most out of the AI-enhancing content available.

## Table of Contents
1. [What is the Collection?](#what-is-the-collection)
2. [Content Types Explained](#content-types-explained)
3. [Browsing Content](#browsing-content)
4. [Using Content](#using-content)
5. [Content Areas](#content-areas)
6. [Best Practices](#best-practices)
7. [FAQs](#faqs)

## What is the Collection?

The DollhouseMCP Collection is a curated library of content designed to enhance AI assistants like Claude. Think of it as an "app store" for AI capabilities - you can browse, install, and activate different types of content to give your AI assistant new abilities, personalities, and tools.

## Content Types Explained

### 🎭 Personas
**What they are:** AI personality profiles that change how your assistant behaves and responds.

**Example uses:**
- Activate a "Creative Writer" persona for storytelling help
- Use a "Business Consultant" for professional advice
- Switch to "Friendly Tutor" for learning assistance

**How to identify quality:**
- Look for detailed personality descriptions
- Check for specific expertise areas
- Review example interactions

### 🛠️ Skills
**What they are:** Specific capabilities that enhance what your AI can do.

**Example uses:**
- "Debugging Assistant" for coding help
- "Language Translator" for multilingual support
- "Data Analyzer" for working with statistics

**How to identify quality:**
- Clear capability descriptions
- Supported languages/formats listed
- Limitations clearly stated

### 🤖 Agents
**What they are:** Autonomous AI agents that can complete complex tasks independently.

**Example uses:**
- "Research Agent" to gather information
- "Project Manager" to organize tasks
- "Content Creator" to generate materials

**How to identify quality:**
- Defined workflow steps
- Required tools listed
- Success criteria specified

### 💬 Prompts
**What they are:** Pre-written prompt templates for specific tasks.

**Example uses:**
- "Story Starter" for creative writing
- "Code Review" for programming
- "Meeting Summary" for business

**How to identify quality:**
- Customizable parameters
- Example outputs provided
- Clear use cases

### 📄 Templates
**What they are:** Document and workflow templates for common tasks.

**Example uses:**
- "Project Proposal" for business documents
- "Lesson Plan" for education
- "Blog Post" for content creation

**How to identify quality:**
- Professional formatting
- Placeholder variables
- Industry standards followed

### 🔧 Tools
**What they are:** MCP-compatible tools that add new functionalities.

**Example uses:**
- "Task Prioritizer" for productivity
- "Calculator" for computations
- "File Organizer" for system tasks

**How to identify quality:**
- Clear parameter descriptions
- Error handling documented
- Integration instructions

### 👥 Ensembles
**What they are:** Curated collections of multiple content types that work together.

**Example uses:**
- "Complete Productivity Suite" combining personas, tools, and templates
- "Creative Writing Workshop" with prompts, personas, and skills
- "Business Professional Pack" with agents, templates, and tools

**How to identify quality:**
- Component synergies explained
- Use case scenarios provided
- Getting started guide included

## Browsing Content

### Content Areas

1. **✨ Showcase**
   - Featured, high-quality content
   - Thoroughly tested and reviewed
   - Often includes extended features
   - Best for new users

2. **📚 Library**
   - Free community content
   - Wide variety of options
   - Community tested
   - Great for exploration

3. **💎 Catalog**
   - Premium content (coming soon)
   - Professional-grade tools
   - Advanced capabilities
   - Commercial use licensed

### Finding Content

**By Category:**
- Creative (writing, art, music)
- Professional (business, consulting)
- Educational (tutoring, research)
- Personal (productivity, lifestyle)
- Gaming (RPG, storytelling)

**By Tags:**
Look for relevant keywords like:
- `#beginner-friendly`
- `#advanced`
- `#free`
- `#featured`

**By Author:**
- `dollhousemcp` - Official content
- Community creators
- Verified developers

## Using Content

### With DollhouseMCP Server

1. **Browse available content:**
   ```
   browse_collection
   browse_collection "personas"
   browse_collection "showcase"
   ```

2. **Search for specific content:**
   ```
   search_collection "creative writing"
   search_collection "python debugging"
   ```

3. **View details:**
   ```
   get_content_details "creative-writer_20250715-100000_dollhousemcp"
   ```

4. **Install content:**
   ```
   install_content "creative-writer_20250715-100000_dollhousemcp"
   ```

5. **Activate content:**
   ```
   activate_persona "Creative Writer"
   use_tool "Task Prioritizer"
   ```

### Direct Usage

For content that doesn't require installation:

1. **Prompts:** Copy and customize the template
2. **Templates:** Download and fill in variables
3. **Skills:** Reference in your conversations
4. **Agents:** Follow the workflow instructions

## Best Practices

### 1. Start Simple
- Begin with showcase content
- Try one content type at a time
- Read the documentation
- Test in a safe environment

### 2. Mix and Match
- Combine complementary content
- Use ensembles for complex tasks
- Switch between personas as needed
- Layer skills for better results

### 3. Provide Feedback
- Rate content you use
- Report issues
- Suggest improvements
- Share your experiences

### 4. Security First
- Only use content from trusted sources
- Check reviews and ratings
- Be cautious with tools requiring permissions
- Report suspicious content

### 5. Optimize Your Workflow
- Create shortcuts for frequently used content
- Build your own ensembles
- Customize templates to your needs
- Document what works best

## FAQs

### General Questions

**Q: Is the content free?**
A: Showcase and Library content is free. Catalog content (coming soon) may have pricing.

**Q: Can I create my own content?**
A: Yes! See our [Contributing Guide](../CONTRIBUTING.md) for details.

**Q: How often is new content added?**
A: New content is added regularly by the community and our team.

**Q: Can I use this content commercially?**
A: Check the license for each piece of content. Most allow commercial use.

### Technical Questions

**Q: Do I need DollhouseMCP server?**
A: For full functionality, yes. Some content can be used standalone.

**Q: What AI assistants are supported?**
A: Any MCP-compatible assistant, primarily Claude.

**Q: Can I modify content?**
A: Yes, most content is open source and can be customized.

**Q: How do updates work?**
A: Content updates are available through the collection. Re-install to update.

### Troubleshooting

**Q: Content won't activate**
A: Ensure it's properly installed and you're using the correct activation command.

**Q: Performance issues**
A: Try using fewer simultaneous activations or simpler content.

**Q: Unexpected behavior**
A: Deactivate all content and reactivate one at a time to identify issues.

**Q: Where to get help**
A: Create an issue on GitHub or contact support@dollhousemcp.com.

## Advanced Usage

### Creating Custom Ensembles

1. Identify complementary content
2. Test combinations
3. Document the workflow
4. Share with the community

### Automation

Use MCP tools to automate workflows:
```javascript
// Example: Morning routine ensemble
activate_ensemble("morning-productivity")
run_tool("task_prioritizer", { tasks: today_tasks })
activate_persona("Motivational Coach")
```

### Integration

Integrate with your existing tools:
- Calendar applications
- Task managers
- Note-taking apps
- Development environments

## Community

### Getting Involved
- Join discussions on GitHub
- Share your creations
- Help test new content
- Contribute to documentation

### Content Creation
- Start with simple content
- Follow the guidelines
- Test thoroughly
- Get community feedback

### Support Others
- Answer questions
- Share tips
- Report bugs
- Suggest features

---

Thank you for using the DollhouseMCP Collection! We're excited to see what you create and accomplish with these tools. Happy exploring! 🚀