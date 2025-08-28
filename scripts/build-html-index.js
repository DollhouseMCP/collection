#!/usr/bin/env node
/**
 * Build HTML index page for GitHub Pages
 * Creates a visual catalog of the collection
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildHtmlIndex() {
  const publicDir = path.join(process.cwd(), 'public');
  const indexPath = path.join(publicDir, 'collection-index.json');
  
  try {
    // Read the JSON index
    const indexData = JSON.parse(await fs.readFile(indexPath, 'utf-8'));
    
    // Generate HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DollhouseMCP Collection</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }
    .stat {
      background: rgba(255,255,255,0.2);
      padding: 1rem 2rem;
      border-radius: 10px;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
    }
    .categories {
      display: grid;
      gap: 2rem;
      margin-top: 3rem;
    }
    .category {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .category h2 {
      color: #764ba2;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }
    .elements {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .element {
      background: #f7f7f7;
      padding: 1rem;
      border-radius: 8px;
      transition: transform 0.2s;
    }
    .element:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .element-name {
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }
    .element-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .element-meta {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #999;
    }
    .tag {
      background: #667eea;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    footer {
      text-align: center;
      color: white;
      margin-top: 4rem;
      padding: 2rem;
    }
    footer a {
      color: white;
      text-decoration: none;
      margin: 0 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🏚️ DollhouseMCP Collection</h1>
      <p class="subtitle">Community-driven AI elements for the Model Context Protocol</p>
      <div class="stats">
        <div class="stat">
          <div class="stat-number">${indexData.total_elements}</div>
          <div>Total Elements</div>
        </div>
        <div class="stat">
          <div class="stat-number">${Object.keys(indexData.index).length}</div>
          <div>Categories</div>
        </div>
      </div>
    </header>

    <div class="categories">
      ${Object.entries(indexData.index).map(([category, elements]) => `
        <div class="category">
          <h2>${category.charAt(0).toUpperCase() + category.slice(1)} (${elements.length})</h2>
          <div class="elements">
            ${elements.slice(0, 12).map(el => `
              <div class="element">
                <div class="element-name">${el.name}</div>
                <div class="element-description">${el.description || 'No description available'}</div>
                <div class="element-meta">
                  ${el.author ? `<span>by ${el.author}</span>` : ''}
                  ${el.version ? `<span>v${el.version}</span>` : ''}
                  ${el.ai_generated ? '<span class="tag">AI Generated</span>' : ''}
                </div>
              </div>
            `).join('')}
            ${elements.length > 12 ? `
              <div class="element" style="text-align: center; padding: 2rem;">
                <div class="element-description">... and ${elements.length - 12} more</div>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>

    <footer>
      <p>Last updated: ${new Date(indexData.generated).toLocaleString()}</p>
      <p style="margin-top: 1rem;">
        <a href="https://github.com/DollhouseMCP/collection">GitHub Repository</a>
        <a href="collection-index.json">JSON API</a>
        <a href="https://github.com/DollhouseMCP/mcp-server">MCP Server</a>
      </p>
    </footer>
  </div>
</body>
</html>`;

    // Write HTML file
    await fs.writeFile(path.join(publicDir, 'index.html'), html, 'utf-8');
    console.log('✅ Built HTML index at public/index.html');
  } catch (error) {
    console.error('❌ Error building HTML index:', error.message);
    process.exit(1);
  }
}

// Run the build
buildHtmlIndex().catch(console.error);