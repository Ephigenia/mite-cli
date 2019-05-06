'use strict';

const util = require('util');
const assert = require('assert');

const miteApi = require('mite-api');

/**
 * @typedef MiteTimeEntry
 * @property {Number} customer_id
 * @property {Number} minutes
 * @property {Number} project_id
 * @property {Number} service_id
 * @property {String} date_at
 * @property {String} note
 */

/**
 * Simple wrapper for some of the mite api methods
 */
function miteApiWrapper(config) {

  const mite = miteApi(config);

  return {

    mite: mite,

    /**
     * Returns the user object for the current requesting user (identified
     * by the API key)
     *
     * @typedef MiteUser
     * @property {Number} id
     * @property {String} name full name of the user
     *
     * @returns {Promise<MiteUser>} user object
     */
    getMyself: async function() {
      return util.promisify(this.mite.getMyself)().then(data => data.user);
    },

    /**
     * @param {@MiteTimeEntry} timeEntry
     * @returns {Promise<object>}
     */
    addTimeEntry: async function(timeEntry) {
      const mite = this.mite;
      return new Promise(function(resolve, reject) {
        // addTimeEntry cannot use util.promisify as it doesn't match the
        // standard callback
        mite.addTimeEntry({ time_entry: timeEntry }, (response) => {
          // response contains the created time entry as a string
          const data = JSON.parse(response);
          if (data.error) {
            return reject(new Error(data.error));
          }
          return resolve(data);
        });
      });
    },

    /**
     * Returns an array containing the most recent time-entries from the
     * current user.
     *
     * @param {Number} limit
     * @returns {Promise<MiteTimeEntry>}
     */
    getMyRecentTimeEntries: async function(limit = 5) {
      assert.strictEqual(typeof limit, 'number', 'expected limit to be number');
      return this.getMyself()
        .then(me => {
          const options = {
            user_id: me ? me.id : undefined,
            limit: limit,
            sort: 'date_at',
            direction: 'desc',
          };
          return util.promisify(this.mite.getTimeEntries)(options);
        })
        .then(items => items.map(item => item.time_entry));
    },

    /**
     * Returns an ordered copy of the given items where the given attribute
     * is used for comparison. String comparison is case-insensitive.
     *
     * @param {Array<Object>} items
     * @param {Array<String>|string} attributes either a single attribute name
     *   which should be used for ordering the items or a list of attributes
     * @param {Object<String>} aliases hashmap containing attribute aliases
     * @throws {Error} when item or attribute are not valid
     * @return {Array<Object>}
     */
    sort: function(items, attributes = [], aliases = {}) {
      if (typeof attributes === 'string') {
        attributes = [attributes];
      }
      assert.strictEqual(true, Array.isArray(items),
        'expected items to be an array'
      );
      assert.strictEqual(true, Array.isArray(attributes),
        'expected attributes to be a an array of strings'
      );

      // store directions for the attributes using the index of the attribute
      const directions = attributes.map(attribute => {
        return (attribute.substr(0, 1) === '-') ? 'desc' : 'asc';
      });
      // remove "-" from the attribute’s name
      attributes = attributes.map(attribute => {
        return (attribute.substr(0, 1) === '-') ? attribute.substr(1) : attribute;
      });
      // replace aliases with their actual attribute
      attributes = attributes.map(attribute => {
        if (aliases[attribute]) return aliases[attribute];
        return attribute;
      });

      const that = this;
      return items.sort(function(a, b) {
        let val1 = attributes.map(attribute => a[attribute]);
        let val2 = attributes.map(attribute => b[attribute]);

        let scores = [];
        for (let i = 0; i < val1.length; i++) {
          const score = that.sortCompare(val1[i], val2[i], directions[i]);
          if (scores.length === 0) {
            scores.push(score);
          } else if (scores[i-1] === 0) {
            scores.push(score);
          }
        }

        return scores.reduce((acc, cur) => acc + cur, 0);
      });
    },

    sortCompare: (a, b, direction = 'asc') => {
      if (typeof a === 'string') a = a.toLowerCase();
      if (typeof b === 'string') b = b.toLowerCase();
      if (typeof a === 'boolean' && typeof b === 'boolean') {
        if (a > b) return direction === 'asc' ? -1 : 1;
        if (a < b) return direction === 'asc' ? 1 : -1;
        return 0;
      }
      if (a > b) return direction === 'asc' ? 1 : -1;
      if (a < b) return direction === 'asc' ? -1 : 1;
      return 0;
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
