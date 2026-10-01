#!/usr/bin/env bash
# Render a local HTML file to a PNG of an exact CSS-pixel size with headless Chrome.
# Usage: scripts/hero-film/render-html.sh <in.html> <out.png> <width> <height>
set -euo pipefail
in="$1"; out="$2"; w="$3"; h="$4"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$chrome" ] || { echo "Google Chrome not found at $chrome" >&2; exit 2; }
mkdir -p "$(dirname "$out")"
abs="$(cd "$(dirname "$in")" && pwd)/$(basename "$in")"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --default-background-color=0F1E35FF --virtual-time-budget=3000 \
  --window-size="$w,$h" --screenshot="$out" "file://$abs" >/dev/null 2>&1
node -e "require('sharp')('$out').metadata().then(m=>{if(m.width!==$w||m.height!==$h){console.error('wrong size',m.width,m.height);process.exit(1)}console.log('$out',m.width+'x'+m.height)})"
