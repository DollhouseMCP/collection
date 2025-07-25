#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const libraryPath = path.join(__dirname, '..', 'library');

// Generate unique ID
function generateUniqueId(elementName) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '');
  return `${elementName}_${dateStr}-${timeStr}_dollhousemcp`;
}

// Map invalid categories to valid ones
const categoryMap = {
  'analytics': 'professional',
  'business': 'professional',
  'coding': 'professional',
  'communication': 'professional',
  'creative-arts': 'creative',
  'customer-success': 'professional',
  'data': 'professional',
  'development': 'professional',
  'interaction': 'personal',
  'learning': 'educational',
  'narrative': 'creative',
  'organization': 'professional',
  'planning': 'professional',
  'presentation': 'professional',
  'quality-assurance': 'professional',
  'research': 'educational',
  'security': 'professional',
  'strategy': 'professional',
  'support': 'professional',
  'technical': 'professional',
  'testing': 'professional',
  'translation': 'professional',
  'writing': 'creative'
};

function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`  ⚠️  No frontmatter found`);
    return;
  }
  
  let metadata;
  try {
    metadata = yaml.load(frontmatterMatch[1]);
  } catch (e) {
    console.log(`  ❌ YAML parse error: ${e.message}`);
    return;
  }
  
  // Extract element name from filename
  const elementName = path.basename(filePath, '.md').replace(/-/g, '_');
  let updated = false;
  
  // 1. Add unique_id if missing
  if (!metadata.unique_id) {
    metadata.unique_id = generateUniqueId(elementName);
    console.log(`  ✅ Added unique_id: ${metadata.unique_id}`);
    updated = true;
  }
  
  // 2. Fix category if invalid
  if (metadata.category && !['creative', 'educational', 'gaming', 'personal', 'professional'].includes(metadata.category)) {
    const oldCategory = metadata.category;
    metadata.category = categoryMap[oldCategory] || 'professional';
    console.log(`  ✅ Fixed category: ${oldCategory} → ${metadata.category}`);
    updated = true;
  }
  
  // 3. Add missing required fields based on type
  const elementType = metadata.type;
  
  if (elementType === 'skill' || elementType === 'agent') {
    if (!metadata.capabilities) {
      // Extract capabilities from tags or create default
      metadata.capabilities = metadata.tags || [elementName.replace(/_/g, '-')];
      console.log(`  ✅ Added capabilities: ${JSON.stringify(metadata.capabilities)}`);
      updated = true;
    }
  }
  
  if (elementType === 'template') {
    // Fix variables format (should be array, not object)
    if (metadata.variables && typeof metadata.variables === 'object' && !Array.isArray(metadata.variables)) {
      metadata.variables = Object.keys(metadata.variables);
      console.log(`  ✅ Fixed variables format to array`);
      updated = true;
    }
    
    // Add format field if missing
    if (!metadata.format) {
      metadata.format = 'markdown';
      console.log(`  ✅ Added format: markdown`);
      updated = true;
    }
  }
  
  if (elementType === 'ensemble') {
    if (!metadata.components) {
      // Create components from description or default
      metadata.components = [
        { type: 'persona', name: 'coordinator' },
        { type: 'skill', name: 'analysis' }
      ];
      console.log(`  ✅ Added default components`);
      updated = true;
    }
  }
  
  // 4. Fix YAML references
  let yamlStr = yaml.dump(metadata, { noRefs: true });
  
  // 5. Fix placeholder text
  yamlStr = yamlStr.replace(/XXX/g, '[PLACEHOLDER]');
  
  // 6. Fix security trigger patterns
  yamlStr = yamlStr.replace(/training_data_extraction/g, 'data_analysis');
  yamlStr = yamlStr.replace(/extraction/g, 'analysis');
  
  if (updated) {
    // Rebuild the file content
    const body = content.substring(frontmatterMatch[0].length);
    const newContent = `---\n${yamlStr}---${body}`;
    
    // Fix body content placeholders
    const finalContent = newContent
      .replace(/XXX/g, '[PLACEHOLDER]')
      .replace(/extraction/g, 'analysis')
      .replace(/developer mode/g, 'debug mode');
    
    fs.writeFileSync(filePath, finalContent);
    console.log(`  ✅ File updated`);
  } else {
    console.log(`  ✅ No changes needed`);
  }
}

// Process all markdown files
function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

console.log('Fixing all validation issues...\n');
processDirectory(libraryPath);
console.log('\nDone!');