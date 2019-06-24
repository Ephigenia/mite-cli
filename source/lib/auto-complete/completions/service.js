#!/usr/bin/env node
'use strict';

const serviceUpdateCompletion = require('./service-update');
const serviceDeleteCompletion = require('./service-delete');
const serviceListCompletion = require('./services');

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
      return serviceDeleteCompletion.apply(serviceDeleteCompletion, arguments);
    case 'list':
      return serviceListCompletion.apply(serviceListCompletion, arguments);
    case 'update':
      return serviceUpdateCompletion.apply(serviceUpdateCompletion, arguments);
  }
  return [
    {
      name: 'delete',
      description: 'delete a single service by it’s id',
    },
    {
      name: 'list',
      description: 'list services',
    },
    {
      name: 'update',
      description: 'update a single service by it’s id',
    },
    {
      name: '--help',
      description: 'show help message',
    },
  ];
};
