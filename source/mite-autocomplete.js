#!/usr/bin/env node
'use strict';

const { program } = require('commander');

const pkg = require('./../package.json');
const autoComplete = require('./lib/auto-complete');
const { handleError, GeneralError } = require('./lib/errors');

program
  .version(pkg.version);

program.command('install')
  .description(
    'Installs auto-completion for most of the mite subcommands, options and ' +
    'arguments. Compatible with bash, fish and zsh. ' +
    'No support for windows systems. Also note that it will only work ' +
    'when mite is installed globally.'
  )
  .action(() => {
    return autoComplete.install()
      .catch(err => {
        throw new GeneralError('error while installing autocompletion for mite ' + err);
      })
      .catch(handleError);
  });

program.command('uninstall')
  .description('removes the auto-completion for mite')
  .action(() => {
    autoComplete.uninstall()
      .catch(err => {
        throw new GeneralError('error while un-installing autocompletion for mite ' + err);
      })
      .catch(handleError);
  });

program.on('command:*', function (operands) {
  // eslint-disable-next-line no-console
  console.error(`error: unknown command '${operands[0]}'`);
  process.exit(1);
});

program.parse();
