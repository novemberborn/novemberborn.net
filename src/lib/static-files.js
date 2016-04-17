import { readFile } from 'fs'

import files from 'files:../../static/*.*'

const paths = new Map()
const inverse = new Map()
for (const name in files) {
  const file = files[name]

  let path = `/static/${file.tag}/${name}`
  if (name === 'favicon.ico') {
    path = '/favicon.ico'
  } else if (name.endsWith('.map')) {
    // Source maps are relative to the tag of the file they apply to.
    const { tag } = files[name.slice(0, -4)]
    path = `/static/${tag}/${name}`
  }
  paths.set(path, file)
  inverse.set(name, path)
}

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
    const contents = await getContents(file)
    return [contents, file]
  }
}

export function getPath (name) {
  return inverse.get(name)
}
