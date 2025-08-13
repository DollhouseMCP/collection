# PR Validation Pipeline

This directory contains the comprehensive PR validation system for the DollhouseMCP Collection. The validation pipeline ensures all content submissions meet quality, security, and integration standards before being merged.

## Components

### 1. GitHub Workflow (`.github/workflows/pr-validation.yml`)

The main workflow that orchestrates all validation checks when PRs are created or updated. It runs four parallel validation jobs:

- **Security Scan**: Deep security analysis for malicious patterns
- **Schema Check**: YAML/JSON structure validation  
- **Content Quality**: Documentation and completeness analysis
- **Integration Test**: Element loading and functionality verification

### 2. Report Generator (`report-generator.mjs`) ⭐ NEW

Comprehensive report generation system that creates contextual review reports to help maintainers make informed decisions:

- **Unified Report Generation**: Aggregates all validation results into comprehensive markdown reports
- **Auto-Approval Assessment**: Intelligent eligibility analysis with confidence scoring
- **Reviewer Decision Support**: Contextual checklists and prioritized review areas
- **Visual Dashboards**: Quality metrics, security assessment, and performance impact analysis
- **Intelligent Recommendations**: Risk assessment, improvement suggestions, and similar element detection

**Key Features:**
- Security assessment summary with confidence scores
- Quality metrics dashboard with visualizations  
- Compatibility analysis with existing elements
- Performance impact assessment
- Community guidelines compliance checking
- Auto-approval eligibility based on comprehensive criteria

**Usage**: `node report-generator.mjs validation-results.json [output-dir]`

### 3. Integrated Pipeline (`validate-and-report.mjs`) ⭐ NEW

Complete end-to-end validation and reporting pipeline that orchestrates all components:

- **Parallel Validation Execution**: Runs security, quality, and integration tests simultaneously
- **Results Aggregation**: Combines all validation outputs into unified structure
- **Comprehensive Reporting**: Generates multiple report formats (Markdown, JSON)
- **GitHub Integration**: Creates status checks and PR comments
- **Error Handling**: Robust failure recovery and detailed logging

**Usage**: `node validate-and-report.mjs "file1.md,file2.md" [options]`

### 4. Security Scanner (`security-scanner.mjs`)

Advanced security analysis utility that performs:

- Multi-layered pattern detection for injection attacks
- Context-aware vulnerability assessment  
- Anomaly detection using statistical analysis
- Risk scoring and detailed threat categorization
- Support for prompt injection, code injection, and social engineering detection

**Usage**: `node security-scanner.mjs "file1.md,file2.md"`

### 3. Quality Analyzer (`quality-analyzer.mjs`)

Comprehensive content quality assessment covering:

- Documentation completeness (25% weight)
- Metadata richness (20% weight)  
- Content structure (20% weight)
- Language quality (15% weight)
- Usability (10% weight)
- Best practices compliance (10% weight)

**Usage**: `node quality-analyzer.mjs "file1.md,file2.md"`

### 4. Integration Tester (`integration-tester.mjs`)

Element functionality and integration testing including:

- Element loading and parsing verification
- Schema compliance checking
- Collection integration validation
- Cross-reference integrity checks
- Performance and compatibility testing

**Usage**: `node integration-tester.mjs "file1.md,file2.md"`

### 7. Test Validation (`test-validation.mjs`)

Comprehensive testing utility to verify all validation components work correctly before deployment.

**Usage**: `node test-validation.mjs`

### 8. Report Generator Testing (`test-report-generator.mjs`) ⭐ NEW

Testing utility specifically for the report generation system:

- **Sample Data Generation**: Creates realistic validation results for testing
- **Template Validation**: Ensures all report templates work correctly
- **Edge Case Testing**: Validates handling of unusual scenarios
- **Output Verification**: Checks report quality and completeness

**Usage**: `node test-report-generator.mjs`

## Workflow Integration

### Status Checks

The workflow creates GitHub status checks for each validation stage:

- `pr-validation/security` - Security scan results
- `pr-validation/schema` - Schema validation status  
- `pr-validation/quality` - Content quality score
- `pr-validation/integration` - Integration test results
- `pr-validation/overall` - Combined validation status

### PR Comments

The workflow automatically posts comprehensive validation reports as PR comments, including:

- Overall validation status with pass/fail indicators
- Detailed breakdown of each validation check
- Security risk levels and quality scores
- Actionable recommendations for failed checks
- Links to detailed reports in workflow artifacts

### Artifacts

Each validation run generates detailed reports stored as workflow artifacts:

