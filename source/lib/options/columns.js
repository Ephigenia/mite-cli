'use strict';

module.exports = {
  definition: '--columns <columns>',

  description: (options) => {
    return (
      'custom list of columns to use in the output, pass in a comma-separated ' +
      'list of attribute names: ' + Object.keys(options).join(', ')
    );
  },

  /**
   * Parse the command line option value
   * @param {string} str the command line option value
   * @return {string}
   */
  parse: (str) => {
    // normalize column names to lowercase, no spaces, non-empty string
    return str.split(',')
      .map(v => v.trim().toLowerCase())
      .filter(v => v) // remove empty strings
      .join(',');
  },

  /**
   * Check if any of the given columns has a reducer function
   *
   * @param {import("../data-output").ColumnDefinition[]} columns
   * @returns {boolean}
   */
  hasReducer: function(columns) {
    return Boolean(columns.find(c => c.reducer));
  },

  /**
   * @param {string} csvList string containing column names seperated with comma
   * @param {import("../data-output").ColumnDefinition[]} columnDefinitions list of all available
   *   columns
   * @return {import("../data-output").ColumnDefinition[]} resolved columns
   */
  resolve: function (csvList, columnDefinitions) {
    columnDefinitions = columnDefinitions || [];
    if (csvList === 'all') {
      return Object.values(columnDefinitions);
    }
    // convert list of column names to definitions of the columns
    return this.parse(csvList)
      .split(',')
      .filter(v => v)
      .map(attrName => {
        const columnDefinition = columnDefinitions[attrName];
        if (!columnDefinition) {
          throw new Error(`Invalid column name ${JSON.stringify(attrName)}`);
        }
        return columnDefinition;
      });
  }
};
