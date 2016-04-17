#!/bin/bash
set -e
nodemon -w src/style.css -x "$(dirname ${0})/../css.sh"
