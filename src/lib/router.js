import { routes as staticRoutes } from './static-files'
import {
  render as renderContent,
  projects
} from './content'
import { NODE_ENV } from './env'
import securityHeaders from './security-headers'

import {
  content as contentPartial,
  notFound,
  skeleton
} from 'glob:../templates/*.js'

const FourHours = 4 * 60 * 60
const NinetyDays = 90 * 24 * 60 * 60
const TenDays = 10 * 24 * 60 * 60

const contentCacheControl = NODE_ENV === 'production' ? `public, max-age=${FourHours}, s-maxage=${TenDays}` : 'no-store'

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

export async function route (pathname, host) {
  // Redirect away from pathnames ending in a slash.
  if (pathname !== '/' && pathname.endsWith('/')) {
    return [301, Object.assign({
      location: pathname.slice(0, -1),
      'cache-control': contentCacheControl
    }, securityHeaders)]
  }

  // Don't use the www. subdomain
  if (/^www\./.test(host)) {
    return [301, Object.assign({
      location: `https://${host.slice(4)}${pathname}`,
      'cache-control': contentCacheControl
    }, securityHeaders)]
  }

  if (staticRoutes.has(pathname)) {
    // Static routes contain a file hash, so they're safe to cache for a pretty
    // long while. That doesn't apply to the favicon though.
    let maxAge = pathname === '/favicon.ico' ? TenDays : NinetyDays
    const [chunk, { contentType, contentLength }] = await staticRoutes.get(pathname)
    return [200, Object.assign({
      'content-type': contentType,
      'content-length': contentLength,
      'cache-control': NODE_ENV === 'production' ? `public, max-age=${maxAge}` : 'no-store'
    }, securityHeaders), chunk]
  }

  let statusCode = 200
  let headers = {
    'content-type': 'text/html; charset=utf-8',
    // Cache for 4 ours in end-users browsers, and 10 days in CloudFlare. The
    // latter should help with the Always Online feature:
    // <https://support.cloudflare.com/hc/en-us/articles/202238800>.
    'cache-control': contentCacheControl
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

  return [statusCode, Object.assign(headers, securityHeaders), body]
}
