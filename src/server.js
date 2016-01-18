import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import { PFX_BASE64 } from './lib/env'
import { route } from './lib/router'

import { skeleton, serverError } from 'glob:templates/*.js'

const errorBody = new Buffer(skeleton({
  title: '500 Internal Server Error',
  contentPartial: serverError
}), 'utf8')

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, (req, res) => {
  try {
    const [statusCode, headers, body] = handleRequest(req)
    res.writeHead(statusCode, headers)
    if (req.method !== 'HEAD') {
      res.write(body)
    }
    res.end()
  } catch (err) {
    // TODO: Hook up Bunyan
    console.error(err)

    if (!res.headersSent) {
      res.writeHead(500)
      res.end()
    }
  }
}).listen(8443)

function handleRequest (req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return [405]
  }

  try {
    const { pathname } = parseUrl(req.url)
    return route(pathname)
  } catch (err) {
    // TODO: Hook up Bunyan
    console.error(err)

    return [500, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': errorBody.length
    }, errorBody]
  }
}
