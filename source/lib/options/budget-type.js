'use strict';

const { BUDGET_TYPES } = require('./../constants');

const {
  InvalidOptionValue
} = require('./../errors');

let option = {
  definition: '--budget-type <budget_type>',
  description: function() {
    return (
      'Defines the budget type that should be used. Only accepts one of the ' +
      'following options: ' + BUDGET_TYPES.join(', ')
    )
  },
  validate: function(v) {
    return BUDGET_TYPES.indexOf(v) > -1;
  },
  parse: function(v) {
    if (typeof v === 'string') {
      v = v.trim().toLowerCase();
    }
    // check if the given value is one of the valid options
    if (!option.validate(v)) {
      throw new InvalidOptionValue(`Invalid value for budget-type: "${v}"`);
    }
    return v;
  }
};

module.exports = option;
