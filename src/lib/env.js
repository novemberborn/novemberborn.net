import dotenv from 'dotenv'
dotenv.config({ silent: true })

const {
  BUNYAN_LEVEL,
  NODE_ENV,
  PFX_BASE64,
  SENTRY_DSN
} = process.env

export {
  BUNYAN_LEVEL,
  NODE_ENV,
  PFX_BASE64,
  SENTRY_DSN
}
