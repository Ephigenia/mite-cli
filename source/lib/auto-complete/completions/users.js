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
  // binary options
  if (
    [
      '--archived',
      '-a',
    ].indexOf(prev) !== -1
  ) {
    return ['yes', 'no'];
  }
  // query options
  if ([
    '--search',
    '--eamil',
    '--name',
  ].indexOf(prev) !== -1
  ) {
    return ['query'];
  }

  // options with a set of values to choose from
  if (['--format', '-f'].indexOf(prev) !== -1) {
    return DataOutput.FORMATS;
  }
  if (['--role'].indexOf(prev) !== -1) {
    return [
      'admin',
      'owner',
      'time_tracker',
      'coworker'
    ];
  }
  if (prev === '--sort') {
    // @TODO get sort options from actual command
    return [
      'id',
      'name',
      'email',
      'role',
      'note',
      'updated_at',
      'created_at',
    ];
  }

  // list of options and short descriptions
  return [
    {
      name: '--archived',
      description: 'defines wheter services which are archived should be listed',
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
