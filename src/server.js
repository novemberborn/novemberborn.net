import { createServer } from 'https'

import hbs from 'handlebars-inline-precompile'

const pfx = new Buffer(process.env.PFX_BASE64, 'base64')
const hello = hbs`Hello world`

createServer({ pfx }, (req, res) => {
  res.end(hello())
}).listen(8443)
