#!/bin/bash
set -e
nodemon \
  -w content \
  -w static \
  -w dist \
  -e css,css.map,ico,jpg,js,js.map,md,png,svg \
  -x 'babel src --ignore src/browser.js --out-dir dist --source-maps --watch'
