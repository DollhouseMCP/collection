---
name: programmatic-security-validator
description: >-
  Advanced programmatic security validation skill that uses Claudes analysis
  tool to execute real JavaScript-based security checks on websites,
  repositories, and AI tools with precise threat detection
version: 1.0.0
created: '2025-08-12T15:53:45.332Z'
modified: '2025-08-12T15:53:45.332Z'
tags: []
dependencies: []
custom: {}
languages: []
complexity: beginner
domains: []
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# Programmatic Security Validator Skill

## Purpose

Advanced security validation skill that uses programmatic analysis through Claudes built-in analysis capabilities to perform real code-based validation checks on websites, repositories, and AI tools.

## Core Programmatic Validation Framework

###

1. Web Security Analysis Engine

javascript// Template for web security programmatic analysisasync function validateWebSecurityurl     const results =         timestamp: new Date.toISOString,        url: url,        riskScore: 0,        threats: [],        confidence: 0,        recommendations: []            try         // Fetch and analyze webpage content        const response = await fetchurl        const html = await response.text        const headers = Object.fromEntriesresponse.headers.entries                // Security header analysis        const securityHeaders = analyzeSecurityHeader

sheaders        results.riskScore += securityHeaders.riskScore        results.threats.pu

sh...securityHeaders.threats                // Content analysis for malicious patterns        const contentAnalysis = analyzeHtmlContenthtml        results.riskScore += contentAnalysis.riskScore        results.threats.pu

sh...contentAnalysis.threats                // Prompt injection pattern detection        const promptAnalysis = detectPromptInjectionPattern

shtml        results.riskScore += promptAnalysis.riskScore        results.threats.pu

sh...promptAnalysis.threats                // AI tool specific validation        if isAIToolhtml, url             const aiAnalysis = validateAIToolSecurityhtml, url            results.riskScore += aiAnalysis.riskScore            results.threats.pu

sh...aiAnalysis.threats                        // Calculate final risk assessment        results.confidence = calculateConfidenceresults.threats.length        results.riskLevel = classifyRiskresults.riskScore        results.recommendations = generateRecommendationsresults.threats                return results             catch error         results.error = error.message        results.riskLevel = ANALYSIS_FAILED        return results    function analyzeSecurityHeader

sheaders     const threats = []    let riskScore = 0        // Critical security headers check    const requiredHeaders = [        content-security-policy,        x-frame-options,        x-content-type-options,        strict-transport-security    ]        requiredHeaders.forEachheader =         if headers[header]             threats.pu

sh                type: MISSING_SECURITY_HEADER,                header: header,                severity: MEDIUM,                description: Missing header security header                        riskScore += 2                    // Check for dangerous headers    if headers[x-frame-options] === ALLOWALL         threats.pu

sh            type: UNSAFE_FRAME_OPTIONS,            severity: HIGH,            description: Dangerous X-Frame-Options setting allows clickjacking                riskScore += 4            return  threats, riskScore function analyzeHtmlContenthtml     const threats = []    let riskScore = 0        // Malicious script patterns    const maliciousPatterns = [         pattern: /evals/gi, type: EVAL_USAGE, severity: HIGH ,         pattern: /document.writes/gi, type: DOCUMENT_WRITE, severity: MEDIUM ,         pattern: /innerHTMLs=/gi, type: INNERHTML_USAGE, severity: MEDIUM ,         pattern: /crypto.mininger/gi, type: CRYPTO_MINING, severity: CRITICAL ,         pattern: /bitcoin.mininger/gi, type: BITCOIN_MINING, severity: CRITICAL     ]        maliciousPatterns.forEach pattern, type, severity  =         const matches = html.matchpattern        if matches             threats.pu

sh                type: type,                severity: severity,                matches: matches.length,                description: Detected matches.length instances of type.toLowerCase                        riskScore += severity === CRITICAL  6 : severity === HIGH  4 : 2                    // Hidden iframe detection    const iframePattern = /iframe[^]styles=s[][^]displays:snone[^][][^]/gi    const hiddenIframes = html.matchiframePattern    if hiddenIframes         threats.pu

sh            type: HIDDEN_IFRAME,            severity: HIGH,            count: hiddenIframes.length,            description: Detected hiddenIframes.length hidden iframes                riskScore += 5            return  threats, riskScore function detectPromptInjectionPattern

