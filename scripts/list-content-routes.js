#!/usr/bin/env node
'use strict'

const router = require('../dist/lib/router') // eslint-disable-line import/no-unresolved

for (const pathname of Object.keys(router.table)) {
  console.log(`https://novemberborn.net${pathname}`)
}
