#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const tableLib = require('table')
const table = tableLib.table;
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')

function durationFromMinutes(minutes) {
  return (new Date(minutes * 60 * 1000)).toISOString().substr(11, 5)
}

// set a default period argument if not set
if (!process.argv[2] || process.argv[2].substr(0, 1) === '-' && process.argv[2] !== '--help') {
  process.argv.splice(2, 0, 'today')
}

program
  .version(pkg.version)
  .description('list time entries')
  .arguments('<period>')
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
    }

    if (program.from && program.to) {
      opts.from = program.from;
      opts.to = program.to;
      delete opts.at;
    }

    if (typeof program.billable === 'boolean') {
      opts.billable = program.billable
    }

    mite.getTimeEntries(opts, (err, results) => {
      if (err) {
        throw err;
      }


      const tableData = results.map((data, index) => {
        const timeEntry = data.time_entry;
        let minutes = timeEntry.minutes
        // detect time entries that are tracked (running) and add an indicator
        // to the table
        if (timeEntry.tracking) {
          minutes = timeEntry.tracking.minutes;
        }
        let duration = durationFromMinutes(minutes)
        // add a lock symbol to the duration when the time entry cannot be edited
        if (timeEntry.locked) {
          duration = chalk.green('✔') + ' ' + duration;
        }
        if (timeEntry.tracking) {
          duration = '▶ ' + duration;
        }
        let row = [
          index + 1,
          timeEntry.id,
          timeEntry.date_at,
          timeEntry.project_name,
          duration,
          (timeEntry.revenue / 100).toFixed(2),
          timeEntry.service_name,
          timeEntry.note
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
        '#', 'id', 'date', 'project', 'duration', 'revenue', 'service', 'note'
      ].map(function(v) { return chalk.bold(v); }))
      // sum up everything as last row
      tableData.push([
        null,
        null,
        null,
        null,
        chalk.bold(durationFromMinutes(minutesTotal)),
        chalk.bold((revenueTotal / 100).toFixed(2)),
        null,
        null,
      ])

      const tableConfig = {
        border: tableLib.getBorderCharacters('norc'),
        columns: {
          0: {
            width: 10,
            alignment: 'right',
          },
          1: {
            width: 10,
            alignment: 'right',
          },
          2: {
            width: 10,
            alignment: 'right',
          },
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
            width: 80,
            wrapWord: true,
            alignment: 'left',
          }
        }
      }
      console.log(table(tableData, tableConfig))
    }) // get time entries

  })
  .parse(process.argv)
