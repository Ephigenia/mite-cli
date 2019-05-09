#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, GeneralError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .description('start the tracker for the given id, will also stop allready running entry', {
    timeEntryId: 'id of the entry which should be started'
  });

function main(timeEntryId) {
  if (!timeEntryId) {
    throw new MissingRequiredArgumentError('Missing required argument <timeEntryId>');
  }
  const miteTracker = require('./lib/mite-tracker')(config.get());
  miteTracker.start(timeEntryId)
    .then(() => console.log(`Successfully started the time entry (id: ${timeEntryId})`))
    .catch((err) => {
      throw new GeneralError(`Unable to start the time entry (id: ${timeEntryId}): ` + (err && err.message || err));
    });}

try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
