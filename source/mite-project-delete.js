#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');

program
  .version(pkg.version)
  .arguments('<projectId>')
  .description(
    'Deletes a specific project',
    // arguments description
    {
      projectId: 'Id of the project which should get delete'
    }
  )
  .on('--help', () => {
    console.log(`
Examples:

  Delete a single project
    mite project delete 123456

  Delete a whole set of projects
    mite projects --columns id --archived yes --format=text | xargs -n1 mite project delete
`);
  })
  .action((projectId) => {
    const mite = miteApi(config.get());
    return util.promisify(mite.deleteProject)(projectId)
      .then(() => {
        console.log('Successfully deleted project (id: %s)', projectId);
      })
      .catch(err => {
        console.error('Error while deleting project (id: %s)', projectId, err && err.message || err);
        process.exit(1);
      });
  })
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
