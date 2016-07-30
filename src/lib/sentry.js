import { Client, utils } from 'raven'

import {
  NODE_ENV as environment,
  SENTRY_DSN
} from './env'

// Monkey-patch to remove modules lookup.
utils.getModules = () => ({})

let client = null
if (environment === 'production' && SENTRY_DSN) {
  client = new Client(SENTRY_DSN, {
    tags: { environment }
  })
}

const sentry = client
export default sentry
