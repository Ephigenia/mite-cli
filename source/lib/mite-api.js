'use strict';

const util = require('util');
const assert = require('assert');

const miteApi = require('mite-api');

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
     * @typedef MiteTimeEntry
     * @property {Number} customer_id
     * @property {Number} minutes
     * @property {Number} project_id
     * @property {Number} service_id
     * @property {String} date_at
     * @property {String} note
     *
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
     * @typedef MiteTimeEntry
     * @property {Number} id
     * @property {String} note note of the entry
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
     * @param {String} attribute
     * @param {Object<String>} aliases hashmap containing attribute aliases
     * @throws {Error} when item or attribute are not valid
     * @return {Array<Object>}
     */
    sort: function(items, attribute = false, aliases = {}) {
      if (!attribute) return items;
      assert.strictEqual(true, Array.isArray(items),
        'expected items to be an array'
      );
      assert.strictEqual(typeof attribute, 'string',
        'expected attribute to be a valid string'
      );
      // check if alias defined
      if (aliases && aliases[attribute]) {
        attribute = aliases[attribute];
      }
      return items.sort((a, b) => {
        let val1 = a[attribute];
        let val2 = b[attribute];
        // type conversion for accurate comparison
        if (typeof val1 === 'string') val1 = val1.toLowerCase();
        if (typeof val2 === 'string') val2 = val2.toLowerCase();
        if (typeof val1 === 'boolean' && typeof val2 === 'boolean') {
          if (val1 > val2) return -1;
          if (val1 < val2) return 1;
          return 0;
        }
        if (val1 > val2) return 1;
        if (val1 < val2) return -1;
        return 0;
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
