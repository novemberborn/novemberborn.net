#!/usr/bin/env node
'use strict'

const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const mkdirp = require('mkdirp')
const Remarkable = require('remarkable')

const { files } = require('../../dist/lib/content') // eslint-disable-line import/no-unresolved
const { getPath } = require('../../dist/lib/static-files') // eslint-disable-line import/no-unresolved

const md = new Remarkable({
  html: true,
  typographer: true
}).use(({renderer: {rules}}) => {
  // Replace the image renderer so static file names can be used.
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

mkdirp(join('dist', 'content'))

Object.keys(files)
  .map(relpath => files[relpath])
  .forEach(({ src, tag }) => {
    const dest = join('dist', 'content', `${tag}.html`)
    writeFileSync(dest, md.render(readFileSync(src, 'utf8')))
    console.log(`${src} -> ${dest}`)
  })
