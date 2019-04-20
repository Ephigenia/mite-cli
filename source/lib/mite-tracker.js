'use strict';

const fetch = require('node-fetch');
const assert = require('assert');

module.exports = (config) => {
  const BASE_URL = `https://${config.account}.mite.yo.lk`;

  let headers = {
    'User-Agent': config.applicationName,
    'X-MiteApiKey': config.apiKey,
    'Content-Type': 'application/json',
  };
  const opts = {
    headers
  };

  async function makeRequest(
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

  return {
    get: async () => {
      const url = `${BASE_URL}/tracker.json`;
      const options = Object.assign({}, opts);
      return makeRequest(url, options);
    },
    stop: async (timeEntryId) => {
      const url = `${BASE_URL}/tracker/${timeEntryId}.json`;
      const options = Object.assign({}, opts, { method: 'DELETE' });
      return makeRequest(url, options);
    },
    start: async (timeEntryId) => {
      const url = `${BASE_URL}/tracker/${timeEntryId}.json`;
      const options = Object.assign({}, opts, { method: 'PATCH' });
      return makeRequest(url, options);
    }
  };
};
