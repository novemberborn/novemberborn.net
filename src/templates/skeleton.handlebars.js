import hbs from 'handlebars-inline-precompile'

export default hbs`<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>{{#if title}}{{title}} — {{/if}}novemberborn.net</title>
  </head>

  <body>
    {{> (lookup . 'contentPartial')}}
  </body>
</html>
`
