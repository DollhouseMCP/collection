---
name: pdf-creator
description: >-
  Creates professional PDF documents from markdown, HTML, DOCX, or structured
  content with automatic table of contents, smart pagination, headers, footers,
  bookmarks, and multi-page layouts
author: Mick Darling
version: 1.1.0
created: '2025-10-24T13:31:45.133Z'
modified: '2025-10-24T16:45:00.000Z'
tags:
  - pdf
  - document-creation
  - markdown
  - conversion
  - export
  - print
dependencies: []
custom: {}
languages:
  - javascript
  - typescript
complexity: intermediate
domains:
  - document-processing
  - file-conversion
  - publishing
prerequisites:
  - npm
  - node
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_pdf-creator_mick-darling_20251024-133145
type: skill
capabilities:
  - general-purpose
---
# PDF Creator Skill## PurposeCreate professional PDF documents from various input formats including markdown, HTML, DOCX, or structured content. Generate presentation-ready PDFs for sharing, archiving, and distribution. Primary use cases: markdown to PDF conversion, professional reports, final deliverables.## Core Capabilities1. Markdown to PDF Conversion   - Full markdown syntax support   - Preserves formatting and structure   - Syntax-highlighted code blocks   - Embedded images and tables   - Custom styling via CSS2. HTML to PDF Conversion   - Render HTML with full CSS support   - Responsive layouts   - Web fonts and custom typography   - Complex layouts with flexbox/grid3. Multi-Source Input   - Markdown files → PDF   - HTML files → PDF   - DOCX files → PDF via conversion   - Plain text → PDF with formatting   - JSON/structured data → formatted PDF4. PDF Manipulation   - Merge multiple PDFs   - Split PDFs by page range   - Add/remove pages   - Rotate pages   - Extract text and images5. Professional Features   - Headers and footers   - Page numbers   - Table of contents   - Bookmarks/outline   - Metadata author, title, subject   - Watermarks   - Password protection## Triggers- convert markdown to pdf- create a pdf- export to pdf- make a .pdf file- turn this into a pdf- generate pdf from [file]- merge these pdfs- split this pdf## Input Formats### Markdown Filebash/path/to/document.md### HTML ContenthtmlDOCTYPE htmlhtmlhead  style    body  font-family: Arial   /style/headbody  h1Title/h1  pContent/p/body/html### Structured Contentjson  title: Report Title,  metadata:     author: Author Name,    subject: Report Subject  ,  content: [    type: heading, text: Section 1,    type: paragraph, text: Content...  ]### Multiple Files for Mergingjson  operation: merge,  files: [file1.pdf, file2.pdf, file3.pdf],  output: merged.pdf## Implementation Steps### 1. Parse Input- Identify input type and format- Read source files- Validate content### 2. Process Content#### For Markdownjavascriptconst marked = requiremarkedconst html = marked.parsemarkdownContent// Then convert HTML → PDF#### For HTMLjavascriptconst puppeteer = requirepuppeteerconst browser = await puppeteer.launchconst page = await browser.newPageawait page.setContenthtmlContentawait page.pdf path: output.pdf, format: A4 #### Alternative: PDFKit for programmatic generationjavascriptconst PDFDocument = requirepdfkitconst doc = new PDFDocumentdoc.pipefs.createWriteStreamoutput.pdfdoc.fontSize25.textTitle, 100, 100doc.end### 3. Apply Styling- Custom CSS for markdown/HTML conversions- Font selection system fonts or embedded- Color schemes- Margins and padding- Page layout settings### 4. Add Metadatajavascript  title: Document Title,  author: DollhouseMCP,  subject: Generated PDF,  keywords: markdown, pdf, conversion,  creator: DollhouseMCP PDF Creator,  producer: Puppeteer/PDFKit### 5. Save PDF- Write to file system- Set permissions- Verify PDF is not corrupted- Report file size and page count## DependenciesRequired packages:### Option 1: Puppeteer Recommended for markdown/HTMLjson  puppeteer: ^21.0.0,  marked: ^11.0.0### Option 2: PDFKit Programmatic PDF generationjson  pdfkit: ^0.14.0,  markdown-it: ^14.0.0### Option 3: PDF Manipulationjson  pdf-lib: ^1.17.0,  pdf-parse: ^1.1.1## Example Usage### Convert Markdown to PDFbashInput: Convert README.md to PDFSteps:1. Read README.md2. Parse markdown → HTML3. Apply professional styling4. Generate PDF with page numbers5. Save as README.pdf6. Report: Created README.pdf 3 pages, 245 KB### Create Professional ReportbashInput: Create a PDF report with title page and table of contentsSteps:1. Create title page with metadata2. Generate table of contents from headings3. Add content pages with proper formatting4. Include headers/footers with page numbers5. Add bookmarks for navigation6. Save as report-date.pdf### Merge Multiple PDFsbashInput: Merge chapter1.pdf, chapter2.pdf, and chapter3.pdfSteps:1. Load all source PDFs2. Verify PDF validity3. Combine in specified order4. Add continuous page numbering5. Save as merged-chapters.pdf### Split PDF by PagesbashInput: Split report.pdf into separate pagesSteps:1. Load report.pdf2. Count total pages3. Extract each page to separate PDF4. Save as report-page-01.pdf, report-page-02.pdf, etc.5. Report: Created 15 separate PDF files## Styling Options### CSS for Markdown/HTML Conversioncss@page   size: A4  margin: 1in    @top-center     content: Document Title    font-size: 10pt    color: #666      @bottom-right     content: Page  counterpage    font-size: 10pt  body   font-family: Georgia, serif  font-size: 12pt  line-height: 1.6  color: #333h1   font-size: 24pt  color: #2c3e50  page-break-before: always  margin-top: 0code   background: #f4f4f4  padding: 2px 6px  border-radius: 3px  font-family: Courier New, monospacepre   background: #f8f8f8  padding: 16px  border-left: 4px solid #2c3e50  overflow-x: autotable   border-collapse: collapse  width: 100%  margin: 16px 0th, td   border: 1px solid #ddd  padding: 8px 12px  text-align: leftth   background: #f2f2f2  font-weight: bold### Puppeteer PDF Optionsjavascriptawait page.pdf  path: output.pdf,  format: A4,              // or Letter, Legal, etc.  printBackground: true,      // Include background colors/images  margin:     top: 1in,    right: 1in,    bottom: 1in,    left: 1in  ,  displayHeaderFooter: true,  headerTemplate: div style=font-size:10pt text-align:center width:100%Header/div,  footerTemplate: div style=font-size:10pt text-align:center width:100%span class=pageNumber/span / span class=totalPages/span/div,  preferCSSPageSize: false## Error Handling### Common Errors1. File Not Found   - Error: Source file doesnt exist   - Solution: Verify path exists   - Message: Source file not found: path2. Invalid PDF   - Error: Corrupted source PDF for merge/split   - Solution: Validate PDF before processing   - Message: Invalid or corrupted PDF: filename3. Memory Limit   - Error: Large file exceeds memory   - Solution: Process in chunks or increase memory   - Message: File too large: size. Try splitting the source first.4. Missing Dependencies   - Error: Puppeteer/fonts not installed   - Solution: Install required packages   - Message: Missing dependency: package. Install with: npm install package5. Permission Denied   - Error: Cannot write output file   - Solution: Check directory permissions   - Message: Cannot write to path. Check permissions.6. Browser Launch Failed Puppeteer   - Error: Chrome/Chromium not found   - Solution: Install browser or use bundled version   - Message: Cannot launch browser. Run: npx puppeteer install chrome## Output Options### File Naming- Default: original-name.pdf- Custom: User-specified path- Auto: document-timestamp.pdf- Batch: basename-page-number.pdf### PDF Metadatajavascript  Title: Document Title,  Author: Author Name,  Subject: Document Subject,  Keywords: keyword1, keyword2,  Creator: DollhouseMCP PDF Creator,  Producer: Puppeteer/PDFKit,  CreationDate: new Date,  ModDate: new Date### Page Setup- Paper sizes: Letter, A4, Legal, Tabloid, A3, A5- Orientation: Portrait or Landscape- Margins: Customizable default 1 inch- Page numbers: Position and format- Headers/footers: Custom HTML templates## Best Practices1. Optimize File Size   - Compress images before embedding   - Use web fonts efficiently   - Remove unused resources   - Consider PDF/A for archival2. Accessibility   - Tag PDF structure   - Add alt text for images   - Use proper heading hierarchy   - Include document title   - Maintain logical reading order3. Print Optimization   - Use CMYK for print RGB for screen   - Set proper bleed for printing   - Embed fonts   - Use appropriate resolution 300 DPI for print4. Security   - Add password protection for sensitive docs   - Set permissions printing, copying, editing   - Remove metadata if privacy needed   - Use encryption when appropriate5. Performance   - Reuse browser instances Puppeteer   - Process large batches sequentially   - Cache rendered HTML   - Use streams for large files## Advanced Features

