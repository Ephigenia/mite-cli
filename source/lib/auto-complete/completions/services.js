#!/usr/bin/env node
'use strict';

const DataOutput = require('./../../data-output');
const servicesCommand = require('./../../commands/services');

/**
 * https://www.npmjs.com/package/tabtab#3-parsing-env
 *
 * @param {string} env.lastPartial - the characters entered in the current
 *                                   argument before hitting tabtab
 * @param {string} env.prev - last given argument value, or previously
 *                            completed value
 * @param {string} env.words - the number of argument currently active
 * @param {string} env.line - the current complete input line in the cli
 * @returns {Promise<Array<string>>}
 */
module.exports = async ({ prev }) => {
  switch(prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no', 'all'];
    case '--billable':
      return ['yes', 'no'];
    case '--columns':
      return Object.keys(servicesCommand.columns.options).concat(['all']);
    case '--format':
    case '-f':
      return DataOutput.FORMATS;
    case '--search':
      return ['query'];
    case '--sort':
      return servicesCommand.sort.options;
  }

  return [
    {
      name: '--archived',
      description: 'defines wheter services which are archived should be listed',
    },
    {
      name: '--billable',
      description: 'defines wheter billable services should be shown or not',
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
      description: 'show help message',
    },
    {
      name: '--search',
      description: 'given a search query will list only services that match that query',
    },
    {
      name: '--sort',
      description: 'defines the order of results shown',
    },
  ];
};

