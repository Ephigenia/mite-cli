#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');

program
  .version(pkg.version)
  .command('delete', 'delete a single service').alias('rm')
  .command('list', 'list services').alias('ls')
  .command('update', 'update a single service')
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
}
