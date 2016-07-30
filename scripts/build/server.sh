#!/bin/bash
set -e
babel src --ignore src/browser.js --out-dir dist --source-maps
