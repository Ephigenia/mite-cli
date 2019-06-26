'use strict';

const config = require('../../config');
const miteApi = require('../mite-api')(config.get());

const NOTE_MAX_LENGTH = (process.stdout.columns || 80) - 20;

/**
 * @typedef TabTabOption
 * @property {String} name
 * @property {String} description

/**
 * Removes all options from the given array which where already used in the
 * given line
 *
 * @param {Array<TabTabOption>} defaults
 * @param {string} line
 * @return {Array<TabTabOption>}
 */
function removeAlreadyUsedOptions(defaults, line = '') {
  return defaults.filter(option => {
    return isOptionUsedInLine(option, line);
  });
}

function isOptionUsedInLine(option, line) {
  return line.indexOf(option.name) === -1;
}

/**
 * Returns an array of options for tabtab which contains the most recent
 * time entries of the current user
 *
 * @param {Object<String>} options request parameters
 * @param {Boolean} options.archived include archived items or not
 * @return {Promise<Array<TabTabOption>>}
 */
async function getMyRecentTimeEntriesOptions(noteMaxLength = NOTE_MAX_LENGTH) {
  return miteApi.getMyRecentTimeEntries()
    .then(timeEntries => timeEntries.map(entry => {
      let note = entry.note || '[no note]';
      if (note.length > noteMaxLength) {
        note = note.substr(0, noteMaxLength - 1) + '…';
      }
      // transform the note to a tabtab option
      return {
        name: String(entry.id),
        description: `${entry.date_at} ${note}`
      };
    }));
}

/**
 * Returns an array of options for tabtab which contains projects
 *
 * @param {Object<String>} options request parameters
 * @param {Boolean} options.archived include archived items or not
 * @return {Promise<Array<TabTabOption>>}
 */
async function getProjectOptions(options = { archived: false }) {
  return miteApi.getProjects(options).then(
    projects => projects.map(c => ({
      name: String(c.id),
      description: c.name
    }))
  );
}

/**
 * Returns an array of options for tabtab which contains services
 * @param {Object<String>} options request parameters
 * @param {Boolean} options.archived include archived items or not
 * @return {Promise<Array<TabTabOption>>}
 */
async function getServiceOptions(options = { archived: false }) {
  return miteApi.getServices(options).then(
    service => service.map(c => ({
      name: String(c.id),
      description: c.name + (c.billable ? ' $' : '')
    }))
  );
}

/**
 * Returns an array of tabtab options containing customers
 * @param {Object<String>} options request parameters
 * @param {Boolean} options.archived include archived items or not
 * @return {Promise<Array<TabTabOption>>}
 */
async function getCustomerOptions(options = { archived: false }) {
  return miteApi.getCustomers(options)
    .then(customer => customer.map(c => ({
      name: String(c.id),
      description: c.name
    })));
}

/**
 * Returns an array of tabtab options containing users
 *
 * @param {Object<String>} options request parameters
 * @param {Boolean} options.archived include archived items or not
 * @return {Promise<Array<TabTabOption>>}
 */
async function getUserIdOptions(options = { archived: false }) {
  return Promise.all([
    miteApi.getUsers(options),
    miteApi.getMyself(),
  ]).then(([users, me]) => {
    return users.map(u => ({
      name: String(u.id),
      description: u.name + (me.id === u.id ? ' (you)' : '')
    }));
  });
}

module.exports = {
  getCustomerOptions,
  getMyRecentTimeEntriesOptions,
  getProjectOptions,
  getServiceOptions,
  getUserIdOptions,
  removeAlreadyUsedOptions,
};
