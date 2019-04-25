#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const DataOutput = require('./lib/data-output');
const customersCommand = require('./lib/commands/customers');
const columnOptions = require('./lib/options/columns');
const sortOption = require('./lib/options/sort');

program
  .version(pkg.version)
  .description('list, filter & search for servuces')
  .option(
    '-a, --archived <true|false|all>',
    'When used will only show either archived customers or not archived ' +
    'customers',
    ((val) => {
      if (val === 'all') return 'all';
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    'all'
  )
  .option(
    '--columns <columns>',
    columnOptions.description(customersCommand.columns.options),
    columnOptions.parse,
    config.get().customersColumns,
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
  )
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the service’s name ' +
    '(case insensitive)'
  )
  .option(
    '--sort <sort>',
    sortOption.description(customersCommand.sort.options),
    sortOption.parse,
    customersCommand.sort.default
  )
  .on('--help', function() {
    console.log(`
Examples:

  Search for specific customers
    mite customers --search company1

  List customers ordered by their hourly rate
    mite customers --sort hourly_rate

  Export all archived customers
    mite customers --archived=true --format=csv > archived_customers.json

  Use different columns
    mite customers --columns=name,hourly_rate

  Use resulting customers to update their archived state
    mite customers --search company 1 --colums=id --format=text | xargs -n1 mite customer update --archived=false
`);
  })
  .action(() => {
    return main().catch(err => {
      console.log(err && err.message || err);
      process.exit(1);
    });
  })
  .parse(process.argv);

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
      sortOption.resolve(program.sort, customersCommand.sort.options),
    ))
    .then(items => {
      const columns = columnOptions.resolve(program.columns, customersCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns);
      console.log(DataOutput.formatData(tableData, program.format, columns));
    });
  } // main
