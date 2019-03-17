#!/usr/bin/env node
'use strict'

const program = require('commander')
const opn = require('opn')
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')

program
  .version(pkg.version)
  .description('opens the given time entry in the browser', {
    timeEntryId: 'id of the entry which should be opened'
  })
  .arguments('<timeEntryId>')
  .action((timeEntryId) => {
    main(timeEntryId)
  })
  .parse(process.argv)

if (!program.args.length) {
  main(null)
}

function main(timeEntryId) {
  return new Promise((resolve, reject) => {
    if (!timeEntryId) {
      return resolve()
    }
    const mite = miteApi(config.get());
    mite.getTimeEntry(timeEntryId, (err, response) => {
      if (err) {
        return reject(err)
      }
      if (!response.time_entry) {
        return reject(new Error(`Unable to find time entry with the id "${timeEntryId}"`))
      }
      return resolve(response.time_entry)
    })
  })
  .then((entry) => {
    let url = 'https://' + config.get('account') + '.mite.yo.lk/';
    console.log('No time entry id given, opening the organisation’s account');
    if (entry) {
      url += 'daily/#' + (entry.date_at).replace('-', '/') + '?open=time_entry_' + entry.id
    }
    opn(url).then(() => {
      process.exit(0)
    })
  })
  .catch((err) => {
    console.error(err.message)
    console.error(err)
    process.exit(1)
  })
}
