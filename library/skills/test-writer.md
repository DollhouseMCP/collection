---
name: Test Writer
description: >-
  Comprehensive test creation skill for TypeScript/Jest projects with focus on
  MCP server testing patterns
type: skill
version: 1.0.0
author: dollhousemcp
created: 2025-09-01T00:00:00.000Z
tags:
  - testing
  - jest
  - typescript
  - unit-tests
  - integration-tests
keywords:
  - test writing
  - jest
  - testing
  - coverage
  - TDD
category: development
proficiency_levels:
  beginner: Basic unit test creation
  intermediate: Complex mocking and integration tests
  advanced: Full test suites with edge cases and performance tests
parameters:
  test_framework:
    type: string
    description: Testing framework to use
    default: jest
    enum:
      - jest
      - mocha
      - vitest
  test_type:
    type: string
    description: Type of tests to write
    default: unit
    enum:
      - unit
      - integration
      - e2e
      - performance
  coverage_target:
    type: number
    description: Target coverage percentage
    default: 90
unique_id: skill_test-writer_dollhousemcp_20250901-000000
capabilities:
  - general-purpose
---

# Test Writer Skill

## Purpose

Create comprehensive test suites for TypeScript/Jest projects with emphasis on MCP server patterns, element system testing, and DollhouseMCP conventions.

## Test Creation Guidelines

### 1. Unit Testing Patterns

#### Basic Test Structure
```typescript
describe('ComponentName', () => {
  // Setup
  let instance: ComponentType;
  
  beforeEach(() => {
    // Reset state before each test
    instance = new ComponentType();
  });
  
  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });
  
  describe('methodName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = instance.method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
    
    it('should handle edge case', () => {
      // Edge case testing
    });
    
    it('should handle error case', () => {
      // Error testing
      expect(() => instance.method(null)).toThrow();
    });
  });
});
```

### 2. MCP Server Testing

#### Tool Registration Tests
```typescript
describe('MCP Tool Registration', () => {
  it('should register workflow tools', () => {
    const server = new DollhouseMCPServer();
    expect(server.tools.has('execute_workflow')).toBe(true);
    expect(server.tools.has('list_workflow_steps')).toBe(true);
  });
  
  it('should validate element types', () => {
    const server = new DollhouseMCPServer();
    expect(server.validTypes).toContain('workflows');
  });
});
```

#### Element System Tests
```typescript
describe('Element Implementation', () => {
  describe('Workflow Element', () => {
    it('should implement IElement interface', () => {
      const workflow = new Workflow(metadata);
      expect(workflow.validate).toBeDefined();
      expect(workflow.serialize).toBeDefined();
      expect(workflow.deserialize).toBeDefined();
    });
    
    it('should extend BaseElement', () => {
      const workflow = new Workflow(metadata);
      expect(workflow).toBeInstanceOf(BaseElement);
    });
  });
});
```

### 3. Testing Patterns for DollhouseMCP

#### Portfolio Manager Tests
```typescript
describe('PortfolioManager', () => {
  const mockHomedir = '/tmp/test-home';
  
  beforeEach(() => {
    jest.spyOn(os, 'homedir').mockReturnValue(mockHomedir);
  });
  
  it('should use portfolio directory for elements', () => {
    const manager = PortfolioManager.getInstance();
    const dir = manager.getElementDir(ElementType.WORKFLOW);
    expect(dir).toBe(path.join(mockHomedir, '.dollhouse/portfolio/workflows'));
  });
  
  it('should prevent path traversal', () => {
    const manager = PortfolioManager.getInstance();
    expect(() => manager.getElementPath(ElementType.WORKFLOW, '../../../etc/passwd'))
      .toThrow('Invalid element name');
  });
});
```

