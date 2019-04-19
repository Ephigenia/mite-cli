#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config.js');

program
  .version(pkg.version)
  .arguments('<projectId>')
  // @TODO add edit "budget"
  // @TODO add edit "hourly_rate"
  // @TODO add edit "name"
  // @TODO add edit "note"
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

  Unarchive all archived projects
    mite projects --archived false --columns id --format=text | xargs -0 mite project update --archived false
`);
  })
  .action((projectId) => {
    const mite = miteApi(config.get());
    const data = {};
    if (typeof program.archived === 'boolean') {
      data.archived = program.archived;
    }
    return util.promisify(mite.updateProject)(projectId, data)
      .then(() => {
        console.log('Successfully updated project (id: %s)', projectId);
      })
      .catch(err => {
        console.error('Error while updateing project (id: %s)', projectId, err);
        process.exit(1);
      });
  })
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
