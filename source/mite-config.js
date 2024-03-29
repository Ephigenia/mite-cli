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
  .addHelpText('after', `

Examples:

  set the subdomain and api key that should be used
    mite config set account mycompanyname
    mite config set apiKey bf817ba626

  set the columns for the list command:
    mite config set listColumns date,duration,note,service

  set a value of a configuration variable back to it’s default:
    mite config set listColumns
  `)
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
          process.stdout.write(`successfully set "${key}" to the default value\n`);
        } else {
          process.stdout.write(`successfully set "${key}" to "${value}"\n`);
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
  .addHelpText('after', `

Examples:

  Get the current value of the "account" config variable:
    mite config get account
  `)
  .action((key) => process.stdout.write(JSON.stringify(config.get(key)) + '\n'));

program.command('list')
  .description('list all currently defined config vars')
  .action(() => process.stdout.write(JSON.stringify(config.get(), null, 2) + '\n'));

program.parse();

if (!program.args.length) {
  program.help();
}
