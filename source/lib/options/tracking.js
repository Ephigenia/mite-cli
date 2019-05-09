'use strict';

const option = {
  definition: '--tracking <true|false>',
  description: () => (
    'filter for time-entries which are currently running'
  ),
  parse: function(input) {
    if (typeof input !== 'string') {
      return input;
    }
    input = input.toLowerCase().trim();
    return ['true', 'yes', 'ja', 'ok', '1'].indexOf(input) > -1;
  }
};

module.exports = option;
