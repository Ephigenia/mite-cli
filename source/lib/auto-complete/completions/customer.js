#!/usr/bin/env node
'use strict';

const customerUpdateCompletion = require('./customer-update');
const customerDeleteCompletion = require('./customer-delete');
const customerListCompletion = require('./customers.js');
const customerNewCompletion = require('./customer-new.js');

const defaults = [
  {
    name: 'delete',
    description: 'delete a single customer by it’s id',
  },
  {
    name: 'new',
    description: 'create a new customer',
  },
  {
    name: 'list',
    description: 'list customers',
  },
  {
    name: 'update',
    description: 'update a single customer by it’s id',
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
module.exports = async function ({ line }) {
  // check if a sub command was accessed and return the auto-completion of
  // this sub-command instead, in this case subcommand would be at the 3rd
  // place
  const subCommand = line.split(/\s/).splice(2)[0];
  switch (subCommand) {
    case 'delete':
      return customerDeleteCompletion.apply(customerDeleteCompletion, arguments);
    case 'list':
      return customerListCompletion.apply(customerDeleteCompletion, arguments);
    case 'new':
      return customerNewCompletion.apply(customerNewCompletion, arguments);
    case 'update':
      return customerUpdateCompletion.apply(customerUpdateCompletion, arguments);
  }

  // otherwise return defaults
  return defaults;
};
