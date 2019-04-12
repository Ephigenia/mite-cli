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
module.exports = async ({ last }) => {
  // some option triggerd
  if (last.substr(0, 1) === '-') {
    return [
      '--editor'
    ];
  }

  return [];
}
