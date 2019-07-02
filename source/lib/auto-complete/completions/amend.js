#!/usr/bin/env node
'use strict';

const {
  getMyRecentTimeEntriesOptions,
  getProjectOptions,
  getServiceOptions,
  removeAlreadyUsedOptions,
} = require('../helpers');

const defaults = [
  {
    name: '--help',
    description: 'show help message'
  },
  {
    name: '--editor',
    description: 'open $EDITOR for editing the entry’s note'
  },
  {
    name: '--duration',
    description: 'set, substract or add mimnutes',
  },
  {
    name: '--project-id',
    description: 'id of the project the entry should be assigned to'
  },
  {
    name: '--service-id',
    description: 'id of the service  the entry should be assigned to'
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
module.exports = async ({ line, prev }) => {
  // argument value completion
  switch (prev) {
    case '--project-id':
      return getProjectOptions({ archived: false });
    case '--service-id':
      return getServiceOptions({ archived: false });
    case '--duration':
      return ['0\\:00'];
  }

  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);

  // try to find the latest entries created by the current user and propose the
  // ids of these
  const recentTimeEntryOptions = await getMyRecentTimeEntriesOptions();

  return [].concat(options, recentTimeEntryOptions);
};
