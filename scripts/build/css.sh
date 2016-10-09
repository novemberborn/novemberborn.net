#!/bin/bash
set -e
mkdir -p dist
postcss -o dist/style.css -m file -c postcss.json src/style.css