### Automatic Table of Contents Generation

Generate a professional TOC from document headings with clickable links and accurate page numbers.

#### Step 1: Extract Headings from Markdown

```javascript
const marked = require('marked');

function extractHeadings(markdown) {
  const headings = [];
  const tokens = marked.lexer(markdown);

  tokens.forEach((token, index) => {
    if (token.type === 'heading') {
      headings.push({
        level: token.depth,      // 1-6 for H1-H6
        text: token.text,         // Heading text
        id: slugify(token.text),  // For anchor links
        index: index              // Position in document
      });
    }
  });

  return headings;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
```

#### Step 2: Generate TOC HTML with Placeholders

```javascript
function generateTOC(headings) {
  let tocHTML = `
    <div class="table-of-contents">
      <h1>Table of Contents</h1>
      <nav class="toc-nav">
  `;

  headings.forEach((heading, i) => {
    const indent = (heading.level - 1) * 20; // 20px per level
    const pageClass = `toc-page-${i}`;

    tocHTML += `
      <div class="toc-entry level-${heading.level}" style="margin-left: ${indent}px;">
        <a href="#${heading.id}" class="toc-link">
          <span class="toc-title">${heading.text}</span>
          <span class="toc-dots"></span>
          <span class="toc-page ${pageClass}">00</span>
        </a>
      </div>
    `;
  });

  tocHTML += `
      </nav>
    </div>
  `;

  return tocHTML;
}
```

