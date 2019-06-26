#!/usr/bin/env node
'use strict';

const {
  getServiceOptions,
  removeAlreadyUsedOptions,
} = require('../helpers');

const defaults = [
  // do not includ --archived when it’s allready been set
  {
    name: '--archived',
    description: 'archive or unarchive a service',
  },
  {
    name: '--billable',
    description: 'make a service billable or unbillable',
  },
  {
    name: '--hourly-rate',
    description: 'change the hourly-rate',
  },
  {
    name: '--name',
    description: 'change the name of the service',
  },
  {
    name: '--note',
    description: 'change the note of the service',
  },
  {
    name: '--update-entries',
    description: 'update time entries when hourly_rate was changed',
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
    case '--billable':
      return ['yes', 'no'];
    case '--name':
      return ['name'];
    case '--note':
      return ['note'];
    case '--hourly-rate':
      return ['0.00'];
  }

  // return default options without the ones which where already entered
  const options = removeAlreadyUsedOptions(defaults, line);

  // show list of archived or unarchived services depending on the --archived
  // flag wich is allready been given
  const query = {};
  if (line.match(/--archived/)) {
    query.archived = !/--archived[ =](yes|true|1|ja)/.test(line);
  }
  if (line.match(/--billable/)) {
    query.billable = !/--billable[ =](yes|true|1|ja)/.test(line);
  }
  const serviceOptions = await getServiceOptions(query);

  return [].concat([], options, serviceOptions);
};
