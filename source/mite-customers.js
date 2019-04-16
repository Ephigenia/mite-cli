#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');
const tableLib = require('table');
const table = tableLib.table;

const pkg = require('./../package.json');
const config = require('./config.js');
const miteApi = require('./lib/mite-api')(config.get());
const formater = require('./lib/formater');
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
      })
      .map((customer) => {
        let rate = formater.budget(BUDGET_TYPE.CENTS, customer.hourly_rate);
        if (!customer.hourly_rate) {
          rate = '-';
        }
        return [
          customer.id,
          customer.name,
          rate,
          customer.note.replace(/\r?\n/g, ' '),
        ].map((v) => {
          if (customer.archived) {
            return chalk.grey(v);
          }
          return v;
        });
      });
  }).then(tableData => {
    tableData.unshift([
      'id',
      'name',
      'rate',
      'note'
    ].map(v=> chalk.bold(v)));
    const tableConfig = {
      border: tableLib.getBorderCharacters('norc'),
      columns: {
        2: {
          alignment: 'right',
        },
        3: {
          width: 50,
          wrapWord: true,
        }
      }
    };
    console.log(table(tableData, tableConfig));
  });
