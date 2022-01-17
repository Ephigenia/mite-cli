#!/usr/bin/env node
'use strict';

const program = require('commander');
const miteApi = require('mite-api');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .description('delete a time entry', {
    timeEntryId: 'The id of the time entry which should be deleted'
  })
  .addHelpText('after', `

Examples:

  Delete a single entry identified by it’s id:
    mite delete 1283761

  Delete multiple entries from a project selected by using mite list:
    mite list this_month --project-id 123128 --columns id --plain | xargs -n1 mite delete
`);

function main(timeEntryId) {
  if (!timeEntryId) {
    throw new MissingRequiredArgumentError('Missing required argument <timeEntryId>');
  }
  const mite = miteApi(config.get());
  mite.deleteTimeEntry(timeEntryId, (err) => {
    if (err) {
      const message = (err && err.message) ? err.message : err;
      handleError(new Error(`Error while deleted time entry (id: ${timeEntryId}) ${message}`));
    }
    process.stdout.write(timeEntryId);
  });
}

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
