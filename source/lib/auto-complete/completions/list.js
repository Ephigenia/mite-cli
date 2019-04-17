#!/usr/bin/env node
'use strict';

const chalk = require('chalk');

const DataOutput = require('./../../data-output');
const config = require('./../../../config.js');
const miteApi = require('./../../mite-api')(config.get());

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
  switch (prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no'];
    case '--billable':
      return ['yes', 'no'];
    case '--customer_id':
      return miteApi.getCustomers({ archived: false }).then(
        customers => customers.map(c => ({
          name: String(c.id),
          description: c.name + (c.archived ? ' (archived)' : '')
        }))
      );
    case '--group_by':
      // @TODO use options from command
      return [
        'user',
        'customer',
        'project',
        'service',
        'day',
        'week',
        'month',
        'year',
      ];
    case '--format':
    case '-f':
      return DataOutput.FORMATS;
    case '--from':
    case '--to':
      return [
        'today',
        'yesterday',
        'this_week',
        'last_week',
        'this_month',
        'last_month',
        'this_year',
        'last_year',
        'YYYY-MM-DD'
      ];
    case '--project_id':
      return miteApi.getProjects({ archived: false }).then(
        projects => projects.map(c => ({
          name: String(c.id),
          description: c.name
        }))
      );
    case '--search':
    case '-s':
      return ['note'];
    case '--service_id':
      return miteApi.getServices({ archived: false }).then(
        service => service.map(c => ({
          name: String(c.id),
          description: c.name + (c.billable ? ' $' : '')
        }))
      );
    case '--sort':
      // @TODO get sort options from actual command
      return [
        'date',
        'user',
        'customer',
        'project',
        'service',
        'note',
        'minutes',
        'revenue',
      ];
    case '--tracking':
      return ['yes', 'no'];
    case '--user_id':
      return Promise.all([
        miteApi.getUsers({ archived: false }),
        miteApi.getMyself(),
      ]).then(([users, me]) => {
        return users.map(u => ({
          name: String(u.id),
          description: u.name + (me.id === u.id ? ' (you)' : '')
        }))
      });
  }

  return [
    {
      name: '--archived',
      description: 'defines wheter time-entries which are archived should be listed',
    },
    {
      name: '--billable',
      description: 'defines wheter billable time-entries should be shown or not',
    },
    {
      name: '--columns',
      description: 'define the columns that are shown',
    },
    {
      name: '--customer_id',
      description: 'list only time entries from the given customer',
    },
    {
      name: '--format',
      description: 'defines the output format',
    },
    {
      name: '--from',
      description: 'define a start date from when time-entries should be shown',
    },
    {
      name: '--group_by',
      description: 'optional name of a property or multiple properties that should be used to group the time-entries',
    },
    {
      name: '--project_id',
      description: 'list only time entries from the given project',
    },
    {
      name: '--search',
      description: 'given a search query will list time-entries where the note matches the given query',
    },
    {
      name: '--service_id',
      description: 'list only time entries that have the given service assigned',
    },
    {
      name: '--sort',
      description: 'defines the order of results shown',
    },
    {
      name: '--to',
      description: 'define a end date from when time-entries should be shown',
    },
    {
      name: '--tracking',
      description: 'show only currently active trackers',
    },
    {
      name: '--user_id',
      description: 'when defined will list only time-entries from the given user',
    },
  ];
}

