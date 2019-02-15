#!/usr/bin/env node
'use strict'

const program = require('commander')
const shell = require('shelljs')
const path = require('path')

const pkg = require('./../package.json')

const INTERNAL_COMMANDS = [
  'amend', 'reword', 'config', 'delete', 'rm', 'list', 'ls', 'status', 'st', 'new', 
  'create', 'open', 'stop', 'start', 'users', 'projects', 'services', 'customers', 'clients',
  'help', '--help', '-?', '-h'
];

const mainCommand = path.basename(process.argv[1]);
const subCommand = process.argv[2];
const subCommandIsInternal = !!INTERNAL_COMMANDS.find(cmd => cmd === subCommand);
const couldBeExternalCommand = process.argv.length>2 && !subCommandIsInternal;
if (couldBeExternalCommand) { 
    const childCommand = mainCommand + '-' + subCommand;  
    const childCommandExitCode = shell.exec(childCommand).code;
    process.exit(childCommandExitCode)
}

program
  .version(pkg.version)
  .command('amend', 'edit the text for a specific time entry or the currently runnning entry')
  .alias('reword')
  .command('config', 'show or set configuration settings')
  .command('delete', 'delete a specific time entry')
  .alias('rm')
  .command('list', 'list time entries', {
    isDefault: true
  })
  .alias('ls')
  .alias('status')
  .alias('st')
  .command('new', 'create a new time entry')
  .alias('create')
  .command('open', 'open the given time entry in browser')
  .command('stop', 'stop any running counter')
  .command('start', 'start the tracker for the given id, will also stop allready running entry')
  .command('users', 'list, filter & search for users')
  .command('projects', 'list, filter & search projects')
  .command('services', 'list, filter & search services')
  .command('customers', 'list, filter & search customers')
  .alias('clients')
  .description(pkg.description)
  .parse(process.argv)
