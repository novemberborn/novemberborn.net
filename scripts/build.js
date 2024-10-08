#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import markdownFactory from 'markdown-it'
import YAML from 'yaml'

const markdown = markdownFactory({
  html: true,
  typographer: true,
})

const PREFETCH_PATHS = ['/', '/work', '/open-source']

// Load the layout template.
const LAYOUT = await fs.readFile('layouts/layout.html', 'utf8')

// Render the layout with the given content, title and pathname.
function render({ title, pathname, description, content }) {
  const layout = new JSDOM(LAYOUT, {})

  // Remove any whitespace-only text nodes from the layout and otherwise normalize them.
  const walker = layout.window.document.createTreeWalker(layout.window.document.documentElement, 4)
  const textNodes = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode)
  }

  for (const textNode of textNodes) {
    if (textNode.nodeValue.trim() === '') {
      textNode.remove()
    } else if (/\s+/m.test(textNode.nodeValue)) {
      textNode.nodeValue = textNode.nodeValue.replaceAll(/\s+/gm, ' ')
    }
  }

  // Customize document title.
  if (title) {
    layout.window.document.title = `${title}\u2008·\u2008${layout.window.document.title}`
  }

  // Set the canonical URL.
  if (pathname) {
    const element = layout.window.document.createElement('link')
    element.rel = 'canonical'
    element.href = new URL(pathname, 'https://novemberborn.net').href
    layout.window.document.querySelector('head').append(element)
  }

  // Prefetch internal links.
  for (const prefetchPath of PREFETCH_PATHS) {
    if (prefetchPath === pathname) {
      continue
    }

    const element = layout.window.document.createElement('link')
    element.rel = 'prefetch'
    element.href = prefetchPath
    layout.window.document.querySelector('head').append(element)
  }

  if (description) {
    const element = layout.window.document.createElement('meta')
    element.name = 'description'
    element.content = description
    layout.window.document.querySelector('title').insertAdjacentElement('afterend', element)
  }

  // Highlight the current page in the navigation.
  const currentAnchor = layout.window.document.querySelector(`header a[href="${pathname}"]`)
  currentAnchor?.classList.add('current')

  // Insert the content.
  layout.window.document.querySelector('article').append(JSDOM.fragment(content))

  // Return the rendered HTML.
  return layout.serialize()
}

// Remove previously published content.
for await (const entry of fs.glob('public/**/*.html')) {
  await fs.rm(entry)
}

// Publish default 404 page.
await fs.writeFile(
  'public/404.html',
  render({
    title: '404 Not Found',
    content: `<h1>Not found</h1>
<p>The page you requested could not be found. You could try <a href="javascript:location.href=\`https://web.archive.org/web/2012*/\${document.URL}\`">the Wayback Machine</a>.</p>`,
  }),
)

// Render and publish the content.
const FRONT_MATTER_START = '---\n'
const FRONT_MATTER_END = '\n---\n'

for await (const contentPath of fs.glob('content/**/*.md')) {
  const pathname = contentPath.replace(/^content\//, '/').replace(/\.md$/, '')
  const options = {
    filename: `${pathname}.html`,
    pathname,
  }

  const rawContent = await fs.readFile(contentPath, 'utf8')
  let markdownContent = rawContent
  if (rawContent.startsWith(FRONT_MATTER_START) && rawContent.includes(FRONT_MATTER_END)) {
    const endIndex = rawContent.indexOf(FRONT_MATTER_END)
    markdownContent = rawContent.slice(endIndex + FRONT_MATTER_END.length).trimStart()

    const yamlString = rawContent.slice(FRONT_MATTER_START.length, endIndex)
    const customOptions = YAML.parse(yamlString)
    Object.assign(options, customOptions)
  }

  // Extract the title from the first heading. It can be overridden in the YAML front matter.
  let title = ''
  const tokens = markdown.parse(markdownContent, {})
  const headingToken = tokens.findIndex((t) => t.type === 'heading_open' && t.tag === 'h1')
  if (headingToken !== -1) {
    title = tokens[headingToken + 1].content
  }

  const htmlContent = markdown.render(markdownContent)
  const dirname = path.dirname(options.filename)
  await fs.mkdir(`public/${dirname}`, { recursive: true })
  await fs.writeFile(`public/${options.filename}`, render({ title, ...options, content: htmlContent }))
}
