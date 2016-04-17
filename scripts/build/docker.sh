#!/bin/bash

set -e

# Build the initial image, from a non-slim base image.
docker build -t novemberborn-dot-net-build -f build.Dockerfile .

# Create a fresh container from the newly built image.
docker rm novemberborn-dot-net-build | true
docker create --name novemberborn-dot-net-build novemberborn-dot-net-build /bin/true

# Extract production dependencies and built app code from the container.
tmp=$(mktemp -d)
docker cp novemberborn-dot-net-build:/prod_modules/node_modules/. - > ${tmp}/node_modules.tgz
docker cp novemberborn-dot-net-build:/app/. - > ${tmp}/full.tgz

# Remove dev dependencies from the app code.
tar -c --exclude './node_modules' -f ${tmp}/app.tgz @${tmp}/full.tgz

# The full.tgz archive is not needed in the build context, remove to improve
# build performance.
rm ${tmp}/full.tgz

# Dockerfile needs to be in the build context directory.
cp Dockerfile ${tmp}

# Build the production image, based on a slim base image.
docker build -t novemberborn-dot-net -f ${tmp}/Dockerfile ${tmp}

# Cleanup
docker rm novemberborn-dot-net-build | true
rm -rf ${tmp}
