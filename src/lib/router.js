import {
  content as contentPartial,
  notFound,
  skeleton
} from 'glob:../templates/*.js'

import { routes as staticRoutes } from './static-files'
import {
  get as getContent,
  projects
} from './content'
import { NODE_ENV } from './env'
import securityHeaders from './security-headers'

const FourHours = 4 * 60 * 60
const NinetyDays = 90 * 24 * 60 * 60
const TenDays = 10 * 24 * 60 * 60

const contentCacheControl = NODE_ENV === 'production' ? `public, max-age=${FourHours}, s-maxage=${TenDays}` : 'no-store'

const table = {
  '/' () {
    return {
      content: getContent('home')
    }
  },
  '/colophon' () {
    return {
      content: getContent('colophon')
    }
  },
  '/consulting' () {
    return {
      content: getContent('consulting')
    }
  },
  '/projects' () {
    return {
      content: getContent('projects')
    }
  },
  '/skills-and-background' () {
    return {
      content: getContent('skills-and-background')
    }
  }
}

for (const [subpath, contentName] of projects) {
  table[`/projects/${subpath}`] = () => ({
    content: getContent(contentName)
  })
}

export { table }

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
    const [chunk, { contentType, size: contentLength }] = await staticRoutes.get(pathname)
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
    context = table[pathname]()
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
