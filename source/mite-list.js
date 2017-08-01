#!/usr/bin/env node
'use strict'

const program = require('commander')
const chalk = require('chalk')
const Table = require('cli-table2')
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')

function durationFromMinutes(minutes) {
  return (new Date(minutes * 60 * 1000)).toISOString().substr(11, 5)
}

program
  .version(pkg.version)
  .description('list time entries')
  .parse(process.argv)

const mite = miteApi(config.get())
const at = process.argv[2] || 'today'
const opts = { at }
mite.getTimeEntries(opts, (err, results) => {
  if (err) {
    throw err;
  }

  const table = new Table({
    wordWrap: true,
    colWidths:[ null, null, null, null, null, null, 50],
    colAligns: [null, null, 'right', 'right', 'right', null],
    head: ['#', 'date', 'project', 'duration', 'revenue', 'service', 'note']
  })

  // format each time entry and add it to the report table
  Array.prototype.push.apply(table, results.map((data, index) => {
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
      duration = '🔒 ' + duration;
    }
    let row = [
      index + 1,
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
  }))

  const minutesTotal = results.reduce((sum, cur) => {
    return sum + cur.time_entry.minutes;
  }, 0)
  const revenueTotal = results.reduce((sum, cur) => {
    return sum + cur.time_entry.revenue;
  }, 0)

  // sum up everything as last row
  table.push([
    null,
    null,
    null,
    chalk.bold(durationFromMinutes(minutesTotal)),
    chalk.bold((revenueTotal / 100).toFixed(2))
  ])

  // show list to choose from
  console.log(table.toString())
}) // get time entries
