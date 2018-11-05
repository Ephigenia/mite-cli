#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const tableLib = require('table')
const table = tableLib.table;
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')
const formater = require('./lib/formater');

const SORT_OPTIONS = [
  'date',
  'user',
  'customer',
  'project',
  'service',
  'note',
  'minutes',
  'revenue',
];
const SORT_OPTIONS_DEFAULT = 'date';
const BUDGET_TYPE = formater.BUDGET_TYPE;

const GROUP_BY_OPTIONS = [
  'user',
  'customer',
  'project',
  'service',
  'day',
  'week',
  'month',
  'year',
];

// set a default period argument if not set
if (!process.argv[2] || process.argv[2].substr(0, 1) === '-' && process.argv[2] !== '--help') {
  process.argv.splice(2, 0, 'today')
}

program
  .version(pkg.version)
  .description('list time entries')
  .arguments('<period>')
  .option(
    '--group_by <value>',
    'optional group_by parameter which should be used. Valid values are ' +
    GROUP_BY_OPTIONS.join(', ')
  )
  .option(
    '--user_id <user_id>',
    'optional single user_id who’s time entries should be returned or ' +
    'multiple values comma-separated. Note that the current user may not ' +
    'have the permission ot read other user’s time entries which will result ' +
    'in an empty response',
    ((val) => {
      if (typeof val === 'string') {
        return val.split(/\s*,\s*/)
      }
      return val
    })
  )
  .option(
    '--project_id <project_id>',
    'project id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--customer_id <customer_id>',
    'customer id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--service_id <service_id>',
    'service id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--sort <column>',
    `optional column the results should be sorted `+
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
  .option(
    '--billable <true|false>',
    'wheter to show only billable or not-billable entries, all kinds of entries are returned by default',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    })
  )
  .option(
    '--tracking <true|false>',
    'wheter to show only currently running entries or not running entries',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    })
  )
  .option(
    '--from <period|YYYY-MM-DD>',
    'in combination with "to" used for selecting a specific time frame of ' +
    'time entries to return, same as "period" argument or a specific date in ' +
    'the format "YYYY-MM-DD". The period argument is ignored.'
  )
  .option(
    '--to <period|YYYY-MM-DD>',
    'in combination with "from" used for selecting a specific time frame of ' +
    'time entries to return, same as "period" argument or a specific date in ' +
    'the format "YYYY-MM-DD". The period argument is ignored.'
  )
  .option(
    '-s --search <query>',
    'search within the notes, to filter by multiple criteria connected with OR use comma-separated query values',
    ((val) => {
      if (typeof val === 'string') {
        return val.split(/\s*,\s*/)
      }
      return val
    })
  )
  .option(
    '-l, --limit <limit>',
    'numeric number of items to return (default 100)',
    100,
    ((val) => parseInt(val, 10))
  )
  .action((period) => {
    const mite = miteApi(config.get())
    const opts = {
      at: period,
      customer_id: program.customer_id,
      limit: program.limit,
      note: program.search,
      project_id: program.project_id,
      service_id: program.service_id,
      group_by: program.group_by,
      sort: program.sort,
    }

    if (program.user_id) {
      opts.user_id = program.user_id;
    }

    if (program.from && program.to) {
      opts.from = program.from;
      opts.to = program.to;
      delete opts.at;
    }

    if (typeof program.tracking === 'boolean') {
      opts.tracking = program.tracking;
    }
    if (typeof program.billable === 'boolean') {
      opts.billable = program.billable
    }

    mite.getTimeEntries(opts, (err, results) => {
      if (err) {
        throw err;
      }

      // decide wheter to output grouped report or single entry report
      const groupedResults = results
        .map((r) => r.time_entry_group)
        .filter((v) => v);
      if (groupedResults.length > 0) {
        const tableData = groupedResults.map((groupedTimeEntry) => {
          const row = [
            groupedTimeEntry.year,
            groupedTimeEntry.month,
            groupedTimeEntry.week,
            groupedTimeEntry.day,
            groupedTimeEntry.customer_name || groupedTimeEntry.customer_id,
            groupedTimeEntry.user_name,
            groupedTimeEntry.project_name || groupedTimeEntry.project_id,
            groupedTimeEntry.service_name || groupedTimeEntry.service_id,
            formater.minutesToDuration(groupedTimeEntry.minutes || 0),
            groupedTimeEntry.revenue === null ? '-' : formater.budget(BUDGET_TYPE.CENTS, groupedTimeEntry.revenue || 0),
          ]
          .filter((v) => (typeof v !== 'undefined'));
          return row;
        });

        const columnCount = tableData[0].length;

        // add one last row which contains minutes & revenue sums
        const footerRow = new Array(columnCount);
        const revenueSum = groupedResults.reduce((v, a) => {
          return v + a.revenue || 0;
        }, 0);
        footerRow[columnCount - 1] = formater.budget(BUDGET_TYPE.CENTS, revenueSum || 0);
        const minutesSum = groupedResults.reduce((v, a) => {
          return v + a.minutes || 0;
        }, 0);
        footerRow[columnCount - 2] = formater.minutesToDuration(minutesSum);
        tableData.push(footerRow.map(v => chalk.yellow(v)));

        const tableConfig = {
          border: tableLib.getBorderCharacters('norc'),
          columns: {}
        };
        tableConfig.columns[columnCount - 2] = tableConfig.columns[columnCount - 1] = {
          alignment: 'right'
        };

        console.log(table(tableData, tableConfig));
        process.exit(0);
      } // end grouped reports

      const tableData = results.map((data) => {
        const timeEntry = data.time_entry;
        let minutes = timeEntry.minutes
        // detect time entries that are tracked (running) and add an indicator
        // to the table
        if (timeEntry.tracking) {
          minutes = timeEntry.tracking.minutes;
        }
        let duration = formater.minutesToDuration(minutes)
        // add a lock symbol to the duration when the time entry cannot be edited
        if (timeEntry.locked) {
          duration = chalk.green('✔') + ' ' + duration;
        }
        if (timeEntry.tracking) {
          duration = '▶ ' + duration;
        }
        let revenue = formater.budget(BUDGET_TYPE.CENTS, timeEntry.revenue || 0);
        if (!timeEntry.revenue) {
          revenue = '-';
        }
        let row = [
          timeEntry.id,
          timeEntry.date_at,
          timeEntry.user_name,
          timeEntry.project_name || '-',
          duration,
          revenue,
          timeEntry.service_name || '-',
          formater.note(timeEntry.note)
        ]
        if (timeEntry.tracking) {
          row = row.map((v) => chalk.yellow(v))
        }
        if (timeEntry.locked) {
          row = row.map((v) => chalk.grey(v))
        }
        return row;
      })

      const minutesTotal = results.reduce((sum, cur) => {
        return sum + cur.time_entry.minutes;
      }, 0)
      const revenueTotal = results.reduce((sum, cur) => {
        return sum + cur.time_entry.revenue;
      }, 0)

      tableData.unshift([
        'id', 'date', 'user', 'project', 'duration', 'revenue', 'service', 'note'
      ].map(function(v) { return chalk.bold(v); }))
      // sum up everything as last row
      tableData.push([
        null,
        null,
        null,
        null,
        chalk.bold(formater.minutesToDuration(minutesTotal)),
        chalk.bold(formater.budget(BUDGET_TYPE.CENTS, revenueTotal)),
        null,
        null,
      ])

      const tableConfig = {
        border: tableLib.getBorderCharacters('norc'),
        columns: {
          0: { // id
            width: 10,
            alignment: 'right',
          },
          1: { // date
            width: 10,
            alignment: 'right',
          },
          // user
          // no-definition
          3: { // project
            width: 20,
            alignment: 'right',
            wrapWord: true,
          },
          4: { // duration
            width: 10,
            alignment: 'right',
          },
          5: { // revenue
            width: 10,
            alignment: 'right',
          },
          6: { // service
            width: 20,
            wrapWord: true,
            alignment: 'right',
          },
          7: { // note
            width: 70,
            wrapWord: true,
            alignment: 'left',
          }
        }
      }
      console.log(table(tableData, tableConfig))
    }) // get time entries

  })
  .parse(process.argv)
