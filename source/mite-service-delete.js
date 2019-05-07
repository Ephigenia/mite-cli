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
  .arguments('[serviceId]')
  .description(
    'Deletes a specific service',
    {
      serviceId: 'Id of the service which should get delete'
    }
  )
  .on('--help', () => console.log(`
Examples:

  Delete a single service
    mite service delete 123456

  Delete a whole set of services
    mite services --columns id --archived yes --format=text | xargs -n1 mite service delete
`));

function main(serviceId) {
  if (!serviceId) {
    throw new MissingRequiredArgumentError('Missing required <serviceId>');
  }
  const mite = miteApi(config.get());
  return util.promisify(mite.deleteService)(serviceId)
    .then(() => console.log(`Successfully deleted service (id: ${serviceId})`))
    .catch(err => {
      throw new Error(`Error while deleting service (id: ${serviceId}): ` + err && err.message || err);
    })
    .catch(handleError);
}

try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
