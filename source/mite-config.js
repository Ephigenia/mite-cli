#!/usr/bin/env node
'use strict';

const fs = require('fs');
const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const { handleError, MissingRequiredArgumentError, GeneralError } = require('./lib/errors');

program
  .version(pkg.version);

program
  .command('set [key] [value]')
  .description('set a configuration variable', {
    key: 'the configuration key which should be set',
    value: 'the value which should be used'
  })
  .on('--help', () => console.log(`
Examples:

  set the subdomain and api key that should be used
    mite config set account mycompanyname
    mite config set apiKey bf817ba626

  set the columns for the list command:
    mite config set listColumns date,duration,note,service
  `))
  .action((key, value) => {
    try {
      if (!key) {
        throw new MissingRequiredArgumentError(
          'Missing required option [key]'
        );
      }
      config.set(key, value);
      config.save((err) => {
        if (err) {
          throw new GeneralError(err.message);
        }
        if (value === undefined) {
          console.log(`successfully set "${key}" to the default value`);
        } else {
          console.log(`successfully set "${key}" to "${value}"`);
        }
        // make sure file is only write- and readable by the user
        const configFilename = config.stores.file.file;
        fs.chmodSync(configFilename, 0o600);
      });
    } catch (err) {
      handleError(err);
    }
  });

program.command('get [key]')
  .description('get a configruation variable’s value')
  .on('--help', () => console.log(`
Examples:

  Get the current value of the "account" config variable:
    mite config get account
  `))
  .action((key) => console.log(config.get(key)));

program.command('list')
  .description('list all currently defined config vars')
  .action(() => console.log(config.get()));

program.parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit();
}
