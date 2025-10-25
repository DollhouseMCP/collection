#!/bin/bash
for file in library/agents/*.md; do
    result=$(node scripts/pr-validation/security-scanner.mjs "$file" 2>&1 | grep "Issues:")
    issues=$(echo "$result" | grep -oE '[0-9]+$')
    if [ -n "$issues" ] && [ "$issues" != "0" ]; then
        echo "$(basename "$file"): $issues issues"
    fi
done
