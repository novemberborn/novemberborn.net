import dotenv from 'dotenv'

dotenv.config({silent: true})

const {
  ANY_CLIENT,
  BUNYAN_LEVEL,
  CERT_NAME,
  NODE_ENV,
  SENTRY_DSN
} = process.env

export {
  ANY_CLIENT,
  BUNYAN_LEVEL,
  CERT_NAME,
  NODE_ENV,
  SENTRY_DSN
}
