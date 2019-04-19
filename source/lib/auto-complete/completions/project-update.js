#!/usr/bin/env node
'use strict';

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
module.exports = async ({ prev, line, word }) => {
  const defaults = [
    // do not includ --archived when it’s allready been set
    line.indexOf('--archived') === -1 ? {
      name: '--archived',
      description: 'archive or unarchive a project',
    } : undefined,
    line.indexOf('--name') === -1 ? {
      name: '--name',
      description: 'change the name of the project',
    } : undefined,
    line.indexOf('--note') === -1 ? {
      name: '--note',
      description: 'change the note of the project',
    } : undefined,
    // include --help only when no other arguments or options are provided
    word < 4 ? {
      name: '--help',
      description: 'show help message',
    } : undefined,
  ];

  switch(prev) {
    case '--archived':
      return ['yes', 'no'];
    case '--name':
      return ['name'];
    case '--note':
      return ['note'];
  }

  // show list of archived or unarchived projects depending on the --archived
  // flag wich is allready been given
  const options = {};
  if (line.match(/--archived/)) {
    options.archived = !/--archived[ =](yes|true|1|ja)/.test(line);
  }
  // return a list of project ids and default options
  return miteApi.getProjects(options)
    .then(projects => projects.map(c => ({
      name: String(c.id),
      description: c.name
    })))
    .then(options => [].concat(options, defaults));
};

