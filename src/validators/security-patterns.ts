/**
 * Security patterns for content validation
 * Detects potentially malicious patterns in user-submitted content
 */

export interface SecurityPattern {
  name: string;
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  category: string;
}

export const SECURITY_PATTERNS: SecurityPattern[] = [
  // Prompt Injection Patterns
  {
    name: 'ignore_instructions',
    pattern: /ignore\s+(all\s+)?(previous|prior|above|preceding)\s+(instructions?|commands?|directives?|rules?)/i,
    severity: 'critical',
    description: 'Attempts to override previous instructions',
    category: 'prompt_injection'
  },
  {
    name: 'disregard_instructions',
    pattern: /disregard\s+(all\s+)?(previous|prior|above|preceding)\s+(instructions?|commands?|directives?|rules?)/i,
    severity: 'critical',
    description: 'Attempts to disregard system instructions',
    category: 'prompt_injection'
  },
  {
    name: 'forget_instructions',
    pattern: /forget\s+(all\s+)?(previous|prior|above|preceding)\s+(instructions?|commands?|directives?|rules?)/i,
    severity: 'critical',
    description: 'Attempts to make system forget instructions',
    category: 'prompt_injection'
  },
  {
    name: 'new_instructions',
    pattern: /you\s+are\s+now\s+.{0,50}(instead|ignore|forget)/i,
    severity: 'high',
    description: 'Attempts to replace system identity',
    category: 'prompt_injection'
  },
  {
    name: 'act_as_root',
    pattern: /act\s+as\s+(root|admin|administrator|system|sudo)/i,
    severity: 'high',
    description: 'Attempts to gain elevated privileges',
    category: 'privilege_escalation'
  },
  {
    name: 'pretend_admin',
    pattern: /pretend\s+(you\s+are|to\s+be)\s+(root|admin|administrator|system)/i,
    severity: 'high',
    description: 'Attempts to simulate admin access',
    category: 'privilege_escalation'
  },

  // System Command Execution
  {
    name: 'shell_command',
    pattern: /\b(exec|system|shell|bash|sh|cmd|powershell)\s*\(/i,
    severity: 'critical',
    description: 'Attempts to execute shell commands',
    category: 'command_execution'
  },
  {
    name: 'eval_code',
    pattern: /\b(eval|exec|compile)\s*\(/i,
    severity: 'critical',
    description: 'Attempts to evaluate arbitrary code',
    category: 'code_execution'
  },
  {
    name: 'file_operations',
    pattern: /\b(rm|del|delete|format|fdisk|dd)\s+(-rf\s+)?\/|\\\\|C:/i,
    severity: 'critical',
    description: 'Dangerous file system operations',
    category: 'file_system'
  },
  {
    name: 'curl_wget',
    pattern: /\b(curl|wget|fetch)\s+.{0,50}(http|ftp|file)/i,
    severity: 'high',
    description: 'Attempts to download external content',
    category: 'network_access'
  },

  // Data Exfiltration
  {
    name: 'send_data',
    pattern: /send\s+.{0,50}(data|information|details|credentials)\s+to\s+/i,
    severity: 'high',
    description: 'Attempts to exfiltrate data',
    category: 'data_exfiltration'
  },
  {
    name: 'email_data',
    pattern: /email\s+.{0,50}(password|credential|secret|key|token)\s+to/i,
    severity: 'high',
    description: 'Attempts to email sensitive data',
    category: 'data_exfiltration'
  },
  {
    name: 'post_request',
    pattern: /\b(POST|PUT)\s+.{0,50}(http|https):\/\//i,
    severity: 'medium',
    description: 'HTTP POST/PUT requests',
    category: 'network_access'
  },
  {
    name: 'api_key_pattern',
    pattern: /\b(api[_-]?key|apikey|secret[_-]?key|access[_-]?token)\s*[:=]\s*["']?[a-zA-Z0-9]{20,}/i,
    severity: 'high',
    description: 'Contains potential API keys or secrets',
    category: 'sensitive_data'
  },

  // Obfuscation Attempts
  {
    name: 'base64_decode',
    pattern: /\b(atob|base64[_-]?decode|from[_-]?base64)\s*\(/i,
    severity: 'medium',
    description: 'Base64 decoding attempts',
    category: 'obfuscation'
  },
  {
    name: 'hex_decode',
    pattern: /\\x[0-9a-f]{2}|\\u[0-9a-f]{4}/i,
    severity: 'low',
    description: 'Hex-encoded characters',
    category: 'obfuscation'
  },
  {
    name: 'unicode_rtl',
    pattern: /[\u202A-\u202E\u2066-\u2069]/,
    severity: 'medium',
    description: 'Unicode right-to-left override characters',
    category: 'obfuscation'
  },

  // Jailbreak Attempts
  {
    name: 'developer_mode',
    pattern: /developer\s+mode|debug\s+mode|enable\s+developer/i,
    severity: 'medium',
    description: 'Attempts to enable developer mode',
    category: 'jailbreak'
  },
  {
    name: 'safety_override',
    pattern: /disable\s+safety|override\s+safety|bypass\s+filter/i,
    severity: 'high',
    description: 'Attempts to disable safety features',
    category: 'jailbreak'
  },
  {
    name: 'do_anything_now',
    pattern: /\bDAN\b|do\s+anything\s+now/i,
    severity: 'medium',
    description: 'Known jailbreak attempt pattern',
    category: 'jailbreak'
  },

  // YAML Security
  {
    name: 'yaml_merge_key',
    pattern: /<<\s*:\s*\*/,
    severity: 'medium',
    description: 'YAML merge key exploitation',
    category: 'yaml_security'
  },
  {
    name: 'yaml_python_tag',
    pattern: /!![a-z]+\/[a-z]+\s+python\//i,
    severity: 'critical',
    description: 'Python object instantiation in YAML',
    category: 'yaml_security'
  },

  // Resource Exhaustion
  {
    name: 'excessive_repetition',
    pattern: /(.)\1{100,}/,
    severity: 'low',
    description: 'Excessive character repetition',
    category: 'resource_exhaustion'
  },
  {
    name: 'large_numbers',
    pattern: /\d{50,}/,
    severity: 'low',
    description: 'Extremely large numbers',
    category: 'resource_exhaustion'
  }
];

/**
 * Scans content for security patterns
 * @param content The content to scan
 * @returns Array of detected security issues
 */
export function scanForSecurityPatterns(content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  for (const pattern of SECURITY_PATTERNS) {
    // Check full content
    if (pattern.pattern.test(content)) {
      // Find which line(s) contain the pattern
      let lineNumber: number | null = null;
      for (let i = 0; i < lines.length; i++) {
        if (pattern.pattern.test(lines[i])) {
          lineNumber = i + 1;
          break;
        }
      }

      issues.push({
        severity: pattern.severity,
        type: `security_${pattern.category}`,
        details: `${pattern.description}: Pattern "${pattern.name}" detected`,
        line: lineNumber,
        suggestion: getSuggestionForPattern(pattern)
      });
    }
  }

  return issues;
}

/**
 * Gets a helpful suggestion for fixing a security pattern
 */
function getSuggestionForPattern(pattern: SecurityPattern): string {
  const suggestions: Record<string, string> = {
    prompt_injection: 'Remove attempts to override or ignore instructions. Focus on describing the intended behavior.',
    privilege_escalation: 'Remove references to admin or system privileges. Content should work within normal user permissions.',
    command_execution: 'Remove shell commands or code execution. Use descriptive language instead of executable code.',
    file_system: 'Remove file system operations. Describe the desired outcome instead.',
    network_access: 'Remove external URLs and network requests. Keep content self-contained.',
    data_exfiltration: 'Remove attempts to send data externally. Focus on local processing.',
    obfuscation: 'Use clear, readable text. Avoid encoded or obfuscated content.',
    jailbreak: 'Stay within the intended use of the system. Remove attempts to bypass safety features.',
    yaml_security: 'Use simple YAML structures. Avoid advanced features that could be exploited.',
    resource_exhaustion: 'Use reasonable sizes for content. Avoid excessive repetition or large values.',
    sensitive_data: 'Remove API keys, tokens, or other sensitive information. Use placeholders if needed.'
  };

  return suggestions[pattern.category] || 'Review and remove potentially unsafe content.';
}

// Additional security constants
export const MAX_CONTENT_LENGTH = 50000; // 50KB max content size
export const MAX_METADATA_LENGTH = 5000; // 5KB max metadata size
export const MAX_LINE_LENGTH = 1000; // 1000 chars max per line

// Email validation (RFC 5321 compliant with ReDoS protection)
export const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{1,63}$/;

// Safe URL validation
export const SAFE_URL_REGEX = /^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]{1,2000}$/;

import type { ValidationIssue } from '../types/index.js';