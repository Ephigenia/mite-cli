#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');
const mite = require('./lib/mite-api')(config.get());

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .description('start the tracker for the given id, will also stop allready running entry', {
    timeEntryId: 'id of the entry which should be started'
  })
  .option(
    '-l, --last',
    're-start time-tracking of the last created time-entry',
  )
  .addHelpText('after', `

Examples:

  Start the time entry with the id 127831
    mite start 127831

  Start the most recently created time-entry
    mite start --last
`);

async function main(timeEntryId) {
  const opts = program.opts();
  // the "magic" entry id "last" acts like the "--last" option
  if (String(timeEntryId).toLowerCase()  === 'last') {
    opts.last = true;
  }
  // "--last" was used, ignore timeEntryId and use the id of the latest entry
  // of the current user if there’s one
  if (opts.last) {
    timeEntryId = (await mite.getMyRecentTimeEntry() || {}).id;
  }
  if (!timeEntryId) {
    throw new MissingRequiredArgumentError('Missing required argument [timeEntryId]');
  }
  mite.tracker.start(timeEntryId)
    // output the id of the entry which was started for piping
    .then(() => console.log(timeEntryId))
    .catch(handleError);
}

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
