#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const pkg = require('./../package.json');
const config = require('./config.js');
const miteApi = require('./lib/mite-api')(config.get());
const formater = require('./lib/formater');
const DataOutput = require('./lib/data-output');
const BUDGET_TYPE = formater.BUDGET_TYPE;
const SORT_OPTIONS = [
  'id',
  'name',
  'updated_at',
  'created_at',
  'hourly_rate',
  'rate',
];
const SORT_OPTIONS_DEFAULT = 'name';

const COLUMNS_OPTIONS = {
  created_at: {
    label: 'created at',
    attribute: 'created_at',
  },
  id: {
    label: 'id',
    attribute: 'id',
    width: 10,
    alignment: 'right'
  },
  name: {
    label: 'name',
    attribute: 'name',
  },
  note: {
    label: 'Note',
    attribute: 'note',
    width: 50,
    wrapWord: true,
    alignment: 'left',
    format: formater.note,
  },
  rate: {
    label: 'rate',
    attribute: 'hourly_rate',
    width: 10,
    alignment: 'right',
    format: (value) => {
      if (!value) {
        return '-';
      }
      return formater.budget(BUDGET_TYPE.CENTS, value || 0);
    },
  },
  updated_at: {
    label: 'updated at',
    attribute: 'updated_at',
  }
};

program
  .version(pkg.version)
  .description('list, filter & search for servuces')
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the services’ name ' +
    '(case insensitive)'
  )
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
    'list of attribute names: ' + Object.keys(COLUMNS_OPTIONS).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    'id,name,rate,note'
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    'table'
  )
  .option(
    '--sort <column>',
    `optional column the results should be case-insensitive ordered by `+
    `(default: "${SORT_OPTIONS_DEFAULT}"), ` +
    `valid values: ${SORT_OPTIONS.join(', ')}`,
    (value) => {
      if (SORT_OPTIONS.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          SORT_OPTIONS.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    'name' // default sort
  )
  .on('--help', function() {
    console.log(`
Examples:

  $ mite customers --search company1
  $ mite customers --sort hourly_rate
`);
  })
  .parse(process.argv);

const opts = {
  name: program.search
};

miteApi.getCustomers(opts)
  .then((allCustomers) => {
    return allCustomers
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
        const columnDefinition = COLUMNS_OPTIONS[attrName];
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
  });
