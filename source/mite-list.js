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
  .option.apply(program, commandOptions.toArgs(commandOptions.billable),
    'show entries which are billable or not billable'
  )
  .option(
    '--columns <columns>',
    columnOptions.description(listCommand.columns.options),
    columnOptions.parse,
    config.get().listColumns
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
  .action(main)
  .parse(process.argv);

function groupedTable(timeEntryGroups) {
  return timeEntryGroups.map((groupedTimeEntry) => {
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
      formater.budget(formater.BUDGET_TYPE.CENTS, groupedTimeEntry.revenue || 0),
    ].filter(v => v);
  });
}

/**
 * Returns the request options for requesting the time entries or grouped
 * time entries for the given time entries and filtering options.
 *
 * @param {string} period
 * @param {object} program
 * @return {Object<String>} time entries or grouped time entries
 */
function getRequestOptions(period, program) {
  const data = {
    ...(typeof program.billable === 'boolean' && { billable: program.billable }),
    ...(program.customerId && { customer_id: program.customerId }),
    ...(program.reversed && { direction: 'desc' }),
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
    delete data.at;
  } else {
    data.at = period;
  }

  return data;
}

function getGroupedReport(timeEntryGroups, format) {
  const tableData = groupedTable(timeEntryGroups);
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

  return DataOutput.formatData(tableData, format);
}

function getNormalReport(items, columns, format) {
  const tableData = DataOutput.compileTableData(items, columns);

  // Table footer
  // add table footer if any of the table columns has a reducer
  if (columnOptions.hasReducer(columns)) {
    let footerColumns = DataOutput.getTableFooterColumns(items, columns);
    footerColumns = footerColumns.map(v => chalk.bold(v)); // make footer bold
    tableData.push(footerColumns);
  }

  return DataOutput.formatData(tableData, format, columns);
}

function main(period) {
  const mite = miteApi(config.get());

  const opts = getRequestOptions(period, program);
  const columns = columnOptions.resolve(program.columns, listCommand.columns.options);

  mite.getTimeEntries(opts, (err, results) => {
    if (err) throw err;

    const timeEntries = results.map(data => data.time_entry).filter(v => v);
    const timeEntryGroups = results.map(data => data.time_entry_group).filter(v => v);

    // decide wheter to output grouped report or single entry report
    if (timeEntryGroups.length) {
      console.log(getGroupedReport(timeEntryGroups, program.format));
    } else {
      console.log(getNormalReport(timeEntries, columns, program.format));
    }
  });
} // main
