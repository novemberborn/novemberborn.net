#!/usr/bin/env node
'use strict'

const router = require('../lib/router')

for (const pathname of Object.keys(router.table)) {
  console.log(`https://novemberborn.net${pathname}`)
}
