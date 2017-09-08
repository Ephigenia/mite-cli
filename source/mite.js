#!/usr/bin/env node
'use strict'

const program = require('commander')

const pkg = require('./../package.json')

program
  .version(pkg.version)
  .command('budgets', 'list money and time budgets for current month')
  .command('config', 'show or set configuration settings')
  .command('list', 'list time entries', {
    isDefault: true
  })
  .command('new', 'create a new time entry')
  .command('stop', 'stop any running counter')
  .command('start', 'start the tracker for the given id, will also stop allready running entry')
  .description(pkg.description)
  .parse(process.argv)
