#!/usr/bin/env node
'use strict';

const fs = require('fs');
const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config.js');

program
  .version(pkg.version);

program
  .command('set [key] [value]')
  .description('set a configuration variable', {
    key: 'the configuration key which should be set',
    value: 'the value which should be used'
  })
  .on('--help', function() {
    console.log(`
Examples:

  set the subdomain and api key that should be used
    $ mite config set account mycompanyname
    $ mite config set apiKey bf817ba626

  set the columns for the list command:
    $ mite config set listColumns date,duration,note,service
`);
  })
  .action((key, value) => {
    if (!key) {
      console.error('No configuration key given, unable to set a variable');
      process.exit(1);
    }
    config.set(key, value);
    config.save((err) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
        return;
      }
      console.log(`successfully set "${key}" to "${value}"`);
      // make sure file is only write- and readable by the user
      const configFilename = config.stores.file.file;
      fs.chmodSync(configFilename, 0o600);
    });
  });

program.command('get [key]')
  .description('get a configruation variable’s value')
  .on('--help', function() {
    console.log();
    console.log('Examples:');
    console.log();
    console.log('  $ mite config get account');
  })
  .action((key) => console.log(config.get(key)));

program.command('list')
  .description('list all currently defined config vars')
  .action(() => console.log(config.get()));

program.parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit();
}
