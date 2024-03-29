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
  .description(`Unlocks a specific time-entry identified by it’s id. \
Time entries can only get unlocked if they have been locked by the same \
user or users who are admin or owner. \
Use the --force argument if you want to bypass that restriction as admin.`,
    {
      timeEntryId: 'The id of the time entry which should be unloacked'
    }
  )
  .option(
    '--force',
    'bypass user id or role restrictions as a admin or owner'
  )
  .addHelpText('after', `

Examples:

  Unlock a single entry identified by it’s id:
    mite unlock 1283761

  Unlock multiple entries selected by using mite list:
    mite list this_month --search "query" --columns id --plain | xargs -n1 mite unlock
  `);

function main (timeEntryId) {
  const opts = program.opts();
  if (!timeEntryId) {
    throw new MissingRequiredArgumentError('Missing required <timeEntryId>');
  }
  const mite = miteApi(config.get());
  const data = {
    locked: false,
    ...(typeof opts.force === 'boolean' && { force: opts.force })
  };
  return util.promisify(mite.updateTimeEntry)(timeEntryId, data)
    .then(() => process.stdout.write(`${timeEntryId}\n`))
    .catch(handleError);
}

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
