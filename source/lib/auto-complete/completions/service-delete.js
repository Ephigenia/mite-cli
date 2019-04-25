#!/usr/bin/env node
'use strict';

const config = require('./../../../config');
const miteApi = require('./../../mite-api')(config.get());

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
  const defaults = [
    (words < 3 ? {
      name: '--help',
      description: 'show help message'
    } : undefined)
  ];

  // return a list of service ids and default options
  return miteApi.getServices()
    .then(items => items.map(c => ({
      name: String(c.id),
      description: c.name
    })))
    .then(options => [].concat(options, defaults));
};
