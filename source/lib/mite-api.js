'use strict';

const util = require('util');
const miteApi = require('mite-api');

/**
 * Simple wrapper for some of the mite api methods
 */
function miteApiWrapper(config) {

  const mite = miteApi(config);

  return {

    mite: mite,

    getProjects: async (options = {}) => {
      const defaultOpts = {
        limit: 1000
      };
      const opts = Object.assign({}, defaultOpts, options);
      return Promise.all([
        util.promisify(mite.getProjects)(opts),
        util.promisify(mite.getArchivedProjects)(opts),
      ]).then(results => {
        // merge both results into one array
        return [].concat(results[0], results[1]);
      }).then(project => {
        // unwrap the object.customers nesting
        return project.map(c => c.project);
      });
    },

    getCustomers: async (options = {}) => {
      const defaultOpts = {
        limit: 1000
      };
      const opts = Object.assign({}, defaultOpts, options);
      return Promise.all([
        util.promisify(mite.getCustomers)(opts),
        util.promisify(mite.getArchivedCustomers)(opts),
      ]).then(results => {
        // merge both results into one array
        return [].concat(results[0], results[1]);
      }).then(customers => {
        // unwrap the object.customers nesting
        return customers.map(c => c.customer);
      });
    }
  };
};

module.exports = miteApiWrapper;
