#!/usr/bin/env bash
# Builds two files from src/:
#   gleamwell.html  page fragment (published as a claude.ai Artifact, which adds its own skeleton)
#   index.html      standalone page (open directly or host anywhere)
set -euo pipefail
cd "$(dirname "$0")"
head='<title>Gleamwell Smile Co.</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Gleamwell Smile Co.: smile brighter, smile forever. A satirical horror story told through a website.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=VT323&family=IBM+Plex+Mono:wght@400;500;600&family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap">'
{
  echo "$head"
  echo '<style>'; cat src/style.css; echo '</style>'
  cat src/body.html
  echo '<script>'; echo '(() => {'; echo "'use strict';"; document_class='document.body.classList.add("gated");'; echo "$document_class"
  cat src/js/*.js
  echo '})();'; echo '</script>'
} > gleamwell.html
{
  echo '<!doctype html>'; echo '<html lang="en">'; echo '<head>'; echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '</head>'; echo '<body>'
  cat gleamwell.html
  echo '</body>'; echo '</html>'
} > index.html
echo "built: $(wc -c < gleamwell.html) bytes"
