#!/usr/bin/env node
'use strict';

const program = require('commander');
const miteApi = require('mite-api');
const chalk = require('chalk');
const async = require('async');

const pkg = require('./../package.json');
const config = require('./config.js');
const DataOutput = require('./lib/data-output');
const formater = require('./lib/formater');
const BUDGET_TYPE = formater.BUDGET_TYPE;
const SORT_OPTIONS = [
  'id',
  'name',
  'updated_at',
  'created_at',
  'hourly_rate',
  'rate' // alias for hourly_rate
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
    SORT_OPTIONS_DEFAULT // default sort
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
    'table',
  )
  .on('--help', function() {
    console.log(`
Examples:

  show all services
    $ mite services

  list all entries which note contains the given search query:
    $ mite list this_year --search JIRA-123

  show all users who tracked billable entries ordered by the amount of time they have tracked:
    $ mite list this_year --billable true --columns=user,duration --group_by=user --sort=duration

  export all time-entries from the current month as csv file:
    $  mite list last_week --format=csv --columns=user,id
`);
  })
  .parse(process.argv);

const opts = {
  limit: 1000,
  offset: 0,
  name: program.search
};

const mite = miteApi(config.get());

async.parallel([
  async.apply(mite.getServices, opts),
  async.apply(mite.getArchivedServices, opts)
], (err, results) => {
  if (err) {
    throw err;
  }

  const allServices = [].concat(results[0], results[1]);
  const tableData = allServices.map((v) => v.service)
    // filter archived services?
    .filter((a) => {
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
    })
    .map((service) => {
      let rate = formater.budget(BUDGET_TYPE.CENTS, service.hourly_rate);
      if (!service.hourly_rate) {
        rate = '-';
      }
      return [
        service.id,
        service.name,
        service.billable ? 'yes' : 'no',
        rate,
        service.note.replace(/\r?\n/g, ' '),
      ].map(v => {
        if (service.archived) {
          return chalk.grey(v);
        }
        return v;
      });
    });
  tableData.unshift([
    'id',
    'name',
    'billable',
    'rate',
    'note',
  ].map(v=> chalk.bold(v)));
  const columns = {
    3: {
      alignment: 'right',
    },
    4: {
      width: 50,
      wrapWord: true,
    }
  };

  console.log(DataOutput.formatData(tableData, program.format, columns));
});
