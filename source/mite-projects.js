#!/usr/bin/env node
'use strict'

const program = require('commander');
const miteApi = require('mite-api');
const chalk = require('chalk');
const async = require('async');
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
  'hourly_rate',
  'rate',
  'budget',
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
    '-a, --archived <true|false>',
    'When used will only show either archived users or not archived users',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    false // default archive argument
  )
  .parse(process.argv);

const opts = {
  limit: 10000,
  name: program.search,
  customer_id: program.customer_id
};

const mite = miteApi(config.get());

async.parallel([
  async.apply(mite.getProjects, opts),
  async.apply(mite.getArchivedProjects, opts)
], (err, results) => {

  if (err) {
    throw err;
  }
  // merge archived and not archived projects together in one array
  const allProjects = [].concat(results[0], results[1]);
  // proclaim an array of tabular data by mapping and filtering the data
  const tableData = allProjects
    .map((e) => e.project)
    .filter((p) => {
      if (program.archived === null) {
        return true;
      }
      return program.archived === p.archived;
    })
    .filter((p) => {
      // filter by customer regexp, skip if no cli argument was given
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
      ].map((v) => {
        if (data.archived) {
          return chalk.grey(v);
        }
        return v;
      })
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
      1: {
        wrapWord: true,
      },
      3: {
        alignment: 'right',
      },
      4: {
        alignment: 'right',
      },
      5: {
        width: 50,
        wrapWord: true,
      }
    }
  };
  console.log(table(tableData, tableConfig));
});
