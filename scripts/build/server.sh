#!/bin/bash
set -e
dir=$(dirname ${0})
babel src --ignore src/browser.js --out-dir dist --source-maps
${dir}/content.js
