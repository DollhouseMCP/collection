---
name: docx-creator
description: >-
  Creates professional DOCX documents from markdown, plain text, or structured
  content with full formatting support including headings, lists, tables, and
  images
author: Mick Darling
version: 1.2.0
created: '2025-10-24T13:30:26.981Z'
modified: '2025-10-24T19:30:00.000Z'
tags:
  - docx
  - word
  - document-creation
  - markdown
  - conversion
  - export
  - table-support
dependencies: []
custom: {}
languages:
  - javascript
  - typescript
complexity: intermediate
domains:
  - document-processing
  - file-conversion
  - office
prerequisites:
  - npm
  - node
parameters: []
examples: []
proficiency_level: 0
unique_id: unknown_docx-creator_mick-darling_20251024-133026
type: skill
capabilities:
  - general-purpose
security_exceptions:
  - pattern: code_execution
    reason: Contains legitimate JavaScript code examples for document processing - educational content showing regex.exec() usage, not actual code execution threats
  - pattern: data_exfiltration
    reason: Contains legitimate documentation about exporting/converting documents to DOCX format - educational content, not actual data exfiltration
  - pattern: "command-injection"
    reason: "Documentation contains command-line examples and shell syntax for educational purposes - not executed directly"
  - pattern: "file-system"
    reason: "Contains file path examples and file operation documentation for technical reference - not actual file system access"
  - pattern: "credential-leak"
    reason: "Documentation mentions security-related terms (key, token, credential) in educational context - no actual credentials exposed"
  - pattern: "template-injection"
    reason: "Template file contains placeholder variables ({{variable}}) for content generation - these are legitimate template syntax, not injection vulnerabilities"
  - pattern: "xss"
    reason: "Contains HTML examples and event handlers for documentation/template purposes - sanitized in actual usage"
---
# DOCX Creator Skill## PurposeCreate professional Microsoft Word .docx documents from various input formats including markdown, plain text, or structured content. Primary use case: converting markdown files to shareable DOCX documents for users who dont read markdown.## Core Capabilities1. Markdown to DOCX Conversion   - Full markdown syntax support headings, lists, bold, italic, code blocks   - Preserves document structure and formatting   - Handles tables, links, and images   - Code block syntax highlighting2. Direct DOCX Creation   - Create documents from scratch with structured content   - Apply professional formatting   - Support for headers, footers, page numbers   - Custom styles and themes3. Content Formatting   - Headings H1-H6 with proper styling   - Paragraph formatting alignment, spacing, indentation   - Lists ordered, unordered, nested   - Tables with borders and styling   - Inline formatting bold, italic, underline, strikethrough   - Hyperlinks   - Images embedded or linked## Triggers- convert markdown to docx- create a word document- export this to docx- make a .docx file- turn this markdown into a word document- create docx from [file]## Input Formats### Markdown Filebash# User provides markdown file path/path/to/document.md### Inline Markdownmarkdown# HeadingParagraph with bold and italic- List item 1- List item 2### Structured Content Objectjson  title: Document Title,  sections: [    type: heading, level: 1, text: Main Heading,    type: paragraph, text: Body text,    type: list, items: [Item 1, Item 2]  ]## Implementation Steps### 1. Parse Input- Identify input type file path, markdown string, structured data- Read file if path provided- Validate content format### 2. Process ContentFor markdown input:javascript// Use markdown-it or similar parserconst md = requiremarkdown-itconst tokens = md.parsemarkdownContent, For structured input:- Validate JSON schema- Extract document elements### 3. Build DOCX Documentjavascriptconst  Document, Paragraph, TextRun, HeadingLevel  = requiredocxconst doc = new Document  sections: [    properties: ,    children: [      new Paragraph        text: Content here,        heading: HeadingLevel.HEADING_1          ]  ]### 4. Apply Formatting- Convert markdown bold text → TextRun with bold: true- Convert markdown italic text → TextRun with italics: true- Convert headings # → Paragraph with appropriate HeadingLevel- Convert lists → Paragraph with numbering/bullet formatting- Convert tables → Table objects with proper rows/cells

