#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');

program
  .version(pkg.version)
  .description('stops any running time entry')
  .parse(process.argv);

const miteTracker = require('./lib/mite-tracker')(config.get());
miteTracker.get()
  .then((response) => {
    if (!response.tracker || !response.tracker.tracking_time_entry) {
      console.log('No running tracker found.');
      process.exit(0);
    }
    return response.tracker.tracking_time_entry.id;
  })
  .then((timeEntryId) => {
    return miteTracker.stop(timeEntryId).then(() => {
      console.log('Successfully stopped time tracking (id: %s)', timeEntryId);
    });
  })
  .catch((err) => {
    console.log('Error while stopping time entry: %s', err && err.message || err);
    process.exit(1);
  });
