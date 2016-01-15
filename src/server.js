import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import { PFX_BASE64 } from './lib/env'
import staticFiles from './static'

import { skeleton } from 'glob:templates/*.js'

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405)
    res.end()
    return
  }

  const { pathname } = parseUrl(req.url)
  if (staticFiles.has(pathname)) {
    const { contentType, chunk } = staticFiles.get(pathname)
    res.writeHead(200, {
      'content-type': contentType,
      'content-length': chunk.length
    })
    res.end(chunk)
    return
  }

  res.end(skeleton())
}).listen(8443)
