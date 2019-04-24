#!/usr/bin/env node
'use strict';

const DataOutput = require('./../../data-output');
const usersCommand = require('./../../commands/users');

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
  switch(prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no'];
    case '--columns':
      return Object.keys(usersCommand.columns.options);
    case '--email':
    case '--name':
    case '--search':
      return ['query'];
    case '--format':
    case '-f':
      return DataOutput.FORMATS;
    case '--role':
      return usersCommand.USER_ROLES;
    case '--sort':
      return usersCommand.sort.options;
  }

  // list of options and short descriptions
  return [
    {
      name: '--archived',
      description: 'defines wheter services which are archived should be listed',
    },
    {
      name: '--columns',
      description: 'defines which columns should be shown'
    },
    {
      name: '--email',
      description: 'given a email will list only users with that email',
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
      name: '--name',
      description: 'given a query only shows users that have a matching name',
    },
    {
      name: '--role',
      description: 'list only users that have the given role',
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

