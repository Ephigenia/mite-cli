'use strict';

module.exports = {
  amend: require('./amend'),
  autocomplete: require('./autocomplete'),
  config: require('./config'),
  customer: require('./customer'),
  customers: require('./customers'),
  delete: require('./delete'),
  list: require('./list'),
  lock: require('./lock'),
  new: require('./new'),
  project: require('./project'),
  projects: require('./projects'),
  service: require('./service'),
  services: require('./services'),
  start: require('./start'),
  // stop: no auto completion for stop as there can only be one time entry
  // running at a time and there’s no need for proposing other time entries
  unlock: require('./unlock'),
  users: require('./users'),
};
