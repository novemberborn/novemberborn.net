#!/bin/bash
set -e
mkdir -p dist
uglifyjs -c -m \
  -o dist/browser.js \
  --source-map filename=dist/browser.js.map \
  --source-map includeSources \
  src/browser.js
echo "//# sourceMappingURL=./browser.js.map" >> dist/browser.js
