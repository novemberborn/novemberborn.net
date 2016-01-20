import hbs from 'handlebars-inline-precompile'

export default hbs`<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>{{#if title}}{{title}} — {{/if}}novemberborn.net</title>
    <link rel="stylesheet" href="{{cssUrl}}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  </head>

  <body data-pathname="{{pathname}}">
    <header>
      <h1><a href="/">novemberborn.net</a></h1>
      <nav>
        <a href="/about">About</a>,
        <a href="/skills-and-background">Skills &amp; Background</a>,
        <a href="/projects">Projects</a>
      </nav>
    </header>

    <main>
      {{> (lookup . 'contentPartial')}}
    </main>
  </body>
</html>
`
