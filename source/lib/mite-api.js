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
    getMyself: async function() {
      return util.promisify(this.mite.getMyself)().then(data => data.user);
    },

    sort: function(items, attribute) {
      // @TODO add assertions
      return items.sort((a, b) => {
        var val1 = String(a[attribute]).toLowerCase();
        var val2 = String(b[attribute]).toLowerCase();
        if (val1 > val2) {
          return 1;
        } else if (val1 < val2) {
          return -1;
        } else {
          return 0;
        }
      });
    },

    getItemsAndArchived: async function(itemName, options = {}) {
      const defaultOpts = {
        limit: 1000
      };
      const itemNamePluralCamelCased = itemName.substr(0, 1).toUpperCase() + itemName.substr(1) + 's';
      const opts = Object.assign({}, defaultOpts, options);

      return Promise.all([
        util.promisify(mite['get' + itemNamePluralCamelCased])(opts),
        util.promisify(mite['getArchived' + itemNamePluralCamelCased])(opts),
      ])
      .then(results => Array.prototype.concat.apply([], results))
      .then(items => items.map(c => c[itemName]))
      .then(items => items.filter(item => {
        if (typeof options.archived === 'boolean') {
          return item.archived === options.archived;
        }
        return true;
      }))
      // always sort by name
      .then(items => this.sort(items, 'name'));
    },

    getCustomers: async function (options = {}) {
      return this.getItemsAndArchived('customer', options);
    },

    getProjects: async function (options = {}) {
      return this.getItemsAndArchived('project', options);
    },

    getServices: async function(options = {}) {
      return this.getItemsAndArchived('service', options);
    },

    getUsers: async function (options = {}) {
      return this.getItemsAndArchived('user', options);
    },
  };
}

module.exports = miteApiWrapper;
