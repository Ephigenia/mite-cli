#!/usr/bin/env node
'use strict';

const config = require('./../../../config');
const miteApi = require('./../../mite-api')(config.get());
const DataOutput = require('./../../data-output');
const projectsCommand = require('./../../commands/projects');

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
  switch (prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no', 'all'];
    case '--columns':
      return Object.keys(projectsCommand.columns.options).concat(['all']);
    case '--customer':
      return miteApi.getCustomers().then(customers => customers.map(c => ({
        name: String(c.name)
      })));
    case '--customer_id':
      return miteApi.getCustomers().then(customers => customers.map(c => ({
        name: String(c.id),
        description: c.name
      })));
    case '--format':
    case '-f':
      return DataOutput.FORMATS;
    case '--search':
      return ['query'];
    case '--sort':
      return projectsCommand.sort.options;
  }

  return [
    // @TODO do not add completions if they have been already adde
    {
      name: '--archived',
      description: 'defines wheter archived projects should be shown',
    },
    {
      name: '--format',
      description: 'defines the output format',
    },
    {
      name: '--columns',
      description: 'define the columns that are shown',
    },
    {
      name: '--customer',
      description: 'given a regular expression will list only projects where the customers’s name matches',
    },
    {
      name: '--customer_id',
      description: 'given a customer id will list only projects for that customer',
    },
    {
      name: '--help',
      description: 'show help message',
    },
    {
      name: '--search',
      description: 'given a query will show only projects where name or customer name match',
    },
    {
      name: '--sort',
      description: 'defines the order of projects',
    }
  ];
};

