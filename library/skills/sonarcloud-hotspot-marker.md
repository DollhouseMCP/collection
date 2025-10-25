---
name: sonarcloud-hotspot-marker
description: >-
  Automated script for bulk marking SonarCloud security hotspots as SAFE with
  proper authentication and rate limiting
author: sonar-guardian
version: 1.0.0
created: '2025-10-01T18:10:48.756Z'
modified: '2025-10-01T18:10:48.756Z'
tags:
  - sonarcloud
  - hotspots
  - automation
  - security-review
  - bulk-operations
  - api
  - bash-script
dependencies: []
custom: {}
triggers:
  - mark hotspots
  - bulk mark safe
  - sonarcloud automation
  - hotspot marking
languages: []
complexity: intermediate
domains:
  - security
  - automation
  - sonarcloud
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# Sonar

Cloud Hotspot Marker Skill

## PurposeBulk mark Sonar

Cloud security hotspots as SAFE after comprehensive security review. Successfully used to mark 47 production code DOS hotspots in October 2025.

## Authentication

- CRITICAL

### Use the Correct Token✅ CORRECT: Use SONARQUBE_TOKEN environment variable❌ WRONG: Dont use old keychain token may be expired

Both are now synced as of Oct 1, 2025, but environment variable is the source of truth.ba

sh

# Verify token is valid BEFORE markingcurl -s https://sonarcloud.io/api/authentication/validate   -H Authorization: Bearer SONARQUBE_TOKEN

# Should return: valid:true

Required Permission: Administer Security Hotspots

## The Script

### mark-all-production-hotspots.sh

bash#/bin/ba

sh

# Mark all production code hotspots documented in comprehensive security review

# Reference: docs/security/SONARCLOUD_HOTSPOT_SECURITY_REVIEW.md

# Success: 47/47 production hotspots marked Oct 1, 2025TOKEN=SONARQUBE_TOKENMARKED=0FAILED=0mark     local key=1    local comment=2        result=curl -s -w %http_code -X POST https://sonarcloud.io/api/hotspots/change_status         -H Authorization: Bearer TOKEN         -d hotspot=key         -d status=REVIEWED         -d resolution=SAFE         -d comment=comment -o /dev/null        if [ result = 204 ] then        echo ✓ key        MARKED++    else        echo ✗ key HTTP result        FAILED++    fiecho Fetching all DOS hotspots for production files...

# Get all DOS hotspots for production files exclude test/, archive/, scripts/curl -s https://sonarcloud.io/api/hotspots/searchprojectKey=DollhouseMCP_mcp-serverstatus=TO_REVIEWsecurity

Cate

gory=dosps=100     -H Authorization: Bearer TOKEN  /tmp/hotspots.json

# Filter to only production files and mark themcat /tmp/hotspots.json  jq -r .hotspots[]  select.component  test^DollhouseMCP_mcp-server:src/  .key  while read key do    mark key SAFE: Pattern uses linear complexity techniques negated character classes, bounded quantifiers, or Safe

Regex timeout protection. Reviewed in comprehensive security audit PR #

1219. See docs/security/SONARCLOUD_HOTSPOT_SECURITY_REVIEW.md for detailed analysis.    sleep 0.5  # Rate limitingdoneecho echo Summary: ✓MARKED ✗FAILEDrm /tmp/hotspots.json

### Usage

bash

# Make executablechmod +x mark-all-production-hotspots.sh

# Run requires SONARQUBE_TOKEN in environment./mark-all-production-hotspots.sh

## API Endpoint Details

### Change Hotspot StatusPOST https://sonarcloud.io/api/hotspots/change_statusForm Parameters:
  - hotspot: Hotspot key e.g., AZmIpHMy-9Qg1ZEE01md

- status: REVIEWED  TO_REVIEW

- resolution: SAFE  FIXED required when status=REVIEWED

- comment: Markdown explanation optional but recommendedSuccess Response: HTTP 204 No Content

Error Responses:
  - HTTP 401: Token invalid/expired

- HTTP 403: Token lacks Administer Security Hotspots permission

## Comment Templates

### Generic Production CodeSAFE: Pattern uses linear complexity techniques negated character classes, bounded quantifiers, or Safe

Regex timeout protection. Reviewed in comprehensive security audit PR #

1219. See docs/security/SONARCLOUD_HOTSPOT_SECURITY_REVIEW.md for detailed analysis.

