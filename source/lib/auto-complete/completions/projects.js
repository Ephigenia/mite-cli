#!/usr/bin/env node
'use strict';

const config = require('./../../../config.js');
const miteApi = require('./../../mite-api')(config.get());
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
  if (['--archived', '-a'].indexOf(prev) !== -1) {
    return ['yes', 'no'];
  }
  if (['--customer'].indexOf(prev) !== -1) {
    // add completion for customer ids?
    return miteApi.getCustomers()
      .then(
        customers => customers.map(c => ({
          name: String(c.name)
        }))
      );
  }
  if (['--customer_id'].indexOf(prev) !== -1) {
    // add completion for customer ids?
    return miteApi.getCustomers()
      .then(
        customers => customers.map(c => ({
          name: String(c.id),
          description: c.name
        }))
      );
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
      'customer',
      'customer_name',
      'customer_id',
      'updated_at',
      'created_at',
      'hourly_rate',
      'rate',
      'budget',
    ];
  }

  return [
    '--archived',
    '--format',
    '--customer',
    '--customer_id',
    '--search',
    '--sort'
  ];
}

