#!/usr/bin/env node
'use strict';

const DataOutput = require('./../../data-output');
const config = require('./../../../config');
const miteApi = require('./../../mite-api')(config.get());
const listCommand = require('./../../commands/list');

const { TIME_FRAMES } = require('./../../constants');

function dateCompletion(lastPartial) {
  const now = new Date();
  let options = [
    now.toISOString().substr(0, 10)
  ];
  // YYYY-MM- completion
  if (lastPartial.match(/^\d{1,4}-\d{1,2}-?$/)) {
    options = options.concat([...Array(31).keys()].map(i => {
      return `${lastPartial.replace(/-$/, '')}-` + (++i < 10 ? '0' : '') + i;
    }));
  }
  // YYYY- completion
  if (lastPartial.match(/^\d{1,4}-?$/)) {
    options = options.concat([...Array(12).keys()].map(i => {
      return `${lastPartial.replace(/-$/, '')}-` + (++i < 10 ? '0' : '') + i + '-DD';
    }));
  }
  return options;
}

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
module.exports = async ({ words, prev, lastPartial }) => {

  switch (prev) {
    case '--archived':
    case '-a':
      return ['yes', 'no'];
    case '--billable':
      return ['yes', 'no'];
    case '--columns':
      return Object.keys(listCommand.columns.options).concat(['all']);
    case '--customer-id':
      return miteApi.getCustomers({ archived: false }).then(
        customers => customers.map(c => ({
          name: String(c.id),
          description: c.name
        }))
      );
    case '--group-by':
      return listCommand.groupBy.options;
    case '--format':
    case '-f':
      return DataOutput.FORMATS;
    case '--from':
    case '--to':
      return TIME_FRAMES.concat(dateCompletion(lastPartial));
    case '--locked':
      return ['yes', 'no'];
    case '--project-id':
      return miteApi.getProjects({ archived: false }).then(
        projects => projects.map(c => ({
          name: String(c.id),
          description: c.name
        }))
      );
    case '--search':
    case '-s':
      return ['note'];
    case '--service-id':
      return miteApi.getServices({ archived: false }).then(
        service => service.map(c => ({
          name: String(c.id),
          description: c.name + (c.billable ? ' $' : '')
        }))
      );
    case '--sort':
      return listCommand.sort.options;
    case '--tracking':
      return ['yes', 'no'];
    case '--user-id':
      return Promise.all([
        miteApi.getUsers({ archived: false }),
        miteApi.getMyself(),
      ]).then(([users, me]) => {
        return users.map(u => ({
          name: String(u.id),
          description: u.name + (me.id === u.id ? ' (you)' : '')
        }));
      });
  }

  // date completion
  if (lastPartial) {
    const r = dateCompletion(lastPartial);
    if (r && r.length > 1) {
      return r;
    }
  }

  // auto-completion for time-frame option argument
  if (words === 2 && lastPartial.substr(0, 1) !== '-') {
    return TIME_FRAMES.concat(dateCompletion(lastPartial));
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
      name: '--customer-id',
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
      name: '--group-by',
      description: 'optional name of a property or multiple properties that should be used to group the time-entries',
    },
    {
      name: '--help',
      description: 'show help message',
    },
    {
      name: '--project-id',
      description: 'list only time entries from the given project',
    },
    {
      name: '--reversed',
      description: 'sort in reversed direction',
    },
    {
      name: '--search',
      description: 'given a search query will list time-entries where the note matches the given query',
    },
    {
      name: '--service-id',
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
      name: '--user-id',
      description: 'when defined will list only time-entries from the given user',
    },
  ];
};

