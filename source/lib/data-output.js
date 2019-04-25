'use strict';

const chalk = require('chalk');
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

/**
 * @typedef ColumnDefinition
 * @property {String} label label used for the table header
 * @property {String} attribute name of the attribute which should be shown
 * @property {function} format optional function for formatting the value
 * @property {Number} width fixed with column
 * @property {String} alignment either left, right or center
 * @property {Boolean} wrapWord flag for wrapping long words when column width reached
 */

/**
 * @param {Array<Object>} data
 * @param {String} format
 * @param {Array<ColumnDefinition>} columns
 */
function formatData(data, format, columns) {
  assert(Array.isArray(data), 'expeceted data to be an array');
  assert(Array.isArray(columns), 'expeceted columns to be an array');
  assert.strictEqual(typeof format, 'string', 'expected format to be a string');

  // adds table header
  data.unshift(columns
    .map(columnDefinition => columnDefinition.label)
    .map(v => chalk.bold(v))
  );

  // format the output according to the given format
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
      // first data item contains the column names which should be omitted
      return data.splice(1).join("\n");
    case 'tsv':
      return csvString.stringify(data, "\t");
    default:
      throw new Error(`Unknown format "${format}"`);
  }
}

module.exports = {
  FORMAT,
  FORMATS,
  formatData,
};
