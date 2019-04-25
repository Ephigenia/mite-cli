#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');

program
  .version(pkg.version)
  .arguments('<customerId>')
  .description(
    'Deletes a specific customer',
    // arguments description
    {
      customerId: 'Id of the customer of which the note should be altered'
    }
  )
  .on('--help', () => {
    console.log(`
Examples:

  Delete a single customer
    mite customer delete 123456

  Delete a whole set of customers
    mite customers --columns id --archived yes --format=text | xargs -n1 mite customer delete
`);
  })
  .action((customerId) => {
    const mite = miteApi(config.get());
    return util.promisify(mite.deleteCustomer)(customerId)
      .then(() => {
        console.log('Successfully deleted customer (id: %s)', customerId);
      })
      .catch(err => {
        console.error('Error while updating customer (id: %s)', customerId, err && err.message || err);
        process.exit(1);
      });
  })
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
