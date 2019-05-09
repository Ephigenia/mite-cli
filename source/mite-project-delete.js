#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[projectId]')
  .description(
    'Deletes a specific project',
    {
      projectId: 'Id of the project which should get delete'
    }
  )
  .on('--help', () => console.log(`
Examples:

  Delete a single project
    mite project delete 123456

  Delete a whole set of projects
    mite projects --columns id --archived yes --format text | xargs -n1 mite project delete
`));

function main(projectId) {
  if (!projectId) {
    throw new MissingRequiredArgumentError('Missing required <projectId>');
  }
  const mite = miteApi(config.get());
  return util.promisify(mite.deleteProject)(projectId)
    .then(() => console.log(`Successfully deleted project (id: ${projectId})`))
    .catch(err => {
      throw new Error(`Error while deleting project (id: ${projectId}): ` + (err && err.message || err));
    })
    .catch(handleError);
}

try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
