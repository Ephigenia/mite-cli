#!/usr/bin/env node
'use strict'

const program = require('commander');
const miteApi = require('mite-api');
const chalk = require('chalk');
const tableLib = require('table')
const table = tableLib.table;

const pkg = require('./../package.json');
const config = require('./config.js');

program
  .version(pkg.version)
  .description('list & search for users')
  .option(
    '-s, --search <query>',
    'search for users who’s name contains the given query string ' +
    'while beeing not case-sensivite. No support multiple values.'
  )
  .option(
    '-e, --email <query>',
    'search for users who’s email contains the given query string ' +
    'while beeing not case-sensivite. No support multiple values.'
  )
  .option(
    '-l, --limit <limit>',
    'numeric number of items to return (default 1000)',
    null,
    ((val) => parseInt(val, 10))
  )
  .option(
    '-o, --offset <offset>',
    'numeric offset of items to return (default 0)',
    0,
    ((val) => parseInt(val, 10))
  )
  .option(
    '-a, --archived',
    'Archived users are not returned by default, use this flag to only ' +
    'archived users accounts',
    false
  )
  .parse(process.argv);

const mite = miteApi(config.get());
const opts = {
  offset: program.offset
};
if (typeof program.limit === 'number') {
  opts.limit = program.limit;
}
if (program.email) {
  opts.email = program.email;
}
if (program.search) {
  opts.name = program.search;
}
let method = 'getUsers';
if (program.archived) {
  method = 'getArchivedUsers';
}

mite[method](opts, (err, results) => {
  if (err) {
    throw err;
  }

  const tableData = results.map((row) => {
    return row.user;
  }).map((user) => {
    // colorize the user name depending on his role
    switch(user.role) {
      case 'admin':
        user.name = chalk.yellow(user.name);
        break;
      case 'owner':
        user.name = chalk.red(user.name);
        break;
    }
    return user;
  }).map((user) => {
    return [
      user.id,
      user.role,
      user.name,
      user.email,
      user.note
    ];
  });

  // table header
  tableData.unshift([
    'id',
    'role',
    'name',
    'email',
    'note',
  ].map(v => chalk.bold(v)));

  const tableConfig = {
    border: tableLib.getBorderCharacters('norc'),
    columns: {
      0: {
        width: 10,
        alignment: 'right',
      },
      4: {
        width: 50,
        alignment: 'left',
      }
    }
  };
  console.log(table(tableData, tableConfig));
});