#### Async Operation Tests
```typescript
describe('Async Operations', () => {
  it('should handle async file operations', async () => {
    const manager = new WorkflowManager();
    
    // Mock file system
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue('content');
    
    const result = await manager.load('test.md');
    expect(result).toBeDefined();
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      expect.stringContaining('test.md'),
      'utf-8'
    );
  });
  
  it('should handle file operation errors', async () => {
    const manager = new WorkflowManager();
    
    jest.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('ENOENT'));
    
    await expect(manager.load('missing.md')).rejects.toThrow('ENOENT');
  });
});
```

### 4. Integration Testing

#### Multi-Component Tests
```typescript
describe('Workflow Execution Integration', () => {
  it('should execute complete workflow', async () => {
    // Setup
    const workflow = new Workflow(workflowMetadata);
    const executor = new WorkflowExecutor();
    
    // Add steps
    workflow.addStep({
      type: 'activate_element',
      element_type: 'personas',
      element_name: 'alex-sterling'
    });
    
    // Execute
    const result = await executor.execute(workflow);
    
    // Verify
    expect(result.status).toBe('completed');
    expect(result.stepsCompleted).toBe(1);
  });
});
```

### 5. Test Coverage Strategies

#### Coverage Goals
- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%

#### Edge Cases to Test
```typescript
describe('Edge Cases', () => {
  // Boundary values
  it('should handle empty input', () => {});
  it('should handle maximum input', () => {});
  
  // Null/undefined
  it('should handle null values', () => {});
  it('should handle undefined values', () => {});
  
  // Concurrent operations
  it('should handle concurrent requests', async () => {});
  
  // Resource limits
  it('should handle memory limits', () => {});
  it('should handle timeout scenarios', () => {});
});
```

### 6. Mocking Strategies

#### Mock File System
```typescript
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  readdir: jest.fn()
}));
```

#### Mock MCP Tools
```typescript
const mockServer = {
  addTool: jest.fn(),
  tools: new Map(),
  validTypes: ['personas', 'skills']
};
```

#### Mock External APIs
```typescript
jest.mock('node-fetch', () => jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked' })
  })
));
```

## Test Documentation Template

```typescript
/**
 * Test Suite: [Component Name]
 * Purpose: [What this suite tests]
 * Coverage: [What aspects are covered]
 * 
 * Test Cases:
 * 1. Normal operation
 * 2. Edge cases
 * 3. Error conditions
 * 4. Performance constraints
 */
```

## Common Testing Patterns

### Snapshot Testing
```typescript
it('should match snapshot', () => {
  const output = formatter.format(data);
  expect(output).toMatchSnapshot();
});
```

### Parameterized Tests
```typescript
describe.each([
  ['input1', 'expected1'],
  ['input2', 'expected2'],
  ['input3', 'expected3']
])('process(%s)', (input, expected) => {
  it(`returns ${expected}`, () => {
    expect(process(input)).toBe(expected);
  });
});
```

### Timeout Testing
```typescript
it('should timeout after 5 seconds', async () => {
  jest.setTimeout(6000);
  
  const promise = longRunningOperation();
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  );
  
  await expect(Promise.race([promise, timeout])).rejects.toThrow('Timeout');
});
```

## Integration with Orchestration

When used in orchestration:
1. Activate after implementation complete
2. Generate tests for new code
3. Ensure coverage targets met
4. Create both unit and integration tests
5. Deactivate when tests complete

## Customization Points

1. **Framework**: Adjust for Mocha, Vitest, etc.
2. **Assertion Library**: Chai, Should.js alternatives
3. **Coverage Tools**: Istanbul, C8 configuration
4. **Mock Strategies**: Project-specific mocking patterns
5. **Performance Thresholds**: Custom timing requirements

## Test Execution Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- workflow.test.ts

# Run in watch mode
npm test -- --watch

# Update snapshots
npm test -- -u
```

---

*This skill provides comprehensive test writing capabilities optimized for TypeScript/Jest projects while remaining adaptable to other testing frameworks and patterns.*
