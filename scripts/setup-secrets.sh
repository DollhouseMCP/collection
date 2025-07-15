#!/bin/bash
# Setup script for repository secrets

set -e

echo "🔐 DollhouseMCP Collection - Secrets Setup"
echo "========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Please install it: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "   Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to set a secret
set_secret() {
    local name=$1
    local prompt=$2
    
    echo "📝 Setting up $name"
    echo "   $prompt"
    echo ""
    
    read -s -p "Enter value for $name (input hidden): " value
    echo ""
    
    if [ -z "$value" ]; then
        echo "⚠️  Skipping $name (no value provided)"
        return
    fi
    
    echo "$value" | gh secret set "$name"
    echo "✅ $name has been set"
    echo ""
}

# Main setup
echo "This script will help you set up the required secrets."
echo "Press Ctrl+C to cancel at any time."
echo ""

# ANTHROPIC_API_KEY
echo "1️⃣  ANTHROPIC_API_KEY (Required for Claude bot)"
echo "   - Sign up at https://console.anthropic.com"
echo "   - Create an API key"
echo "   - This enables automated PR reviews"
echo ""
read -p "Do you want to set ANTHROPIC_API_KEY? (y/n): " setup_anthropic
if [[ "$setup_anthropic" == "y" ]]; then
    set_secret "ANTHROPIC_API_KEY" "Paste your Anthropic API key"
fi

echo ""

# ADD_TO_PROJECT_PAT
echo "2️⃣  ADD_TO_PROJECT_PAT (Optional - for project integration)"
echo "   - Go to GitHub Settings → Developer settings → Personal access tokens"
echo "   - Create token with 'repo' and 'project' scopes"
echo "   - This enables automatic project tracking"
echo ""
read -p "Do you want to set ADD_TO_PROJECT_PAT? (y/n): " setup_pat
if [[ "$setup_pat" == "y" ]]; then
    set_secret "ADD_TO_PROJECT_PAT" "Paste your Personal Access Token"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To verify your setup:"
echo "  - For Claude bot: gh workflow run test-claude-bot.yml"
echo "  - For project integration: Create a test issue"
echo ""
echo "For more information, see docs/SECRETS_SETUP.md"