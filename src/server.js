import { createServer } from 'https'

import { PFX_BASE64 } from './lib/env'
import { skeleton } from 'glob:templates/*.js'

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405)
    res.end()
    return
  }

  res.end(skeleton())
}).listen(8443)
