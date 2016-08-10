const nconf = require('nconf')
const path = require('path')

const pkg = require(path.resolve('package.json'))

module.exports = function(filename) {

  nconf
    .env([
      'account',
      'apiKey',
      'application'
    ])
    .file(filename)

  nconf.defaults({
    applicationName: `mite-cli/${pkg.version}`,
  })

  return nconf
}
