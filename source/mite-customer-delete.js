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
  .arguments('[customerId]')
  .description(
    'Delete a specific customer',
    {
      customerId: 'Id of the customer that should get deleted'
    }
  )
  .on('--help', () => console.log(`
Examples:

  Delete a single customer
    mite customer delete 123456

  Delete a whole set of customers
    mite customers --columns id --archived yes --format text | xargs -n1 mite customer delete
  `));

function main(customerId) {
  if (!customerId) {
    throw new MissingRequiredArgumentError('Missing required <customerId>');
  }
  const mite = miteApi(config.get());
  return util.promisify(mite.deleteCustomer)(customerId)
    .then(() => console.log(`Successfully deleted customer (id: ${customerId})`))
    .catch(handleError);
}

try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
