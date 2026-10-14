#!/bin/bash
# Sync projects.json → portfolio commands.js + GitHub profile README
# Usage: ./sync-projects.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GITHUB_USER="lgdlcs"
PROJECTS_FILE="$SCRIPT_DIR/projects.json"

if ! command -v jq &>/dev/null; then echo "Need jq: brew install jq"; exit 1; fi

echo "📦 Reading projects.json..."

# --- Update portfolio commands.js ---
PROJ_LINES=""
ID_WIDTH=$(jq '[.[].id | length] | max + 1' "$PROJECTS_FILE")
while IFS= read -r line; do
  emoji=$(echo "$line" | jq -r '.emoji')
  id=$(echo "$line" | jq -r '.id')
  desc=$(echo "$line" | jq -r '.desc')
  padded=$(printf "%-${ID_WIDTH}s" "$id")
  PROJ_LINES+="        { text: '$emoji $padded— $desc', link: 'https://github.com/$GITHUB_USER/$id' },\n"
done < <(jq -c '.[]' "$PROJECTS_FILE")

# Replace projects block in commands.js
python3 -c "
import re, sys
content = open('$SCRIPT_DIR/js/commands.js').read()
new_lines = '''$PROJ_LINES'''.rstrip(',\n')
pattern = r\"(text: 'Projects.*?cls: 'accent'.*?\n        \{ text: '' \},\n)(.*?)(    \],)\"
def repl(m):
    return m.group(1) + new_lines.rstrip() + '\n        '  + m.group(3)
result = re.sub(pattern, repl, content, flags=re.DOTALL)
open('$SCRIPT_DIR/js/commands.js', 'w').write(result)
"
echo "✅ Portfolio commands.js updated"

# --- Update GitHub profile README ---
PROFILE_DIR=$(mktemp -d)
git clone --quiet "git@github.com:$GITHUB_USER/$GITHUB_USER.git" "$PROFILE_DIR" 2>/dev/null

FEATURED=""
while IFS= read -r line; do
  emoji=$(echo "$line" | jq -r '.emoji')
  id=$(echo "$line" | jq -r '.id')
  desc=$(echo "$line" | jq -r '.desc')
  FEATURED+="$emoji [$id](https://github.com/$GITHUB_USER/$id) — $desc\n"
done < <(jq -c '.[] | select(.featured == true)' "$PROJECTS_FILE")

cat > "$PROFILE_DIR/README.md" << READMEEOF
### Hey, I'm Lucas 👋

Developer & builder based near Annecy, French Alps 🏔️

Building side projects, shipping fast, learning by doing.

#### What I'm working on

$(echo -e "$FEATURED")
#### Stack

\`\`\`
Frontend    → Bro do you even read code ?
Backend     → Bro do you even read code ?
Tools       → Git · Omarchy
AI          → OpenClaw · Claude Code · personal harness · status line
\`\`\`

#### Find me

🌐 [Portfolio](https://$GITHUB_USER.github.io/portfolio/) — *try typing \`secret\` in the terminal* 😏

---

<sub>⚡ Powered by too much coffee and not enough sleep</sub>
READMEEOF

cd "$PROFILE_DIR" && git add -A && git commit -m "chore: sync projects" --quiet && git push --quiet
rm -rf "$PROFILE_DIR"
echo "✅ GitHub profile README updated"

# --- Commit portfolio changes ---
cd "$SCRIPT_DIR" && git add -A && git commit -m "chore: sync projects" --quiet && git push --quiet
echo "✅ Portfolio pushed"

echo ""
echo "🎉 All synced!"
