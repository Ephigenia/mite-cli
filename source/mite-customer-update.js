#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');
const commandOptions = require('./lib/options');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[customerId]')
  .description(
    'Updates a specific customer',
    {
      customerId: 'Id of the customer of which the note should be altered'
    }
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'define the new archived state of the customer'))
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'changes the name of the customer to the given value',
  )
  .option(
    '--note <note>',
    'changes the note of the customer to the given value',
  )
  .option(
    '--update-entries',
    'will update also the associated time-entries when changing archived ' +
    'state or hourly rate',
  )
  .addHelpText('after', `

Examples:

  Put a customer into the archive:
    mite customer update --archived true 123456

  Unarchive a single customer
    mite customer update --archived false 123456

  Change the name of a customer
    mite customer update --name "Super-Client" 123456

  Change the hourly rate and update all entries created for this customer
    mite customer update --hourly-rate 9000 --update-entries 123456

  Unarchive all archived customers
    mite customers --columns id --archived true --format text | xargs -n1 mite customer update --archived false
  `);

function main(customerId) {
  if (!customerId) {
    throw new MissingRequiredArgumentError('Missing required <customerId>');
  }
  const mite = miteApi(config.get());
  const data = {
    ...(typeof program.archived === 'boolean' && { archived: program.archived }),
    ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
    ...(typeof program.name === 'string' && { name: program.name }),
    ...(typeof program.note === 'string' && { note: program.note }),
    ...(typeof program.updateEntries === 'boolean' && { update_hourly_rate_on_time_entries: true }),
  };
  return util.promisify(mite.updateCustomer)(customerId, data)
    .then(() => console.log(`Successfully updated customer (id: ${customerId})`))
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
