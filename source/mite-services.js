#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const DataOutput = require('./lib/data-output');
const pkg = require('./../package.json');
const config = require('./config');
const servicesCommand = require('./lib/commands/services');
const columnOptions = require('./lib/options/columns');

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
    'all'
  )
  .option(
    '--billable <true|false|all>',
    'wheter to show only billable or not-billable entries, no filter is used ' +
    'when argument is not used',
    ((val) => {
      if (val === 'all') return 'all';
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1
    }),
    'all'
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
  )
  .option(
    '--columns <columns>',
    columnOptions.description(servicesCommand.columns.options),
    columnOptions.parse,
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
    .filter(({ archived }) => program.archived === 'all' ? true : archived === program.archived)
    .filter(({ billable }) => program.billable === 'all' ? true : billable === program.billable)
  )
  .then(items => miteApi.sort(items, program.sort))
  .then(items => {
    const columns = columnOptions.resolve(program.columns, servicesCommand.columns.options);

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
