'use strict';

module.exports = {
  definition: '--columns <columns>',
  description: (options) => {
    return (
      'custom list of columns to use in the output, pass in a comma-separated ' +
      'list of attribute names: ' + Object.keys(options).join(', ')
    );
  },
  parse: (str) => {
    return str.split(',')
      .map(v => v.trim().toLowerCase())
      .filter(v => v)
      .join(',');
  },
  hasReducer: function(columns) {
    return columns.find(c => c.reducer);
  },
  resolve: function (csvList, columns) {
    if (csvList === 'all') {
      return Object.values(columns);
    }
    return this.parse(csvList).split(',')
      .map(attrName => {
        const columnDefinition = columns[attrName];
        if (!columnDefinition) {
          throw new Error(`Invalid column name "${attrName}"`);
        }
        return columnDefinition;
      });
  }
};
