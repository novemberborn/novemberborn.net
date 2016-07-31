#!/bin/bash
set -e

CERT_NAME=${CERT_NAME:-development}

docker run \
  --rm \
  --name=site \
  -p 443:8443 \
  -p 8443:8443 \
  -e ANY_CLIENT=true \
  -e CERT_NAME=${CERT_NAME} \
  --env-file=.env \
  novemberborn-dot-net | bunyan
