#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, GeneralError } = require('./lib/errors');

function main() {
  const miteTracker = require('./lib/mite-tracker')(config.get());
  miteTracker.get()
    .then((timeEntryId) => {
      if (!timeEntryId) {
        throw new GeneralError('No running tracker found.');
      }
      return miteTracker.stop(timeEntryId);
    })
    .then((timeEntryId) => console.log(
      `Successfully stopped time tracking (id: ${timeEntryId})`
    ))
    .catch(handleError);
}

try {
  program
    .version(pkg.version)
    .description('stops any running time entry')
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
