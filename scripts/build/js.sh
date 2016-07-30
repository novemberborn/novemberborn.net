#!/bin/bash
set -e
mkdir -p dist
uglifyjs -c -m \
  -o dist/browser.js \
  --source-map dist/browser.js.map \
  --source-map-url ./browser.js.map \
  --source-map-include-sources \
  src/browser.js
