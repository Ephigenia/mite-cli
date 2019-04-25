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
  // @TODO add update_hourly_rate_on_time_entries flag
  // @TODO add edit "hourly_rate"
  .option(
    '--name <name>',
    'changes the name of the project to the given value',
  )
  .option(
    '--note <note>',
    'changes the note of the project to the given value',
  )
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
    '--billable <true|false>',
    'changes the archived state of the project',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    })
  )
  .description(
    'Updates a specific service',
    // arguments description
    {
      serviceId: 'Id of the service which should get updated'
    }
  )
  .on('--help', () => {
    console.log(`
Examples:

  Put a service into the archive:
    mite service update --archived true 123456

  Unarchive a single service
    mite service update --archived false 123456

  Make a single service not billable anymore
    mite service update --billable false 123456

  Change the name of a service
    mite service update --name "new name" 123456

  Unarchive all archived services
    mite services --archived false --columns id --format=text | xargs -n1 mite service update --archived true
`);
  })
  .action((serviceId) => {
    const mite = miteApi(config.get());
    const data = {
      ...(typeof program.archived === 'boolean' && { archived: program.archived }),
      ...(typeof program.billable === 'boolean' && { billable: program.billable }),
      ...(typeof program.name === 'string' && { name: program.name }),
      ...(typeof program.note === 'string' && { note: program.note }),
    };
    return util.promisify(mite.updateProject)(serviceId, data)
      .then(() => {
        console.log('Successfully updated project (id: %s)', serviceId);
      })
      .catch(err => {
        console.error('Error while updating project (id: %s)', serviceId, err && err.message || err);
        process.exit(1);
      });
  })
  .parse(process.argv);

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
  process.exit();
}
