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

export interface SecurityIssue {
  pattern: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  category: string;
  description: string;
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
    pattern: /disregard\s+(all\s+|the\s+|everything\s+)?(previous|prior|above|preceding)\s+(instructions?|commands?|directives?|rules?)/i,
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
    name: 'forget_everything',
    pattern: /forget\s+everything\s+(above|before|previous)/i,
    severity: 'critical',
    description: 'Attempts to override system context',
    category: 'prompt_injection'
  },
  {
    name: 'act_as_different',
    pattern: /act\s+as\s+a?\s?(different|another)\s+(AI|system|assistant|bot)/i,
    severity: 'high',
    description: 'Attempts to change AI role or identity',
    category: 'role_hijacking'
  },
  {
    name: 'you_are_now',
    pattern: /you\s+are\s+now\s+a?\s?(different|another)\s+(AI|system|assistant|bot)/i,
    severity: 'high',
    description: 'Attempts to redefine AI identity',
    category: 'role_hijacking'
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
    pattern: /\b(system|shell|bash|sh|cmd|powershell)\s*\(/i,
    severity: 'critical',
    description: 'Attempts to execute shell commands',
    category: 'command_execution'
  },
  {
    name: 'execute_command',
    pattern: /execute\s+(the\s+)?(following\s+|this\s+)?command/i,
    severity: 'critical',
    description: 'Direct command execution request',
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
    // Pattern: command + optional flags + path/target
    // Fixed to prevent ReDoS by limiting repetition and using non-capturing groups
    pattern: /\b(rm|del|delete|format|fdisk|dd)(?:\s+(?:-rf?|-[rf]|\/[FQ])){0,2}\s+(?:\/|\\\\|[A-Z]:|if=|of=|\.)/i,
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
  {
    name: 'os_command',
    // Pattern: OS-specific command execution methods
    // Python: os.system, subprocess.call/run/Popen
    // Node.js: spawn, execFile  
    // Generic: popen
    pattern: /\b(os\.system|subprocess\.(call|run|Popen)|popen|spawn|execFile)\s*\(/i,
    severity: 'critical',
    description: 'Operating system command execution via language-specific APIs',
    category: 'command_execution'
  },
  {
    name: 'sql_command',
    // Pattern: SQL Server command execution stored procedures
    // xp_cmdshell: Direct OS command execution
    // sp_execute_external_script: External script execution (Python/R)
    pattern: /\b(xp_cmdshell|sp_execute_external_script)\s*\(/i,
    severity: 'critical',
    description: 'SQL Server command execution via stored procedures',
    category: 'command_execution'
  },
  {
    name: 'reverse_shell',
    // Pattern: Common reverse shell tools with execution flags
    // Tools: nc/netcat/socat
    // Flags: -e/--exec (execute), -c (command)
    // Limited to 30 chars between tool and flag to reduce false positives
    pattern: /\b(nc|netcat|socat)\s+.{0,30}(-e|--exec|-c)\s+/i,
    severity: 'critical',
    description: 'Reverse shell connection attempt using netcat/socat',
    category: 'command_execution'
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
    pattern: /email\s+.{0,50}(password|credentials?|secret|key|token)\s+to/i,
    severity: 'high',
    description: 'Attempts to email sensitive data',
    category: 'data_exfiltration'
  },
  {
    name: 'send_to_email',
    // Pattern: "send" followed by content then "to" and an email pattern
    // Email pattern simplified to avoid ReDoS
    pattern: /send\s+.{0,50}\s+to\s+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,
    severity: 'high',
    description: 'Attempts to send data to email address',
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
    pattern: /(api[_-]?key|apikey|secret[_-]?key|access[_-]?token)\s*[:=]\s*["']?[a-zA-Z0-9_\-.]{20,}/i,
    severity: 'high',
    description: 'Contains potential API keys or secrets',
    category: 'sensitive_data'
  },
  {
    name: 'webhook_callback',
    // Pattern: webhook/callback URLs for data exfiltration
    // Matches: webhook URL, callback to URL, notify URL
    // Limited to 50 chars between keyword and URL to reduce false positives
    pattern: /\b(webhook|callback|notify)\s+.{0,50}(https?:\/\/|url:\s*)/i,
    severity: 'high',
    description: 'Webhook or callback URL for potential data exfiltration',
    category: 'data_exfiltration'
  },
  {
    name: 'cloud_storage',
    // Pattern: Cloud storage services for data exfiltration
    // Services: S3 bucket, Google Drive, Dropbox, OneDrive
    // Includes upload/sync/backup verbs
    pattern: /\b(upload|sync|backup|save)\s+.{0,30}(s3\s+bucket|google\s+drive|dropbox|onedrive|cloud\s+storage)/i,
    severity: 'high',
    description: 'Cloud storage exfiltration attempt',
    category: 'data_exfiltration'
  },
  {
    name: 'database_dump',
    // Pattern: Database dump/export operations
    // Commands: dump, export, backup
    // Targets: database, tables, schema
    pattern: /\b(dump|export|backup)\s+.{0,20}(database|tables?|schema|all\s+data)/i,
    severity: 'high',
    description: 'Database dump or export operation',
    category: 'data_exfiltration'
  },
  {
    name: 'file_transfer',
    // Pattern: File transfer protocols
    // Protocols: FTP, SFTP, SCP, rsync
    // Matches: ftp://..., scp user@..., rsync to ..., sftp to ...
    pattern: /\b(ftp|sftp|scp|rsync)(\s+.{0,30})?(@|:\/\/|\s+to\s+)/i,
    severity: 'medium',
    description: 'File transfer protocol usage',
    category: 'data_exfiltration'
  },
  {
    name: 'graphql_exfiltration',
    // Pattern: GraphQL queries that might exfiltrate data
    // Looks for introspection queries or bulk data queries
    pattern: /\b(__schema|__type|query\s*{\s*\w+\s*{\s*\.\.\.)|\bquery\s+.{0,30}(all|dump|export)\w*/i,
    severity: 'medium',
    description: 'GraphQL query for potential data exfiltration',
    category: 'data_exfiltration'
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
  {
    name: 'remove_restrictions',
    pattern: /remove\s+all\s+restrictions|operate\s+without\s+any?\s+restrictions|you\s+have\s+no\s+restrictions/i,
    severity: 'critical',
    description: 'Attempts to remove all restrictions',
    category: 'jailbreak'
  },
  {
    name: 'hypothetical_bypass',
    pattern: /hypothetical(ly)?\s+.{0,40}(no\s+restrictions|unrestricted|without\s+limits)/i,
    severity: 'high',
    description: 'Hypothetical scenario to bypass restrictions',
    category: 'jailbreak'
  },
  {
    name: 'roleplay_unrestricted',
    pattern: /(roleplay|role-play|pretend|act\s+as)\s+.{0,20}(unrestricted|no\s+limits|no\s+rules)/i,
    severity: 'high',
    description: 'Role-play as unrestricted AI',
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
    pattern: /!!python\/(object|module|name)/i,
    severity: 'critical',
    description: 'Python object instantiation in YAML',
    category: 'yaml_security'
  },

  // Context Awareness & Information Extraction
  {
    name: 'system_prompt_extraction',
    // Pattern: Attempts to reveal system prompt or instructions
    // Matches: show/reveal/display + system prompt/instructions
    pattern: /\b(show|reveal|display|what\s+is|tell\s+me)\s+.{0,30}(system\s+prompt|initial\s+instructions?|original\s+prompt)/i,
    severity: 'high',
    description: 'Attempts to extract system prompt',
    category: 'context_awareness'
  },
  {
    name: 'conversation_history',
    // Pattern: Attempts to access conversation history
    // Matches: show/list/display + conversation/chat history
    pattern: /\b(show|list|display|print|output)\s+.{0,30}(conversation|chat|message)\s+history/i,
    severity: 'high',
    description: 'Attempts to access conversation history',
    category: 'context_awareness'
  },
  {
    name: 'previous_messages',
    // Pattern: Attempts to access previous messages
    // Matches: what did I/you say, previous message/response
    pattern: /\b(what\s+did\s+(i|you)\s+say|show\s+previous\s+(message|response)|repeat\s+my\s+last)/i,
    severity: 'high',
    description: 'Attempts to access previous messages',
    category: 'context_awareness'
  },
  {
    name: 'context_manipulation',
    // Pattern: Attempts to manipulate conversation context
    // Matches: forget what I said, erase context, reset conversation
    pattern: /\b(forget\s+what\s+i\s+said|erase\s+.{0,20}context|reset\s+.{0,20}conversation|clear\s+.{0,20}memory)/i,
    severity: 'critical',
    description: 'Attempts to manipulate conversation context',
    category: 'context_awareness'
  },
  {
    name: 'memory_extraction',
    // Pattern: Attempts to extract memory or stored information
    // Matches: what do you remember (about X), show your memory, access stored
    pattern: /\b(what\s+do\s+you\s+remember(\s+about)?|show\s+.{0,20}(memory|stored\s+(data|information))|access\s+.{0,20}stored\s+(data|information))/i,
    severity: 'high',
    description: 'Attempts to extract memory content',
    category: 'context_awareness'
  },
  {
    name: 'session_data_probe',
    // Pattern: Attempts to probe session metadata
    // Matches: session ID, user ID, metadata, internal state
    pattern: /\b(session\s+id|user\s+id|show\s+.{0,20}metadata|internal\s+state|debug\s+info)/i,
    severity: 'medium',
    description: 'Attempts to access session data',
    category: 'context_awareness'
  },
  {
    name: 'hidden_context_reveal',
    // Pattern: Attempts to reveal hidden or system context
    // Matches: hidden instructions, secret prompt, behind the scenes
    pattern: /\b(hidden\s+instructions?|secret\s+prompt|behind\s+the\s+scenes|what\s+are\s+you\s+hiding)/i,
    severity: 'high',
    description: 'Attempts to reveal hidden context',
    category: 'context_awareness'
  },
  {
    name: 'training_data_extraction',
    // Pattern: Attempts to extract training data
    // Matches: phrases asking about AI training data, NOT general data analysis terms
    pattern: /\b(show\s+.{0,20}training\s+data|reveal\s+.{0,20}training\s+data|what\s+.{0,20}(trained\s+on|learned\s+from)|your\s+training\s+(data|dataset|examples?)|(extract|expose|leak)\s+.{0,20}training)/i,
    severity: 'critical',
    description: 'Attempts to extract training data',
    category: 'context_awareness'
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
export function scanForSecurityPatterns(content: string): SecurityIssue[] {
  if (!content || content.trim() === '') {
    return [];
  }

  const issues: SecurityIssue[] = [];
  const lines = content.split('\n');

  for (const pattern of SECURITY_PATTERNS) {
    // Check full content
    if (pattern.pattern.test(content)) {
      // Find which line(s) contain the pattern
      let lineNumber = 1;
      for (let i = 0; i < lines.length; i++) {
        if (pattern.pattern.test(lines[i])) {
          lineNumber = i + 1;
          break;
        }
      }

      issues.push({
        pattern: pattern.name,
        severity: pattern.severity,
        line: lineNumber,
        category: pattern.category,
        description: pattern.description
      });
    }
  }

  return issues;
}

// Note: getSuggestionForPattern function moved to content-validator.ts where it's used

// Additional security constants
export const MAX_CONTENT_LENGTH = 50000; // 50KB max content size
export const MAX_METADATA_LENGTH = 5000; // 5KB max metadata size
export const MAX_LINE_LENGTH = 1000; // 1000 chars max per line

// Email validation (RFC 5321 compliant with ReDoS protection)
export const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{1,63}$/;

// Safe URL validation
export const SAFE_URL_REGEX = /^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]{1,2000}$/;

// Note: ValidationIssue import removed as we now use SecurityIssue for this function

// Export optimized scanner for performance-critical use cases
export { 
  scanForSecurityPatternsOptimized,
  quickScan,
  fullScan,
  metricsScan,
  type ScanOptions,
  type ScanMetrics
} from './security-scanner-optimized.js';