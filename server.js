'use strict'

const https = require('https')

const pfx = new Buffer(process.env.PFX_BASE64, 'base64')

https.createServer({ pfx }, (req, res) => {
  res.end('Hello world')
}).listen(8443)
