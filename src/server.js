import { createServer } from 'https'
import { parse as parseUrl } from 'url'

import convertHrTime from 'convert-hrtime'
import sourceMapSupport from 'source-map-support'

import { ANY_CLIENT, NODE_ENV } from './lib/env'
import { verifyPullOrigin } from './lib/cloudflare'
import logger from './lib/logger'
import pfx from './lib/pfx'
import { route } from './lib/router'
import securityHeaders from './lib/security-headers'
import sentry from './lib/sentry'

import { skeleton, serverError } from 'glob:templates/*.js'

const errorBody = new Buffer(skeleton({
  title: '500 Internal Server Error',
  contentPartial: serverError
}), 'utf8')

sourceMapSupport.install({ handleUncaughtExceptions: false })

const requestCert = !ANY_CLIENT && NODE_ENV === 'production'

createServer({
  pfx,
  requestCert,
  rejectUnauthorized: false
}, async function (req, res) {
  const start = process.hrtime()
  logger.info({ req }, 'request-start')

  try {
    if (requestCert && !verifyPullOrigin(req.client.getPeerCertificate())) {
      req.client.destroy()
      logger.info({ req }, 'reject-client-certificate')
      return
    }

    const [statusCode, headers, body] = await handleRequest(req)
    res.writeHead(statusCode, headers)
    if (req.method !== 'HEAD' && body) {
      res.write(body)
    }
    res.end()
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, securityHeaders)
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
    return [405, Object.assign({}, securityHeaders)]
  }

  try {
    const { pathname } = parseUrl(req.url)
    const { headers: { host } } = req
    return await route(pathname, host)
  } catch (err) {
    logger.error({ err, req }, 'server-handle-request-failure')

    return [500, Object.assign({
      'content-type': 'text/html; charset=utf-8',
      'content-length': errorBody.length
    }, securityHeaders), errorBody]
  }
}

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'uncaught-exception')

  const exit = () => process.exit(1)
  if (!sentry) {
    exit()
  } else {
    sentry.captureError(err)
    // Assume these events aren't triggered by another report that was
    // in flight.
    sentry.once('logged', exit)
    sentry.once('error', exit)

    // Force exit after 5 seconds.
    setTimeout(exit, 5000).unref()
  }
})
