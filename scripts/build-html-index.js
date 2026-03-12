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


/**
 * Escape HTML to prevent XSS attacks
 * @param {string} unsafe - The unsafe string to escape
 * @returns {string} - The escaped HTML-safe string
 */
function _escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Check if content contains potential malicious patterns
 * @param {string} content - Content to check
 * @returns {boolean} - True if potentially malicious
 */
function containsMaliciousPatterns(content) {
  if (typeof content !== 'string') return false;
  
  // Check for common XSS patterns
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,  // onclick, onerror, etc.
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /data:text\/html/i,
    /vbscript:/i
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(content));
}

async function buildHtmlIndex() {
  const publicDir = path.join(process.cwd(), 'public');
  const indexPath = path.join(publicDir, 'collection-index.json');
  const htmlPath  = path.join(publicDir, 'index.html');

  try {
    // Validate collection-index.json is present and well-formed
    const indexData = JSON.parse(await fs.readFile(indexPath, 'utf-8'));
    const total = indexData.total_elements ?? 0;
    const types = Object.keys(indexData.index ?? {}).length;
    console.log(`✅ collection-index.json valid: ${total} elements across ${types} types`);

    // Count potentially malicious elements for logging (no longer filtered from HTML — app.js escapes at render time)
    let maliciousCount = 0;
    Object.values(indexData.index).forEach(elements => {
      elements.forEach(el => {
        if (containsMaliciousPatterns(el.name) ||
            containsMaliciousPatterns(el.description) ||
            containsMaliciousPatterns(el.author)) {
          maliciousCount++;
          console.warn(`⚠️  Potentially malicious metadata in element: ${el.name}`);
        }
      });
    });

    if (maliciousCount > 0) {
      console.log(`⚠️  ${maliciousCount} element(s) with suspicious metadata — review before release`);
    }

    // Validate index.html exists (it is a committed source file, not generated here)
    await fs.access(htmlPath);
    console.log('✅ public/index.html present (source file — not overwritten by this script)');

  } catch (error) {
    console.error('Error in build-html-index:', error.message);
    process.exit(1);
  }
}

// Run the build
buildHtmlIndex().catch(console.error);