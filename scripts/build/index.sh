#!/bin/bash
set -e
dir=$(dirname ${0})
${dir}/browser.sh
${dir}/server.sh
