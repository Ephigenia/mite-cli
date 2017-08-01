const nconf = require('nconf')
const path = require('path')

const pkg = require('./../package.json')

const configFilename = path.resolve(path.join(__dirname, './../config.json'))

nconf
  .env([
    'account',
    'apiKey',
    'application'
  ])
  .file(configFilename)

nconf.defaults({
  applicationName: `mite-cli/${pkg.version}`,
})

module.exports = nconf