#### Step 3: Add Anchor IDs to Headings

```javascript
function addAnchorIDs(html, headings) {
  let modifiedHTML = html;

  headings.forEach(heading => {
    // Find H1-H6 tags and add id attribute
    const regex = new RegExp(
      `(<h${heading.level}[^>]*>)(${escapeRegex(heading.text)})(</h${heading.level}>)`,
      'i'
    );

    modifiedHTML = modifiedHTML.replace(regex, (match, openTag, text, closeTag) => {
      if (openTag.includes('id=')) return match; // Already has ID
      return `${openTag.replace('>', ` id="${heading.id}">`)}}${text}${closeTag}`;
    });
  });

  return modifiedHTML;
}
```

#### Step 4: Calculate Page Numbers with Puppeteer

```javascript
async function calculatePageNumbers(page, headings) {
  const pageNumbers = await page.evaluate((headingIds) => {
    const results = [];

    headingIds.forEach(id => {
      const element = document.getElementById(id);
      if (!element) {
        results.push(null);
        return;
      }

      // Get element's position
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top;

      // Calculate page number (assuming 11 inch pages at 96 DPI)
      const pageHeight = 11 * 96; // Letter size height in pixels
      const pageNum = Math.floor(scrollY / pageHeight) + 1;

      results.push(pageNum);
    });

    return results;
  }, headings.map(h => h.id));

  return pageNumbers;
}
```

#### Step 5: Update TOC with Real Page Numbers

```javascript
async function updateTOCPageNumbers(page, headings, pageNumbers) {
  await page.evaluate((pages) => {
    pages.forEach((pageNum, index) => {
      const pageElement = document.querySelector(`.toc-page-${index}`);
      if (pageElement && pageNum !== null) {
        pageElement.textContent = String(pageNum).padStart(2, '0');
      }
    });
  }, pageNumbers);
}
```

#### Step 6: Complete TOC CSS Styling

```css
.table-of-contents {
  page-break-after: always;
  margin: 2em 0;
}

.table-of-contents h1 {
  font-size: 28pt;
  margin-bottom: 1em;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 0.5em;
}

.toc-nav {
  font-size: 11pt;
}

.toc-entry {
  margin: 0.5em 0;
  page-break-inside: avoid;
}

.toc-link {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  text-decoration: none;
  color: #2c3e50;
  padding: 0.25em 0;
}

.toc-link:hover {
  color: #3498db;
}

.toc-title {
  flex-shrink: 0;
  padding-right: 0.5em;
}

.toc-dots {
  flex-grow: 1;
  border-bottom: 1px dotted #999;
  margin: 0 0.5em;
  height: 0.8em;
}

.toc-page {
  flex-shrink: 0;
  font-weight: bold;
  min-width: 2em;
  text-align: right;
}

/* Indentation for different heading levels */
.level-1 .toc-title { font-weight: bold; font-size: 12pt; }
.level-2 .toc-title { font-size: 11pt; }
.level-3 .toc-title { font-size: 10pt; color: #555; }
.level-4 .toc-title { font-size: 9pt; color: #666; font-style: italic; }
```

#### Complete Implementation Example

