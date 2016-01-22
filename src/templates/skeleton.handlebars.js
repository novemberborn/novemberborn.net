import Handlebars from 'handlebars/runtime'
import hbs from 'handlebars-inline-precompile'

import { getPath } from '../lib/static-files'

export default hbs`<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>{{#if title}}{{title}} — {{/if}}novemberborn.net</title>
    <link rel="stylesheet" href="{{static_path name='style.css'}}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="apple-touch-icon-precomposed" href="{{static_path name='favicon-152.png'}}">
    <script src="{{static_path name='browser.js'}}" defer></script>
  </head>

  <body data-pathname="{{pathname}}">
    <header>
      <h1><a href="/">novemberborn.net</a></h1>
      <nav>
        <a href="/skills-and-background">Skills &amp; Background</a>,
        <a href="/projects">Projects</a>,
        <a href="/colophon">Colophon</a>
      </nav>
    </header>

    <main>
      {{> (lookup . 'contentPartial')}}
    </main>
  </body>
</html>
`

Handlebars.registerHelper('static_path', ({ hash: { name } }) => getPath(name))
