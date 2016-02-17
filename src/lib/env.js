import dotenv from 'dotenv'
dotenv.config({ silent: true })

const {
  BUNYAN_LEVEL,
  CERT_NAME,
  NODE_ENV,
  SENTRY_DSN
} = process.env

export {
  BUNYAN_LEVEL,
  CERT_NAME,
  NODE_ENV,
  SENTRY_DSN
}
