import { createServer } from 'https'

const pfx = new Buffer(process.env.PFX_BASE64, 'base64')

createServer({ pfx }, (req, res) => {
  res.end('Hello world')
}).listen(8443)
