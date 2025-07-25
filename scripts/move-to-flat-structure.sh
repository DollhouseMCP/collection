#!/bin/bash

# Script to move all library files to flat directory structure
# This implements Phase 2 of the category removal plan

echo "Moving library files to flat directory structure..."

# Move personas
echo "Moving personas..."
for file in library/personas/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/personas/$filename"
  fi
done

# Move skills
echo "Moving skills..."
for file in library/skills/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/skills/$filename"
  fi
done

# Move agents
echo "Moving agents..."
for file in library/agents/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/agents/$filename"
  fi
done

# Move templates
echo "Moving templates..."
for file in library/templates/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    # Handle naming conflicts for templates
    if [[ "$file" == *"business/report"* ]]; then
      mv "$file" "library/templates/report-executive_$(basename "$file")"
    elif [[ "$file" == *"professional/report"* ]]; then
      mv "$file" "library/templates/report-$(basename "$file")"
    else
      mv "$file" "library/templates/$filename"
    fi
  fi
done

# Move ensembles
echo "Moving ensembles..."
for file in library/ensembles/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/ensembles/$filename"
  fi
done

# Move memories
echo "Moving memories..."
for file in library/memories/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/memories/$filename"
  fi
done

# Move prompts
echo "Moving prompts..."
for file in library/prompts/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/prompts/$filename"
  fi
done

# Move tools
echo "Moving tools..."
for file in library/tools/*/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    mv "$file" "library/tools/$filename"
  fi
done

# Remove empty directories
echo "Removing empty directories..."
find library -type d -empty -delete

echo "✅ Done! All files have been moved to flat directory structure."
echo ""
echo "Next steps:"
echo "1. Check for any naming conflicts"
echo "2. Update unique IDs to include type prefix"
echo "3. Commit the changes"