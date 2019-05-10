'use strict';

const fetch = require('node-fetch');
const assert = require('assert');

class MiteTracker {

  constructor(config) {
    this.config = config;

    this.BASE_URL = `https://${config.account}.mite.yo.lk`;

    const headers = {
      'User-Agent': config.applicationName,
      'X-MiteApiKey': config.apiKey,
      'Content-Type': 'application/json',
    };
    this.opts = { headers };
  }

  async makeRequest(
    url,
    opts = {}
  ) {
    assert.strictEqual(typeof url, 'string', 'expected "url" to be a string');
    assert.strictEqual(typeof opts, 'object', 'expected "opts" to be a string');

    return fetch(url, opts)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      });
  }

  /**
   * @returns {Promise<Number|null>} the id of the currently tracked time entry
   */
  async get () {
    const url = `${this.BASE_URL}/tracker.json`;
    const options = Object.assign({}, this.opts, { method: 'GET' });
    return this.makeRequest(url, options)
      .then(data => {
        // return the id of the entry
        if (!data || !data.tracker || !data.tracker.tracking_time_entry) {
          return null;
        }
        return data.tracker.tracking_time_entry.id;
      });
  }

  /**
   * @param {Number} timeEntryId
   * @returns {Promise<Number|null>} the id of the stopped entry
   */
  async stop (timeEntryId) {
    const url = `${this.BASE_URL}/tracker/${timeEntryId}.json`;
    const options = Object.assign({}, this.opts, { method: 'DELETE' });
    return this.makeRequest(url, options).then(() => timeEntryId);
  }

  /**
   * @param {Number} timeEntryId
   * @returns {Promise<Number|null>} the id of the started entry
   */
  async start (timeEntryId) {
    const url = `${this.BASE_URL}/tracker/${timeEntryId}.json`;
    const options = Object.assign({}, this.opts, { method: 'PATCH' });
    return this.makeRequest(url, options).then(() => timeEntryId);
  }
}

module.exports = function(config) {
  return new MiteTracker(config);
};
