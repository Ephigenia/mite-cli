#!/usr/bin/env node
'use strict';

const options = require('./../../opions');
const usersCommand = require('./../../commands/users');
const { USER_ROLES } = require('./../../constants');
const { removeAlreadyUsedOptions } = require('../helpers');

const defaults = [
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
    name: options.plain.definition,
    description: options.plain.description(),
  },
  {
    name: options.pretty.definition,
    description: options.pretty.description(),
  },
  {
    name: options.json.definition,
    description: options.json.description(),
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
module.exports = async ({ prev, line }) => {
  // argument value completion
  switch (prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no', 'all'];
    case '--columns':
      return Object.keys(usersCommand.columns.options).concat(['all']);
    case '--email':
    case '--name':
    case '--search':
      return ['query'];
    case '--role':
      return Object.values(USER_ROLES);
    case '--sort':
      return usersCommand.sort.options;
  }

  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);
  return options;
};
