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
module.exports = async ({ prev }) => {
  if (['--search'].indexOf(prev) !== -1) {
    return ['query'];
  }
  if (['--archived', '-a'].indexOf(prev) !== -1) {
    return ['yes', 'no'];
  }
  if (prev === '--sort') {
    // @TODO get sort options from actual command
    return [
      'id',
      'name',
      'updated_at',
      'created_at',
      'hourly_rate',
      'rate'
    ];
  }

  return [
    {
      name: '--search',
      description: 'given a query will list only customers that match the query',
    },
    {
      name: '--archived',
      description: 'defines wheter archived customers should be shown or not'
    },
    {
      name: '--sort',
      description: 'defines the order of customers shown',
    }
  ];
};

