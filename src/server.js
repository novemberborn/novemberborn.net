import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import convertHrTime from 'convert-hrtime'
import sourceMapSupport from 'source-map-support'

import { PFX_BASE64, NODE_ENV } from './lib/env'
import { verifyPullOrigin } from './lib/cloudflare'
import logger from './lib/logger'
import { route } from './lib/router'

import { skeleton, serverError } from 'glob:templates/*.js'

const errorBody = new Buffer(skeleton({
  title: '500 Internal Server Error',
  contentPartial: serverError
}), 'utf8')

sourceMapSupport.install({ handleUncaughtExceptions: false })

createServer({
  pfx: new Buffer(PFX_BASE64, 'base64'),
  requestCert: NODE_ENV === 'production',
  rejectUnauthorized: false
}, async (req, res) => {
  const start = process.hrtime()
  logger.info({ req }, 'request-start')

  try {
    if (NODE_ENV === 'production' && !verifyPullOrigin(req.client.getPeerCertificate(true))) {
      req.client.destroy()
      logger.info({ req }, 'reject-client-certificate')
      return
    }

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

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

process.on('uncaughtException', err => {
  logger.fatal(err, 'uncaught-exception')
  process.exit(1)
})
