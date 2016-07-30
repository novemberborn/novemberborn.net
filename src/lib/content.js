import { readFile, writeFile } from 'fs'
import { basename, join, sep as fileSeparator } from 'path'

import findCacheDir from 'find-cache-dir'
import mkdirp from 'mkdirp'
import Remarkable from 'remarkable'

import files from 'files:../../content/**/*.md'
import { getPath } from './static-files'

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
async function getFromCacheOrRender (src, tag) {
  // Reuse promises in case of concurrent access.
  if (inProgress.has(tag)) return inProgress.get(tag)

  const promise = new Promise(resolve => {
    const cacheSrc = join(cacheDir, `${tag}.html`)
    readFile(cacheSrc, async (err, contents) => {
      if (!err) {
        resolve(contents)
        return
      }

      const rendered = renderMarkdown(src)
      resolve(rendered)

      // Attempt to write the rendered content to the on-disk cache.
      {
        const contents = await rendered
        mkdirp(cacheDir, err => {
          if (!err) writeFile(cacheSrc, contents, () => {})
        })
      }
    })
  })
  inProgress.set(tag, promise)

  try {
    // Await the promise rather than returning it, so cleanup can happen in the
    // finally clause.
    return await promise
  } finally {
    // Clean up to avoid wasting memory.
    inProgress.delete(tag)
  }
}

async function renderMarkdown (src) {
  const str = await new Promise((resolve, reject) => {
    readFile(src, 'utf8', (err, str) => err ? reject(err) : resolve(str))
  })
  return new Buffer(md.render(str), 'utf8')
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
