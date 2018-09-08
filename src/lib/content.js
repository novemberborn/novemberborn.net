import {readFileSync} from 'fs'
import {basename, join, sep as fileSeparator} from 'path'

import files from 'files:../../content/**/*.md'

export {files}

const cache = new Map()
export function prepareCache () {
  const dir = join(__dirname, '..', 'content')
  Object.keys(files)
    .map(relpath => files[relpath])
    .forEach(({tag}) => {
      cache.set(tag, readFileSync(join(dir, `${tag}.html`)))
    })
}

export function get (name) {
  const {tag} = files[`${name}.md`]
  return cache.get(tag)
}

export const projects = Object.keys(files).reduce((acc, relpath) => {
  const parts = relpath.split(fileSeparator)
  const filePart = basename(parts.pop(), '.md')
  const name = join(...parts, filePart)

  const subDirectory = parts.shift()
  if (subDirectory !== 'projects') return acc

  const subpath = [].concat(parts, filePart).join('/')
  return acc.set(subpath, name)
}, new Map())
