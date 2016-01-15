import { home, notFound } from 'glob:../templates/*.js'

const table = {
  '/' () {
    return { contentPartial: home }
  }
}

export function route (pathname) {
  if (table.hasOwnProperty(pathname)) {
    return [200, table[pathname]()]
  }

  return [404, { contentPartial: notFound }]
}
