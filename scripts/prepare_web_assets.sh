#!/usr/bin/env bash
set -euo pipefail
rm -rf app/src/main/assets/libs
mkdir -p app/src/main/assets/libs
cp -R web/node_modules/three app/src/main/assets/libs/three
cp -R web/node_modules/three-viewport-gizmo app/src/main/assets/libs/three-viewport-gizmo
