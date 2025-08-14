#!/usr/bin/env node

/**
 * Integration Tester for PR Validation
 * 
 * This utility performs integration testing on content elements,
 * verifying that they can be properly loaded, parsed, and function
 * as expected within the collection ecosystem.
 * 
 * Features:
 * - Element loading and parsing tests
 * - Schema validation compliance
 * - Cross-reference integrity checks
 * - Collection compatibility testing
 * - Runtime validation simulation
 * - Dependency resolution verification
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * Integration test suite configuration
 */
const TEST_SUITE = {
  ELEMENT_LOADING: {
    name: 'Element Loading',
    weight: 25,
    tests: [
      'canParseYaml',
      'hasValidStructure',
      'metadataComplete',
      'contentAccessible'
    ]
  },
  
  SCHEMA_COMPLIANCE: {
    name: 'Schema Compliance',
    weight: 25,
    tests: [
      'requiredFieldsPresent',
      'fieldTypesCorrect',
      'constraintsRespected',
      'enumValuesValid'
    ]
  },
  
  COLLECTION_INTEGRATION: {
    name: 'Collection Integration',
    weight: 20,
    tests: [
      'uniqueIdUnique',
      'noCircularReferences',
      'validCategories',
      'properNaming'
    ]
  },
  
  FUNCTIONAL_VALIDATION: {
    name: 'Functional Validation',
    weight: 15,
    tests: [
      'templateVariablesValid',
      'linksResolvable',
      'codeBlocksValid',
      'examplesWorking'
    ]
  },
  
  PERFORMANCE_CHECK: {
    name: 'Performance Check',
    weight: 10,
    tests: [
      'fileSizeReasonable',
      'parsingPerformance',
      'memoryUsage'
    ]
  },
  
  COMPATIBILITY: {
    name: 'Compatibility',
    weight: 5,
    tests: [
      'platformIndependent',
      'encodingValid'
    ]
  }
};

/**
 * Integration tester class
 */
class IntegrationTester {
  constructor() {
    this.results = {
      files: {},
      summary: {
        totalFiles: 0,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        overallSuccess: false,
        testSuites: {}
      },
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    // Load existing collection for reference checks
    this.existingElements = new Map();
    this.loadExistingElements();
  }

  /**
   * Load existing elements for reference checks
   */
  async loadExistingElements() {
    try {
      const searchPaths = [
        'library/**/*.md',
        'showcase/**/*.md',
        'catalog/**/*.md'
      ];

      for (const searchPath of searchPaths) {
        const files = await glob(searchPath, { cwd: rootDir, absolute: true });
        
        for (const file of files) {
          try {
            const content = fs.readFileSync(file, 'utf8');
            const parsed = matter(content);
            if (parsed.data.unique_id) {
              this.existingElements.set(parsed.data.unique_id, {
                path: file,
                metadata: parsed.data
              });
            }
          } catch {
            // Skip files that can't be parsed
            continue;
          }
        }
      }
      
      console.log(`📚 Loaded ${this.existingElements.size} existing elements for reference`);
    } catch (error) {
      console.warn(`⚠️  Warning: Could not load existing elements: ${error.message}`);
    }
  }

  /**
   * Run integration tests on multiple files
   */
  async testFiles(filePaths) {
    console.log(`🧪 Starting integration tests on ${filePaths.length} files...`);
    
    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        await this.testFile(filePath);
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
        this.results.files[filePath] = {
          path: filePath,
          error: 'File not found',
          testResults: {},
          passed: false
        };
      }
    }

