#!/usr/bin/env node
'use strict';

const program = require('commander');
const miteApi = require('mite-api');
const util = require('util');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .description(`Locks a specific time-entry identified by it’s id. \
The time-entry must either be owned by the requesting user or the \
requesting user must be an admin or owner. In that case the time entry \
can only be unlocked by an admin or owner.`,
    {
      timeEntryId: 'The id of the time entry which should be locked'
    }
  )
  .option(
    '--force',
    'try to bypass user id or role restrictions as a admin or owner'
  )
  .addHelpText('after', `

Examples:

  Lock a single entry identified by it’s id:
    mite lock 1283761

  Lock multiple entries selected by using mite list:
    mite list this_month --search "query" --columns id --plain | xargs -n1 mite lock
  `);

function main(timeEntryId) {
  const opts = program.opts();
  if (!timeEntryId) {
    throw new MissingRequiredArgumentError('Missing required <timeEntryId>');
  }
  const mite = miteApi(config.get());
  const data = {
    locked: true,
    ...(typeof opts.force === 'boolean' && { force: opts.force })
  };
  return util.promisify(mite.updateTimeEntry)(timeEntryId, data)
    .then(() => process.stdout.write(`Successfully locked time entry (id: ${timeEntryId})`))
    .catch(handleError);
}

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
