const fs = require('fs');

class Cache {

  constructor(filename) {
    this.filename = filename;
    this.loaded = false;
    this.cache = {};
  }

  serialize(cache) {
    return JSON.stringify(cache);
  }

  deserialize(string) {
    return JSON.parse(string);
  }

  createCacheItem(value, options) {
    const now = new Date();
    const timestamp = now.getTime();
    const expire = options.expire || timestamp + (options.ttl * 1000);
    return { value, timestamp, expire };
  }

  isExpired(item) {
    if (!item) return true;
    return item.expire <= new Date().getTime();
  }

  async load() {
    if (this.loaded) {
      return this;
    }
    const content = await fs.promises.readFile(this.filename);
    this.cache = this.deserialize(content);
    this.loaded = true;
    return this;
  }

  async save() {
    await fs.promises.writeFile(this.filename, this.serialize(this.cache));
    return this;
  }

  key(input) {
    return JSON.stringify(input);
  }

  clear() {
    this.cache = {};
    return this;
  }

  async set(key, value, { ttl, expire }) {
    await this.load();
    this.cache[this.key(key)] = this.createCacheItem(value, { ttl, expire });
    return this;
  }

  async get(key) {
    await this.load();
    const item = this.cache[this.key(key)];
    // only return the item’s value when it’s not expired
    if (item && !this.isExpired(item)) {
      return item.value;
    }
    return undefined;
  }

  async delete(key) {
    await this.load();
    delete this.cache[this.key(key)];
    return this;
  }
}

module.exports = Cache;
