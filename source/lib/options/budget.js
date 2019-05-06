'use strict';

const formater = require('./../formater');

const {
  MissingRequiredOptionError,
  InvalidOptionValue
} = require('./../errors');

const option = {
  definition: '--budget <budget>',
  description: () => (
    'Defines the budget either in minutes or cents, alternatively also a ' +
    'duration value can be used. F.e. 23:42 for 23 hours and 42 minutes.'
  ),
  parse: function(input) {
    if (!input) {
      throw new InvalidOptionValue('Invalid value for budget option');
    }

    let result;
    // budget in duration format should be converted to minutes
    if (input.match(/^\d+:\d+$/)) {
      result = formater.durationToMinutes(input);
    } else if (input.match(/^\d+$/)) {
      result = parseInt(input, 10);
    }

    if (!result || isNaN(result)) {
      throw new MissingRequiredOptionError(`Invalid value for budget: "${input}"`);
    }

    return result;
  }
};

module.exports = option;
