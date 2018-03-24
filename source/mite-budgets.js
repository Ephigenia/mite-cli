#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const miteApi = require('mite-api')
const tableLib = require('table')
const table = tableLib.table;

const pkg = require('./../package.json')
const config = require('./config.js')
const formater = require('./lib/formater');
const BUDGET_TYPE = formater.BUDGET_TYPE;

// set a default period argument if not set
if (!process.argv[2] || process.argv[2].substr(0, 1) === '-' && process.argv[2] !== '--help') {
  process.argv.splice(2, 0, 'this_month')
}

program
  .version(pkg.version)
  .arguments('<period>')
  .option(
    '--project_id <project_id>',
    'project id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .option(
    '--customer_id <customer_id>',
    'customer id, can be either a single ID, or multiple comma-separated IDs.'
  )
  .description('show amount of used monthly budgets with time and money')
  .action((period) => {
    const mite = miteApi(config.get())

    // https://mite.yo.lk/en/api/time-entries.html
    const opts = {
      group_by: 'project',
      billable: 'true',
      at: period,
      project_id: program.project_id,
      customer_id: program.customer_id
    };
    mite.getTimeEntries(opts, (err, results) => {
      if (err) {
        throw err;
      }

      // format each table row
      const tableData = results
        .map((entry) => entry.time_entry_group)
        .map((entry) => {
          let revenue = formater.budget(BUDGET_TYPE.CENTS, entry.revenue || 0);
          if (entry.revenue === null) {
            revenue = '-'
          }
          return [
            entry.project_id,
            entry.project_name,
            formater.minutesToDuration(entry.minutes || 0),
            formater.minutesToWorkDays(entry.minutes || 0),
            revenue,
          ]
        })

      // table footer with sums
      const minutesTotal = results
        .map(r => r.time_entry_group.minutes)
        .reduce((sum, cur) => sum + cur, 0)
      const revenueTotal = results
        .map(r => r.time_entry_group.revenue)
        .reduce((sum, cur) => sum + cur, 0)

      // header
      tableData.unshift(
        ['id', 'project', 'duration', 'days', 'revenue']
        .map(function(v) {
          return chalk.bold(v);
        })
      )
      // footer
      tableData.push([
        '',
        '',
        formater.minutesToDuration(minutesTotal),
        formater.minutesToWorkDays(minutesTotal),
        formater.budget(BUDGET_TYPE.CENTS, revenueTotal)
      ].map(s => chalk.bold(s)));

      const tableConfig = {
        border: tableLib.getBorderCharacters('norc'),
        columns: {
          0: {
            width: 10,
            alignment: 'right',
          },
          1: { // project
            width: 20,
            wrapWord: true,
            alignment: 'right',
          },
          2: { // duration
            width: 10,
            alignment: 'right',
          },
          3: { // days
            width: 10,
            alignment: 'right',
          },
          4: {
            width: 10,
            alignment: 'right',
          },
        }
      }

      console.log(table(tableData, tableConfig))
    });

  })
  .parse(process.argv)
