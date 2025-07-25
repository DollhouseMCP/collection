#!/bin/bash

# Script to update unique IDs to include type prefix
# Format: {type}_{name}_{author}_{datetime}

echo "Updating unique IDs to include type prefix..."

# Function to update unique ID in a file
update_unique_id() {
  local file=$1
  local type=$2
  
  # Extract current unique_id from the file
  current_id=$(grep -E "^unique_id:" "$file" | sed 's/unique_id: //')
  
  # Check if ID already has type prefix
  if [[ "$current_id" == "$type"_* ]]; then
    echo "✓ $file already has type prefix"
    return
  fi
  
  # Create new ID with type prefix
  new_id="${type}_${current_id}"
  
  # Update the file
  sed -i.bak "s/^unique_id: ${current_id}/unique_id: ${new_id}/" "$file"
  rm "${file}.bak"
  
  echo "✓ Updated $file: $current_id → $new_id"
}

# Update personas
for file in library/personas/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "persona"
done

# Update skills
for file in library/skills/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "skill"
done

# Update agents
for file in library/agents/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "agent"
done

# Update templates
for file in library/templates/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "template"
done

# Update ensembles
for file in library/ensembles/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "ensemble"
done

# Update memories
for file in library/memories/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "memory"
done

# Update prompts
for file in library/prompts/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "prompt"
done

# Update tools
for file in library/tools/*.md; do
  [ -f "$file" ] && update_unique_id "$file" "tool"
done

echo "✅ Done! All unique IDs have been updated."