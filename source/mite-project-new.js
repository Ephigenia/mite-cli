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
    `Creates a new project while using the given argument parameters \
as starting values. Note that some users are not able to create new projects.`
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'Defines the archived state'))
  .option.apply(program, commandOptions.toArgs(commandOptions.budget))
  .option.apply(program, commandOptions.toArgs(commandOptions.budgetType, null, 'minutes'))
  .option(
    '--customer-id <customerId>',
    'Optional id of the customer this project should belong to.'
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'Required name of the project'
  )
  .option(
    '--note <note>',
    'Optional Note of the project',
  )
  .addHelpText('after', `

Examples:

  Create a new project with a overall budget of 5000:
    mite project new --customer-id 123456 \
--name "Side Project B" \
--hourly-rate 80.00 \
--budget 5000 \
--budget-type cents
`);

function main(name, opts) {
  if (typeof name !== 'string' || !name) {
    throw new MissingRequiredArgumentError('Missing or empty required option --name <name>');
  }

  const data = {
    ...(typeof opts.archived === 'boolean' && { archived: opts.archived }),
    ...(opts.budgetType && { budget_type: opts.budgetType }),
    ...(opts.budget && { budget: opts.budget }),
    ...(opts.customerId && { 'customer_id': opts.customerId }),
    ...(typeof opts.hourlyRate === 'number' && { hourly_rate: opts.hourlyRate }),
    ...(typeof name === 'string' && { name: name }),
    ...(typeof opts.note === 'string' && { note: opts.note })
  };

  const mite = miteApi(config.get());
  return util.promisify(mite.addProject)(data)
    .then(body => {
      const projectId = body.project.id;
      process.stdout.write(`Successfully created project (id: ${projectId}).

Please use web-interface to modify complicated service & hourly rates settings:
https://${config.get('account')}.mite.de/reports/projects/${projectId}\n`);
    });
}

try {
  program.parse();
  main(program.name, program.opts()).catch(handleError);
} catch (err) {
  handleError(err);
}
