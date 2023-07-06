#!/usr/bin/env node
"use strict";

const program = require("commander");

const pkg = require("../package.json");

program
  .version(pkg.version)
  .description("Utility to manage mite cache system.")
  .command("clear", "Clear the cache.")
  .parse();

// show help message when the required first argument is not given
if (!program.args.length) {
  program.help();
}