### 5. Inline Markdown Formatting

**CRITICAL**: Inline markdown formatting (**bold**, *italic*, `code`) must be parsed and converted to proper TextRun objects with formatting properties. This affects both table cells and regular paragraphs.

#### Inline Markdown Parser

Parse inline markdown and return array of TextRun objects with proper formatting:

```javascript
const { TextRun } = require('docx');

function parseInlineMarkdown(text) {
  if (!text || typeof text !== 'string') {
    return [new TextRun({ text: '' })];
  }

  const runs = [];
  let remaining = text;
  let position = 0;

  // Pattern priority: code > bold > italic
  // This prevents nested formatting issues
  const patterns = [
    { regex: /`([^`]+)`/g, format: { font: 'Courier New', shading: { type: 'solid', color: 'F0F0F0' } } }, // Inline code
    { regex: /\*\*(.+?)\*\*/g, format: { bold: true } }, // Bold
    { regex: /\*(.+?)\*/g, format: { italics: true } }     // Italic
  ];

  while (position < text.length) {
    let earliestMatch = null;
    let earliestIndex = text.length;
    let matchPattern = null;

    // Find the earliest match among all patterns
    for (const pattern of patterns) {
      pattern.regex.lastIndex = position;
      const match = pattern.regex.exec(text);

      if (match && match.index < earliestIndex) {
        earliestMatch = match;
        earliestIndex = match.index;
        matchPattern = pattern;
      }
    }

    if (!earliestMatch) {
      // No more matches, add remaining text
      if (position < text.length) {
        runs.push(new TextRun({ text: text.substring(position) }));
      }
      break;
    }

    // Add text before match
    if (earliestMatch.index > position) {
      runs.push(new TextRun({ text: text.substring(position, earliestMatch.index) }));
    }

    // Add formatted text
    runs.push(new TextRun({
      text: earliestMatch[1],
      ...matchPattern.format
    }));

    // Move position past the match
    position = earliestMatch.index + earliestMatch[0].length;
  }

  return runs.length > 0 ? runs : [new TextRun({ text: text })];
}

function createParagraphWithFormatting(markdownText, options = {}) {
  const runs = parseInlineMarkdown(markdownText);
  return new Paragraph({
    children: runs,
    ...options
  });
}
```

#### Enhanced Table Cell Formatting

Update table cell creation to parse inline markdown:

```javascript
function createTableCellWithFormatting(cellText, alignment, isHeader = false) {
  const runs = parseInlineMarkdown(cellText);

  // Apply header bold in addition to inline formatting
  if (isHeader) {
    runs.forEach(run => {
      if (run.options && !run.options.font) {
        run.options.bold = true;
      }
    });
  }

  return new TableCell({
    children: [
      new Paragraph({
        children: runs,
        alignment: alignment
      })
    ],
    shading: isHeader ? {
      type: ShadingType.SOLID,
      color: 'E7E6E6',
      fill: 'E7E6E6'
    } : undefined,
    borders: createTableBorders(),
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100
    }
  });
}
```

### 6. Table Handling

Markdown tables require special parsing and conversion to DOCX Table objects. The `docx` package provides comprehensive table support with full styling capabilities.

#### Enhanced Table Detection

Improved table parsing that handles tables with formatting inside cells and imperfect alignment:

```javascript
function detectMarkdownTables(markdownText) {
  const lines = markdownText.split('\n');
  const tables = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect table start: line starts with | or contains multiple |
    if (line.startsWith('|') || (line.match(/\|/g) || []).length >= 2) {
      const tableData = {
        headers: [],
        alignments: [],
        rows: []
      };

      // Parse header row
      const headerCells = line.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);
      tableData.headers = headerCells;

      // Check next line for separator
      i++;
      if (i < lines.length) {
        const separatorLine = lines[i].trim();

        // Detect separator row (contains dashes)
        if (separatorLine.includes('-') && separatorLine.includes('|')) {
          const separators = separatorLine.split('|').map(s => s.trim()).filter(s => s.length > 0);

          // Parse alignments from separator
          tableData.alignments = separators.map(sep => {
            if (sep.startsWith(':') && sep.endsWith(':')) return 'center';
            if (sep.endsWith(':')) return 'right';
            return 'left';
          });

          // Parse data rows
          i++;
          while (i < lines.length) {
            const rowLine = lines[i].trim();

            // Stop at empty line or non-table line
            if (!rowLine || (!rowLine.startsWith('|') && !rowLine.includes('|'))) {
              break;
            }

            const rowCells = rowLine.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);
            if (rowCells.length > 0) {
              // Pad or truncate to match header count
              while (rowCells.length < tableData.headers.length) {
                rowCells.push('');
              }
              tableData.rows.push(rowCells.slice(0, tableData.headers.length));
            }

            i++;
          }

          tables.push(tableData);
          continue;
        }
      }
    }

    i++;
  }

  return tables;
}
```

#### Parsing Markdown Tables

Use markdown-it to extract table structure from tokens:

```javascript
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

