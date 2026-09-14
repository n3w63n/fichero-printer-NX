#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if [ ! -f dist/index.html ]; then
  echo "No build found. Running npm run build..."
  npm run build
fi
npm run serve:local
