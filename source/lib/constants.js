'use strict';

module.exports.USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  TIME_TRACKER: 'time_tracker',
  COWORKER: 'coworker',
};

module.exports.TIME_FRAMES = [
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

module.exports.BUDGET_TYPE = {
  MINUTES_PER_MONTH: 'minutes_per_month',
  MINUTES: 'minutes',
  CENTS: 'cents',
  CENTS_PER_MONTH: 'cents_per_month',
};

module.exports.BUDGET_TYPES = Object.values(module.exports.BUDGET_TYPE);
