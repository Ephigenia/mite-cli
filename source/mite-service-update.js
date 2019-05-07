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
  .arguments('[serviceId]')
  .description(
    'Updates a specific service',
    // arguments description
    {
      serviceId: 'Id of the service which should get updated'
    }
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'define the new archived state of the project'))
  .option(
    '--billable <true|false>',
    'changes the archived state of the project',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    })
  )
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
    'Works only in compbination with hourly-rate. When used also updates all ' +
    'already created time entries with the new hourly-rate',
  )
  .on('--help', () => console.log(`
Examples:

  Put a service into the archive:
    mite service update --archived true 123456

  Unarchive a single service
    mite service update --archived false 123456

  Make a single service not billable anymore
    mite service update --billable false 123456

  Change the name of a service
    mite service update --name "new name" 123456

  Unarchive all archived services
    mite services --archived false --columns id --format=text | xargs -n1 mite service update --archived true
`));

function main(serviceId) {
  if (!serviceId) {
    throw new MissingRequiredArgumentError('Missing required <serviceId>');
  }
  const mite = miteApi(config.get());
  const data = {
    ...(typeof program.archived === 'boolean' && { archived: program.archived }),
    ...(typeof program.billable === 'boolean' && { billable: program.billable }),
    ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
    ...(typeof program.name === 'string' && { name: program.name }),
    ...(typeof program.note === 'string' && { note: program.note }),
    ...(typeof program.updateEntries === 'boolean' && { update_hourly_rate_on_time_entries: true }),
  };
  return util.promisify(mite.updateProject)(serviceId, data)
    .then(() => console.log(`Successfully updated service (id: ${serviceId})`))
    .catch(err => {
      throw new Error(`Error while updating service (id: ${serviceId}):` + err && err.message || err);
    })
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
