'use strict';

module.exports = {
  description: (options) => {
    return (
      `optional column name(s) which define the order of the results shown. ` +
      `You can prepend a "-" to reverse the sort order: f.e. "-archived,budget". ` +
      `valid values: ${options.join(', ')}`
    );
  },
  parse: (str) => {
    if (!str) return [];
    return str.split(/,/).map(v => v.trim()).filter(v => v);
  },
  resolve: function (sortOptions, columns) {
    if (!sortOptions) return [];
    if (typeof sortOptions === 'string') {
      sortOptions = this.parse(sortOptions);
    }
    return sortOptions
      .map(attribute => {
        const attr = attribute.replace(/^-/, '');
        // check if each attribute is valid
        if (columns.indexOf(attr) === -1) {
          throw new Error(
            `Invalid value for sort option: "${attr}", ` +
            `valid values are: ${columns.join(', ')}`,
          );
        }
        return attribute;
      });
  }
};
