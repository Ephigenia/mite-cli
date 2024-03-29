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
    `Creates a new customer while using the given values. \
Note that some users are not able to create new customers.`
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'Defines the archived state'))
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'Name of the customer',
  )
  .option(
    '--note <note>',
    'Optional additional note of the customer',
  )
  .addHelpText('after', `

Examples:

  Create a new customer with an hourly rate of 80:
    mite customer new --name "World Company" --hourly-rate 80
`);

function main(name, opts) {
  if (typeof name !== 'string' || !name) {
    throw new MissingRequiredArgumentError('Missing or empty required option --name <name>');
  }

  const data = {
    ...(typeof opts.archived === 'boolean' && { archived: opts.archived }),
    ...(typeof opts.hourlyRate === 'number' && { hourly_rate: opts.hourlyRate }),
    ...(typeof name === 'string' && { name: name }),
    ...(typeof opts.note === 'string' && { note: opts.note })
  };

  const mite = miteApi(config.get());
  return util.promisify(mite.addCustomer)(data)
    .then(body => {
      const customerId = body.customer.id;
      process.stdout.write(`Successfully created customer (id: ${customerId}).

Please use web-interface to modify complicated service & hourly rates settings:
https://${config.get('account')}.mite.de/customers/${customerId}/edit\n`);
    });
}

try {
  program.parse();
  main(program.name, program.opts()).catch(handleError);
} catch (err) {
  handleError(err);
}
