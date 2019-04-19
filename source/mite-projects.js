#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const DataOutput = require('./lib/data-output');
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

const COLUMNS_OPTIONS = {
  budget: {
    label: 'budget',
    attribute: 'budget',
    width: 10,
    alignment: 'right',
    format: (value, item) => {
      if (!value) {
        return '-';
      }
      return formater.budget(item.budget_type, value);
    },
  },
  budget_type: {
    label: 'budget_type',
    attribute: 'budget_type',
  },
  created_at: {
    label: 'created at',
    attribute: 'created_at',
  },
  customer_id: {
    label: 'customer id',
    attribute: 'customer_id'
  },
  customer_name: {
    label: 'customer name',
    attribute: 'customer_name'
  },
  customer: {
    label: 'customer',
    attribute: 'customer_name',
    format: (value, item) => {
      return `${item.customer_name} (${item.customer_id})`;
    }
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
  .description('list, filter & search for projects')
  .option(
    '-a, --archived <true|false>',
    'When used will only show either archived users or not archived users',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    false // default option of archived
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
    '--columns <columns>',
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(COLUMNS_OPTIONS).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    'id,name,customer,budget,rate,note'
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    'table'
  )
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the project’s name ' +
    '(case insensitive)'
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
    SORT_OPTIONS_DEFAULT // default sor
  )
  .on('--help', function() {
    console.log(`
Examples:

  list all projects
    mite projects

  list projects while setting different columns and export to csv
    mite projects --columns=id,customer_id,customer_name --format=csv > projects_export.csv

  show all projects ordered by their budget while only showing their names and bugets
    mite projects --sort=budget

  show all projects by a specific customer
    mite projects --customer Client1

  export the resulting list as csv
    mite projects --format=csv > my-projects.csv

  use the resulting projects in another command to archive the listed projects
    mite projects --columns=id --format=text | xargs -0 mite project update --archived false
`);
  })
  .parse(process.argv);

const opts = {
  limit: 10000,
  name: program.search,
  customer_id: program.customer_id
};

const miteApi = require('./lib/mite-api')(config.get());

miteApi.getProjects(opts).then(allProjects => {
  // proclaim an array of tabular data by mapping and filtering the data
  return allProjects
    .filter((p) => {
      if (typeof program.archived !== 'boolean') {
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
      return p.customer_name === program.customer || regexp.exec(p.customer_name) || regexp.exec(String(p.customer_id));
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
