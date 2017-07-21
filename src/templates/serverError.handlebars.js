import hbs from 'handlebars-inline-precompile'

export default hbs`<article>
  <h1>Fife Zero Zero</h1>
  <p>
    <img
      src="{{static_path name='empty-rowboat.jpg'}}"
      alt="An empty rowboat, signifying the failure in serving the page"
      class="invert">
  </p>
  <p>
    The page you requested could not be found.
    It may have <a href="https://web.archive.org/web/2012*/https://novemberborn.net{{pathname}}">existed previously</a> though.
  </p>
</article>
`
