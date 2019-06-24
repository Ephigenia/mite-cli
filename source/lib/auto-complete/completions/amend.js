#!/usr/bin/env node
'use strict';

const config = require('./../../../config');
const miteApi = require('./../../mite-api')(config.get());

const NOTE_MAX_LENGTH = (process.stdout.columns || 80) - 20;

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
module.exports = async ({ line, words, prev }) => {

  switch (prev) {
    case '--project-id':
      return miteApi.getProjects({ archived: false }).then(
        projects => projects.map(c => ({
          name: String(c.id),
          description: c.name
        }))
      );
    case '--service-id':
        return miteApi.getServices({ archived: false }).then(
          service => service.map(c => ({
            name: String(c.id),
            description: c.name + (c.billable ? ' $' : '')
          }))
        );
  }

  const defaults = [
    (words < 3 ? {
      name: '--help',
      description: 'show help message'
    } : undefined),
    (line.indexOf('--editor') === -1 ? {
      name: '--editor',
      description: 'open $EDITOR for editing the entry’s note'
    } : undefined),
    {
      name: '--project-id',
      description: 'id of the project the entry should be assigned to'
    },
    {
      name: '--service  -id',
      description: 'id of the service  the entry should be assigned to'
    }
  ];

  // try to find the latest entries created by the current user and propose the
  // ids of these
  return miteApi.getMyRecentTimeEntries()
    .then(timeEntries => timeEntries.map(entry => {
      let note = entry.note || '[no note]';
      if (note.length > NOTE_MAX_LENGTH) {
        note = note.substr(0, NOTE_MAX_LENGTH - 1) + '…';
      }
      return {
        name: String(entry.id),
        description: `${entry.date_at} ${note}`
      };
    }))
    .then(options => {
      return [].concat([], options, defaults);
    });
};
