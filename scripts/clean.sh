#!/bin/sh
set -e
rimraf \
  lib \
  node_modules/.cache \
  server.js* \
  static/browser.js* \
  static/style.css* \
  templates
