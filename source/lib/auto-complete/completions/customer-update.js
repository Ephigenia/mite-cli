#!/usr/bin/env node
'use strict';

const config = require('./../../../config.js');
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
module.exports = async ({ prev, line, word }) => {
  switch(prev) {
    case '--archived':
      return ['yes', 'no'];
  }
  // return a list of project ids
  // @TODO use archived: true | false as parameter depending on the àrchived flag
  return miteApi.getCustomers()
    .then(customer => customer.map(c => ({
      name: String(c.id),
      description: c.name
    })))
    .then(customer => {
      return customer.concat([
        line.indexOf('--archived') === -1 ? {
          name: '--archived',
          description: 'archive or unarchive a customer',
        } : undefined,
        word < 4 ? {
          name: '--help',
          description: 'show help message',
        } : undefined,
      ]);
    });
};

