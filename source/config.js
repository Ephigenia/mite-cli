const nconf = require('nconf')
const path = require('path')
const os = require('os')

const pkg = require('./../package.json')

const homedir = os.homedir()
const configFilename = path.resolve(path.join(homedir, '.mite-cli.json'))

nconf.file(configFilename)

nconf.defaults({
  applicationName: `mite-cli/${pkg.version}`,
})

module.exports = nconf
