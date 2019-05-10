'use strict';

const option = {
  definition: '--billable <true|false|all>',
  description: () => (
    'defines the billable state or filter option'
  ),
  parse: function(input) {
    if (typeof input !== 'string') {
      return input;
    }
    input = input.toLowerCase().trim();
    if (input === 'all') return 'all';
    return ['true', 'yes', 'ja', 'ok', '1'].indexOf(input) > -1;
  }
};

module.exports = option;
