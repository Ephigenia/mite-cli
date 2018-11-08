#!/usr/bin/env node
'use strict'

const program = require('commander')
const assert = require('assert');
const chalk = require('chalk')
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')
const formater = require('./lib/formater');
const DataOutput = require('./lib/data-output');

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

const OUTPUT_FORMAT_OPTIONS = ['table', 'csv', 'tsv'];

const COLUMNS_OPTIONS_DEFAULT = 'id,date,user,project,duration,revenue,service,note';
const COLUMNS_OPTIONS = {
  billable: {
    label: 'billable',
    attribute: 'billable',
    format: (value) => {
      return value ? 'yes' : 'no'
    }
  },
  created: {
    label: 'Created',
    attribute: 'created_at',
  },
  customer: {
    label: 'Customer',
    attribute: 'customer_name',
  },
  customer_id: {
    label: 'Customer ID',
    attribute: 'customer_id',
  },
  date: {
    label: 'Date',
    attribute: 'date_at',
    width: 10,
    alignment: 'right'
  },
  duration: {
    label: 'Duration',
    attribute: 'minutes',
    width: 10,
    alignment: 'right',
    format: (value, timeEntry) => {
      if (timeEntry && timeEntry.tracking) {
        value = timeEntry.tracking.minutes;
      }
      let duration = formater.minutesToDuration(value);
      if (timeEntry && timeEntry.locked) {
        duration = chalk.green('✔') + ' ' + duration;
      }
      if (timeEntry && timeEntry.tracking) {
        duration = '▶ ' + duration;
      }
      return duration;
    },
    reducer: (sum, cur) => {
      if (!sum) sum = 0;
      return sum + cur.minutes;
    }
  },
  hourly_rate: {
    label: 'Rate',
    attribute: 'hourly_rate',
  },
  id: {
    label: 'ID',
    attribute: 'id',
    width: 10,
    alignment: 'right',
  },
  locked: {
    label: 'Locked',
    attribute: 'locked',
    format: (value) => {
      return value ? 'yes' : 'no'
    }
  },
  minutes: {
    label: 'Minutes',
    attribute: 'minutes',
    reducer: (sum, cur) => {
      return sum + cur.minutes;
    }
  },
  note: {
    label: 'Note',
    attribute: 'note',
    width: 70,
    wrapWord: true,
    alignment: 'left',
    format: formater.note,
  },
  project: {
    label: 'Project',
    attribute: 'project_name',
    width: 20,
    alignment: 'right',
    wrapWord: true,
  },
  project_id: {
    label: 'Project ID',
    attribute: 'project_id',
  },
  revenue: {
    label: 'Revenue',
    attribute: 'revenue',
    width: 10,
    alignment: 'right',
    format: (value) => {
      if (!value) {
        return '-';
      }
      return formater.budget(BUDGET_TYPE.CENTS, value || 0);
    },
    reducer: (sum, cur) => {
      if (!sum) sum = 0;
      return sum + cur.minutes;
    }
  },
  service: {
    label: 'Service',
    attribute: 'service_name',
    width: 20,
    alignment: 'right',
  },
  service_id: {
    label: 'Service ID',
    attribute: 'service_id',
  },
  updated: {
    label: 'Updated',
    attribute: 'updated',
  },
  user: {
    attribute: 'user_name',
    label: 'User',
  },
  user_id: {
    label: 'User ID',
    attribute: 'user_id',
  },
};

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
    '--columns <columns>',
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(COLUMNS_OPTIONS).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    COLUMNS_OPTIONS_DEFAULT
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
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    'table',
  )
  .action(main)
  .parse(process.argv)


function main(period) {
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



  const columns = program.columns
    .split(',')
    .map(attrName => {
      const columnDefinition = COLUMNS_OPTIONS[attrName];
      if (!columnDefinition) {
        console.error('Invalid column name "' + attrName + '"');
        process.exit(2);
      }
      return columnDefinition;
    });

  mite.getTimeEntries(opts, (err, results) => {
    if (err) {
      throw err;
    }

    const timeEntries = results.map(data => data.time_entry).filter(v => v);
    const timeEntryGroups = results.map(data => data.time_entry_group).filter(v => v);

    // decide wheter to output grouped report or single entry report
    if (timeEntryGroups.length > 0) {
      const tableData = timeEntryGroups.map((groupedTimeEntry) => {
        return [
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
        ].filter((v) => (typeof v !== 'undefined'));
      });

      const columnCount = tableData[0].length;

      // add one last row which contains minutes & revenue sums
      const footerRow = new Array(columnCount);
      const revenueSum = timeEntryGroups.reduce((v, a) => {
        return v + a.revenue || 0;
      }, 0);
      footerRow[columnCount - 1] = formater.budget(BUDGET_TYPE.CENTS, revenueSum || 0);
      const minutesSum = timeEntryGroups.reduce((v, a) => {
        return v + a.minutes || 0;
      }, 0);
      footerRow[columnCount - 2] = formater.minutesToDuration(minutesSum);
      tableData.push(footerRow.map(v => chalk.yellow(v)));

      console.log(DataOutput.formatData(tableData, program.format));
      process.exit(0);
    } // end grouped reports

    const tableData = timeEntries.map((timeEntry) => {
      let row = columns.map(columnDefinition => {
        const value = timeEntry[columnDefinition.attribute];
        if (columnDefinition.format) {
          return columnDefinition.format(value, timeEntry);
        }
        return value;
      });

      // colorize the whole row when it’s actively tracked or archived
      if (timeEntry.tracking) {
        row = row.map(v => chalk.yellow(v));
      }
      if (timeEntry.locked) {
        row = row.map(v => chalk.grey(v));
      }

      return row;
    })

    // Table footer
    // add table footer if any of the table columns has a reducer
    if (columns.find(c => c.reducer)) {
      tableData.push(
        columns
          .map(columnDefinition => {
            let columnSum;
            if (columnDefinition.reducer) {
              columnSum = timeEntries.reduce(columnDefinition.reducer, null);
            }
            if (columnSum && columnDefinition.format) {
              return columnDefinition.format(columnSum);
            }
            return columnSum || '';
          })
          .map(v => chalk.bold(v))
      );
    }

    // Table header
    tableData.unshift(
      columns
        .map(columnDefinition => columnDefinition.label)
        .map(v => chalk.bold(v))
    );

    console.log(DataOutput.formatData(tableData, program.format, columns));
  }) // get time entries
}
