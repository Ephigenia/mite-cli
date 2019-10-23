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
const columnOptions = require('./lib/options/columns');
const commandOptions = require('./lib/options');
const { handleError } = require('./lib/errors');

// no other options or comamnd line arguments used, default "period" to "today"
if (process.argv.length === 2) {
  process.argv.splice(2, 0, 'today');
}

program
  .version(pkg.version)
  .arguments('<period>')
  .description('list time entries', {
    period:
      `name of the period for which the time entries should be shown. \
Can be single dates, duraions and weekday names: \n\
- "today" shows todays time entries (default)\n\
- "last_week" or "last-week" shows entries from the whole last week\n\
- "7days", "2days", "3m" shows time entries since 7 days, 2days or 3 months\n\
- "2019-10-12" shows all entries from that exact date\n\
- "friday", "fr" or other weekday names or abbreviations show all entries since \
  this last weekday`
  })
  .option.apply(program, commandOptions.toArgs(commandOptions.billable),
    'show entries which are billable or not billable'
  )
  .option(
    '--columns <columns>',
    columnOptions.description(listCommand.columns.options),
    columnOptions.parse
  )
  .option(
    '--customer-id <id>',
    'customer id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.format, null, config.get('outputFormat')))
  .option(
    '--from <period|YYYY-MM-DD>',
    'in combination with "to" used for selecting a specific time frame of ' +
    'time entries to return, same as "period" argument or a specific date in ' +
    'the format "YYYY-MM-DD". The period argument is ignored.'
  )
  .option(
    '--group-by <column>',
    'optional grouping parameter which should be used. Valid values are ' +
    listCommand.groupBy.options.join(', ')
  )
  .option(
    '-l, --limit <limit>',
    'optional number of items to show, default is infinite',
    undefined,
    ((val) => parseInt(val, 10))
  )
  .option(
    '--locked <true|false>',
    'filter entries by their locked status',
    (val => ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1),
    null
  )
  .option(
    '--min-duration <minDuration>',
    'filter out entries which have a duration below the given value (client side)',
  )
  .option(
    '--max-duration <maxDuration>',
    'filter out entries which have a duration above the given value (client side)',
  )
  .option(
    '--project-id <id>',
    'project id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--to <period|YYYY-MM-DD>',
    'in combination with "from" used for selecting a specific time frame of ' +
    'time entries to return, same as "period" argument or a specific date in ' +
    'the format "YYYY-MM-DD". The period argument is ignored.'
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.tracking))
  .option(
    '--reversed',
    'reverse the sorting direction',
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
    '--service-id <id>',
    'service id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(listCommand.sort.options),
    listCommand.sort.default
  ))
  .option(
    '--user-id <id>',
    'optional single user id who’s time entries should be returned or ' +
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

  show all entries from two services 123 and 38171
    mite list last_month --service-id 123,38171

  show all time entries from a specific date
    mite list 2019-10-21

  show time entries from last thursday
    mite list thursday

  show all users who tracked billable entries ordered by the amount of time
  they have tracked:
    mite list this_year --billable true --columns user,duration --group-by user --sort duration

  export all time-entries from the current month as csv:
    mite list last_week --format csv --columns user,id

  create a markdown report of all customer and their generated profits:
    mite list this_year --format md --group-by customer --sort revenue

  The output of mite list can be forwarded to other commands using xargs. The
  following example will delete all matchin entries:
    mite list this_month --search="query" --columns id --format text | xargs -n1 mite delete

  Get the notes for one specific service, project for the last month to put
  them on a bill or similar
    mite list last_month --project-id 2681601 --service-id 325329 --columns note --format text | sort -u

  Show a seperate report for all users showing the revenues and times per
  service for all users matching a query:
    mite users --search marc --columns id --format text | xargs mite list last_month --group-by service --user-id

`);
  })
  .parse(process.argv);

/**
 * Returns the request options for requesting the time entries or grouped
 * time entries for the given time entries and filtering options.
 *
 * @param {string} period
 * @param {object} program
 * @return {Object<String, any>} time entries or grouped time entries
 */
function getRequestOptions(period, program) {
  // use notation of "3d" or "5w" to translate into from and to time periods
  const matches = String(period).match(/^(\d+)(d|w|m|day|week|month)s$/);
  if (matches) {
    const from = new Date();
    switch(matches[2]) {
      case 'd':
      case 'day':
        from.setDate(from.getDate() - parseInt(matches[1], 10));
        break;
      case 'w':
      case 'week':
          from.setDate(from.getDate() - parseInt(matches[1], 10) * 7);
        break;
      case 'm':
      case 'month':
        from.setMonth(from.getMonth() - parseInt(matches[1], 10));
        break;
    }
    program.from = from.toISOString().substr(0, 10);
    program.to = (new Date).toISOString().substr(0, 10);
    period = undefined;
  }
  // mite’s "periods" strings using underscore like in "this_month", "this_week"
  // but sometimes the user enters a minus instead of underscore, then replace
  // it
  if (typeof period === 'string') {
    if (!period.match(/[\d]+/)) {
      period = period.replace(/-/g, '_');
    }

    // check if the period is a week day name and calculate the date of this
    // weekday, f.e. "friday" from last week becomes the date a string
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const matchingWeekday = weekdays.find(weekday => {
      return (
        weekday === period ||
        period.toLowerCase() === weekday.toLowerCase() ||
        period.toLowerCase() === weekday.substr(0, 2)
      );
    });
    if (matchingWeekday) {
      const weekdayIndex = weekdays.indexOf(matchingWeekday);
      const todayIndex = (new Date).getDay();
      const now = new Date();
      if (todayIndex <= weekdayIndex) {
        now.setDate(now.getDate() - (7 - weekdayIndex + todayIndex));
      } else {
        now.setDate(now.getDate() - weekdayIndex - 1);
      }
      period = now.toISOString().substr(0, 10);
    }
  }

  const data = {
    ...(typeof program.billable === 'boolean' && { billable: program.billable }),
    ...(program.customerId && { customer_id: program.customerId }),
    ...(program.reversed && { direction: 'asc' }),
    ...(program.groupBy && { group_by: program.groupBy }),
    ...(program.limit && { limit: program.limit }),
    ...(typeof program.locked === 'boolean' && { locked: program.locked }),
    ...(program.search && { note: program.search }),
    ...(program.projectId && { project_id: program.projectId }),
    ...(program.serviceId && { service_id: program.serviceId }),
    ...(program.sort && { sort: program.sort }),
    ...(typeof program.tracking === 'boolean' && { tracking: program.tracking }),
    ...(program.userId && { user_id: program.userId}),
  };

  // add optional time period using from & to
  if (program.from && program.to) {
    data.from = program.from;
    data.to = program.to;
  } else if (period) {
    data.at = period;
  }

  return data;
}

/**
 * Callback function to filter time entries which are shown depending on the
 * command line options
 *
 * @param {object} program
 * @param {MiteTimeEntry} entry
 * @return {boolean}
 */
function filterData(program, row) {
  let valid = true;
  if (program.minDuration) {
    const minDuration = formater.durationToMinutes(program.minDuration, 10);
    valid &= row.minutes >= minDuration;
  }
  if (program.maxDuration) {
    const maxDuration = formater.durationToMinutes(program.maxDuration, 10);
    valid &= row.minutes <= maxDuration;
  }
  return valid;
}

function getReport(items, columns, format) {
  const tableData = DataOutput.compileTableData(items, columns, format);

  // Table footer
  // add table footer if any of the table columns has a reducer
  if (columnOptions.hasReducer(columns)) {
    let footerColumns = DataOutput.getTableFooterColumns(items, columns);
    footerColumns = footerColumns.map(v => v ? chalk.bold(v) : v); // make footer bold
    tableData.push(footerColumns);
  }

  return DataOutput.formatData(tableData, format, columns);
}

function main(period) {
  const mite = miteApi(config.get());

  const requestOpts = getRequestOptions(period, program);
  // "columns" default option is different
  if (!program.columns) {
    // when groupBy is used, make sure that revenue and duration are used
    if (program.groupBy) {
      program.columns = program.groupBy + ',revenue,duration';
    } else {
      program.columns = config.get().listColumns;
    }
  }
  const columns = columnOptions.resolve(program.columns, listCommand.columns.options);

  mite.getTimeEntries(requestOpts, (err, results) => {
    if (err) return handleError(err);

    // decide wheter to output grouped report or single entry report
    let items = results
      .map(data => data[program.groupBy ? 'time_entry_group' : 'time_entry'])
      .filter(v => v)
      .filter(filterData.bind(this, program))
      ;
    const report = getReport(items, columns, program.format);
    console.log(report);
  });
} // main

const period = program.args[0];
main(period);
