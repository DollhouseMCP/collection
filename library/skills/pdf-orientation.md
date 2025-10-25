---
name: pdf-orientation
description: >-
  Comprehensive PDF page orientation detection and correction using adaptive
  intelligence with code exemplars for PyPDF2, pdf-lib, and reportlab
author: Mick Darling
version: 1.0.2
created: '2025-10-18T18:11:58.043Z'
modified: '2025-10-18T18:11:58.043Z'
tags:
  - pdf
  - orientation
  - rotation
  - document-correction
  - adaptive
dependencies:
  python:
    - PyPDF2
    - pdf2image
    - pytesseract
  javascript:
    - pdf-lib
custom: {}
triggers:
  - pdf
  - rotate
  - orientation
  - sideways
  - landscape
  - portrait
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# PDF Orientation Detection and Correction

## Overview

This skill enables intelligent PDF page orientation analysis and correction. Unlike deterministic scripts that rigidly rotate pages, this skill adapts to user intent using exemplar code patterns that Claude can understand, modify, and apply contextually.

## Capabilities

### Detection

- Analyze PDF pages to determine current orientation

- Detect text direction and page dimensions

- Identify landscape vs portrait layouts

- Recognize inverted or rotated content

### Correction

- Rotate pages to correct orientation

- Handle mixed-orientation documents

- Preserve document structure and metadata

- Support batch processing of multiple pages

### Adaptive Intelligence

- Interpret natural language requests make it readable, fix the sideways pages

- Determine appropriate rotation based on content analysis

- Handle ambiguous cases with intelligent defaults

- Provide preview/confirmation options when needed

## Code Exemplars

### Python: PyPDF2 Approach

pythonfrom PyPDF2 import PdfReader, PdfWriterimport sysdef detect_and_correct_orientationinput_path, output_path, rotation_angle=None:
  Detect and correct PDF page orientation.        Args:
  input_path: Path to input PDF        output_path: Path to output PDF        rotation_angle: Optional explicit rotation 0, 90, 180, 270                       If None, auto-detect based on content        reader = PdfReaderinput_path    writer = PdfWriter        for page_num, page in enumeratereader.pages:
  # Get page dimensions        mediabox = page.mediabox        width = floatmediabox.width        height = floatmediabox.height                # Detect if page is landscape width  height        is_landscape = width  height                # Auto-detect rotation if not specified        if rotation_angle is None:
  # Check if page has rotation metadata            current_rotation = page.get/Rotate, 0                        # Heuristic: if landscape and rotated 90/270, probably needs correction            if is_landscape and current_rotation in [90, 270]:
  rotation_angle = 90            # If portrait and rotated 90/270, might need 180 correction            elif not is_landscape and current_rotation in [90, 270]:
  rotation_angle = 180            else:
  rotation_angle = 0                # Apply rotation        if rotation_angle = 0:
  page.rotaterotation_angle                writer.add_pagepage        # Write output    with openoutput_path, wb as output_file:
  writer.writeoutput_file        return         pages_processed: lenreader.pages,        rotation_applied: rotation_angle,        output_path: output_path    # Example usageif __name__ == __main__:
  input_pdf = sys.argv[1] if lensys.argv  1 else input.pdf    output_pdf = sys.argv[2] if lensys.argv  2 else output.pdf    angle = intsys.argv[3] if lensys.argv  3 else None        result = detect_and_correct_orientationinput_pdf, output_pdf, angle    printfProcessed result[pages_processed] pages    printf

Applied result[rotation_applied]° rotation

### JavaScript: pdf-lib Approach

javascriptimport  PDFDocument, degrees  from pdf-libimport fs from fsasync function detectAndCorrectOrientationinputPath, outputPath, rotationAngle = null     // Load the PDF    const existingPdfBytes = fs.readFileSyncinputPath    const pdfDoc = await PDFDocument.loadexistingPdfBytes        const pages = pdfDoc.getPages        for let i = 0 i  pages.length i++         const page = pages[i]        const  width, height  = page.getSize        const currentRotation = page.getRotation.angle                // Auto-detect if rotation not specified        let rotation = rotationAngle        if rotation === null             // Detect landscape orientation            const isLandscape = width  height                        // Apply heuristics for correction            if isLandscape  currentRotation === 90  currentRotation === 270                 rotation = 90             else if isLandscape  currentRotation === 90  currentRotation === 270                 rotation = 180             else                 rotation = 0                                    // Apply rotation if needed        if rotation == 0             page.setRotationdegreescurrentRotation + rotation % 360                    // Save the modified PDF    const pdfBytes = await pdfDoc.save    fs.writeFileSyncoutputPath, pdfBytes        return         pagesProcessed: pages.length,        rotationApplied: rotationAngle  auto-detected,        outputPath: outputPath    // Example usageconst args = process.argv.slice2const inputPdf = args[0]  input.pdfconst outputPdf = args[1]  output.pdfconst angle = args[2]  parseIntargs[2] : nulldetectAndCorrectOrientationinputPdf, outputPdf, angle    .thenresult =         console.logProcessed result.pagesProcessed pages        console.logApplied result.rotationApplied rotation        .catcherr = console.error

