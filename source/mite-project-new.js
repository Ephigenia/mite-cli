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
  .on('--help', () => console.log(`
Examples:

  Create a new project with a overall budget of 5000:
    mite project new --customer-id 123456 \
--name "Side Project B" \
--hourly-rate 80.00 \
--budget 5000 \
--budget-type cents
`));

function main(name) {
  if (typeof name !== 'string' || !name) {
    throw new MissingRequiredArgumentError('Missing or empty required option --name <name>');
  }

  const data = {
    ...(typeof program.archived === 'boolean' && { archived: program.archived }),
    ...(program.budgetType && { budget_type: program.budgetType }),
    ...(program.budget && { budget: program.budget }),
    ...(program.customerId && { 'customer_id': program.customerId }),
    ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
    ...(typeof name === 'string' && { name: name }),
    ...(typeof program.note === 'string' && { note: program.note })
  };

  const mite = miteApi(config.get());
  return util.promisify(mite.addProject)(data)
    .then(body => {
      const projectId = body.project.id;
      console.log(`Successfully created project (id: ${projectId}).

Please use web-interface to modify complicated service & hourly rates settings:
https://${config.get('account')}.mite.yo.lk/reports/projects/${projectId}`);
    });
}

try {
  program.parse(process.argv);
  main(program.name).catch(handleError);
} catch (err) {
  handleError(err);
}
