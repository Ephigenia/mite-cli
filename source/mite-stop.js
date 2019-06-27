#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, GeneralError } = require('./lib/errors');

function main() {
  const miteTracker = require('./lib/mite-tracker')(config.get());
  return miteTracker.get()
    .then(id => {
      if (!id) {
        throw new GeneralError('No running time entry found.');
      }
      return miteTracker.stop(id);
    })
    .then((id) => console.log(
      `Successfully stopped time entry (id: ${id})`
    ))
    .catch(handleError);
}

try {
  program
    .version(pkg.version)
    .description('stops any running time entry')
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
