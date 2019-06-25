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
    'all'
  ))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(customersCommand.columns.options),
    config.get().customersColumns
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.format, undefined, config.get('outputFormat')))
  .option(
    '--search <query>',
    'optional case-insensitive string to search'
  )
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(customersCommand.sort.options),
    customersCommand.sort.default
  ))
  .on('--help', () => console.log(`
Examples:

  Search for specific customers
    mite customer list --search Big

  List customers ordered by their hourly rate
    mite customer list --sort hourly_rate

  Export all archived customers
    mite customer list --archived true --format csv > archived_customers.json

  Use different columns
    mite customer list --columns name,hourly_rate

  Use resulting customers to update their archived state
    mite customer list --search company 1 --colums id --format text | xargs -n1 mite customer update --archived false
  `));

async function main() {
  const miteApi = require('./lib/mite-api')(config.get());

  const opts = {
    limit: 1000,
    ...(program.search && { name: program.search })
  };

  return miteApi.getCustomers(opts)
    .then((customers) => customers
      .filter(({ archived }) => program.archived === 'all' ? true : program.archived === archived)
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(program.sort, customersCommand.sort.options),
    ))
    .then(items => {
      const columns = commandOptions.columns.resolve(program.columns, customersCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns);
      console.log(DataOutput.formatData(tableData, program.format, columns));
    })
    .catch(handleError);
} // main


try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
