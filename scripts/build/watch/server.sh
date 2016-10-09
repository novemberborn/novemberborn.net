#!/bin/bash
set -e
nodemon \
  -w content \
  -w static \
  -w dist/style.css \
  -w dist/browser.js \
  -e ico,jpg,js,md,png,svg \
  -x 'babel src --ignore src/browser.js --out-dir dist --source-maps --watch'
