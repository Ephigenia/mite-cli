#!/usr/bin/env node
'use strict';

const customerUpdateCompletion = require('./customer-update');
const customerDeleteCompletion = require('./customer-delete');
const customerListCompletion = require('./customers.js');

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
  // check wheter the update sub-sub command is called and forward completion
  // to that command
  const thirdArg = line.split(/\s/).splice(2)[0];
  switch (thirdArg) {
    case 'delete':
      // forward auto-completion to sub-sub-command
      return customerDeleteCompletion.apply(customerDeleteCompletion, arguments);
    case 'list':
      return customerListCompletion.apply(customerDeleteCompletion, arguments);
    case 'update':
      // forward auto-completion to sub-sub-command
      return customerUpdateCompletion.apply(customerUpdateCompletion, arguments);

  }
  return [
    {
      name: 'delete',
      description: 'delete a single customer by it’s id',
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
};
