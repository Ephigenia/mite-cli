#!/usr/bin/env node
'use strict';

const {
  getServiceOptions,
  removeAlreadyUsedOptions,
} = require('../helpers');

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
module.exports = async ({ line }) => {
  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);

  // also propose services
  const serviceOptions = await getServiceOptions();

  return [].concat([], options, serviceOptions);
};
