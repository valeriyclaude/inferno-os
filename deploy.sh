#!/bin/zsh
# Билд + деплой Inferno OS на GitHub Pages (ветка gh-pages). Отдельный репо — акция его не трогает.
set -e
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/valeriyclaude/work/projects/inferno-os
npm run build
TOKEN=$(cat ~/work/projects/inferno/.new_gh_token)
D=/tmp/inferno-os-deploy
rm -rf "$D"; cp -r dist "$D"; touch "$D/.nojekyll"
cd "$D"
git init -q && git checkout -q -b gh-pages
git add -A
git -c user.email=valeriyclaude@proton.me -c user.name=valeriyclaude commit -q -m "Deploy $(/bin/date +%Y%m%d-%H%M)"
git push -f "https://$TOKEN@github.com/valeriyclaude/inferno-os.git" gh-pages
echo "→ https://valeriyclaude.github.io/inferno-os/"
