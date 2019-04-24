#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const DataOutput = require('./lib/data-output');
const pkg = require('./../package.json');
const config = require('./config');
const servicesCommand = require('./lib/commands/services');

program
  .version(pkg.version)
  .description('list, filter & search for servuces')
  .option(
    '-a, --archived <true|false|all>',
    'When used will only show either archived services or not archived ' +
    'services',
    ((val) => {
      if (val === 'all') return 'all';
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1
    }),
    all
  )
  .option(
    '--billable <true|false|all>',
    'wheter to show only billable or not-billable entries, no filter is used ' +
    'when argument is not used',
    ((val) => {
      if (val === 'all') return 'all';
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1
    }),
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
  )
  .option(
    '--columns <columns>',
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(servicesCommand.columns.options).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    config.get().servicesColumns
  )
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the services’ name ' +
    '(case insensitive)'
  )
  .option(
    '--sort <column>',
    `optional column the results should be case-insensitive ordered by `+
    `(default: "${servicesCommand.sort.default}"), ` +
    `valid values: ${servicesCommand.sort.options.join(', ')}`,
    (value) => {
      if (servicesCommand.sort.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          servicesCommand.sort.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    servicesCommand.sort.default
  )
  .on('--help', function() {
    console.log(`
Examples:

  show all services
    mite services

  show all archived services
    mite service --archived=true

  show archived services with custom columns
    mite services --columns=name,hourly_rate,created_at

  export all archived services as csv
    mite services --format=csv --columns=id,name,hourly_rate,billable > all_services.csv
`);
  })
  .parse(process.argv);

const opts = {
  limit: 1000,
  offset: 0,
  name: program.search
};

const miteApi = require('./lib/mite-api')(config.get());

miteApi.getServices(opts)
  .then(services => services
    .filter((s) => program.archived === 'all' && true || s.archived === program.archived)
    .filter((s) => program.billable === 'all' && true || program.billable === s.billable)
  )
  .then(items => miteApi.sort(items, program.sort))
  .then(items => {
    // validate columns options
    const columns = program.columns
      .split(',')
      .map(attrName => {
        const columnDefinition = servicesCommand.columns.options[attrName];
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
        if (typeof columnDefinition.format === 'function') {
          return columnDefinition.format(value, item);
        }
        return value;
      });
      // show archived items in grey
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
  });
