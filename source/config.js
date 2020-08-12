'use strict';

const nconf = require('nconf');
const path = require('path');
const os = require('os');

const pkg = require('./../package.json');
const { handleError, GeneralError } = require('./lib/errors');

const homedir = os.homedir();
const configFilename = path.resolve(path.join(homedir, '.mite-cli.json'));
const DataOutput = require('./lib/data-output');

const listCommand = require('./lib/commands/list');
const customersCommand = require('./lib/commands/customers');
const projectsCommand = require('./lib/commands/projects');
const servicesCommand = require('./lib/commands/services');
const usersCommand = require('./lib/commands/users');

try {
  nconf.file(configFilename);
} catch (err) {
  handleError(new GeneralError(err.message));
}

nconf.defaults({
  currency: '€',
  applicationName: `mite-cli/${pkg.version}`,
  customersColumns: customersCommand.columns.default,
  listColumns: listCommand.columns.default,
  // https://regexr.com/50d36
  noteHighlightRegexp: '(([a-z0-9\\/-]+)?\\!\\d{1,6})|([A-Z]{1,10}-\\d{1,10})|(#\\d+)|(\\(\\d\\d?:\\d\\d\\s(to|bis)\\s\\d\\d?:\\d\\d\\))',
  outputFormat: DataOutput.FORMAT.TABLE,
  projectsColumns: projectsCommand.columns.default,
  servicesColumns: servicesCommand.columns.default,
  usersColumns: usersCommand.columns.default,
});

module.exports = nconf;