function extractTables(markdownText) {
  const tokens = md.parse(markdownText, {});
  const tables = [];

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'table_open') {
      const tableData = {
        headers: [],
        alignments: [],
        rows: []
      };

      // Find table_close to get all table content
      let j = i + 1;
      let currentRow = [];
      let isHeader = false;

      while (j < tokens.length && tokens[j].type !== 'table_close') {
        const token = tokens[j];

        if (token.type === 'thead_open') {
          isHeader = true;
        } else if (token.type === 'thead_close') {
          isHeader = false;
          tableData.headers = currentRow;
          currentRow = [];
        } else if (token.type === 'tbody_open') {
          isHeader = false;
        } else if (token.type === 'tr_open') {
          currentRow = [];
        } else if (token.type === 'tr_close') {
          if (!isHeader && currentRow.length > 0) {
            tableData.rows.push(currentRow);
          }
          currentRow = [];
        } else if (token.type === 'th_open' || token.type === 'td_open') {
          // Extract alignment from style attribute
          const align = token.attrGet('style') || '';
          const alignment = align.includes('text-align:center') ? 'center' :
                          align.includes('text-align:right') ? 'right' : 'left';
          if (isHeader && tableData.alignments.length < tableData.headers.length + 1) {
            tableData.alignments.push(alignment);
          }
        } else if (token.type === 'inline') {
          // Get cell content
          const cellContent = token.content || '';
          currentRow.push(cellContent);
        }

        j++;
      }

      tables.push(tableData);
      i = j;
    }
  }

  return tables;
}
```

#### Creating DOCX Tables

Convert parsed table structure to DOCX Table objects:

```javascript
const { Table, TableRow, TableCell, Paragraph, TextRun,
        AlignmentType, WidthType, BorderStyle, ShadingType } = require('docx');

function createDocxTable(tableData) {
  const rows = [];

  // Create header row if present
  if (tableData.headers && tableData.headers.length > 0) {
    const headerCells = tableData.headers.map((headerText, index) => {
      // Parse inline markdown in header cells
      return createTableCellWithFormatting(
        headerText,
        getAlignment(tableData.alignments[index]),
        true  // isHeader
      );
    });

    rows.push(new TableRow({
      children: headerCells,
      tableHeader: true  // Mark as header row
    }));
  }

  // Create data rows with inline formatting support
  tableData.rows.forEach(rowData => {
    const cells = rowData.map((cellText, index) => {
      // Parse inline markdown in data cells
      return createTableCellWithFormatting(
        cellText,
        getAlignment(tableData.alignments[index]),
        false  // not a header
      );
    });

    rows.push(new TableRow({
      children: cells
    }));
  });

  // Create table with automatic width distribution
  const columnCount = tableData.headers.length ||
                      (tableData.rows[0] ? tableData.rows[0].length : 1);
  const columnWidth = Math.floor(9000 / columnCount); // 9000 DXA ≈ 100% width

  return new Table({
    rows: rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    columnWidths: Array(columnCount).fill(columnWidth),
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100
    }
  });
}

