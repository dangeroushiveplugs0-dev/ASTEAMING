#!/usr/bin/env bash
set -euo pipefail

rm -rf app/src/main/assets
mkdir -p app/src/main/assets/libs

# WebView loads the entry point from the Android asset root.
cp web/index.html app/src/main/assets/index.html

# Bundle the exact web dependencies used by the viewport.
cp -R web/node_modules/three app/src/main/assets/libs/three
cp -R web/node_modules/three-viewport-gizmo app/src/main/assets/libs/three-viewport-gizmo
