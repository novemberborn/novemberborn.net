import { readFile, writeFile } from 'fs'
import { basename, join, sep as fileSeparator } from 'path'

import findCacheDir from 'find-cache-dir'
import mkdirp from 'mkdirp'
import Remarkable from 'remarkable'

import { getPath } from './static-files'

import files from 'files:../../content/**/*.md'

const cacheDir = findCacheDir({ name: 'net.novemberborn' })
const md = new Remarkable({
  html: true,
  typographer: true
}).use(md => {
  // Replace the image renderer so static file names can be used.
  const { rules } = md.renderer
  const { image } = rules
  rules.image = (tokens, idx, ...remainder) => {
    const { src } = tokens[idx]
    if (!src.includes('/')) {
      // If the source includes a / it should be left as-is, it won't match a
      // static file.
      tokens[idx].src = getPath(src)
    }

    return image(tokens, idx, ...remainder)
  }
})

const inProgress = new Map()
function getFromCacheOrRender (src, tag) {
  if (inProgress.has(tag)) return inProgress.get(tag)

  const promise = new Promise(resolve => {
    const cacheSrc = join(cacheDir, `${tag}.html`)
    readFile(cacheSrc, (err, contents) => {
      if (err) {
        const rendered = renderMarkdown(src)
        resolve(rendered)
        rendered.then(contents => {
          mkdirp(cacheDir, err => {
            if (!err) writeFile(cacheSrc, contents, () => {})
          })
        })
      } else {
        resolve(contents)
      }
    })
  })
  const clear = () => inProgress.delete(tag)
  promise.then(clear, clear)
  inProgress.set(tag, promise)
  return promise
}

function renderMarkdown (src) {
  return new Promise((resolve, reject) => {
    readFile(src, 'utf8', (err, str) => err ? reject(err) : resolve(str))
  }).then(str => new Buffer(md.render(str), 'utf8'))
}

export async function render (name) {
  const { src, tag } = files[`${name}.md`]
  return getFromCacheOrRender(src, tag)
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
