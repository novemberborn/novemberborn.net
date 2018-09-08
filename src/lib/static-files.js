import {readFile} from 'fs'

import staticFiles from 'files:../../static/*.*'
import browserFiles from 'files:../../dist/{browser,style}.*'

const files = Object.assign({}, staticFiles, browserFiles)

const paths = new Map()
const inverse = new Map()
for (const name in files) {
  const file = files[name]

  let path = `/static/${file.tag}/${name}`
  if (name === 'favicon.ico') {
    path = '/favicon.ico'
  } else if (name.endsWith('.map')) {
    // Source maps are relative to the tag of the file they apply to.
    const {tag} = files[name.slice(0, -4)]
    path = `/static/${tag}/${name}`
  }
  paths.set(path, file)
  inverse.set(name, path)
}

const cacheSymbol = Symbol('cache key')
async function getContents (file) {
  // Reuse promises in case of concurrent access.
  if (file[cacheSymbol]) return file[cacheSymbol]

  const promise = file[cacheSymbol] = new Promise((resolve, reject) => {
    readFile(file.src, (err, chunk) => err ? reject(err) : resolve(chunk))
  })

  try {
    // Await the promise rather than returning it, so cleanup can happen in the
    // finally clause.
    return await promise
  } finally {
    // Clean up to avoid wasting memory.
    file[cacheSymbol] = null
  }
}

export const routes = {
  has (pathname) {
    return paths.has(pathname)
  },

  async get (pathname) {
    const file = paths.get(pathname)
    const contents = await getContents(file)
    return [contents, file]
  }
}

export function getPath (name) {
  return inverse.get(name)
}
