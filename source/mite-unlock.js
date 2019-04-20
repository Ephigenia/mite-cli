#!/usr/bin/env node
'use strict';

const program = require('commander');
const miteApi = require('mite-api');
const util = require('util');

const pkg = require('./../package.json');
const config = require('./config.js');

program
  .version(pkg.version)
  .description(
    'Unlocks a specific time-entry identified by it’s id. ' +
    'Time entries can only get unlocked if they have been locked by the same ' +
    'user or users who are admin or owner. ' +
    'Use the --force argument if you want to bypass that restriction as admin.',
    // object hash containing description of arguments
    {
      timeEntryId: 'The id of the time entry which should be unloacked'
    })
  .arguments('<timeEntryId>')
  .option(
    '--force',
    'bypass user id or role restrictions as a admin or owner'
  )
  .on('--help', function() {
    console.log(`
Examples:

  Unlock a single entry identified by it’s id:
    mite unlock 1283761

  Unlock multiple entries selected by using mite list:
    mite list this_month --search="query" --columns id --format=text | xargs -0 mite unlock
`);
  })
  .action((timeEntryId) => {
    const mite = miteApi(config.get());

    const data = {
      locked: false,
      ...(typeof program.force === 'boolean' && { force: program.force })
    };
    return util.promisify(mite.updateTimeEntry)(timeEntryId, data)
      .then(() => {
        console.log('Successfully unlocked time entry (id: %s)', timeEntryId);
      })
      .catch(err => {
        console.error(err);
        process.exit(0);
      });
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit();
}
