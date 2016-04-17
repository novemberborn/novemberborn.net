#!/bin/bash
set -e
docker run \
  --rm \
  --name=site \
  -p 443:8443 \
  -e ANY_CLIENT=true \
  -e CERT_NAME=development \
  --env-file=.env \
  novemberborn-dot-net | bunyan
