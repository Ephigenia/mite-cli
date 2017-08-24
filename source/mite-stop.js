#!/usr/bin/env node
'use strict'

const program = require('commander')

const pkg = require('./../package.json')
const config = require('./config.js')

program
  .version(pkg.version)
  .description('stop any running time entry')
  .parse(process.argv)

const miteTracker = require('./lib/mite-tracker')(config.get())
miteTracker.get()
  .then((response) => {
    if (!response.tracker || !response.tracker.tracking_time_entry) {
      throw new Error('There doesn’t seem to be a running time entry')
    }
    return response.tracker.tracking_time_entry.id;
  })
  .then((timeEntryId) => {
    return miteTracker.stop(timeEntryId)
  })
  .then(() => {
    console.log('Successfully stopped time tracking')
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1)
  })
