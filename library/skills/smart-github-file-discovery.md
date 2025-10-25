---
name: smart-github-file-discovery
description: >-
  Smart GitHub repository file discovery that verifies actual file existence
  before URL generation, eliminating false positives and hallucinated file paths
version: 1.0.0
created: '2025-08-19T21:30:35.278Z'
modified: '2025-08-19T21:30:35.278Z'
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
# Smart Git

Hub Repository File Discovery and URL Generator

## PurposeIntelligently discovers actual files in Git

Hub repositories through search-based reconnaissance, then generates precise raw URLs only for files that actually exist, eliminating false positives and hallucinated file paths.

## Two-Phase Approach

### Phase 1: Repository File DiscoveryUses Git

Hub search and repository browsing to identify real files before URL generation.

#### Discovery Methods

1. Git

Hub Search API Simulation

- Search for specific file types in the repository

- Use site:github.com queries to find actual file listings

- Parse repository tree views and file browsers

- Extract real file paths from search results

2. Common File Pattern Verification

- Search for package.json, requirements.txt, etc. specifically

- Verify main entry points index.js, main.py, src/, etc.

- Check for configuration files Dockerfile, docker-compose.yml, etc.

- Look for security-relevant files SECURITY.md, etc.

3. Repository Structure Analysis

- Parse repository README for file references

- Extract file mentions from documentation

- Identify project type and expected file structure

- Cross-reference with actual search results

### Phase 2: Precise URL Generation

Only generates URLs for files confirmed to exist in Phase 1.

#### Verified URL Creation

javascript// Only generate URLs for confirmed filesconst verifiedFiles = discoverActualFilesrepoURLconst rawURLs = verifiedFiles.mapfile = generate

RawURLowner, repo, branch, file.path

#### No Speculative Generation

- Never generate URLs for files not found in discovery

- Flag when expected files are missing

- Provide alternative file suggestions based on actual structure

- Clear distinction between found and expected but missing

## Implementation Framework

### File Discovery Engine

javascriptclass GitHubFileDiscovery     async discoverFilesrepoURL         const  owner, repo, branch  = this.parseReporepoURL                // Step 1: Search for specific file types        const packageFiles = await this.searchForFilesowner, repo, [package.json, requirements.txt, Car

go.toml]        const sourceFiles = await this.searchForSourceFilesowner, repo, branch        const configFiles = await this.searchForConfigFilesowner, repo                // Step 2: Verify files exist via search results        const verifiedFiles = await this.verifyFileExistencepackageFiles, sourceFiles, configFiles                // Step 3: Return only confirmed files        return             confirmed: verifiedFiles,            missing: this.getExpectedButMissingverifiedFiles,            structure: this.analyzeProjectStructureverifiedFiles                    async searchForFilesowner, repo, filenames         const foundFiles = []        for const filename of filenames             const searchQuery = site:github.com owner/repo filename            const results = await this.searchGitHubsearchQuery            if this.confirmFileInResultsresults, filename                 foundFiles.pu

sh                    name: filename,                    path: filename,                    confirmed: true                                            return foundFiles            async searchForSourceFilesowner, repo, branch         // Search for actual source file references        const sourcePatterns = [            site:github.com owner/repo/blob/branch/src,            site:github.com owner/repo/blob/branch filetype:js,            site:github.com owner/repo/blob/branch filetype:ts,            site:github.com owner/repo/blob/branch filetype:py        ]                const foundSources = []        for const pattern of sourcePatterns             const results = await this.searchGitHubpattern            foundSources.pu

sh...this.extractFilePathsFromResultsresults                        return this.deduplicateFilesfound

Sources    #

## Search-Based File Verification

javascript// Use web search to verify file existenceasync verifyFileExistsowner, repo, filePath     const searchQueries = [        site:github.com owner/repo/blob/main/filePath,        site:github.com owner/repo/blob/master/filePath,        filePath site:github.com owner/repo    ]        for const query of searchQueries         const results = await webSearchquery        if this.foundFileInResultsresults, file

Path             return true                return false

## Discovery Strategies

### Language-Specific Discovery

javascriptconst discoveryStrategies =     javascript:
  packageFiles: [package.json, package-lock.json, yarn.lock],        entryPoints: [index.js, main.js, src/index.js, src/main.js],        configs: [webpack.config.js, vite.config.js, tsconfig.json]    ,    python:
  packageFiles: [requirements.txt, pyproject.toml, Pipfile],        entryPoints: [main.py, app.py, src/main.py, __init__.py],        configs: [setup.py, setup.cfg, tox.ini]    ,    rust:
  packageFiles: [Car

go.toml, Car

go.lock],        entry

Points: [src/main.rs, src/lib.rs],        configs: [Car

go.toml, rust-toolchain.toml]    #

## Security File Discovery

javascriptconst securityFile

Patterns =     critical: [        SECURITY.md,        .github/SECURITY.md,         security.txt,        .well-known/security.txt    ],    dependencies: [        package.json, requirements.txt, Car

go.toml,        go.mod, pom.xml, build.gradle    ],    infrastructure: [        Dockerfile, docker-compose.yml,        .github/workflows/.yml,        kubernetes/.yaml    ]

## Output Format

### Confirmed Files Only

json  repository: owner/repo,  branch: main,  discovery_method: search_verified,  confirmed_files:
  dependencies: [              name: package.json,        path: package.json,        url: https://raw.githubusercontent.com/owner/repo/main/package.json,        verified: true          ],    source: [              name: main.tsx,         path: src/main.tsx,        url: https://raw.githubusercontent.com/owner/repo/main/src/main.tsx,        verified: true          ]  ,  missing_expected: [    index.js not found

- project uses main.tsx instead  ],  project_analysis:
  type: React Type

Script Project,    framework: Vite,    entry_point: src/main.tsx  #

## Clear Status Indicators

javascriptconst file

Status =     CONFIRMED: File exists

- URL generated,    MISSING: Expected file not found,    ALTERNATIVE: Different file found instead,    UNCERTAIN: Could not verify existence

## Error Handling and Transparency

### Discovery Limitations

- Clearly state when files cannot be verified

- Explain search limitations and potential false negatives

- Provide manual verification suggestions

- Never generate URLs for unconfirmed files

### Graceful Degradation

javascriptif discovery

Failed     return         status: DISCOVERY_FAILED,        message: Could not verify file existence via search,        suggestions: [            Check repository manually,            Provide specific file paths,            Try alternative search terms        ],        fallback_urls: [] // Empty

- no speculation    #

# Integration with Security Analysis

### Verified Files Only Pipeline

1. Discover → Only real files found via search

2. Generate URLs → Only for confirmed files

3. Fetch Content → High success rate

4. Security Analysis → Based on actual code

5. Report → Accurate findings

### Quality Assurance

- Track URL generation success rates

- Monitor false positives/negatives

- Improve discovery patterns based on results

- Maintain accuracy metrics

## Usage Examples

### Basic DiscoveryInput: https://github.com/owner/repoProcess:
  1. Search for common files in repository

2. Verify existence through search results

3. Generate URLs only for confirmed files

Output: Verified file list with working URLs

### Security-Focused DiscoveryInput: https://github.com/owner/repo --security-focusProcess:
  1. Search specifically for security-relevant files

2. Verify package managers, configs, and source files

3. Generate prioritized URL listOutput: Security-critical files with high fetch probability

This approach eliminates hallucinated files and ensures that generated URLs correspond to actual repository content, making security analysis far more reliable and accurate.
