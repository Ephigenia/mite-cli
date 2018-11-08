'use strict';

const assert = require('assert');
const csvString = require('csv-string');
const tableLib = require('table')
const table = tableLib.table;

const FORMAT = {
  CSV: 'csv',
  TSV: 'tsv',
  TABLE: 'table'
};
const FORMATS = Object.values(FORMAT);

function formatData(data, format, columns) {
  assert(Array.isArray(data), 'expeceted data to be an array');
  assert.strictEqual(typeof format, 'string', 'expected format to be a string');
  assert(FORMATS.indexOf(format) > -1,
    'invalid value for format provided'
  );

  switch(format) {
    case 'tsv':
      return csvString.stringify(data, "\t");
    case 'csv':
      return csvString.stringify(data);
    case 'table': {
      const tableConfig = {
        border: tableLib.getBorderCharacters('norc'),
        columns: columns
      };
      return table(data, tableConfig);
    }
    default:
      throw new Error('Unknown Format');
  }
}

module.exports = {
  FORMAT,
  FORMATS,
  formatData,
};
