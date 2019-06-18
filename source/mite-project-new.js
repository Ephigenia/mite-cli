#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');
const commandOptions = require('./lib/options');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .description(
    `Creates a new project while using the given argument parameters \
as starting values. Note that some users are not able to crate new \
projects.`
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'Defines the archived state'))
  .option.apply(program, commandOptions.toArgs(commandOptions.budget, null, 'hours'))
  .option.apply(program, commandOptions.toArgs(commandOptions.budgetType))
  .option(
    '--customer-id <customerId>',
    'Optional id of the customer this project should belong to.'
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'Name of the project',
  )
  .option(
    '--note <note>',
    'Note of the project',
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

function main() {
  const mite = miteApi(config.get());
  const data = {
    ...(typeof program.archived === 'boolean' && { archived: program.archived }),
    ...(program.budgetType && { budget_type: program.budgetType }),
    ...(program.budget && { budget: program.budget }),
    ...(program.customerId && { 'customer_id': program.customerId }),
    ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
    ...(typeof program.name === 'string' && { name: program.name }),
    ...(typeof program.note === 'string' && { note: program.note })
  };

  return util.promisify(mite.addProject)(data)
    .then(body => {
      const projectId = body.project.id;
      console.log(`Successfully created project (id: ${projectId}):
https://${config.get('account')}.mite.yo.lk/reports/projects/${projectId}`);
    });
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
