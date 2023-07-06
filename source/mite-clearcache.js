#!/usr/bin/env node
"use strict";

const program = require("commander");

const pkg = require("./../package.json");
const config = require("./config");
const fs = require('fs');
const { handleError } = require("./lib/errors");

program
  .version(pkg.version)
  .description("Clear the cache of mite data.");

function main() {
  const cachePath = config.stores.defaults.store.cacheFilename;
  fs.writeFile(cachePath, '{}', (err) => {
    if (err) throw err;
    process.stdout.write('Cache cleared.\n');
  });
}

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
