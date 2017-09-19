#!/usr/bin/env node
'use strict'

const program = require('commander')
const opn = require('opn')
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')

program
  .version(pkg.version)
  .description('opens the given time entry in the browser')
  .arguments('<timeEntryId>')
  .action((timeEntryId) => {
    const mite = miteApi(config.get())
    mite.getTimeEntry(timeEntryId, (err, response) => {
      if (err) {
        console.error('Error while retreiving time entry', err)
        process.exit(1)
      }
      if (!response.time_entry) {
        console.error('No time entry found')
        process.exit(1)
      }
      const entry = response.time_entry;
      // build url to the time entry to open in browser
      const url = 'https://' + config.get('account') + '.mite.yo.lk/daily/#'
        + (entry.date_at).replace('-', '/')
        + '?open=time_entry_' + timeEntryId
      opn(url).then(() => {
        console.log('Ok, bye then …')
      })
    })
  })
  .parse(process.argv)

if (!program.args.length) {
  program.help()
  process.exit()
}
