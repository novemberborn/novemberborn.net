#!/bin/bash
set -e
postcss -o static/style.css -m file -c postcss.json src/style.css
