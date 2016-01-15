import { createServer } from 'https'

import { PFX_BASE64 } from './lib/env'
import { skeleton } from 'glob:templates/*.js'

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, (req, res) => {
  res.end(skeleton())
}).listen(8443)
