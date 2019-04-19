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
module.exports = async ({ words }) => {
  if (words < 3) {
    return [
      {
        name: '--help',
        description: 'show help message'
      },
      {
        name: '--editor',
        description: 'open $EDITOR for editing the entry’s note'
      }
    ];
  }
};
