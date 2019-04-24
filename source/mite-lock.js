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
    'Locks a specific time-entry identified by it’s id. ' +
    'The time-entry must either be owned by the requesting user or the ' +
    'requesting user must be an admin or owner. In that case the time entry ' +
    'can only be unlocked by an admin or owner.',
    // object hash containing description of arguments
    {
      timeEntryId: 'The id of the time entry which should be locked'
    })
  .arguments('<timeEntryId>')
  .option(
    '--force',
    'bypass user id or role restrictions as a admin or owner'
  )
  .on('--help', function() {
    console.log(`
Examples:

  Lock a single entry identified by it’s id:
    mite lock 1283761

  Lock multiple entries selected by using mite list:
    mite list this_month --search="query" --columns id --format=text | xargs -n1 mite lock
`);
  })
  .action((timeEntryId) => {
    const mite = miteApi(config.get());

    const data = {
      locked: true,
      ...(typeof program.force === 'boolean' && { force: program.force })
    };
    return util.promisify(mite.updateTimeEntry)(timeEntryId, data)
      .then(() => {
        console.log('Successfully locked time entry (id: %s)', timeEntryId);
      })
      .catch(err => {
        console.log(err && err.message || err);
        process.exit(1);
      });
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit();
}