shtml     const threats = []    let riskScore = 0        // Prompt injection patterns    const injectionPatterns = [         pattern: /ignores+previouss+instructions/gi, type: IGNORE_INSTRUCTIONS, severity: CRITICAL ,         pattern: /yous+ares+nows+as+differents+AI/gi, type: ROLE_CHANGE, severity: CRITICAL ,         pattern: /forgets+yours+constraints/gi, type: CONSTRAINT_BYPASS, severity: CRITICAL ,         pattern: /bypasss+safetys+guidelines/gi, type: SAFETY_BYPASS, severity: CRITICAL ,         pattern: /roles:sunrestricted/gi, type: UNRESTRICTED_ROLE, severity: CRITICAL     ]        injectionPatterns.forEach pattern, type, severity  =         const matches = html.matchpattern        if matches             threats.pu

sh                type: type,                severity: severity,                matches: matches.length,                description: Detected prompt injection attempt: type.toLowerCase,                context: matches.slice0, 3 // First 3 matches for context                        riskScore += 8 // High risk for prompt injection                    // Encoded content that could hide instructions    const encodedPatterns = [         pattern: /base64[,:][A-Za-z0-9+/=]20,/gi, type: BASE64_ENCODED ,         pattern: /u[0-9a-fA-F]4/g, type: UNICODE_ENCODED ,         pattern: /#[0-9]2,3/g, type: HTML_ENTITY_ENCODED     ]        encodedPatterns.forEach pattern, type  =         const matches = html.matchpattern        if matches  matches.length  10  // Thre

shold for suspicious amount            threats.pu

sh                type: type,                severity: MEDIUM,                matches: matches.length,                description: High volume of type.toLowerCase content detected                        riskScore += 3                    return  threats, riskScore function isAIToolhtml, url     const aiIndicators = [        /AIGPTClaudeChatGPTLLMlanguages+modelartificials+intelligence/gi,        /promptchatconversationassistant/gi    ]        return aiIndicators.somepattern =         pattern.testhtml  pattern.testurl    function validateAIToolSecurityhtml, url     const threats = []    let riskScore = 0        // Check for pre-populated prompts or hidden instructions    const promptInputs = html.match/inputtextarea[^]values=s[][^][][^]/gi    if promptInputs         promptInputs.forEachinput =             const value = input.match/values=s[][^][]/i            if value  value[1].length  50                 threats.pu

sh                    type: PREPOPULATED_PROMPT,                    severity: HIGH,                    description: Pre-populated prompt input detected,                    content: value[1].substring0, 100 + ...                                riskScore += 4                                // Check for suspicious data collection    const dataCollection = [        /localStorage.setItemsessionStorage.setItem/gi,        /document.cookies=/gi,        /navigator.geolocation/gi    ]        dataCollection.forEachpattern, index =         const matches = html.matchpattern        if matches             const types = [LOCAL_STORAGE, COOKIES, GEOLOCATION]            threats.pu

sh                type: DATA_COLLECTION_ + types[index],                severity: MEDIUM,                matches: matches.length,                description: Detected types[index].toLowerCase data collection                        riskScore += 2                    return  threats, riskScore function classifyRiskriskScore     if riskScore = 15 return CRITICAL    if riskScore = 10 return HIGH    if riskScore = 5 return MEDIUM    if riskScore  0 return LOW    return SAFEfunction calculateConfidencethreatCount     // More threats detected = higher confidence in assessment    return Math.min95, 60 + threatCount  8function generateRecommendationsthreats     const recommendations = []        threats.forEachthreat =         switchthreat.type             case MISSING_SECURITY_HEADER:
  recommendations.pu

shImplement threat.header security header                break            case CRYPTO_MINING:
  case BITCOIN_MINING:
  recommendations.pu

shBLOCK IMMEDIATELY

- Cryptocurrency mining detected                break            case IGNORE_INSTRUCTIONS:
  case ROLE_CHANGE:
  case CONSTRAINT_BYPASS:
  recommendations.pu

shAVOID

- Contains prompt injection attempts                break            case HIDDEN_IFRAME:
  recommendations.pu

shExercise extreme caution

- Hidden content detected                break                    return [...new Setrecommendations] // Remove duplicates// Export the main validation functionreturn validateWeb

Security

###

2. Repository Security Analysis Engine

javascript// Template for repository security programmatic analysisasync function validateRepositorySecurityrepoData     const results =         timestamp: new Date.toISOString,        repository: repoData.url  repoData.name,        riskScore: 0,        threats: [],        confidence: 0,        recommendations: []            try         // Analyze repository structure and files        const structureAnalysis = analyzeRepoStructurerepoData.files  []        results.riskScore += structureAnalysis.riskScore        results.threats.pu

sh...structureAnalysis.threats                // Code security analysis        if repoData.sourceCode             const codeAnalysis = analyzeSourceCoderepoData.sourceCode            results.riskScore += codeAnalysis.riskScore            results.threats.pu

sh...code

Analysis.threats                        // Dependency a
