#!/usr/bin/env node
'use strict';

const config = require('./../../../config.js');

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
  switch(words) {
    case 2: {
      return [
        {
          name: 'set',
          description: 'set a config variable'
        },
        { name: 'get',
          description: 'get a config variable'
        },
        { name: 'list',
          description: 'show all variables and their values'
        },
        {
          name: '--help',
          description: 'show help message'
        }
      ];
    }
    case 3: {
      const configKeys = Object.keys(config.get());
      // @TODO add name / description combinations for config variables
      // for better explanation
      delete configKeys.type;
      return configKeys;
    }
    case 4: {
      const value = config.get(prev);
      return [value];
    }
  }
};
