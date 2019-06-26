#!/usr/bin/env node
'use strict';

const projectDeleteCompletion = require('./project-delete');
const projectNewCompletion = require('./project-new');
const projectUpdateCompletion = require('./project-update');
const projectsListCompletion = require('./projects');

const defaults = [
  {
    name: 'delete',
    description: 'delete a single project by it’s id',
  },
  {
    name: 'list',
    description: 'lists projects',
  },
  {
    name: 'update',
    description: 'update a single project by it’s id',
  },
  {
    name: 'new',
    description: 'create a new project',
  },
  {
    name: '--help',
    description: 'show help message',
  },
];

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
  // check if a sub command was accessed and return the auto-completion of
  // this sub-command instead, in this case subcommand would be at the 3rd
  // place
  const subCommand = line.split(/\s/).splice(2)[0];
  switch (subCommand) {
    case 'delete':
      return projectDeleteCompletion.apply(projectDeleteCompletion, arguments);
    case 'list':
      return projectsListCompletion.apply(projectDeleteCompletion, arguments);
    case 'new':
    case 'create':
      return projectNewCompletion.apply(projectNewCompletion, arguments);
    case 'update':
      return projectUpdateCompletion.apply(projectUpdateCompletion, arguments);
  }

  // otherwise return defaults
  return defaults;
};
