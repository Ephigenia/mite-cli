#!/usr/bin/env node
'use strict';

const { BUDGET_TYPES } = require('./../../constants');
const {
  getCustomerOptions,
  removeAlreadyUsedOptions,
} = require('../helpers');

const defaults = [
  {
    name: '--archived',
    description: 'archived or not-archived a project',
  },
  {
    name: '--budget-type',
    description: 'change the budget_type',
  },
  {
    name: '--customer-id',
    description: 'customer the project belongs to',
  },
  {
    name: '--hourly-rate',
    description: 'hourly rate of the project to use',
  },
  {
    name: '--name',
    description: 'name of the project',
  },
  {
    name: '--note',
    description: 'note of the project',
  },
  {
    name: '--help',
    description: 'show help message',
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
      return ['yes', 'no'];
    case '--budget-type':
      return BUDGET_TYPES;
    case '--customer-id':
      return await getCustomerOptions();
    case '--name':
      return ['name'];
    case '--note':
      return ['note'];
    case '--hourly-rate':
      return ['0.00'];
  }

  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);
  return options;
};
