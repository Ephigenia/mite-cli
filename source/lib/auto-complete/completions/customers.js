#!/usr/bin/env node
'use strict';

const customersCommand = require('./../../commands/customers');
const { removeAlreadyUsedOptions } = require('../helpers');
const options = require('./../../options');

const defaults = [
  {
    name: '--archived',
    description: 'defines wheter archived customers should be shown or not'
  },
  {
    name: '--columns',
    description: 'define the columns that are shown',
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
  // argument completion
  switch (prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no', 'all'];
    case '--columns':
      return Object.keys(customersCommand.columns.options).concat(['all']);
    case '--search':
      return ['query'];
    case '--sort':
      return customersCommand.sort.options;
  }

  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);

  return options;
};
