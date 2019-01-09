#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const execa = require('execa')
const glob = require('glob')
const mkdirp = require('mkdirp')
const Remarkable = require('remarkable')

const markdownContent = glob.sync('**/*.md', {cwd: 'content'})

try {
  fs.mkdirSync('dist')
} catch (_) {}

execa.sync('postcss', ['src/style.css', '--output', 'dist/style.css'])
execa.sync('uglifyjs', [
  '-c', '-m',
  '-o', 'dist/browser.js',
  '--source-map', 'filename=dist/browser.js.map',
  '--source-map', 'includeSources',
  'src/browser.js'
])
execa.shellSync('echo "//# sourceMappingURL=./browser.js.map" >> dist/browser.js')
execa.shellSync('cp -r static dist')

const md = new Remarkable({
  html: true,
  typographer: true
}).use(({renderer: {rules}}) => {
  // Replace the image renderer so static file names can be used.
  const {image} = rules
  rules.image = (tokens, idx, ...remainder) => {
    const {src} = tokens[idx]
    if (!src.includes('/')) {
      // If the source includes a / it should be left as-is, it won't match a
      // static file.
      tokens[idx].src = `/static/${src}`
    }

    return image(tokens, idx, ...remainder)
  }
})

try {
  fs.mkdirSync('dist/content')
} catch (_) {}

function skeleton (content, {pathname = '', title = ''} = {}) {
  return `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <title>${title ? Remarkable.utils.escapeHtml(title) + ' — ' : ''}novemberborn.net</title>
    <link rel="stylesheet" href="/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="apple-touch-icon-precomposed" href="/static/favicon-152.png">
    <script src="/browser.js" defer></script>
    ${pathname ? `<link rel="canonical" href="https://novemberborn.net${pathname}">` : ''}
  </head>

  <body data-pathname="${pathname}">
    <header>
      <h1><a href="/">novemberborn.net</a></h1>
      <nav>
        <a href="/skills-and-background">Skills &amp; Background</a>,
        <a href="/projects">Projects</a>,
        <a href="/consulting">Consulting</a>,
        <a href="/colophon">Colophon</a>
      </nav>
    </header>

    <main>
      <article>
        ${content}
      </article>
    </main>
  </body>
</html>
`
}

for (const relpath of markdownContent) {
  const pathname = relpath === 'home.md' ? '/' : `/${relpath.replace(/\.md$/, '')}`
  const src = path.join('content', relpath)
  const raw = fs.readFileSync(src, 'utf8')
  const ast = md.parse(raw, {})

  let title = ''
  if (ast.length >= 3 && ast[0].type === 'heading_open' && ast[1].type === 'inline') {
    title = ast[1].content
  }

  const dest = path.join('dist', relpath.replace(/\.md$/, '.html'))
  mkdirp.sync(path.dirname(dest))

  fs.writeFileSync(dest, skeleton(md.render(raw), {pathname, title}))
  console.log(`${src} -> ${dest}`)
}

fs.writeFileSync(path.join('dist', '404.html'), skeleton(`<article>
  <h1>Fower Zero Fower</h1>
  <p><img src="/static/empty-rowboat.jpg" alt="An empty rowboat, signifying the missing page"></p>
  <p>
    The page you requested could not be found. It may have
    <a href="javascript:location.href=\`https://web.archive.org/web/2012*/\${document.URL}\`">existed previously</a> though.
  </p>
</article>
`, {title: 'Fower Zero Fower'}))
