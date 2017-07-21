#!/bin/bash
set -e
mkdir -p dist
postcss src/style.css --output dist/style.css
