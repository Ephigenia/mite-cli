#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .option(
    '-l, --last',
    'start the last created entry and continue tracking',
  )
  // TODO add examples for "--last"
  // TODO add examples for amend
  .description('start the tracker for the given id, will also stop allready running entry', {
    timeEntryId: 'id of the entry which should be started'
  });

function main(timeEntryId) {
  if (String(timeEntryId).toLowerCase()  === 'last') {
    program.last = true;
  }
  // "--last" was used, ignore timeEntryId and use the id of the latest entry
  // of the current user if there’s one
  if (program.last) {
    console.log('find last entry id');
    process.exit(0);
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