    this.calculateSummary();
    return this.results;
  }

  /**
   * Run integration tests on individual file
   */
  async testFile(filePath) {
    console.log(`📋 Testing: ${filePath}`);
    
    const fileResult = {
      path: filePath,
      testResults: {},
      passed: false,
      issues: [],
      warnings: [],
      metadata: null,
      contentBody: null,
      stats: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0
      }
    };

    try {
      // Parse file content
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(content);
      fileResult.metadata = parsed.data;
      fileResult.contentBody = parsed.content;

      // Run all test suites
      for (const [suiteName, suite] of Object.entries(TEST_SUITE)) {
        await this.runTestSuite(suiteName, suite, fileResult, content);
      }

      // Calculate file results
      fileResult.passed = fileResult.stats.failedTests === 0;
      
      console.log(`   Tests: ${fileResult.stats.passedTests}✅ ${fileResult.stats.failedTests}❌ ${fileResult.stats.skippedTests}⏭️ - ${fileResult.passed ? 'PASSED' : 'FAILED'}`);
      
    } catch (error) {
      console.error(`❌ Error testing ${filePath}: ${error.message}`);
      fileResult.error = error.message;
      fileResult.issues.push({
        category: 'system',
        severity: 'critical',
        message: `Failed to process file: ${error.message}`,
        test: 'file_processing'
      });
    }

    this.results.files[filePath] = fileResult;
  }

  /**
   * Run a specific test suite
   */
  async runTestSuite(suiteName, suite, fileResult, content) {
    const suiteResult = {
      name: suite.name,
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: {}
    };

    for (const testName of suite.tests) {
      try {
        const result = await this.runTest(suiteName, testName, fileResult, content);
        suiteResult.tests[testName] = result;
        
        fileResult.stats.totalTests++;
        
        if (result.passed) {
          suiteResult.passed++;
          fileResult.stats.passedTests++;
        } else if (result.skipped) {
          suiteResult.skipped++;
          fileResult.stats.skippedTests++;
        } else {
          suiteResult.failed++;
          fileResult.stats.failedTests++;
          
          fileResult.issues.push({
            category: suiteName.toLowerCase(),
            severity: result.severity || 'medium',
            message: result.message || `Test ${testName} failed`,
            test: testName,
            details: result.details
          });
        }
      } catch (error) {
        console.error(`Error running test ${testName}: ${error.message}`);
        suiteResult.tests[testName] = {
          passed: false,
          skipped: false,
          message: `Test execution error: ${error.message}`,
          severity: 'high'
        };
        suiteResult.failed++;
        fileResult.stats.failedTests++;
      }
    }

    fileResult.testResults[suiteName] = suiteResult;
  }

  /**
   * Run individual test
   */
  async runTest(suiteName, testName, fileResult, content) {
    const methodName = `test_${suiteName}_${testName}`;
    
    if (typeof this[methodName] === 'function') {
      return await this[methodName](fileResult, content);
    } else {
      return {
        passed: false,
        skipped: true,
        message: `Test method ${methodName} not implemented`
      };
    }
  }

  // Element Loading Tests
  async test_ELEMENT_LOADING_canParseYaml(fileResult, content) {
    try {
      const parsed = matter(content);
      if (!parsed.data || Object.keys(parsed.data).length === 0) {
        return {
          passed: false,
          message: 'No YAML frontmatter found or empty metadata',
          severity: 'high'
        };
      }
      return { passed: true, message: 'YAML parsed successfully' };
    } catch (error) {
      return {
        passed: false,
        message: `YAML parsing failed: ${error.message}`,
        severity: 'critical'
      };
    }
  }

  async test_ELEMENT_LOADING_hasValidStructure(fileResult, content) {
    if (!content.startsWith('---')) {
      return {
        passed: false,
        message: 'File must start with YAML frontmatter (---)',
        severity: 'high'
      };
    }

    const yamlEnd = content.indexOf('---', 3);
    if (yamlEnd === -1) {
      return {
        passed: false,
        message: 'YAML frontmatter not properly closed with ---',
        severity: 'high'
      };
    }

    return { passed: true, message: 'Valid file structure' };
  }

  async test_ELEMENT_LOADING_metadataComplete(fileResult, _content) {
    const metadata = fileResult.metadata;
    if (!metadata) {
      return { passed: false, message: 'No metadata available', severity: 'critical' };
    }

    const requiredFields = ['name', 'description', 'unique_id', 'author', 'type'];
    const missingFields = requiredFields.filter(field => !metadata[field]);

    if (missingFields.length > 0) {
      return {
        passed: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        severity: 'high',
        details: { missingFields }
      };
    }

    return { passed: true, message: 'All required metadata fields present' };
  }

  async test_ELEMENT_LOADING_contentAccessible(fileResult, _content) {
    const contentBody = fileResult.contentBody;
    if (!contentBody || contentBody.trim().length < 10) {
      return {
        passed: false,
        message: 'Content body is empty or too short',
        severity: 'medium'
      };
    }

    return { passed: true, message: 'Content body accessible and non-empty' };
  }

  // Schema Compliance Tests
  async test_SCHEMA_COMPLIANCE_requiredFieldsPresent(fileResult, _content) {
    // This is similar to metadata complete but more comprehensive
    const metadata = fileResult.metadata;
    if (!metadata) return { passed: false, message: 'No metadata', severity: 'critical' };

    const requiredByType = {
      persona: ['name', 'description', 'unique_id', 'author', 'type'],
      skill: ['name', 'description', 'unique_id', 'author', 'type'],
      agent: ['name', 'description', 'unique_id', 'author', 'type'],
      prompt: ['name', 'description', 'unique_id', 'author', 'type'],
      template: ['name', 'description', 'unique_id', 'author', 'type'],
      tool: ['name', 'description', 'unique_id', 'author', 'type'],
      ensemble: ['name', 'description', 'unique_id', 'author', 'type', 'elements'],
      memory: ['name', 'description', 'unique_id', 'author', 'type']
    };

    const elementType = metadata.type;
    const required = requiredByType[elementType] || requiredByType.persona;
    const missing = required.filter(field => !metadata[field]);

    if (missing.length > 0) {
      return {
        passed: false,
        message: `Missing required fields for ${elementType}: ${missing.join(', ')}`,
        severity: 'high'
      };
    }

    return { passed: true, message: `All required fields present for ${elementType}` };
  }

  async test_SCHEMA_COMPLIANCE_fieldTypesCorrect(fileResult, _content) {
    const metadata = fileResult.metadata;
    if (!metadata) return { passed: false, message: 'No metadata', severity: 'critical' };

    const typeChecks = [
      { field: 'name', type: 'string', required: true },
      { field: 'description', type: 'string', required: true },
      { field: 'unique_id', type: 'string', required: true },
      { field: 'version', type: 'string', required: false },
      { field: 'tags', type: 'array', required: false },
      { field: 'elements', type: 'array', required: false }
    ];

    const errors = [];

    for (const check of typeChecks) {
      const value = metadata[check.field];
      
      if (check.required && (value === undefined || value === null)) {
        errors.push(`${check.field} is required but missing`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (check.type === 'string' && typeof value !== 'string') {
          errors.push(`${check.field} should be a string, got ${typeof value}`);
        } else if (check.type === 'array' && !Array.isArray(value)) {
          errors.push(`${check.field} should be an array, got ${typeof value}`);
        }
      }
    }

    if (errors.length > 0) {
      return {
        passed: false,
        message: `Type validation errors: ${errors.join('; ')}`,
        severity: 'medium',
        details: { errors }
      };
    }

    return { passed: true, message: 'All field types are correct' };
  }

  async test_SCHEMA_COMPLIANCE_constraintsRespected(fileResult, _content) {
    const metadata = fileResult.metadata;
    if (!metadata) return { passed: false, message: 'No metadata', severity: 'critical' };

    const violations = [];

    // Unique ID format check
    if (metadata.unique_id && !/^[a-z0-9-_]+$/.test(metadata.unique_id)) {
      violations.push('unique_id must contain only lowercase letters, numbers, hyphens, and underscores');
    }

    // Name length check
    if (metadata.name && (metadata.name.length < 3 || metadata.name.length > 100)) {
      violations.push('name must be between 3 and 100 characters');
    }

    // Description length check
    if (metadata.description && (metadata.description.length < 10 || metadata.description.length > 500)) {
      violations.push('description must be between 10 and 500 characters');
    }

    // Version format check
    if (metadata.version && !/^\d+\.\d+\.\d+$/.test(metadata.version)) {
      violations.push('version should follow semantic versioning (e.g., 1.0.0)');
    }

    if (violations.length > 0) {
      return {
        passed: false,
        message: `Constraint violations: ${violations.join('; ')}`,
        severity: 'medium',
        details: { violations }
      };
    }

    return { passed: true, message: 'All constraints respected' };
  }

  async test_SCHEMA_COMPLIANCE_enumValuesValid(fileResult, _content) {
    const metadata = fileResult.metadata;
    if (!metadata) return { passed: false, message: 'No metadata', severity: 'critical' };

    const validTypes = ['persona', 'skill', 'agent', 'prompt', 'template', 'tool', 'ensemble', 'memory'];
    const validCategories = ['creative', 'educational', 'gaming', 'personal', 'professional'];

    const violations = [];

    if (metadata.type && !validTypes.includes(metadata.type)) {
      violations.push(`Invalid type: ${metadata.type}. Valid types: ${validTypes.join(', ')}`);
    }

    if (metadata.category && !validCategories.includes(metadata.category)) {
      violations.push(`Invalid category: ${metadata.category}. Valid categories: ${validCategories.join(', ')}`);
    }

    if (violations.length > 0) {
      return {
        passed: false,
        message: `Enum value violations: ${violations.join('; ')}`,
        severity: 'high',
        details: { violations }
      };
    }

    return { passed: true, message: 'All enum values are valid' };
  }

  // Collection Integration Tests
  async test_COLLECTION_INTEGRATION_uniqueIdUnique(fileResult, _content) {
    const metadata = fileResult.metadata;
    if (!metadata?.unique_id) {
      return { passed: false, message: 'No unique_id to check', severity: 'high' };
    }

    const existingElement = this.existingElements.get(metadata.unique_id);
    if (existingElement && existingElement.path !== fileResult.path) {
      return {
        passed: false,
        message: `unique_id "${metadata.unique_id}" already exists in ${existingElement.path}`,
        severity: 'critical',
        details: { conflictingPath: existingElement.path }
      };
    }

    return { passed: true, message: 'unique_id is unique' };
  }

  async test_COLLECTION_INTEGRATION_noCircularReferences(fileResult, _content) {
    const metadata = fileResult.metadata;
    
    // Check for ensemble circular references
    if (metadata.type === 'ensemble' && metadata.elements) {
      if (metadata.elements.includes(metadata.unique_id)) {
        return {
          passed: false,
          message: 'Ensemble cannot reference itself',
          severity: 'high'
        };
      }
    }

    return { passed: true, message: 'No circular references detected' };
  }

  async test_COLLECTION_INTEGRATION_validCategories(fileResult, _content) {
    // This overlaps with enum validation but adds integration context
    const metadata = fileResult.metadata;
    if (!metadata?.category) {
      return { passed: true, message: 'No category specified (optional)', skipped: true };
    }

    const validCategories = ['creative', 'educational', 'gaming', 'personal', 'professional'];
    
    if (!validCategories.includes(metadata.category)) {
      return {
        passed: false,
        message: `Invalid category for collection integration: ${metadata.category}`,
        severity: 'medium'
      };
    }

    return { passed: true, message: 'Category is valid for collection' };
  }

  async test_COLLECTION_INTEGRATION_properNaming(fileResult, _content) {
    const fileName = path.basename(fileResult.path, '.md');
    const metadata = fileResult.metadata;
    
    if (!metadata?.unique_id) {
      return { passed: false, message: 'No unique_id for naming check', severity: 'medium' };
    }

    // File name should match or be derived from unique_id
    const normalizedId = metadata.unique_id.replace(/[^a-z0-9-_]/g, '-');
    
    if (fileName !== normalizedId && fileName !== metadata.unique_id) {
      return {
        passed: false,
        message: `File name "${fileName}" doesn't match unique_id "${metadata.unique_id}"`,
        severity: 'low',
        details: { 
          fileName, 
          uniqueId: metadata.unique_id, 
          suggested: normalizedId 
        }
      };
    }

    return { passed: true, message: 'File naming follows conventions' };
  }

  // Functional Validation Tests
  async test_FUNCTIONAL_VALIDATION_templateVariablesValid(fileResult, _content) {
    const contentBody = fileResult.contentBody;
    if (!contentBody) return { passed: true, message: 'No content to check', skipped: true };

    // Check for template variables like {{variable}} or {variable}
    const templateVars = contentBody.match(/\{\{?([^}]+)\}?\}/g);
    
    if (!templateVars) {
      return { passed: true, message: 'No template variables found' };
    }

    const issues = [];
    
    for (const variable of templateVars) {
      // Check for malformed variables
      if (variable.includes('<') || variable.includes('>') || variable.includes('script')) {
        issues.push(`Potentially malicious template variable: ${variable}`);
      }
      
      // Check for unclosed variables
      if (!variable.endsWith('}')) {
        issues.push(`Malformed template variable: ${variable}`);
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        message: `Template variable issues: ${issues.join('; ')}`,
        severity: 'medium',
        details: { issues, variables: templateVars }
      };
    }

    return { 
      passed: true, 
      message: `Found ${templateVars.length} valid template variables`,
      details: { variableCount: templateVars.length }
    };
  }

  async test_FUNCTIONAL_VALIDATION_linksResolvable(fileResult, _content) {
    const contentBody = fileResult.contentBody;
    if (!contentBody) return { passed: true, message: 'No content to check', skipped: true };

    const links = contentBody.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    
    if (!links) {
      return { passed: true, message: 'No links found' };
    }

    const issues = [];
    
    for (const link of links) {
      const urlMatch = link.match(/\(([^)]+)\)/);
      if (!urlMatch) continue;
      
      const url = urlMatch[1];
      
      // Check for obviously invalid URLs
      if (url.includes('javascript:') || url.includes('data:') || url.includes('<script')) {
        issues.push(`Potentially malicious link: ${url}`);
      }
      
      // Check for broken relative links (very basic)
      if (url.startsWith('./') || url.startsWith('../')) {
        // Would need filesystem access to properly validate
        // For now, just check format
        if (url.includes('..') && url.includes('//')) {
          issues.push(`Suspicious relative link: ${url}`);
        }
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        message: `Link issues found: ${issues.join('; ')}`,
        severity: 'medium',
        details: { issues, linkCount: links.length }
      };
    }

    return { 
      passed: true, 
      message: `Found ${links.length} links, no obvious issues`,
      details: { linkCount: links.length }
    };
  }

  async test_FUNCTIONAL_VALIDATION_codeBlocksValid(fileResult, _content) {
    const contentBody = fileResult.contentBody;
    if (!contentBody) return { passed: true, message: 'No content to check', skipped: true };

    const codeBlocks = contentBody.match(/```[\s\S]*?```/g);
    
    if (!codeBlocks) {
      return { passed: true, message: 'No code blocks found' };
    }

    const issues = [];
    
    for (const block of codeBlocks) {
      // Check for properly closed code blocks
      if (!block.endsWith('```')) {
        issues.push('Unclosed code block found');
      }
      
      // Check for potentially malicious code patterns
      if (block.includes('eval(') || block.includes('exec(') || block.includes('system(')) {
        issues.push('Code block contains potentially dangerous functions');
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        message: `Code block issues: ${issues.join('; ')}`,
        severity: 'medium',
        details: { issues, blockCount: codeBlocks.length }
      };
    }

    return { 
      passed: true, 
      message: `Found ${codeBlocks.length} valid code blocks`,
      details: { blockCount: codeBlocks.length }
    };
  }

  async test_FUNCTIONAL_VALIDATION_examplesWorking(fileResult, _content) {
    const contentBody = fileResult.contentBody;
    if (!contentBody) return { passed: true, message: 'No content to check', skipped: true };

    // Look for example sections
    const hasExamples = contentBody.toLowerCase().includes('example') || 
                       contentBody.toLowerCase().includes('usage') ||
                       contentBody.includes('```');

    if (!hasExamples) {
      return {
        passed: false,
        message: 'No examples or usage instructions found',
        severity: 'low'
      };
    }

    return { passed: true, message: 'Examples or usage instructions present' };
  }

  // Performance Check Tests
  async test_PERFORMANCE_CHECK_fileSizeReasonable(fileResult, content) {
    const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;
    const maxSizeKB = 100; // 100KB limit
    
    if (sizeKB > maxSizeKB) {
      return {
        passed: false,
        message: `File size ${sizeKB.toFixed(1)}KB exceeds limit of ${maxSizeKB}KB`,
        severity: 'medium',
        details: { sizeKB, maxSizeKB }
      };
    }

    return { 
      passed: true, 
      message: `File size ${sizeKB.toFixed(1)}KB is reasonable`,
      details: { sizeKB }
    };
  }

  async test_PERFORMANCE_CHECK_parsingPerformance(fileResult, content) {
    const startTime = process.hrtime.bigint();
    
    try {
      // Simulate parsing operations
      matter(content);
      JSON.stringify(fileResult.metadata);
      
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000;
      
      const maxParsingTime = 100; // 100ms
      
      if (durationMs > maxParsingTime) {
        return {
          passed: false,
          message: `Parsing took ${durationMs.toFixed(1)}ms, exceeds limit of ${maxParsingTime}ms`,
          severity: 'low',
          details: { durationMs, maxParsingTime }
        };
      }

      return { 
        passed: true, 
        message: `Parsing completed in ${durationMs.toFixed(1)}ms`,
        details: { durationMs }
      };
    } catch (error) {
      return {
        passed: false,
        message: `Parsing performance test failed: ${error.message}`,
        severity: 'medium'
      };
    }
  }

  async test_PERFORMANCE_CHECK_memoryUsage(fileResult, content) {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Simulate memory operations
    const largeCopy = content.repeat(10);
    // Parse content to simulate memory usage (result intentionally unused)
    const _parsed = matter(largeCopy);
    
    const currentMemory = process.memoryUsage().heapUsed;
    const memoryIncreaseMB = (currentMemory - initialMemory) / 1024 / 1024;
    
    const maxMemoryIncreaseMB = 50; // 50MB limit
    
    if (memoryIncreaseMB > maxMemoryIncreaseMB) {
      return {
        passed: false,
        message: `Memory usage increased by ${memoryIncreaseMB.toFixed(1)}MB, exceeds limit of ${maxMemoryIncreaseMB}MB`,
        severity: 'low',
        details: { memoryIncreaseMB, maxMemoryIncreaseMB }
      };
    }

    return { 
      passed: true, 
      message: `Memory usage increase ${memoryIncreaseMB.toFixed(1)}MB is acceptable`,
      details: { memoryIncreaseMB }
    };
  }

  // Compatibility Tests
  async test_COMPATIBILITY_platformIndependent(fileResult, content) {
    // Check for platform-specific paths or commands
    const platformSpecific = [
      /\\\\|C:\\/,  // Windows paths
      /\/usr\/|\/bin\/|\/etc\//,  // Unix paths
      /\r\n/g  // Windows line endings (should be normalized)
    ];

    const issues = [];
    
    for (const pattern of platformSpecific) {
      if (pattern.test(content)) {
        issues.push(`Potentially platform-specific content detected: ${pattern.source}`);
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        message: `Platform compatibility issues: ${issues.join('; ')}`,
        severity: 'low',
        details: { issues }
      };
    }

    return { passed: true, message: 'Content appears platform-independent' };
  }

  async test_COMPATIBILITY_encodingValid(fileResult, content) {
    try {
      // Try to encode/decode as UTF-8
      const buffer = Buffer.from(content, 'utf8');
      const decoded = buffer.toString('utf8');
      
      if (decoded !== content) {
        return {
          passed: false,
          message: 'Content encoding issue detected',
          severity: 'medium'
        };
      }

      // Check for BOMs or other encoding markers
      if (content.charCodeAt(0) === 0xFEFF) {
        return {
          passed: false,
          message: 'BOM detected - remove byte order mark',
          severity: 'low'
        };
      }

      return { passed: true, message: 'Valid UTF-8 encoding' };
    } catch (error) {
      return {
        passed: false,
        message: `Encoding validation failed: ${error.message}`,
        severity: 'medium'
      };
    }
  }

  /**
   * Calculate overall summary
   */
  calculateSummary() {
    const files = Object.values(this.results.files);
    this.results.summary.totalFiles = files.length;
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    
    for (const file of files) {
      if (file.stats) {
        totalTests += file.stats.totalTests;
        passedTests += file.stats.passedTests;
        failedTests += file.stats.failedTests;
        skippedTests += file.stats.skippedTests;
      }
    }

    this.results.summary.totalTests = totalTests;
    this.results.summary.passedTests = passedTests;
    this.results.summary.failedTests = failedTests;
    this.results.summary.skippedTests = skippedTests;
    this.results.summary.overallSuccess = failedTests === 0 && totalTests > 0;

    // Calculate test suite summaries
    for (const suiteName of Object.keys(TEST_SUITE)) {
      const suiteStats = { passed: 0, failed: 0, skipped: 0 };
      
      for (const file of files) {
        if (file.testResults && file.testResults[suiteName]) {
          const suite = file.testResults[suiteName];
          suiteStats.passed += suite.passed;
          suiteStats.failed += suite.failed;
          suiteStats.skipped += suite.skipped;
        }
      }
      
      this.results.summary.testSuites[suiteName] = suiteStats;
    }
  }

  /**
   * Generate integration test report
   */
  generateReport() {
    const { summary } = this.results;
    
    let report = `# Integration Test Report\n\n`;
    report += `**Overall Status**: ${summary.overallSuccess ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Files Tested**: ${summary.totalFiles}\n`;
    report += `**Tests Run**: ${summary.totalTests}\n`;
    report += `**Results**: ${summary.passedTests}✅ ${summary.failedTests}❌ ${summary.skippedTests}⏭️\n\n`;

    // Test suite summary
    report += `## Test Suite Results\n\n`;
    for (const [suiteName, stats] of Object.entries(summary.testSuites)) {
      const total = stats.passed + stats.failed + stats.skipped;
      const successRate = total > 0 ? Math.round((stats.passed / total) * 100) : 0;
      report += `- **${TEST_SUITE[suiteName]?.name || suiteName}**: ${stats.passed}✅ ${stats.failed}❌ ${stats.skipped}⏭️ (${successRate}%)\n`;
    }
    report += '\n';

    // File-specific results
    for (const [filePath, fileResult] of Object.entries(this.results.files)) {
      if (fileResult.stats && fileResult.stats.totalTests > 0) {
        report += `## File: ${filePath}\n\n`;
        report += `**Status**: ${fileResult.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
        report += `**Tests**: ${fileResult.stats.passedTests}✅ ${fileResult.stats.failedTests}❌ ${fileResult.stats.skippedTests}⏭️\n\n`;

        // Test suite details
        for (const [suiteName, suiteResult] of Object.entries(fileResult.testResults)) {
          const suite = TEST_SUITE[suiteName];
          if (!suite) continue;
          
          report += `### ${suite.name}\n\n`;
          
          for (const [testName, result] of Object.entries(suiteResult.tests)) {
            const icon = result.passed ? '✅' : result.skipped ? '⏭️' : '❌';
            report += `- ${icon} **${testName}**: ${result.message}\n`;
            
            if (result.details) {
              report += `  - Details: ${JSON.stringify(result.details, null, 2)}\n`;
            }
          }
          report += '\n';
        }

        // Issues
        if (fileResult.issues && fileResult.issues.length > 0) {
          report += `### Issues Found\n\n`;
          for (const issue of fileResult.issues) {
            const severityIcon = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
            report += `- ${severityIcon[issue.severity]} **${issue.message}**\n`;
            if (issue.details) {
              report += `  - Test: ${issue.test}\n`;
              report += `  - Category: ${issue.category}\n`;
            }
          }
          report += '\n';
        }
      }
    }

    return report;
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node integration-tester.mjs <file1,file2,...>');
    process.exit(1);
  }

  // Parse comma-separated file list
  const files = args[0].split(',').map(f => f.trim()).filter(f => f);
  
  if (files.length === 0) {
    console.log('No files to test');
    process.exit(0);
  }

  const tester = new IntegrationTester();
  const results = await tester.testFiles(files);

  // Save detailed report
  fs.writeFileSync('integration-report.json', JSON.stringify(results, null, 2));
  
  // Generate markdown report
  const markdownReport = tester.generateReport();
  fs.writeFileSync('integration-report.md', markdownReport);

  console.log(`\n--- INTEGRATION TESTING COMPLETE ---`);
  console.log(`Overall Status: ${results.summary.overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Files: ${results.summary.totalFiles}`);
  console.log(`Tests: ${results.summary.passedTests}✅ ${results.summary.failedTests}❌ ${results.summary.skippedTests}⏭️`);

  // Set GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `passed=${results.summary.overallSuccess}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report=${markdownReport.replace(/\n/g, '%0A')}\n`);
  }

  process.exit(results.summary.overallSuccess ? 0 : 1);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { IntegrationTester };