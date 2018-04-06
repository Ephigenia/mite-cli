#!/usr/bin/env node
'use strict'

const program = require('commander')

const pkg = require('./../package.json')
const config = require('./config.js')

program
  .version(pkg.version)
  .description('start the tracker for the given id, will also stop allready running entry')
  .arguments('<timeEntryId>')
  .action((timeEntryId) => {
    const miteTracker = require('./lib/mite-tracker')(config.get())
    miteTracker.start(timeEntryId)
      .then(() => {
        console.log('Successfully started the time entry (id: %s)', timeEntryId);
      })
      .catch((err) => {
        console.log('Unable to start the time entry (id: %s): %s', timeEntryId, err.message);
        process.exit(1)
      })
  })
  .parse(process.argv)

if (!program.args.length) {
  program.help()
  process.exit()
}
