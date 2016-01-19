import hbs from 'handlebars-inline-precompile'

export default hbs`<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>{{#if title}}{{title}} — {{/if}}novemberborn.net</title>
    <link rel="stylesheet" href="{{cssUrl}}">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  </head>

  <body>
    <div class="root">
      {{> (lookup . 'contentPartial')}}
    </div>
  </body>
</html>
`
