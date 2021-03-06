#!/usr/bin/env node
'use strict';

const { BUDGET_TYPES } = require('./../../constants');
const {
  getProjectOptions,
  removeAlreadyUsedOptions
} = require('../helpers');

const defaults = [
  {
    name: '--archived',
    description: 'archive or unarchive a project',
  },
  {
    name: '--budget-type',
    description: 'change the budget_type',
  },
  {
    name: '--hourly-rate',
    description: 'change the hourly-rate',
  },
  {
    name: '--name',
    description: 'change the name of the project',
  },
  {
    name: '--note',
    description: 'change the note of the project',
  },
  {
    name: '--update-entries',
    description: 'update time entries when hourly_rate was changed',
  },
  {
    name: '--help',
    description: 'show help message',
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
  // argument value completion
  switch (prev) {
    case '--archived':
      return ['yes', 'no'];
    case '--budget-type':
      return BUDGET_TYPES;
    case '--name':
      return ['name'];
    case '--note':
      return ['note'];
    case '--hourly-rate':
      return ['0.00'];
  }

  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);

  let query = {};
  if (line.match(/--archived/)) {
    query.archived = !/--archived[ =](yes|true|1|ja)/.test(line);
  }
  const projectOptions = await getProjectOptions(query);

  // merge customer options and defaults togheter
  return [].concat([], options, projectOptions);
};
