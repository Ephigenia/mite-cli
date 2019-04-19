#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const autoComplete = require('./lib/auto-complete');

program
  .version(pkg.version)
  .command('amend', 'edit the text for a specific time entry or the currently runnning entry').alias('reword')
  .command('autocomplete', 'install/uninstall autocompletion')
  .command('config', 'show or set configuration settings')
  .command('customers', 'list, filter & search customers').alias('clients')
  .command('delete', 'delete a specific time entry').alias('rm')
  .command('list', 'list time entries', { isDefault: true }).alias('ls').alias('status').alias('st')
  .command('lock', 'lock single time entry')
  .command('new', 'create a new time entry').alias('create')
  .command('open', 'open the given time entry in browser')
  .command('project', 'update a single project')
  .command('projects', 'list, filter, archive/unarchive & search projects')
  .command('services', 'list, filter & search services')
  .command('start', 'start the tracker for the given id, will also stop allready running entry')
  .command('stop', 'stop any running counter')
  .command('unlock', 'unlock single time entry')
  .command('users', 'list, filter & search for users')
  .description(pkg.description);

// completion command is triggered by automatically installed autocompletion
// lib and the appropriate shell, it’s not listed in the commands above as
// it should be an invisible command
if (process.argv.slice(2)[0] === 'completion') {
  const env = autoComplete.parseEnv(process.env);
  autoComplete.completion(env, program);
} else {
  program.parse(process.argv);
}
