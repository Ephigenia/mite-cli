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
   * @return {string}
   */
  parse: (str) => {
    // normalize column names to lowercase, no spaces, non-empty string
    return str.split(',')
      .map(v => v.trim().toLowerCase())
      .filter(v => v)
      .join(',');
  },
  hasReducer: function(columns) {
    return columns.find(c => c.reducer);
  },
  /**
   *
   * @param {string} csvList
   * @param {Array<ColumnDefinition>} all available columns
   * @return {Array<ColumnDefinition>} columns
   */
  resolve: function (csvList, columns) {
    if (csvList === 'all') {
      return Object.values(columns);
    }
    // convert list of column names to definitions of the columns
    return this.parse(csvList).split(',').filter(v => v)
      .map(attrName => {
        const columnDefinition = columns[attrName];
        if (!columnDefinition) {
          throw new Error(`Invalid column name "${attrName}"`);
        }
        return columnDefinition;
      });
  }
};
