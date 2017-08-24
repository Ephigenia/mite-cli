#!/usr/bin/env node
'use strict'

const program = require('commander')

const pkg = require('./../package.json')
const config = require('./config.js')

program
  .version(pkg.version)
  .description('start tracking on a specific time entry')
  .arguments('<timeEntryId>')
  .action((timeEntryId) => {
    const miteTracker = require('./lib/mite-tracker')(config.get())
    miteTracker.start(timeEntryId)
      .then(() => {
        console.log(`Successfully started the time entry with the id "${timeEntryId}"`)
      })
      .catch((err) => {
        console.error(err.message)
        process.exit(1)
      })
  })
  .parse(process.argv)

if (!program.args.length) {
  program.help()
  process.exit()
}
