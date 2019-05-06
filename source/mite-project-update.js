#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');
const hourlyRateOption = require('./lib/options/hourly-rate');

program
  .version(pkg.version)
  .arguments('<projectId>')
  // @TODO add edit "budget"
  // @TODO add edit "budget_type"
  .option(
    '--archived <true|false>',
    'changes the archived state of the project',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    })
  )
  .option(
    '--hourly-rate <hourlyRate>',
    hourlyRateOption.description,
    hourlyRateOption.parse
  )
  .option(
    '--name <name>',
    'changes the name of the project to the given value',
  )
  .option(
    '--note <note>',
    'changes the note of the project to the given value',
  )
  .option(
    '--update-entries',
    'Works only in compbination with hourly-rate. When used also updates all ' +
    ' already created time entries with the new hourly-rate',
  )
  .description(
    'Updates a specific project',
    // arguments description
    {
      projectId: 'Id of the project of which the note should be altered'
    }
  )
  .on('--help', () => {
    console.log(`
Examples:

  Put a project into the archive:
    mite project update --archived true 123456

  Unarchive a single project
    mite project update --archived false 123456

  Change the name and note of a project
    mite project update --name "new name" --note="my new note" 123456

  Unarchive all archived projects
    mite projects --archived false --columns id --format=text | xargs -n1 mite project update --archived true
`);
  })
  .action((projectId) => {
    const mite = miteApi(config.get());
    const data = {
      ...(typeof program.archived === 'boolean' && { archived: program.archived }),
      ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
      ...(typeof program.name === 'string' && { name: program.name }),
      ...(typeof program.note === 'string' && { note: program.note }),
      ...(typeof program['update-entries'] === 'boolean' && { update_hourly_rate_on_time_entries: true }),
    };
    return util.promisify(mite.updateProject)(projectId, data)
      .then(() => {
        console.log('Successfully updated project (id: %s)', projectId);
      })
      .catch(err => {
        console.error('Error while updating project (id: %s)', projectId, err && err.message || err);
        process.exit(1);
      });
  })
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
