#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');
const miteApi = require('mite-api');

const pkg = require('./../package.json');
const config = require('./config');
const formater = require('./lib/formater');
const DataOutput = require('./lib/data-output');
const listCommand = require('./lib/commands/list');

// set a default period argument if not set
if (!process.argv[2] || process.argv[2].substr(0, 1) === '-' && process.argv[2] !== '--help') {
  process.argv.splice(2, 0, 'today');
}

program
  .version(pkg.version)
  .description('list time entries', {
    period:
      'name of the period for which the time entries should be shown' +
      'or a single date. F.e. "today" or "last_week or "2019-03-17"'
  })
  .arguments('<period>')
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
    '--columns <columns>',
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(listCommand.columns.options).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    config.get().listColumns
  )
  .option(
    '--customer_id <customer_id>',
    'customer id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
  )
  .option(
    '--from <period|YYYY-MM-DD>',
    'in combination with "to" used for selecting a specific time frame of ' +
    'time entries to return, same as "period" argument or a specific date in ' +
    'the format "YYYY-MM-DD". The period argument is ignored.'
  )
  .option(
    '--group_by <value>',
    'optional group_by parameter which should be used. Valid values are ' +
    listCommand.groupBy.options.join(', ')
  )
  .option(
    '-l, --limit <limit>',
    'numeric number of items to return (default 100)',
    100,
    ((val) => parseInt(val, 10))
  )
  .option(
    '--locked <true|false>',
    'filter entries by their locked status',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    })
  )
  .option(
    '--project_id <project_id>',
    'project id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--to <period|YYYY-MM-DD>',
    'in combination with "from" used for selecting a specific time frame of ' +
    'time entries to return, same as "period" argument or a specific date in ' +
    'the format "YYYY-MM-DD". The period argument is ignored.'
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
    '-s --search <query>',
    'search within the notes, to filter by multiple criteria connected with OR use comma-separated query values',
    ((val) => {
      if (typeof val === 'string') {
        return val.split(/\s*,\s*/);
      }
      return val;
    })
  )
  .option(
    '--service_id <service_id>',
    'service id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--sort <column>',
    `optional column the results should be sorted `+
    `(default: "${listCommand.sort.default}"), ` +
    `valid values: ${listCommand.sort.options.join(', ')}`,
    (value) => {
      if (listCommand.sort.options.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          listCommand.sort.options.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    listCommand.sort.default
  )
  .option(
    '--user_id <user_id>',
    'optional single user_id who’s time entries should be returned or ' +
    'multiple values comma-separated. Note that the current user may not ' +
    'have the permission ot read other user’s time entries which will result ' +
    'in an empty response',
    ((val) => {
      if (typeof val === 'string') {
        return val.split(/\s*,\s*/);
      }
      return val;
    })
  )
  .on('--help', function() {
    console.log(`
Examples:

  list all entries from the current month:
    mite list this_month

  list all entries which note contains the given search query:
    mite list this_year --search JIRA-123

  show all users who tracked billable entries ordered by the amount of time they have tracked:
    mite list this_year --billable true --columns=user,duration --group_by=user --sort=duration

  export all time-entries from the current month as csv
    mite list last_week --format=csv --columns=user,id

  create a markdown report of all customer and their generated profits
    mite list this_year --format=md --group_by=customer --sort=revenue

  The output of mite list can be forwarded to other commands using xargs. The
  following example will delete all matchin entries:
    mite list this_month --search="query" --columns id --format=text | xargs -n1 mite delete
`);
  })
  .action(main)
  .parse(process.argv);


function main(period) {
  const mite = miteApi(config.get());

  const opts = {
    at: period,
    ...(typeof program.billable === 'boolean' && { billable: program.billable }),
    customer_id: program.customer_id,
    group_by: program.group_by,
    limit: program.limit,
    ...(typeof program.locked === 'boolean' && { locked: program.locked }),
    note: program.search,
    project_id: program.project_id,
    service_id: program.service_id,
    sort: program.sort,
    ...(typeof program.tracking === 'boolean' && { tracking: program.tracking }),
    ...(program.user_id && { user_id: program.user_id}),
  };

  if (program.from && program.to) {
    opts.from = program.from;
    opts.to = program.to;
    delete opts.at;
  }

  const columns = program.columns
    .split(',')
    .map(attrName => {
      const columnDefinition = listCommand.columns.options[attrName];
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
          groupedTimeEntry.revenue === null ? '-' : formater.budget(formater.BUDGET_TYPE.CENTS, groupedTimeEntry.revenue || 0),
        ].filter((v) => (typeof v !== 'undefined'));
      });

      const columnCount = tableData[0].length;

      // add one last row which contains minutes & revenue sums
      const footerRow = new Array(columnCount);
      const revenueSum = timeEntryGroups.reduce((v, a) => {
        return v + a.revenue || 0;
      }, 0);
      footerRow[columnCount - 1] = formater.budget(formater.BUDGET_TYPE.CENTS, revenueSum || 0);
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
    });

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
  })
} // main
