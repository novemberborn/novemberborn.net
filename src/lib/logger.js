import { createLogger, stdSerializers } from 'bunyan'

import {
  BUNYAN_LEVEL as level
} from './env'

const streams = []

streams.push({
  level,
  type: 'stream',
  stream: process.stdout
})

const serializers = Object.assign({}, stdSerializers, {
  duration ({ ms }) {
    return ms
  }
})

export default createLogger({
  name: 'site',
  serializers,
  streams
})
