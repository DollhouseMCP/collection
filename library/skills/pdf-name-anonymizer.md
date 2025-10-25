---
name: pdf-name-anonymizer
description: >-
  Advanced PDF text processing skill that identifies and anonymizes all personal
  names in research papers and documents by replacing them with sequential
  anonymous identifiers
author: DollhouseMCP
version: 1.0.0
created: '2025-09-22T22:07:51.512Z'
modified: '2025-09-22T22:07:51.512Z'
tags: []
dependencies:
  - PyPDF2
  - pdfplumber
  - reportlab
  - re
  - nltk
custom: {}
languages: []
complexity: intermediate
domains:
  - document_processing
  - privacy
  - anonymization
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# PDF Name Anonymizer Skill

## Purpose

This skill specializes in anonymizing personal names in PDF documents by replacing them with sequential anonymous identifiers Anonymous 1, Anonymous 2, etc. while preserving the documents structure and readability.

## Core Capabilities

### Name Detection

- Identifies personal names in academic papers and research documents

- Recognizes author names, cited researchers, and mentioned individuals

- Distingui

shes between personal names and institutional/organization names

- Handles various name formats First Last, Last, First, initials, etc.

### Anonymization Strategy

- Replaces identified names with Anonymous X format where X is sequential

- Maintains consistency same person = same anonymous identifier throughout

- Preserves references and citations structure

- Keeps institutional affiliations and organizations unchanged

### PDF Processing

- Extracts text content from PDF while preserving formatting

- Processes both main text and reference sections

- Handles multi-column layouts and complex document structures

- Generates new PDF with anonymized content

## Implementation Process

1. PDF Text Extraction: Extract all text content from the uploaded PDF

2. Name Identification: Use pattern recognition to identify personal names

3. Mapping Creation: Create consistent mapping of real names to anonymous identifiers

4. Text Replacement: Replace all instances of identified names

5. PDF Generation: Create new PDF with anonymized content

6. Quality Check: Verify anonymization completeness and document integrity

## Technical Requirements

- PDF processing libraries PyPDF2, pdfplumber, reportlab

- Name recognition patterns and NLP techniques

- Text replacement al

gorithms with context preservation

- PDF generation capabilities

## Output Specifications

- New PDF file with all personal names anonymized

- Mapping log showing original names and their anonymous assignments

- Preservation of document structure, citations, and academic formatting
