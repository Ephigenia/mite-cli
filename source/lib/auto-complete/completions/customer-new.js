#!/usr/bin/env node
'use strict';

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
module.exports = async ({ prev, line, word }) => {
  const defaults = [
    line.indexOf('--archived') === -1 ? {
      name: '--archived',
      description: 'archvied or not-archived state',
    } : undefined,
    line.indexOf('--hourly-rate') === -1 ? {
      name: '--hourly-rate',
      description: 'hourly rate that should be used',
    } : undefined,
    line.indexOf('--name') === -1 ? {
      name: '--name',
      description: 'name of the customer',
    } : undefined,
    line.indexOf('--note') === -1 ? {
      name: '--note',
      description: 'additional note of the customre',
    } : undefined,
    // include --help only when no other arguments or options are provided
    word < 4 ? {
      name: '--help',
      description: 'show help message',
    } : undefined,
  ];

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

  // return a list of project ids and default options
  return defaults;
};
