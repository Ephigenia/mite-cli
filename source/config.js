'use strict';

const nconf = require('nconf');
const path = require('path');
const os = require('os');

const pkg = require('./../package.json');

const homedir = os.homedir();
const configFilename = path.resolve(path.join(homedir, '.mite-cli.json'));
const DataOutput = require('./lib/data-output');

const listCommand = require('./lib/commands/list');
const customersCommand = require('./lib/commands/customers');
const projectsCommand = require('./lib/commands/projects');
const servicesCommand = require('./lib/commands/services');
const usersCommand = require('./lib/commands/users');

nconf.file(configFilename);

nconf.defaults({
  applicationName: `mite-cli/${pkg.version}`,
  customersColumns: customersCommand.columns.default,
  listColumns: listCommand.columns.default,
  outputFormat: DataOutput.FORMAT.TABLE,
  projectsColumns: projectsCommand.columns.default,
  servicesColumns: servicesCommand.columns.default,
  usersColumns: usersCommand.columns.default,
});

module.exports = nconf;
