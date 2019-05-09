'use strict';

const { FORMATS } = require('./../data-output');

module.exports = {
  definition: '-f, --format <format>',
  description: () => (
    `defines the output format, valid options are ${FORMATS.join(', ')}`
  ),
  parse: (str) => {
    return str;
  },
};
