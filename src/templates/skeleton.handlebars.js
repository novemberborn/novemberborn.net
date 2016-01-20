import hbs from 'handlebars-inline-precompile'

export default hbs`<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>{{#if title}}{{title}} — {{/if}}novemberborn.net</title>
    <link rel="stylesheet" href="{{cssUrl}}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="apple-touch-icon-precomposed" href="/static/2036c18c90f28301128b72a66147de93/favicon-152.png">
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