- `security-scan-report/security-report.json`
- `quality-analysis-report/quality-report.json`  
- `integration-test-report/integration-report.json`
- `pr-validation-report/` (comprehensive combined report)

### Report Generation ⭐ NEW

The enhanced validation pipeline now generates comprehensive review reports:

#### 📋 Review Report (`review-report.md`)
- Executive summary with overall status and quick metrics
- Detailed validation dashboard with visual indicators
- Security analysis with confidence scoring and threat assessment
- Quality metrics breakdown with benchmark comparisons
- Integration testing results with compatibility analysis
- Performance impact assessment and community guidelines compliance

#### 🤖 Auto-Approval Assessment (`auto-approval-assessment.md`)
- Eligibility criteria analysis with pass/fail status for each requirement
- Decision logic with confidence scoring and risk assessment
- Comparative analysis against collection benchmarks
- Fallback strategy and escalation recommendations

#### ✅ Reviewer Checklist (`reviewer-checklist.md`)  
- Prioritized checklist items (Critical/Important/Optional)
- Detailed review guides with step-by-step instructions
- Decision matrix and approval criteria
- Review comment templates and time estimates

#### 📊 JSON Reports
- `validation-report.json`: Complete validation data structure
- `validation-summary.json`: Key metrics and recommendations for programmatic access

## Validation Criteria

### Security (Critical)

- **Pass**: No critical or high-risk security issues
- **Fail**: Any critical security patterns detected or >3 high-risk issues

### Schema (Required)

- **Pass**: Valid YAML frontmatter with all required fields
- **Fail**: Missing required fields or invalid data types

### Quality (70+ score required)

Scoring breakdown:
- **A (90-100)**: Excellent quality, comprehensive documentation
- **B (80-89)**: Good quality, minor improvements needed  
- **C (70-79)**: Acceptable quality, meets minimum standards
- **D/F (<70)**: Below standards, requires significant improvement

### Integration (All tests pass)

- **Pass**: Element loads correctly, no integration conflicts
- **Fail**: Parse errors, naming conflicts, or broken functionality

### Auto-Approval Criteria ⭐ NEW

Elements are eligible for automatic approval when ALL criteria are met:

| Criteria | Requirement | Weight |
|----------|-------------|---------|
| **Quality Score** | ≥ 85/100 | High |
| **Security Risk** | ≤ LOW level | Critical |
| **Critical Issues** | = 0 | Critical |
| **High Risk Issues** | ≤ 1 | High |
| **Integration Tests** | 100% pass rate | High |

**Confidence Scoring**: Auto-approval decisions include confidence levels (0-100%) based on:
- Validation result consistency
- Pattern matching reliability  
- Historical accuracy of similar assessments
- Risk factor analysis

**Fallback Strategy**: If auto-approval criteria aren't met, the system provides:
- Specific failure reasons and remediation steps
- Recommended reviewer assignment based on issue types
- Priority level assignment for manual review queue
- Estimated review time and complexity assessment

## Development

### Adding New Validation Checks

1. **Security Patterns**: Add to `SECURITY_PATTERNS` in `security-scanner.mjs`
2. **Quality Metrics**: Extend `QUALITY_METRICS` in `quality-analyzer.mjs`
3. **Integration Tests**: Add test methods to `IntegrationTester` class

### Customizing Thresholds

Adjust validation thresholds in each utility:

- Security: Modify risk scoring logic
- Quality: Update `passingScore` (default: 70)
- Integration: Add/remove test requirements

### Testing Changes

Always run the test suite before deploying changes:

```bash
node scripts/pr-validation/test-validation.mjs
```

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure scripts are executable (`chmod +x *.mjs`)
2. **Module Not Found**: Install dependencies (`npm ci`)
3. **Parse Errors**: Check YAML frontmatter syntax
4. **High Security Scores**: Review content for flagged patterns

### Debug Mode

Set environment variable for verbose output:

```bash
DEBUG=1 node security-scanner.mjs "file.md"
```

## Performance

The validation pipeline is optimized for speed:

- Parallel execution of validation jobs
- File-level parallelization within each job
- Efficient pattern matching and parsing
- Caching of expensive operations

Typical performance:
- Security scan: ~100ms per file
- Quality analysis: ~50ms per file  
- Integration tests: ~200ms per file
- Overall pipeline: ~2-3 minutes for typical PRs

## Security Considerations

The validation system itself follows security best practices:

- No external network calls during validation
- Sandboxed execution environment
- Input sanitization and bounds checking
- Read-only file system access
- Memory usage limits and timeouts

---

*This validation system ensures the DollhouseMCP Collection maintains high standards for security, quality, and reliability across all contributed content.*