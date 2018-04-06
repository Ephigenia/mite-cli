var request = require('request')

module.exports = (config) => {
  const baseUrl = `https://${config.account}.mite.yo.lk`

  let headers = {
    'User-Agent': config.applicationName,
    'X-MiteApiKey': config.apiKey,
    'Content-Type': 'application/json',
  }
  const opts = {
    json: true,
    headers
  }

  function makeRequest(opts) {
    return new Promise((resolve, reject) => {
      request(opts, (err, response) => {
        if (err) {
          return reject(err)
        }
        if (response.body.error) {
          return reject(new Error(response.body.error));
        }
        return resolve(response.body);
      })
    })
  }

  return {
    get: () => {
      opts.url = `${baseUrl}/tracker.json`
      return makeRequest(opts)
    },
    stop: (timeEntryId) => {
      opts.url = `${baseUrl}/tracker/${timeEntryId}.json`
      opts.method = 'DELETE'
      return makeRequest(opts)
    },
    start: (timeEntryId) => {
      opts.url = `${baseUrl}/tracker/${timeEntryId}.json`
      opts.method = 'PATCH'
      return makeRequest(opts)
    }
  }
}
