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
  let options = [];

  switch(words) {
    case 2: {
      options.push(['note']);
      break;
    }
    // project
    case 3: {
      const projects = await miteApi.getProjects({ archived: false });
      options.push(...projects.map(p => (p.name)));
      break;
    }
    // service
    case 4: {
      const services = await miteApi.getServices({ archived: false });
      options.push(...services.map(s => (
        {
          name: s.name,
          description: s.name + (s.billable ? ' $' : '')
        }
      )));
      break;
    }
    // minutes
    case 5: {
      // add one option for each time interval which should be most common
      const minutes = [1, 5, 15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480];
      options.push(...minutes.map(minutes => ({
        description: `${minutes} minute(s)`,
        name: formater.minutesToDuration(minutes),
      })));
      break;
    }
    // date
    case 6: {
      options.push([
        // add YYYY-MM-DD as option
        (new Date()).toISOString().substr(0, 10)
      ]);
      break;
    }
  }

  return options;
};
