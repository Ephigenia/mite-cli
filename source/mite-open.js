#!/usr/bin/env node
'use strict';

const program = require('commander');
const open = require('open');
const miteApi = require('mite-api');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .description(
    'Opens the organization’s mite homepage in the systems default browser. ' +
    'When timeEntryId is provided, opens up the edit form of that entry.',
    {
      timeEntryId: 'optional time-entry id which should be opened in the browser'
    }
  )
  .addHelpText('after', `

Examples:

  Open the organizations mite homepage in the system’s default browser:
    mite open

  Open the given time entry detail page in the default browser:
    mite open 128372
  `);

function main(timeEntryId) {
  return new Promise((resolve, reject) => {
    if (!timeEntryId) {
      return resolve();
    }
    const mite = miteApi(config.get());
    mite.getTimeEntry(timeEntryId, (err, response) => {
      if (err) {
        return reject(err);
      }
      if (!response.time_entry) {
        return reject(new Error(`Unable to find time entry with the id "${timeEntryId}"`));
      }
      return resolve(response.time_entry);
    });
  })
  .then((entry) => {
    let url = `https://${config.get('account')}.mite.de/`;
    process.stdout.write('No time entry id given, opening the organisation’s account\n');
    if (entry) {
      url += 'daily/#' + (entry.date_at).replace('-', '/') + '?open=time_entry_' + entry.id;
    }
    open(url).then(() => process.exit(0));
  })
  .catch(handleError);
}


try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
