#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');

program
  .version(pkg.version)
  .command('delete', 'delete a single customer')
  .command('list', 'list custoemrs').alias('ls')
  .command('update', 'update a single customer')
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
