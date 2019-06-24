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
  .description(
    `Creates a new customer while using the given values.`
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'Defines the archived state'))
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'Name of the project',
  )
  .option(
    '--note <note>',
    'Optional additional note of the project',
  )
  .on('--help', () => console.log(`
Examples:

  Create a new customer:
    mite customer new --name "World Company" --hourly-rate 80
`));


function main() {
  const mite = miteApi(config.get());

  if (program.name) {
    throw new MissingRequiredArgumentError('Missing required "name"');
  }

  const data = {
    ...(typeof program.archived === 'boolean' && { archived: program.archived }),
    ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
    ...(typeof program.name === 'string' && { name: program.name }),
    ...(typeof program.note === 'string' && { note: program.note })
  };

  console.dir(process.argv)
  console.dir(program.args);
  // console.dir(program);
  console.dir(data);
  process.exit();

  return util.promisify(mite.addCustomer)(data)
    .then(body => {
      const customerId = body.customer.id;
      console.log(`Successfully created customer (id: ${customerId}).

Please use web-interface to modify complicated service & hourly rates settings:
https://${config.get('account')}.mite.yo.lk/customers/${customerId}/edit`);
    });
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
