#!/usr/bin/env node

/**
 * CLI for validating content files
 */

console.log('DollhouseMCP Content Validator');

// Check for --help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: validate [options] <files...>

Options:
  -h, --help     Show help
  -v, --version  Show version
  --verbose      Show detailed output

Examples:
  validate library/**/*.md
  validate showcase/personas/example.md
`);
  process.exit(0);
}

// Check for --version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('1.0.0');
  process.exit(0);
}

// TODO: Implement actual validation
console.log('Validation complete (placeholder)');
process.exit(0);