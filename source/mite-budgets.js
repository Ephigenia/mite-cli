#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const Table = require('cli-table2')
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')

if (!process.argv[2]) {
  process.argv[2] = 'this_month'
}

program
  .version(pkg.version)
  .arguments('<period>')
  .description('show amount of used monthly budgets with time and money')
  .action((period) => {
    const mite = miteApi(config.get())

    // https://mite.yo.lk/en/api/time-entries.html
    const opts = {
      group_by: 'project',
      billable: 'true',
      at: period
    };
    mite.getTimeEntries(opts, (err, results) => {
      if (err) {
        throw err;
      }
      const table = new Table({
        head: ['id', 'project', 'days', 'revenue'],
        colAligns: ['right', null, 'right', 'right']
      });

      // format each table row
      Array.prototype.push.apply(table, results
        .map((entry) => entry.time_entry_group)
        .map((entry) => {
          return [
            entry.project_id,
            entry.project_name,
            (entry.minutes / 8 / 60).toFixed(2),
            (entry.revenue / 100).toFixed(2)
          ]
        })
      )

      // table footer with sums
      const minutesTotal = results
        .map(r => r.time_entry_group.minutes)
        .reduce((sum, cur) => sum + cur, 0)
      const revenueTotal = results
        .map(r => r.time_entry_group.revenue)
        .reduce((sum, cur) => sum + cur, 0)

      table.push([
        null,
        null,
        chalk.bold((minutesTotal / 8 / 60).toFixed(2)),
        chalk.bold((revenueTotal / 100).toFixed(2))
      ]);

      console.log(table.toString())
    });

  })
  .parse(process.argv)
