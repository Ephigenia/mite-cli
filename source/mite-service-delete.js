#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');

program
  .version(pkg.version)
  .arguments('<serviceId>')
  .description(
    'Deletes a specific service',
    // arguments description
    {
      serviceId: 'Id of the service which should get delete'
    }
  )
  .on('--help', () => {
    console.log(`
Examples:

  Delete a single service
    mite service delete 123456

  Delete all archived services
    mite services --columns id --archived yes --format=text | xargs -n1 mite service delete
`);
  })
  .action((serviceId) => {
    const mite = miteApi(config.get());
    return util.promisify(mite.deleteService)(serviceId)
      .then(() => {
        console.log('Successfully deleted service (id: %s)', serviceId);
      })
      .catch(err => {
        console.error('Error while deleting service (id: %s)', serviceId, err && err.message || err);
        process.exit(1);
      });
  })
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