// Helper function for cell alignment
function getAlignment(align) {
  switch (align) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'left':
    default:
      return AlignmentType.LEFT;
  }
}

// Helper function for table borders
function createTableBorders() {
  const border = {
    style: BorderStyle.SINGLE,
    size: 4,  // 1/8 point (4 = 0.5pt)
    color: '999999'  // Medium gray
  };

  return {
    top: border,
    bottom: border,
    left: border,
    right: border,
    insideHorizontal: border,
    insideVertical: border
  };
}
```

#### Complete Table Conversion Example

Full workflow from markdown to DOCX table:

```javascript
const MarkdownIt = require('markdown-it');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');

async function convertMarkdownTableToDocx(markdownText, outputPath) {
  // Parse markdown
  const tables = extractTables(markdownText);

  // Build document sections
  const docChildren = [];

  // Add title if needed
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Document with Tables',
          bold: true,
          size: 32
        })
      ],
      spacing: { after: 200 }
    })
  );

  // Convert each table
  tables.forEach((tableData, index) => {
    // Add table caption if present
    if (tableData.caption) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Table ${index + 1}: ${tableData.caption}`,
              italics: true,
              size: 20
            })
          ],
          spacing: { before: 200, after: 100 }
        })
      );
    }

    // Add the table
    docChildren.push(createDocxTable(tableData));

    // Add spacing after table
    docChildren.push(
      new Paragraph({
        text: '',
        spacing: { after: 200 }
      })
    );
  });

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren
    }]
  });

  // Save to file
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  return {
    success: true,
    tableCount: tables.length,
    outputPath: outputPath
  };
}

// Example usage
const markdown = `
# Sales Report

| Product | Q1 Sales | Q2 Sales | Growth |
|---------|----------:|----------:|:-------:|
| Widget A | $10,000 | $12,000 | +20% |
| Widget B | $8,500 | $9,000 | +6% |
| Widget C | $15,000 | $18,500 | +23% |

Note: All figures in USD.
`;

convertMarkdownTableToDocx(markdown, 'sales-report.docx')
  .then(result => console.log(`Created ${result.outputPath} with ${result.tableCount} tables`))
  .catch(err => console.error('Error:', err));
```

#### Advanced Table Features

**1. Table Captions**

Extract and place captions above or below tables:

```javascript
// Markdown: Table: Monthly Revenue Summary
// Place caption as italic paragraph before table

if (captionMatch = /Table:\s*(.+)/.exec(paragraphBeforeTable)) {
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: captionMatch[1], italics: true })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );
}
```

**2. Column Width Distribution**

Specify custom column widths based on content:

```javascript
function calculateColumnWidths(tableData) {
  const totalWidth = 9000; // Total available width in DXA
  const columnCount = tableData.headers.length;

  // Analyze content length for each column
  const columnLengths = tableData.headers.map((header, index) => {
    const maxLength = Math.max(
      header.length,
      ...tableData.rows.map(row => (row[index] || '').length)
    );
    return maxLength;
  });

  const totalLength = columnLengths.reduce((sum, len) => sum + len, 0);

  // Distribute width proportionally
  return columnLengths.map(len =>
    Math.floor((len / totalLength) * totalWidth)
  );
}
```

**3. Nested Content in Cells**

Support formatted content within cells:

```javascript
function createCellWithFormatting(cellText) {
  // Parse inline markdown in cell
  const runs = [];
  const boldPattern = /\*\*(.+?)\*\*/g;
  const italicPattern = /\*(.+?)\*/g;

  let lastIndex = 0;
  let match;

  // Extract bold text
  while ((match = boldPattern.exec(cellText)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: cellText.substring(lastIndex, match.index) }));
    }
    runs.push(new TextRun({ text: match[1], bold: true }));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cellText.length) {
    runs.push(new TextRun({ text: cellText.substring(lastIndex) }));
  }

  return new TableCell({
    children: [new Paragraph({ children: runs.length > 0 ? runs : [new TextRun({ text: cellText })] })]
  });
}
```

**4. Merged Cells (Colspan/Rowspan)**

Handle merged cells using `columnSpan` and `rowSpan`:

```javascript
// For cells that span multiple columns
new TableCell({
  children: [new Paragraph({ text: 'Merged Cell' })],
  columnSpan: 3,  // Spans 3 columns
  borders: createTableBorders()
})

// For cells that span multiple rows
new TableCell({
  children: [new Paragraph({ text: 'Vertical Merge' })],
  rowSpan: 2,  // Spans 2 rows
  borders: createTableBorders()
})
```

#### Error Handling for Tables

```javascript
function safeTableConversion(tableData) {
  try {
    // Validate table structure
    if (!tableData.rows || tableData.rows.length === 0) {
      console.warn('Empty table detected, skipping');
      return null;
    }

    // Ensure consistent column count
    const expectedColumns = tableData.headers.length || tableData.rows[0].length;
    tableData.rows = tableData.rows.map(row => {
      if (row.length < expectedColumns) {
        // Pad short rows with empty cells
        return [...row, ...Array(expectedColumns - row.length).fill('')];
      } else if (row.length > expectedColumns) {
        // Truncate long rows
        console.warn(`Row has ${row.length} cells, expected ${expectedColumns}`);
        return row.slice(0, expectedColumns);
      }
      return row;
    });

    return createDocxTable(tableData);

  } catch (error) {
    console.error('Table conversion error:', error.message);
    // Return error placeholder table
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '[Table conversion error]',
                      italics: true,
                      color: 'FF0000'
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }
}
```

#### Best Practices for Table Conversion

1. **Preserve Alignment** - Respect markdown column alignment (`:---`, `:---:`, `---:`)
2. **Handle Empty Cells** - Convert empty markdown cells to empty DOCX cells, not null
3. **Consistent Styling** - Use the same border style across all tables in document
4. **Header Differentiation** - Always make header row visually distinct (bold + background)
5. **Width Distribution** - Use percentage-based widths for responsive tables
6. **Cell Padding** - Add margins to cells for better readability
7. **Validate Structure** - Check that all rows have same column count
8. **Inline Formatting** - Parse bold/italic within cells if needed

### 6. Handle Special Elements- Code blocks → Paragraph with monospace font, shading- Links → External hyperlinks with proper styling- Images → ImageRun with embedded or linked images- Block quotes → Paragraph with left border and indentation### 7. Save Documentjavascriptconst Packer = requiredocx.Packerconst fs = requirefsPacker.toBufferdoc.thenbuffer =   fs.writeFileSyncoutput.docx, buffer## DependenciesRequired npm packages:- docx - Microsoft Word document creation- markdown-it - Markdown parsing- fs - File system operationsOptional packages:- markdown-it-attrs - Custom attributes in markdown- markdown-it-container - Custom containers- image-size - Get image dimensions for proper embedding## Example Usage### Convert Markdown File to DOCXbashInput: Convert README.md to a Word documentSteps:1. Read README.md2. Parse markdown content3. Convert to DOCX with formatting4. Save as README.docx5. Report success with file location### Create Business LetterbashInput: Create a business letter in DOCX formatSteps:1. Use business letter template if available2. Prompt for: recipient, date, subject, body3. Build DOCX with proper letterhead formatting4. Save as business-letter-date.docx### Batch Convert Markdown FilesbashInput: Convert all markdown files in docs/ to DOCXSteps:1. Find all .md files in docs/2. For each file:   - Parse markdown   - Convert to DOCX   - Save with same name but .docx extension3. Report converted file count## Error Handling### Common Errors1. File Not Found   - Error: Input file doesnt exist   - Solution: Verify path and try again   - Message: File not found: path. Please check the file path.2. Invalid Markdown   - Error: Markdown parser fails   - Solution: Show parsing error location   - Message: Markdown parsing failed at line line: error3. Image Not Found   - Error: Referenced image missing   - Solution: Skip image, note in output   - Message: Warning: Image not found: path. Continuing without image.4. Permission Denied   - Error: Cannot write output file   - Solution: Check directory permissions   - Message: Cannot write to path. Check permissions.5. Invalid Content Structure   - Error: Structured input doesnt match schema   - Solution: Show validation errors   - Message: Invalid content structure: details## Output Options### File Naming- Default: original-name.docx- Custom: User-specified output path- Auto: document-timestamp.docx### Document Metadatajavascript  creator: DollhouseMCP DOCX Creator,  title: Document Title,  subject: Auto-generated from markdown,  created: new Date,  modified: new Date### Page Setup- Paper size: Letter 8.5 × 11 or A4- Margins: 1 inch default- Orientation: Portrait default or Landscape- Page numbers: Optional## Best Practices1. Preserve Markdown Structure   - Maintain heading hierarchy   - Keep list nesting intact   - Preserve link destinations   - Honor code block languages for syntax highlighting2. Professional Formatting   - Use consistent heading styles   - Proper paragraph spacing   - Readable font sizes 11-12pt body, scaled headings   - Professional font families Calibri, Arial, Times New Roman3. Error Recovery   - Continue on non-critical errors   - Log all warnings   - Provide detailed error messages   - Never create corrupted DOCX files4. Template Support   - Allow template DOCX as base   - Preserve template styles   - Insert content into template sections   - Maintain template headers/footers5. Accessibility   - Add alt text for images when available   - Use proper heading structure   - Include document title   - Maintain logical reading order## Advanced Features### Style Customizationjavascriptconst styles =   paragraphStyles: [          id: CustomHeading1,      name: Custom Heading 1,      basedOn: Heading1,      run:  size: 32, bold: true, color: 2E74B5       ]### Table of Contents- Auto-generate from headings- Update field codes- Custom styling### Multi-Column Layout- Two-column sections- Newspaper-style layouts- Column breaks### Custom Headers/Footers- Different first page- Different odd/even pages- Page numbers with formatting- Dynamic content date, filename## Integration with TemplatesThis skill works with DollhouseMCP template elements:bash# Use template to create DOCXInput: Create a business letter using the business-letter templateFlow:1. Load business-letter template DollhouseMCP template element2. Populate template variables3. Render template to markdown/structured format4. Convert to DOCX using this skill5. Save output## Performance Considerations- Large documents 100 pages: Process in chunks- Many images: Consider file size limits- Complex tables: May require manual adjustment- Batch conversions: Process sequentially to avoid memory issues## Testing Checklist- [ ] Basic markdown conversion headings, paragraphs, lists- [ ] Inline formatting bold, italic, code- [ ] Tables with various complexities- [ ] Images local and URLs- [ ] Links internal and external- [ ] Code blocks with syntax highlighting- [ ] Nested lists 3+ levels- [ ] Mixed content types- [ ] Template integration- [ ] Error handling for missing files- [ ] Large file handling 10+ MB markdown- [ ] Special characters and Unicode## Notes- DOCX files are actually ZIP archives containing XML- Use official docx npm package for spec compliance- Test output in Microsoft Word, Google Docs, LibreOffice- Consider DOCX vs DOC legacy - DOCX is preferred- File size: DOCX is compressed, typically smaller than equivalent PDF## Future Enhancements- [ ] Support for footnotes and endnotes- [ ] Math equations LaTeX → Office Math ML- [ ] Charts and diagrams Mermaid → embedded images- [ ] Comments and tracked changes- [ ] Document protection and encryption- [ ] Batch processing with parallel execution- [ ] Template gallery integration- [ ] Style theme picker professional, academic, creative
