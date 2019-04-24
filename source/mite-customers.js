#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const pkg = require('./../package.json');
const config = require('./config.js');
const miteApi = require('./lib/mite-api')(config.get());
const DataOutput = require('./lib/data-output');
const customersCommand = require('./lib/commands/customers');

program
  .version(pkg.version)
  .description('list, filter & search for servuces')
  .option(
    '-a, --archived <value>',
    'When used will only show either archived customers or not archived ' +
    'customers',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    null
  )
  .option(
    '--columns <columns>',
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(customersCommand.columns.options).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    // @TODO make configurable
    customersCommand.columns.default
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
  )
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the services’ name ' +
    '(case insensitive)'
  )
  .option(
    '--sort <column>',
    `optional column the results should be case-insensitive ordered by `+
    `(default: "${customersCommand.sort.default}"), ` +
    `valid values: ${customersCommand.sort.options.join(', ')}`,
    (value) => {
      if (customersCommand.sort.options.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          customersCommand.sort.options.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    customersCommand.sort.default // default sort
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
    mite customers --columns=name,rate

  Use resulting customers to update their archived state
    mite customers --search company 1 --colums=id --format=text | xargs -n1 mite customer update --archived=false
`);
  })
  .parse(process.argv);

const opts = {
  name: program.search
};

miteApi.getCustomers(opts)
  .then((customers) => {
    return customers
      .filter((customer) => {
        if (program.archived === null) {
          return true;
        }
        return customer.archived === program.archived;
      })
      .sort((a, b) => {
        if (!program.sort) {
          return 0;
        }
        let key = program.sort;
        if (key === 'rate') {
          key = 'hourly_rate';
        }
        var val1 = String(a[key]).toLowerCase();
        var val2 = String(b[key]).toLowerCase();

        if (val1 > val2) {
          return 1;
        } else if (val1 < val2) {
          return -1;
        } else {
          return 0;
        }
      });
  }).then(items => {
    // validate columns options
    const columns = program.columns
      .split(',')
      .map(attrName => {
        const columnDefinition = customersCommand.columns.options[attrName];
        if (!columnDefinition) {
          console.error(`Invalid column name "${attrName}"`);
          process.exit(2);
        }
        return columnDefinition;
      });

    // create final array of table data
    const tableData = items.map((item) => {
      let row = columns.map(columnDefinition => {
        const value = item[columnDefinition.attribute];
        if (columnDefinition.format) {
          return columnDefinition.format(value, item);
        }
        return value;
      });
      if (item.archived) {
        row = row.map(v => chalk.grey(v));
      }
      return row;
    });

    // Table header
    tableData.unshift(
      columns
        .map(columnDefinition => columnDefinition.label)
        .map(v => chalk.bold(v))
    );

    console.log(DataOutput.formatData(tableData, program.format, columns));
  })
  .catch(err => {
    console.log(err && err.message || err);
    process.exit(1);
  });;
