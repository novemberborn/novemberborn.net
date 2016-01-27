#!/bin/bash

set -e

docker rm novemberborn-dot-net-build | true
docker build -t novemberborn-dot-net-build -f build.Dockerfile .

tmp=$(mktemp -d)

docker create --name novemberborn-dot-net-build novemberborn-dot-net-build /bin/true
docker cp novemberborn-dot-net-build:/app/. - > ${tmp}/combined.tgz

tar -c --include './node_modules' -f ${tmp}/node_modules.tgz @${tmp}/combined.tgz
tar -c --exclude './node_modules' -f ${tmp}/app.tgz @${tmp}/combined.tgz
rm ${tmp}/combined.tgz

cp Dockerfile ${tmp}
docker build -t novemberborn-dot-net -f ${tmp}/Dockerfile ${tmp}
rm -rf ${tmp}
