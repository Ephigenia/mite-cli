#!/usr/bin/env node
'use strict';

const { getMyRecentTimeEntriesOptions } = require('../helpers');

const defaults = [
  {
    name: '--help',
    description: 'show help message'
  }
];

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
  let options = defaults;

  // try to find the latest entries created by the current user and propose the
  // ids of these
  const recentTimeEntryOptions = await getMyRecentTimeEntriesOptions();

  // merge entry options with other options
  return [].concat([], options, recentTimeEntryOptions);
};
