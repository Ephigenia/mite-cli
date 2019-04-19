#!/usr/bin/env node
'use strict';

const DataOutput = require('./../../data-output');

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
  switch (prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no'];
    // @TODO add completion for --columns option
    case '--format':
    case '-f':
      return DataOutput.FORMATS;
    case '--search':
      return ['query'];
    case '--sort':
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
      name: '--archived',
      description: 'defines wheter archived customers should be shown or not'
    },
    {
      name: '--columns',
      description: 'define the columns that are shown',
    },
    {
      name: '--format',
      description: 'defines the output format',
    },
    {
      name: '--help',
      description: 'show help message'
    },
    {
      name: '--search',
      description: 'given a query will list only customers that match the query',
    },
    {
      name: '--sort',
      description: 'defines the order of customers shown',
    }
  ];
};

