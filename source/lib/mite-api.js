'use strict';

const util = require('util');
const assert = require('assert');

const miteApi = require('mite-api');
const { BUDGET_TYPE } = require('./../lib/constants');

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
 * @typedef MiteConfig
 * @property {String} apiKey mite api key
 * @property {String} account name of the account / subdomain
 */

/**
 * Simple wrapper for some of the mite api methods
 */
class MiteApiWrapper {

  /**
   *
   * @param {MiteConfig} config
   */
  constructor(config) {
    this.config = config;
    this.mite = miteApi(config);
  }

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
  async getMySelf() {
    return util.promisify(this.mite.getMyself)().then(data => data.user);
  }

  /**
   * @param {@MiteTimeEntry} timeEntry
   * @returns {Promise<object>}
   */
  async addTimeEntry(timeEntry) {
    const mite = this.mite;
    return new Promise(function(resolve, reject) {
      // addTimeEntry cannot use util.promisify as it doesn't match the
      // standard callback
      mite.addTimeEntry({ time_entry: timeEntry }, (err, json) => {
        if (err) {
          return reject(err);
        }
        if (json && json.error) {
          return reject(new Error(json.error));
        }
        return resolve(json);
      });
    });
  }

  /**
   * Returns an array containing the most recent time-entries from the
   * current user.
   *
   * @param {Number} limit
   * @returns {Promise<MiteTimeEntry>}
   */
  async getMyRecentTimeEntries(limit = 5) {
    assert.strictEqual(typeof limit, 'number', 'expected limit to be number');
    return this.getMySelf()
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
  }

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
  sort (items, attributes = [], aliases = {}) {
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
  }

  getMonthlyUsedProjectBudgets (projects) {
    // only request time entries that belong to projects that have a
    // budget defined
    const filteredBudgetTypes = [
      BUDGET_TYPE.MINUTES_PER_MONTH,
      BUDGET_TYPE.CENTS_PER_MONTH,
    ];
    const projectIds = projects
      .filter(p => p.budget)
      .filter(p => filteredBudgetTypes.indexOf(p.budget_type) > -1)
      .map(p => p.id);
    if (!projectIds.length) return Promise.resolve([]);
    const query = {
      project_id: projectIds.join(','),
      group_by: 'project,month',
      order: 'month',
      // at: 'this_month',
    };
    return util.promisify(this.mite.getTimeEntries)(query)
      // .then(r => {

      //   console.log(r);
      //   return r;
      // })
      .then(r => r.map(i => i.time_entry_group));
  }

  getProjectsTotalRevenue (projects) {
    const projectIds = projects.map(project => project.id);
    const query = {
      project_id: projectIds.join(','),
      group_by: 'project',
    };
    if (!projectIds.length) return Promise.resolve(projects);
    return util.promisify(this.mite.getTimeEntries)(query)
      .then(r => r.map(i => i.time_entry_group))
      .then(results => {
        results.forEach((result) => {
          const proj = projects.find(p => p.id === result.project_id);
          if (proj) {
            proj.revenue = result.revenue;
          }
        });
        return projects;
      });
  }

  getTotalUsedProjectBudget (projects) {
    // only request time entries that belong to projects that have a
    // budget defined
    const filteredBudgetTypes = [
      BUDGET_TYPE.MINUTES,
      BUDGET_TYPE.CENTS,
    ];
    const projectIds = projects
      .filter(p => p.budget)
      .filter(p => filteredBudgetTypes.indexOf(p.budget_type) > -1)
      .map(p => p.id);
    if (!projectIds.length) return Promise.resolve([]);
    const query = {
      project_id: projectIds.join(','),
      group_by: 'project',
    };
    return util.promisify(this.mite.getTimeEntries)(query)
      .then(r => r.map(i => i.time_entry_group));
  }

  getUsedProjectBudgets (projects) {
    return Promise.all([
      this.getTotalUsedProjectBudget(projects),
      this.getMonthlyUsedProjectBudgets(projects)
    ])
      .then(([list1, list2]) => list1.concat(list2))
      .then(results => {
        // extend the matching project with a new key "used_budget" which
        // contains the result of the grouped time entry request which can
        // be used to determine the percentage of used budget
        results.forEach((result) => {
          const proj = projects.find(p => p.id === result.project_id);
          if (proj && !proj.used_budget) {
            proj.used_budget = result;
          }
        });
        return projects;
      });
  }

  sortCompare (a, b, direction = 'asc') {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return this.sortBoolean(a, b, direction);
    }
    if (typeof a === 'string') a = a.toLowerCase();
    if (typeof b === 'string') b = b.toLowerCase();
    if (direction === 'asc') {
      return (a > b) - (a < b);
    } else {
      return ((a > b) - (a < b)) * -1;
    }
  }

  sortBoolean (a, b, direction = 'asc') {
    if (direction === 'asc') return b - a;
    return a - b;
  }

  filterItem(item, regexp) {
    return regexp.test((item || {}).name);
  }

  filterItems(items, query) {
    if (!query) return items;
    const queryRegexp = new RegExp(query, 'i');
    return items.filter(item => this.filterItem(item, queryRegexp));
  }

  /**
   * Returns an array of tabtab options containing users
   *
   * @param {String} itemName name of the resource that should be requested
   * @param {Object<String>} options request parameters
   * @param {Boolean} options.archived include archived items or not
   * @param {String} options.query optional search string that is tried to match
   *   on each item’s name.
   * @return {Promise<Array<Object>>}
   */
  async getItemsAndArchived(itemName, options = {}) {
    const defaultOpts = {
      limit: 1000
    };
    const itemNamePluralCamelCased = itemName.substr(0, 1).toUpperCase() + itemName.substr(1) + 's';
    const opts = Object.assign({}, defaultOpts, options);
    return Promise.all([
      util.promisify(this.mite['get' + itemNamePluralCamelCased])(opts),
      util.promisify(this.mite['getArchived' + itemNamePluralCamelCased])(opts),
    ])
    .then(results => Array.prototype.concat.apply([], results))
    .then(items => items.map(c => c[itemName]))
    .then(items => items.filter(item => {
      if (typeof options.archived === 'boolean') {
        return item.archived === options.archived;
      }
      return true;
    }))
    .then(items => this.filterItems(items, options.query))
    // always sort by name
    .then(items => this.sort(items, 'name'));
  }

  async getCustomers (options = {}) {
    return this.getItemsAndArchived('customer', options);
  }

  async getProjects (options = {}) {
    return this.getItemsAndArchived('project', options);
  }

  async getServices(options = {}) {
    return this.getItemsAndArchived('service', options);
  }

  async getUsers (options = {}) {
    return this.getItemsAndArchived('user', options);
  }
}

module.exports = function(config) {
  return new MiteApiWrapper(config);
};
