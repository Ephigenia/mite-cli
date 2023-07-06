#!/usr/bin/env node
"use strict";

const program = require("commander");

const pkg = require("./../package.json");
const Cache = require("./lib/cache");
const config = require("./config");
const { handleError } = require("./lib/errors");

program
  .version(pkg.version)
  .description("Clear the cache of mite data.");

function main() {
  const cachePath = config.stores.defaults.store.cacheFilename;
  const cache = new Cache(cachePath);
  process.stdout.write('Clearing cache...\n');
  cache.clear().then(() => {
    process.stdout.write('Cleared.\n');
  });
}

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
