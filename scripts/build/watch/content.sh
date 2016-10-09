#!/bin/bash
set -e
nodemon -w dist/lib/content.js -x  "$(dirname ${0})/../content.js"
