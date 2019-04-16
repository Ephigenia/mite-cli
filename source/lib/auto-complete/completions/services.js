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
module.exports = async ({ words, prev }) => {
  // binaray options
  if (
    [
      '--archived',
      '-a',
      '--billable'
    ].indexOf(prev) !== -1
  ) {
    return ['yes', 'no'];
  }
  if (['--format', '-f'].indexOf(prev) !== -1) {
    return DataOutput.FORMATS;
  }
  if (['--search'].indexOf(prev) !== -1) {
    return ['query'];
  }
  if (prev === '--sort') {
    // @TODO get sort options from actual command
    return [
      'id',
      'name',
      'updated_at',
      'created_at',
      'hourly_rate',
      'rate' // alias for hourly_rate
    ];
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
      name: '--format',
      description: 'defines the output format',
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
}

