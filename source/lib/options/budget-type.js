'use strict';

const { BUDGET_TYPES } = require('./../constants');
const EXIT_CODES = require('./../exit-codes');

const option = {
  definition: '--budget_type <budget_type>',
  description: () => (
    'Defines the budget type that should be used. Only accepts one of the ' +
    'following options: ' + BUDGET_TYPES.join(', ')
  ),
  validate: function (v) {
    return BUDGET_TYPES.indexOf(v) > -1;
  },
  parse: function(v) {
    if (typeof v === 'string') {
      v = v.trim().toLowerCase();
    }
    // check if the given value is one of the valid options
    if (!option.validate(v)) {
      console.error(`Invalid value for budget_type: "${v}"`);
      process.exit(EXIT_CODES.INVALID_OPTION_VALUE);
    }
    return v;
  }
};

module.exports = option;
