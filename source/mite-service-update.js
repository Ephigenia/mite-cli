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
  .arguments('[serviceId]')
  .description(
    'Updates a specific service',
    // arguments description
    {
      serviceId: 'Id of the service which should get updated'
    }
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'defines wheter the service is archived or not'))
  .option.apply(program, commandOptions.toArgs(commandOptions.billable, 'defines wheter the service is billable or not'))
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'changes the name of the project to the given value',
  )
  .option(
    '--note <note>',
    'changes the note of the project to the given value',
  )
  .option(
    '--update-entries',
    'will update also the associated time-entries when changing billable ' +
    'state or hourly rate',
  )
  .addHelpText('after', `

Examples:

  Put a service into the archive:
    mite service update --archived true 123456

  Unarchive a single service
    mite service update --archived false 123456

  Make a single service not billable anymore
    mite service update --billable false 123456

  Change the hourly rate and update all associated entries
    mite service update --hourly-rate 8500 --update-entries 123456

  Change the name of a service
    mite service update --name "new name" 123456

  Unarchive all archived services
    mite services --archived false --columns id --plain | xargs -n1 mite service update --archived true
  `);

function main(serviceId) {
  const opts = program.opts();
  if (!serviceId) {
    throw new MissingRequiredArgumentError('Missing required <serviceId>');
  }
  const mite = miteApi(config.get());
  const data = {
    ...(typeof opts.archived === 'boolean' && { archived: opts.archived }),
    ...(typeof opts.billable === 'boolean' && { billable: opts.billable }),
    ...(typeof opts.hourlyRate === 'number' && { hourly_rate: opts.hourlyRate }),
    ...(typeof opts.name === 'string' && { name: opts.name }),
    ...(typeof opts.note === 'string' && { note: opts.note }),
    ...(typeof opts.updateEntries === 'boolean' && { update_hourly_rate_on_time_entries: true }),
  };
  return util.promisify(mite.updateProject)(serviceId, data)
    .then(() => process.stdout.write(`Successfully updated service (id: ${serviceId})\n`))
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse();
} catch (err) {
  handleError(err);
}
