import { Writable } from 'stream'
import { isError } from 'util'

import { createLogger, stdSerializers } from 'bunyan'
import { parsers as sentryParsers } from 'raven'

import { BUNYAN_LEVEL as level } from './env'
import sentry from './sentry'

const errorTag = Symbol('logger error tag')
const streams = []

streams.push({
  level,
  type: 'stream',
  stream: process.stdout
})

if (sentry) {
  const sentryLevels = new Map([
    [20, 'debug'],
    [30, 'info'],
    [40, 'warning'],
    [50, 'error'],
    [60, 'fatal']
  ])

  streams.push({
    level: 'warn',
    type: 'raw',
    stream: new Writable({
      objectMode: true,
      write (record, _, done) {
        const { err, level: bunyanLevel, msg } = record
        const level = sentryLevels.get(bunyanLevel)

        // Fatal is only used for uncaught exceptions, which are reported to
        // Sentry separately.
        if (level === 'fatal') return

        // Remove fields that Sentry will report by itself, or are otherwise
        // superfluous. Copy the record since it shouldn't be modified.
        const extra = Object.assign({}, record)
        delete extra.hostname
        delete extra.level
        delete extra.name
        delete extra.v

        // Capture the message unless the record is for a proper Error.
        if (!err || !err[errorTag]) {
          sentry.captureMessage(msg, { extra, level })
          done()
          return
        }

        // The `err` field is superfluous since it's being parsed before
        // reporting to Sentry.
        delete extra.err

        // Avoid `sentry.captureException(err)`` which requires `err` to be
        // `instanceof Error`. Bunyan returns a regular object, which the
        // configured serializer has tagged as originally being a proper
        // error.
        sentryParsers.parseError(err, { extra, level }, kwargs => {
          sentry.process(kwargs)
          done()
        })
      }
    })
  })
}

const serializers = Object.assign({}, stdSerializers, {
  err (err) {
    // This is effectively what Bunyan's serializer does (except it checks for
    // the `stack` property).
    if (!isError(err)) return err

    // Extract standard properties which may not be enumerable, and the
    // remainder.
    const { message, name, code, signal, ...result } = err
    // Use Bunyan to get the stack trace.
    const { stack } = stdSerializers.err(err)
    // Put the standard properties back on the result object.
    return Object.assign(result, {
      [errorTag]: true, // Tag the object so the Sentry stream can recognize it.
      code,
      message,
      name,
      signal,
      stack
    })
  },

  duration ({ ms }) {
    return ms
  }
})

export default createLogger({
  name: 'site',
  serializers,
  streams
})
