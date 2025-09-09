#!/usr/bin/env node
'use strict';

const { program } = require('commander');
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
    mite customers --columns id --archived true --plain | xargs -n1 mite customer update --archived false
  `);

function main(customerId, opts) {
  if (!customerId) {
    throw new MissingRequiredArgumentError('Missing required <customerId>');
  }
  const mite = miteApi(config.get());
  const data = {
    ...(typeof opts.archived === 'boolean' && { archived: opts.archived }),
    ...(typeof opts.hourlyRate === 'number' && { hourly_rate: opts.hourlyRate }),
    ...(typeof opts.name === 'string' && { name: opts.name }),
    ...(typeof opts.note === 'string' && { note: opts.note }),
    ...(typeof opts.updateEntries === 'boolean' && { update_hourly_rate_on_time_entries: true }),
  };

  return util.promisify(mite.updateCustomer)(customerId, data)
    .then(() => process.stdout.write(`Successfully updated customer (id: ${customerId})\n`))
    .catch(handleError);
}

try {
  program
    .action(main, program.opts())
    .parse();
} catch (err) {
  handleError(err);
}
