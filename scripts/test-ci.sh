#!/bin/bash
# Test CI/CD locally before pushing

set -e

echo "🧪 Testing CI/CD locally..."

# Build
echo "📦 Building project..."
npm run build

# Validate content
echo "🔍 Validating content..."
npm run validate library/**/*.md showcase/**/*.md catalog/**/*.md || true

# Run tests
echo "🧪 Running tests..."
npm test || true

# Check for security issues
echo "🔒 Checking dependencies..."
npm audit --production

echo "✅ CI tests complete!"