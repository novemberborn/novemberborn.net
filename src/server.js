import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import convertHrTime from 'convert-hrtime'
import sourceMapSupport from 'source-map-support'

import { PFX_BASE64 } from './lib/env'
import logger from './lib/logger'
import { route } from './lib/router'

import { skeleton, serverError } from 'glob:templates/*.js'

const errorBody = new Buffer(skeleton({
  title: '500 Internal Server Error',
  contentPartial: serverError
}), 'utf8')

sourceMapSupport.install({ handleUncaughtExceptions: false })

createServer({ pfx: new Buffer(PFX_BASE64, 'base64') }, async (req, res) => {
  const start = process.hrtime()
  logger.info({ req }, 'request-start')

  try {
    const [statusCode, headers, body] = await handleRequest(req)
    res.writeHead(statusCode, headers)
    if (req.method !== 'HEAD') {
      res.write(body)
    }
    res.end()
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500)
      res.end()
    }

    logger.error({ err, req }, 'server-request-listener-failure')
  } finally {
    const duration = convertHrTime(process.hrtime(start))
    logger.info({ req, res, duration }, 'request-finish')
  }
}).listen(8443, () => {
  logger.info('listening')
})

async function handleRequest (req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return [405]
  }

  try {
    const { pathname } = parseUrl(req.url)
    return await route(pathname)
  } catch (err) {
    logger.error({ err, req }, 'server-handle-request-failure')

    return [500, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': errorBody.length
    }, errorBody]
  }
}
