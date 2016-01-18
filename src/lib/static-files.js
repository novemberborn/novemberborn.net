import { readFile } from 'fs'

import files from 'files:../../static/*.*'

const paths = new Map().set('/favicon.ico', files['favicon.ico'])

const cacheSymbol = Symbol
function getContents (file) {
  if (!file[cacheSymbol]) {
    const promise = file[cacheSymbol] = new Promise((resolve, reject) => {
      readFile(file.src, (err, chunk) => err ? reject(err) : resolve(chunk))
    })
    const clear = () => file[cacheSymbol] = null
    promise.then(clear, clear)
  }

  return file[cacheSymbol]
}

export const routes = {
  has (pathname) {
    return paths.has(pathname)
  },

  async get (pathname) {
    const file = paths.get(pathname)
    return [await getContents(file), file]
  }
}
