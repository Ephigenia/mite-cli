const nconf = require('nconf');
const path = require('path');
const os = require('os');

const pkg = require('./../package.json');

const homedir = os.homedir();
const configFilename = path.resolve(path.join(homedir, '.mite-cli.json'));
const DataOutput = require('./lib/data-output');
const listCommand = require('./lib/commands/list');

nconf.file(configFilename);

nconf.defaults({
  applicationName: `mite-cli/${pkg.version}`,
  listColumns: listCommand.columns.default,
  outputFormat: DataOutput.FORMAT.TABLE,
});

module.exports = nconf;
