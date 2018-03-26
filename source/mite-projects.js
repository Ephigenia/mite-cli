#!/usr/bin/env node
'use strict'

const program = require('commander');
const miteApi = require('mite-api');
const chalk = require('chalk');
const tableLib = require('table')
const table = tableLib.table;

const pkg = require('./../package.json');
const config = require('./config.js');
const formater = require('./lib/formater');
const BUDGET_TYPE = formater.BUDGET_TYPE;
const SORT_OPTIONS = [
  'id',
  'name',
  'customer',
  'customer_name',
  'customer_id',
  'updated_at',
  'created_at',
];
const SORT_OPTIONS_DEFAULT = 'name';

program
  .version(pkg.version)
  .description('list, filter & search for projects')
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
    SORT_OPTIONS_DEFAULT // default sor
  )
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the project’s name ' +
    '(case insensitive)'
  )
  .option(
    '--customer_id <id>',
    'optional id of a customer (use mite customer) to filter the projects by'
  )
  .option(
    '--customer <regexp>',
    'optional client-side filter for customer names, case-insensitive'
  )
  .option(
    '-a, --archived',
    'When used will only return archived projects which are not returned when ' +
    'not used.',
    false
  )
  .parse(process.argv);

const opts = {
  limit: 10000
};
if (program.customer_id) {
  opts.customer_id = program.customer_id;
}
if (program.search) {
  opts.name = program.search;
}
let method = 'getProjects';
if (program.archived) {
  method = 'getArchivedProjects';
}

const mite = miteApi(config.get());
mite[method](opts, (err, responseData) => {
  if (err) {
    throw err;
  }

  const tableData = responseData
    .map((e) => e.project)
    .filter((p) => {
      if (!program.customer) {
        return true;
      }
      const regexp = new RegExp(program.customer, 'i');
      return regexp.exec(p.customer_name) || regexp.exec(String(p.customer_id));
    })
    .sort((a, b) => {
      if (!program.sort) return 0;
      let sortByAttributeName = program.sort;
      if (sortByAttributeName === 'customer') {
        sortByAttributeName = 'customer_name';
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
    })
    .map((data) => {
      let budget = formater.budget(data.budget_type, data.budget);
      if (!data.budget) {
        budget = '-'
      }
      let rate = formater.budget(BUDGET_TYPE.CENTS, data.hourly_rate);
      if (!data.hourly_rate) {
        rate = '-';
      }
      let customer = data.customer_name + ' (' + data.customer_id + ')';
      if (!data.customer_id) {
        customer = '-';
      }
      return [
        data.id,
        data.name,
        customer,
        budget,
        rate,
        data.note.replace(/\r?\n/g, ' '),
      ];
    });
  tableData.unshift([
    'id',
    'name',
    'customer',
    'budget',
    'rate',
    'note',
  ].map((v) => chalk.bold(v)));
  const tableConfig = {
    border: tableLib.getBorderCharacters('norc'),
    columns: {
      0: {},
      1: {},
      2: {},
      3: {
        alignment: 'right',
      },
      4: {
        alignment: 'right',
      },
      5: {
        width: 80,
        wrapWord: true,
      }
    }
  };
  console.log(table(tableData, tableConfig));
});
