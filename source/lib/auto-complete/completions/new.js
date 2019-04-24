#!/usr/bin/env node
'use strict';

const config = require('./../../../config');
const miteApi = require('./../../mite-api')(config.get());

const formater = require('./../../formater');

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
module.exports = async ({ words }) => {

  switch(words) {
    case 2: {
      return ['note'];
    }
    // project
    case 3: {
      return miteApi.getProjects({ archived: false }).then(
        projects => projects.map(p => (p.name))
      );
    }
    // service
    case 4: {
      return miteApi.getServices({ archived: false }).then(
        service => service.map(s => ({
          name: s.name,
          description: s.name + (s.billable ? ' $' : '')
        }))
      );
    }
    // minutes
    case 5: {
      const minutes = [1, 5, 15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480];
      return minutes.map(minutes => ({
        description: String(minutes) + ' minute(s)',
        name: formater.minutesToDuration(minutes),
      }));
    }
    // date
    case 6: {
      return [
        (new Date()).toISOString().substr(0, 10)
      ];
    }
  }
};
