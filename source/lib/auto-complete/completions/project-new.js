#!/usr/bin/env node
'use strict';

const config = require('./../../../config');
const miteApi = require('./../../mite-api')(config.get());
const { BUDGET_TYPES } = require('./../../constants');

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
  const defaults = [
    line.indexOf('--archived') === -1 ? {
      name: '--archived',
      description: 'archive or unarchive a project',
    } : undefined,
    line.indexOf('--budget-type') === -1 ? {
      name: '--budget-type',
      description: 'change the budget_type',
    } : undefined,
    line.indexOf('--customer-id') === -1 ? {
      name: '--customer-id',
      description: 'change the budget_type',
    } : undefined,
    line.indexOf('--hourly-rate') === -1 ? {
      name: '--hourly-rate',
      description: 'change the hourly-rate',
    } : undefined,
    line.indexOf('--name') === -1 ? {
      name: '--name',
      description: 'change the name of the project',
    } : undefined,
    line.indexOf('--note') === -1 ? {
      name: '--note',
      description: 'change the note of the project',
    } : undefined,
    line.indexOf('--update-entries') === -1 ? {
      name: '--update-entries',
      description: 'update time entries when hourly_rate was changed',
    } : undefined,
    // include --help only when no other arguments or options are provided
    word < 4 ? {
      name: '--help',
      description: 'show help message',
    } : undefined,
  ];

  switch(prev) {
    case '--archived':
      return ['yes', 'no'];
    case '--budget-type':
      return BUDGET_TYPES;
    case '--customer-id':
      return miteApi.getCustomers().then(customers => customers.map(c => ({
        name: String(c.id),
        description: c.name,
      })));
    case '--name':
      return ['name'];
    case '--note':
      return ['note'];
    case '--hourly-rate':
      return ['0.00'];
  }

  // show list of archived or unarchived projects depending on the --archived
  // flag wich is allready been given
  // const options = {};
  // if (line.match(/--archived/)) {
  //   options.archived = !/--archived[ =](yes|true|1|ja)/.test(line);
  // }

  // return a list of project ids and default options
  return defaults;
};