Error:, err

### Python: Advanced Detection with OCR

pythonfrom PyPDF2 import PdfReader, PdfWriterfrom pdf2image import convert_from_pathimport pytesseractfrom PIL import Imageimport numpy as npdef detect_text_orientationimage:
  Use OCR to detect text orientation in an image.    Returns suggested rotation angle.        # Try different rotations and measure OCR confidence    confidences =         for angle in [0, 90, 180, 270]:
  rotated = image.rotateangle, expand=True        osd = pytesseract.image_to_osdrotated                # Parse OSD output for confidence        for line in osd.splitn:
  if Orientation confidence in line:
  conf = floatline.split:[1].strip                confidences[angle] = conf        # Return angle with highest confidence    best_angle = maxconfidences.items, key=lambda x: x[1]    return best_angle[0]def smart_orientation_correctioninput_path, output_path, use_ocr=False:
  Intelligently correct PDF orientation using content analysis.        Args:
  input_path: Input PDF path        output_path: Output PDF path        use_ocr: If True, use OCR for text direction detection        reader = PdfReaderinput_path    writer = Pdf

Writer        for page_num, page in enumeratereader.pages:
  rotation = 0                if use_ocr:
  # Convert page to image for OCR analysis            images = convert_from_pathinput_path, first_page=page_num+1, last_page=page_num+1            if images:
  rotation = detect_text_orientationimages[0]        else:
  # Use dimension-based heuristics            mediabox = page.mediabox            width = floatmediabox.width            height = floatmediabox.height            current_rotation = page.get/Rotate, 0                        # Simple heuristic            if width  height and current_rotation in [90, 270]:
  rotation = 90                if rotation = 0:
  page.rotaterotation                writer.add_pagepage        with openoutput_path, wb as f:
  writer.writef        return output_path

## Usage Patterns

### Natural Language CommandsFix the orientation of this PDFRotate all pages 90 degrees clockwiseMake the sideways pages readableCorrect pages 3-7 to portrait orientation

Auto-detect and fix the orientation

### Adaptive Interpretation

Claude will:
  1. Analyze the request to understand user intent

2. Select appropriate approach explicit rotation vs auto-detection

3. Choose the right tool PyPDF2 for simple, OCR for complex

4. Modify the exemplar code to match the specific use case

5. Execute and verify the result

## Key Advantages Over Deterministic Scripts

### Flexibility

- Adapts code to specific file paths and requirements

- Handles edge cases not in the original script

- Combines approaches when needed e.g., OCR + metadata

### Natural Language Understanding

- No need to memorize exact command syntax

- Interprets make it readable intelligently

- Asks clarifying questions when ambiguous

### Contextual Awareness

- Considers document structure when rotating

- Preserves important metadata

- Provides appropriate error handling for the situation

### Code as Template, Not Black Box

- Can explain what the code does

- Modifies code for specific requirements

- Combines multiple approaches creatively

## Implementation Notes

### Dependencies

Python approach requires:
  - PyPDF2 or pypdf for PDF manipulation

- pdf2image + pytesseract for OCR optional

- Pillow for image processing optional

Java

Script approach requires:
  - pdf-lib for PDF manipulation

- Node.js environment

### Best Practices

- Always create backups before modifying PDFs

- Verify rotation with preview before batch processing

- Consider file size when using OCR-based detection

- Test with sample documents first

### Error Handling

Claude should handle:
  - Missing or corrupted PDF files

- Permission errors

- Invalid rotation angles

- Memory issues with large files

## Examples

### Example 1: Simple RotationUser: Rotate this PDF 90 degrees clockwise

Claude: Adapts Python exemplar with rotation_angle=90

### Example 2: Auto-DetectionUser: Fix the orientation

- some pages are sideways

Claude: Uses dimension analysis to detect landscape pages and corrects them

### Example 3: Selective Rotation

User: Only rotate pages 5 through 10Claude: Modifies exemplar to process specific page range

## Comparison with Deterministic Approach Aspect  DollhouseMCP Adaptive  Anthropic Deterministic ----------------------------------------------------

- Flexibility  Modifies code per request  Fixed script execution  Natural Language  Full interpretation  Limited to predefined commands  Edge Cases  Creates solutions on-the-fly  Only handles programmed cases  Learning  Improves with context  Static behavior  Transparency  Can explain and modify  Black box execution #

# ConclusionThis skill demonstrates that adaptive intelligence with exemplar code can equal or exceed the capabilities of deterministic scripts, while providing:
  - Greater flexibility

- Better natural language understanding

- Contextual awareness

- Transparency and explainability

The code exemplars s
