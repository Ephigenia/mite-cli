#!/usr/bin/env node
'use strict';

/**
 * https://www.npmjs.com/package/tabtab#3-parsing-env
 *
 * @param {string} env.lastPartial - the characters entered in the current
 *                               argument before hitting tabtab
 * @param {string} env.prev - last given argument value, or previously
 *                            completed value
 * @param {string} env.words - the number of argument currently active
 * @param {string} env.line - the current complete input line in the cli
 * @returns {Promise<Array<string>>}
 */
module.exports = async () => {
  return [
    {
      name: '--help',
      description: 'show help message'
    },
    {
      name: 'install',
      description: 'tries to install auto-completion for mite-cli'
    },
    {
      name: 'uninstall',
      description: 'removes previously installed auto-completion'
    }
  ];
};
