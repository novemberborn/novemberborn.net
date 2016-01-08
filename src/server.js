import { createServer } from 'https'

import hbs from 'handlebars-inline-precompile'

import { PFX_BASE64 } from './lib/env'

const hello = hbs`Hello world`

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, (req, res) => {
  res.end(hello())
}).listen(8443)
