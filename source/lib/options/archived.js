'use strict';

const option = {
  definition: '--archived <true|false>',
  description: () => (
    'defines the archived state or filter option'
  ),
  parse: function(input) {
    if (typeof input !== 'string') {
      return input;
    }
    input = input.toLowerCase().trim();
    return ['true', 'yes', 'ja', 'ok', '1', ].indexOf(input) > -1;
  }
};

module.exports = option;
