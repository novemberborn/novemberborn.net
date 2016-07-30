#!/bin/bash
set -e
mkdir dist
postcss -o dist/style.css -m file -c postcss.json src/style.css
