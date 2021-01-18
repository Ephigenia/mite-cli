#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');

program
  .version(pkg.version)
  .command('delete', 'delete a single project').alias('rm')
  .command('list', 'list all projects').alias('ls')
  .command('new', 'creates a new project').alias('create')
  .command('update', 'update a single project')
  .parse();

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
}
