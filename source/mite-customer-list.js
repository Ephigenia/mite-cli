#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const DataOutput = require('./lib/data-output');
const customersCommand = require('./lib/commands/customers');
const commandOptions = require('./lib/options');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .description(`Shows a list of customers which can be filtered, searched, \
sorted and used as input for other commands. See the examples for simple and \
and more complex examples.

Note that users with the role time tracker will not be able to list customers!
`)
  .option.apply(program, commandOptions.toArgs(
    commandOptions.archived,
    'filter for archived or unarchived customers only',
    false
  ))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(customersCommand.columns.options),
    config.get().customersColumns
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.json))
  .option(
    '--search <regexp>',
    'optional case-insensitive regular expression matchin on project’s name'
  )
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(customersCommand.sort.options),
    customersCommand.sort.default
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.plain))
  .option.apply(program, commandOptions.toArgs(commandOptions.pretty))
  .addHelpText('after', `

Examples:

  Search for specific customers
    mite customer list --search Big

  List customers ordered by their hourly rate
    mite customer list --sort hourly_rate

  Export all archived customers
    mite customer list --archived true --json > archived_customers.json

  Use different columns
    mite customer list --columns name,hourly_rate

  Use resulting customers to update their archived state
    mite customer list --search company 1 --colums id --plain | xargs -n1 mite customer update --archived false
  `);

// TODO add limit option
// TODO add offset option
async function main() {
  const opts = program.opts();
  const miteApi = require('./lib/mite-api')(config.get());

  const options = {
    limit: 1000,
    ...(opts.search && { query: opts.search })
  };

  return miteApi.getCustomers(options)
    .then((customers) => customers
      .filter(({ archived }) => opts.archived === 'all' ? true : opts.archived === archived)
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(opts.sort, customersCommand.sort.options),
    ))
    .then(items => {
      const format = DataOutput.getFormatFromOptions(opts, config);
      const columns = commandOptions.columns.resolve(opts.columns, customersCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns, format);
      process.stdout.write(DataOutput.formatData(tableData, format, columns));
    })
    .catch(handleError);
} // main

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
