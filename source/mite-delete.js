#!/usr/bin/env node
'use strict';

const program = require('commander');
const miteApi = require('mite-api');

const pkg = require('./../package.json');
const config = require('./config.js');

program
  .version(pkg.version)
  .description('deletes a allready existing time entry', {
    timeEntryId: 'The id of the time entry which should be deleted'
  })
  .arguments('<timeEntryId>')
  .on('--help', function() {
    console.log(`
  Examples:

    Delete a single entry identified by it’s id:
      mite delete 1283761

    Delete multiple entries from a project selected by using mite list:
      mite list this_month --project_id=123128 --columns id --format=text | xargs -n1 mite delete
`);
  })
  .action((timeEntryId) => {
    const mite = miteApi(config.get());
    mite.deleteTimeEntry(timeEntryId, (err, response) => {
      if (!err) {
        console.log(
          'Successfully deleted time entry with the id "%s"',
          timeEntryId
        );
        process.exit(0);
      }
      console.log('Error while deleting time entry "%s"', timeEntryId);
      if (data) {
        var data = JSON.parse(response);
        console.error(data.error);
        process.exit(1);
        return;
      }
    });
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit();
}
