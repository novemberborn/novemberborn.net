#!/bin/bash
set -e
uglifyjs -c -m \
  -o static/browser.js \
  --source-map static/browser.js.map \
  --source-map-url ./browser.js.map \
  --source-map-include-sources \
  src/browser.js
