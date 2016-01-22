import { routes as staticRoutes } from './static-files'
import {
  render as renderContent,
  projects
} from './content'

import {
  content as contentPartial,
  notFound,
  skeleton
} from 'glob:../templates/*.js'

const table = {
  async '/' () {
    return {
      content: await renderContent('home')
    }
  },
  async '/colophon' () {
    return {
      content: await renderContent('colophon')
    }
  },
  async '/projects' () {
    return {
      content: await renderContent('projects')
    }
  },
  async '/skills-and-background' () {
    return {
      content: await renderContent('skills-and-background')
    }
  }
}

for (const [subpath, contentName] of projects) {
  table[`/projects/${subpath}`] = async () => ({
    content: await renderContent(contentName)
  })
}

export async function route (pathname) {
  if (staticRoutes.has(pathname)) {
    const [chunk, { contentType, contentLength }] = await staticRoutes.get(pathname)
    return [200, {
      'content-type': contentType,
      'content-length': contentLength
    }, chunk]
  }

  // Redirect away from pathnames ending in a slash.
  if (pathname !== '/' && pathname.endsWith('/')) {
    return [301, { location: pathname.slice(0, -1) }]
  }

  let statusCode = 200
  let headers = {
    'content-type': 'text/html; charset=utf-8'
  }

  let context
  if (table.hasOwnProperty(pathname)) {
    context = await table[pathname]()
  } else {
    statusCode = 404
    context = { contentPartial: notFound }
  }

  const expandedContext = Object.assign({
    contentPartial,
    pathname
  }, context)
  const body = new Buffer(skeleton(expandedContext), 'utf8')
  headers['content-length'] = body.length

  return [statusCode, headers, body]
}