```javascript
const puppeteer = require('puppeteer');
const marked = require('marked');
const fs = require('fs');

async function createPDFWithTOC(markdownPath, outputPath) {
  // 1. Read markdown
  const markdown = fs.readFileSync(markdownPath, 'utf8');

  // 2. Extract headings
  const headings = extractHeadings(markdown);

  // 3. Convert markdown to HTML
  let contentHTML = marked.parse(markdown);

  // 4. Add anchor IDs to headings
  contentHTML = addAnchorIDs(contentHTML, headings);

  // 5. Generate TOC HTML
  const tocHTML = generateTOC(headings);

  // 6. Combine into full HTML document
  const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        ${cssStyles} /* Include all CSS from above */
      </style>
    </head>
    <body>
      ${tocHTML}
      <div class="content">
        ${contentHTML}
      </div>
    </body>
    </html>
  `;

  // 7. Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHTML, { waitUntil: 'networkidle0' });

  // 8. Calculate page numbers
  const pageNumbers = await calculatePageNumbers(page, headings);

  // 9. Update TOC with real page numbers
  await updateTOCPageNumbers(page, headings, pageNumbers);

  // 10. Generate PDF
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    displayHeaderFooter: true,
    footerTemplate: `
      <div style="font-size: 9pt; text-align: center; width: 100%;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `
  });

  await browser.close();

  console.log(`✓ PDF created with ${headings.length} TOC entries: ${outputPath}`);
}

// Usage
createPDFWithTOC('document.md', 'document.pdf');
```

### Smart Pagination

Prevent awkward page breaks with CSS page-break controls.

#### Avoid Breaking Inside Elements

```css
/* Never break inside these elements */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid;
  page-break-inside: avoid;
}

pre, blockquote, table {
  page-break-inside: avoid;
}

.toc-entry {
  page-break-inside: avoid;
}

/* Keep headings with following content */
h1, h2, h3 {
  page-break-after: avoid;
}

/* Always break before H1 (new chapter) */
h1 {
  page-break-before: always;
}

/* Avoid orphans and widows */
p {
  orphans: 3;
  widows: 3;
}
```

#### Force Page Breaks

```css
/* Force break before major sections */
.chapter-start {
  page-break-before: always;
}

/* Force break after TOC */
.table-of-contents {
  page-break-after: always;
}

/* Prevent break after */
.keep-with-next {
  page-break-after: avoid;
}
```

#### Page Break Strategy

```javascript
function addSmartPageBreaks(html) {
  // Add page break before each H1 (except first)
  html = html.replace(/(<h1[^>]*>)/g, (match, tag, offset) => {
    if (offset === 0) return match;
    return `<div style="page-break-before: always;"></div>${match}`;
  });

  // Keep headings with their first paragraph
  html = html.replace(/(<\/h[1-3]>)\s*(<p>)/g, '$1<div class="keep-with-next">$2');

  // Avoid breaking tables
  html = html.replace(/(<table[^>]*>)/g, '<div style="page-break-inside: avoid;">$1');
  html = html.replace(/(<\/table>)/g, '$1</div>');

  return html;
}
```

### Bookmarks/Outline

Add PDF bookmarks for navigation (requires pdf-lib post-processing).

```javascript
const { PDFDocument } = require('pdf-lib');

async function addBookmarks(pdfPath, headings, pageNumbers) {
  const existingPdfBytes = await fs.promises.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Create outline/bookmarks
  const outline = [];
  headings.forEach((heading, i) => {
    const pageIndex = (pageNumbers[i] || 1) - 1;
    outline.push({
      title: heading.text,
      to: pdfDoc.getPage(pageIndex),
      level: heading.level
    });
  });

  // Note: pdf-lib doesn't directly support outlines yet
  // Use alternative library or manual PDF manipulation
  // This is a conceptual example

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(pdfPath, pdfBytes);
}### Watermarksjavascript// Add watermark to each pagedoc.addWatermark  text: DRAFT,  opacity: 0.3,  angle: 45,  fontSize: 72,  color: #cccccc### Forms and Fieldsjavascript// Create fillable PDF formsconst form = pdfDoc.getFormconst textField = form.createTextFieldfield.nametextField.setTextDefault value## Integration with TemplatesWorks with DollhouseMCP template elements:bash# Use template to create PDFInput: Create a report using the monthly-report templateFlow:1. Load monthly-report template2. Populate with data3. Render to markdown/HTML4. Convert to PDF with this skill5. Apply professional styling6. Save output## Performance Considerations- Puppeteer: Reuse browser instances, 100-200ms per page- PDFKit: Fast for programmatic generation, 10-50ms per page- Large files: Stream processing, consider memory limits- Batch processing: Queue system for multiple conversions- Images: Optimize/compress before embedding## Testing Checklist- [ ] Markdown → PDF basic conversion- [ ] HTML → PDF with CSS styling- [ ] Code blocks with syntax highlighting- [ ] Tables with complex layouts- [ ] Images local and remote URLs- [ ] Links internal anchors and external- [ ] Multi-page documents- [ ] Headers and footers- [ ] Page numbers- [ ] Table of contents generation- [ ] PDF merge 2+ files- [ ] PDF split by page range- [ ] Metadata embedding- [ ] Password protection- [ ] Large file handling 50+ pages- [ ] Different page sizes/orientations## Notes- PDF/A: Use for long-term archiving ISO 19005- PDF/X: Use f
