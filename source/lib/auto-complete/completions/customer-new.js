#!/usr/bin/env node
'use strict';

const defaults = [
  {
    name: '--archived',
    description: 'archvied or not-archived state',
  },
  {
    name: '--hourly-rate',
    description: 'hourly rate that should be used',
  },
  {
    name: '--name',
    description: 'name of the customer',
  },
  {
    name: '--note',
    description: 'additional note of the customre',
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
  // propose values for some of the arguments
  switch(prev) {
    case '--archived':
      return ['yes', 'no'];
    case '--name':
      return ['name'];
    case '--note':
      return ['note'];
    case '--hourly-rate':
      return ['0.00'];
  }

  // return default options without the ones which where already entered
  return defaults.filter(option => {
    return line.indexOf(option.name) === -1;
  });
};
