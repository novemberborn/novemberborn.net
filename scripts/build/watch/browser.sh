#!/bin/bash
set -e
nodemon -w src/browser.js -x "$(dirname ${0})/../js.sh"
