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
    '-a, --archived <true|false>',
    'When used will only show either archived services or not archived ' +
    'services',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    null
  )
  .option(
    '--billable <true|false>',
    'wheter to show only billable or not-billable entries, no filter is used ' +
    'when argument is not used',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    null
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
    // TOOO make this configurable
    servicesCommand.columns.default
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

  show archived services with custom columns
    mite services --columns=name,hourly_rate,created_at

  export all archived services as csv
    mite services --format=csv --columns=id,name,rate,billable > all_services.csv
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
  .then(services => {
    // filter archived services?
    return services.filter((a) => {
      if (program.archived === null) {
        return true;
      }
      return a.archived === program.archived;
    })
    // filter billable services?
    .filter((a) => {
      if (program.billable === null) {
        return true;
      }
      return program.billable === a.billable;
    })
    .sort((a, b) => {
      if (!program.sort) {
        return 0;
      }
      let sortByAttributeName = program.sort;
      if (sortByAttributeName === 'rate') {
        sortByAttributeName = 'hourly_rate';
      }
      var val1 = String(a[sortByAttributeName]).toLowerCase();
      var val2 = String(b[sortByAttributeName]).toLowerCase();
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
        const columnDefinition = servicesCommand.columns[attrName];
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
  });
