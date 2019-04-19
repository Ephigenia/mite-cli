const nconf = require('nconf');
const path = require('path');
const os = require('os');

const pkg = require('./../package.json');

const homedir = os.homedir();
const configFilename = path.resolve(path.join(homedir, '.mite-cli.json'));
const DataOutput = require('./lib/data-output');

nconf.file(configFilename);

nconf.defaults({
  applicationName: `mite-cli/${pkg.version}`,
  listColumns: 'id,date,user,project,duration,revenue,service,note',
  outputFormat: DataOutput.FORMAT.TABLE,
});

module.exports = nconf;
