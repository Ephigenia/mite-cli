'use strict';

const assert = require('assert');
const csvString = require('csv-string');
const tableLib = require('table');
const table = tableLib.table;
const markdownTable = require('markdown-table');

const FORMAT = {
  CSV: 'csv',
  TSV: 'tsv',
  TABLE: 'table',
  MD: 'md',
  TEXT: 'text',
};
const FORMATS = Object.values(FORMAT);

function formatData(data, format, columns) {
  assert(Array.isArray(data), 'expeceted data to be an array');
  assert.strictEqual(typeof format, 'string', 'expected format to be a string');
  assert(FORMATS.indexOf(format) > -1,
    'invalid value for format provided'
  );

  switch(format) {
    case 'csv':
      return csvString.stringify(data);
    case 'md':
      return markdownTable(data);
    case 'table': {
      const tableConfig = {
        border: tableLib.getBorderCharacters('norc'),
        columns: columns
      };
      return table(data, tableConfig);
    }
    case 'text':
      // first data item contains the column names
      return data.splice(1).join("\n");
    case 'tsv':
      return csvString.stringify(data, "\t");
    default:
      throw new Error('Unknown Format');
  }
}

module.exports = {
  FORMAT,
  FORMATS,
  formatData,
};
