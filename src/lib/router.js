import staticFiles from '../static'

import {
  home,
  notFound,
  skeleton
} from 'glob:../templates/*.js'

const table = {
  '/' () {
    return { contentPartial: home }
  }
}

export function route (pathname) {
  if (staticFiles.has(pathname)) {
    const { contentType, chunk } = staticFiles.get(pathname)
    return [200, {
      'content-type': contentType,
      'content-length': chunk.length
    }, chunk]
  }

  let statusCode = 200
  let headers = {
    'content-type': 'text/html; charset=utf-8'
  }

  let context
  if (table.hasOwnProperty(pathname)) {
    context = table[pathname]()
  } else {
    statusCode = 404
    context = { contentPartial: notFound }
  }

  const body = new Buffer(skeleton(context), 'utf8')
  headers['content-length'] = body.length

  return [statusCode, headers, body]
}
