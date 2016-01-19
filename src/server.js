import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import sourceMapSupport from 'source-map-support'

import { PFX_BASE64 } from './lib/env'
import { route } from './lib/router'
import { getPath } from './lib/static-files'

import { skeleton, serverError } from 'glob:templates/*.js'

const errorBody = new Buffer(skeleton({
  title: '500 Internal Server Error',
  contentPartial: serverError,
  cssUrl: getPath('style.css')
}), 'utf8')

sourceMapSupport.install({ handleUncaughtExceptions: false })

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, async (req, res) => {
  try {
    const [statusCode, headers, body] = await handleRequest(req)
    res.writeHead(statusCode, headers)
    if (req.method !== 'HEAD') {
      res.write(body)
    }
    res.end()
  } catch (err) {
    // TODO: Hook up Bunyan
    console.error(err && err.stack || err)

    if (!res.headersSent) {
      res.writeHead(500)
      res.end()
    }
  }
}).listen(8443)

async function handleRequest (req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return [405]
  }

  try {
    const { pathname } = parseUrl(req.url)
    return await route(pathname)
  } catch (err) {
    // TODO: Hook up Bunyan
    console.error(err && err.stack || err)

    return [500, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': errorBody.length
    }, errorBody]
  }
}
