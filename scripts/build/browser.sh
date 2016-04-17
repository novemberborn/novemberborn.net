#!/bin/bash
set -e
dir=$(dirname ${0})
${dir}/css.sh
${dir}/js.sh
