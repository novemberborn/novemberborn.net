import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import { PFX_BASE64 } from './lib/env'
import { route } from './lib/router'
import staticFiles from './static'

import { skeleton, serverError } from 'glob:templates/*.js'

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

  let statusCode = 200
  let body, context
  try {
    [statusCode, context] = route(pathname)
    body = skeleton(context)
  } catch (err) {
    // TODO: Hook up Bunyan
    console.error(err)

    statusCode = 500
    body = skeleton({
      title: '500 Internal Server Error',
      contentPartial: serverError
    })
  } finally {
    const chunk = new Buffer(body, 'utf8')
    res.writeHead(statusCode, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': chunk.length
    })
    if (req.method === 'GET') {
      res.write(chunk)
    }
    res.end()
  }
}).listen(8443)
