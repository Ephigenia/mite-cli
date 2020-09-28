#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');
const miteApi = require('./lib/mite-api')(config.get());

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
  .on('--help', () => console.log(`
Examples:

  Start the time entry with the id 127831
    mite start 127831

  Start the most recently created time-entry
    mite start --last
`));

async function main(timeEntryId) {
  // the "magic" entry id "last" acts like the "--last" option
  if (String(timeEntryId).toLowerCase()  === 'last') {
    program.last = true;
  }
  // "--last" was used, ignore timeEntryId and use the id of the latest entry
  // of the current user if there’s one
  if (program.last) {
    timeEntryId = (await miteApi.getMyRecentTimeEntry() || {}).id;
  }
  if (!timeEntryId) {
    throw new MissingRequiredArgumentError('Missing required argument [timeEntryId]');
  }
  const miteTracker = require('./lib/mite-tracker')(config.get());
  miteTracker.start(timeEntryId)
    // TODO change output to just the ID when tty is off
    .then(() => console.log(`Successfully started the time entry (id: ${timeEntryId})`))
    .catch(handleError);
}

try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
