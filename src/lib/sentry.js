import { Client, utils } from 'raven'

import {
  NODE_ENV as environment,
  SENTRY_DSN
} from './env'

// Monkey-patch to remove modules lookup.
utils.getModules = () => ({})

let sentry = null
if (environment === 'production' && SENTRY_DSN) {
  sentry = new Client(SENTRY_DSN, {
    tags: { environment }
  })
}

export default sentry
