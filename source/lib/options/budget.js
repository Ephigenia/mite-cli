'use strict';

const EXIT_CODES = require('./../exit-codes');
const formater = require('./../formater');

const option = {
  definition: '--budget <budget>',
  description: () => (
    'Defines the budget either in minutes or cents, alternatively also a ' +
    'duration value can be used. F.e. 23:42 for 23 hours and 42 minutes.'
  ),
  parse: function(input) {
    if (!input) {
      console.error(`Invalid value for budget`);
      process.exit(EXIT_CODES.INVALID_OPTION_VALUE);
    }

    let result;
    // budget in duration format should be converted to minutes
    if (input.match(/^\d+:\d+$/)) {
      result = formater.durationToMinutes(input);
    } else if (input.match(/^\d+$/)) {
      result = parseInt(input, 10);
    }

    if (!result || isNaN(result)) {
      console.error(`Invalid value for budget: "${input}"`);
      process.exit(EXIT_CODES.INVALID_OPTION_VALUE);
    }

    return result;
  }
};

module.exports = option;
