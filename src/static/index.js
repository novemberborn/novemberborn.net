// TODO: Create a Babel plugin which can populate a Map() for the files matching
// the glob pattern, with lazy loading of the actual content. This plugin can
// then be used in server.js itself.
import * as files from 'glob:!(index).js'

const map = Object.keys(files)
  .map(name => files[name])
  .reduce((acc, file) => acc.set(file.pathname, file), new Map())

export default map