### Defensive Meta-ProgrammingSAFE: Defensive meta-programming using safe patterns to detect unsafe patterns. Uses negated character classes [^X] with linear On complexity. Reviewed in PR #1219.

### SafeRegex ProtectedSAFE: Already protected with Safe

Regex timeout wrapper PR #

1187. Non-greedy patterns bounded by punctuation. Natural language patterns inherently bounded. Reviewed in PR #1219.

### Test CodeSAFE: Test code in controlled environment, not production runtime. No user input exposure.

## Filtering Options

### By Security Cate

gory

bash

# DOS ReDoS hotspotssecurity

Cate

gory=dos

# Command injectionsecurity

Cate

gory=command-injection

# Authentication issuessecurity

Cate

gory=auth

### By File Path Pattern

bash

# Production code only src/jq -r .hotspots[]  select.component  test^DollhouseMCP_mcp-server:src/  .key

# Test files onlyjq -r .hotspots[]  select.component  testtest/  .key

# Exclude archived scriptsjq -r .hotspots[]  select.component  test^archive/.  .key

### By Vulnerability Probability

bash

# High priority onlyvulnerability

Probability=HIGH

# Medium and high

# requires multiple queries or client-side filtering

## Rate LimitingIMPORTANT: Add delays between API calls to avoid overwhelming the server.ba

shsleep 0.5  # 500ms between calls

For large batches 100+, consider:ba

shsleep 1.0  # 1 second between calls

## Verification

After running the script, verify the results:ba

sh

# Check total TO_REVIEW countcurl -s https://sonarcloud.io/api/hotspots/searchproject

Key=DollhouseMCP_mcp-serverstatus=TO_REVIEWps=1   -H Authorization: Bearer SONARQUBE_TOKEN  jq .paging.total

# Check production file TO_REVIEW count should be 0curl -s https://sonarcloud.io/api/hotspots/searchproject

Key=DollhouseMCP_mcp-serverstatus=TO_REVIEWps=100   -H Authorization: Bearer SONARQUBE_TOKEN    jq [.hotspots[]  select.component  test^DollhouseMCP_mcp-server:src/]  length

# View on Sonar

Cloudopen https://sonarcloud.io/project/security_hotspotsid=DollhouseMCP_mcp-server

## Success Metrics Oct 1, 2025Before: 202 TO_REVIEW hotspotsAfter: 152 TO_REVIEW hotspotsMarked: 47 production code hotspots 100% success rate

Time: 30 seconds executionAPI Calls: 47 successful HTTP 204Failures: 0Remaining 152 hotspots: All in test files, archived scripts, or non-production code

## Trouble

shooting

### HTTP 401 Errors

bash

# Problem: Token invalid

# Solution: Validate token firstcurl -s https://sonarcloud.io/api/authentication/validate   -H Authorization: Bearer SONARQUBE_TOKEN

# If valid:false, token needs regeneration in Sonar

Cloud

### HTTP 403 Errors

bash

# Problem: Missing permissions

# Solution: Regenerate token with Administer Security Hotspots permission

# Go to: https://sonarcloud.io/account/security

### jq Command Not Found

bash

# Install jq JSON processorbrew install jq  # macOS

### No Hotspots Found

bash

# Check if there are any TO_REVIEW hotspotscurl -s https://sonarcloud.io/api/hotspots/searchproject

Key=DollhouseMCP_mcp-serverstatus=TO_REVIEWps=1   -H Authorization: Bearer SONARQUBE_TOKEN  jq .paging.total

## Related DocumentationSession Memory: session-2025-10-01-afternoon-sonarcloud-hotspot-marking-successAPI Reference: sonarcloud-api-reference memory

Security Review: docs/security/SONARCLOUD_HOTSPOT_SECURITY_REVIEW.mdPR: #1219

- Comprehensive security hotspot review

## Integration with Workflow

### Typical Process

1. Comprehensive Security Review → Document all patterns as SAFE

2. Create PR → Include detailed analysis like PR #

12193. Run Script → Bulk mark all reviewed hotspots

4. Verify → Check Sonar

Cloud da

shboard

5. Merge PR → Documentation remains as reference

### When to Use

- After completing comprehensive security audit

- When you have detailed documentation justifying SAFE status

- For production code hotspots only be cautious with test files

- When token has proper permissions

### When NOT to Use

- Without prior security review and documentation

- For hotspots you havent personally analyzed

- When token authentication is uncertain

- For test files without careful consideration
