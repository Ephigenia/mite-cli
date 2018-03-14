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
  .description('list, filter & search for users')
  .option(
    '--search <regexp>',
    'optional cient-side case-insensitive search in user name, email and note.'
  )
  .option(
    '--name <query>',
    'optional search for users who’s name contains the given query string ' +
    'while beeing not case-sensivite. No support multiple values.'
  )
  .option(
    '--email <query>',
    'optional search for users who’s email contains the given query string ' +
    'while beeing not case-sensivite. No support multiple values.'
  )
  .option(
    '-l, --limit <limit>',
    'optional numeric number of items to return (default 1000)',
    null,
    ((val) => parseInt(val, 10))
  )
  .option(
    '-o, --offset <offset>',
    'optional numeric offset of items to return (default 0)',
    0,
    ((val) => parseInt(val, 10))
  )
  .option(
    '--role <role>',
    'optional user role to filter, multiple arguments comma-separated',
    ((val) => {
      if (typeof val === 'string') {
        return val.split(/\s*,\s*/)
      }
      return val
    })
  )
  .option(
    '-a, --archived',
    'When used will only return archived users which are not returned when ' +
    'not used',
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
if (program.name) {
  opts.name = program.name;
}
let method = 'getUsers';
if (program.archived) {
  method = 'getArchivedUsers';
}

// @TODO add client side sorting
// @TODO add client side search

mite[method](opts, (err, results) => {
  if (err) {
    throw err;
  }

  const tableData = results.map((row) => {
    return row.user;
  })
  // filter by user roles
  .filter((user) => {
    if (!program.role) {
      return user;
    }
    return program.role.indexOf(user.role) > -1;
  })
  // filter users when "search" was used
  .filter((user) => {
    if (!program.search) {
      return user;
    }
    const regexp = new RegExp(program.search, 'i');
    const target = [user.name, user.email, user.note].join('');
    return target.match(regexp);
  })
  // colorize the user name depending on his role
  .map((user) => {
    switch(user.role) {
      case 'admin':
        user.name = chalk.yellow(user.name);
        break;
      case 'owner':
        user.name = chalk.red(user.name);
        break;
    }
    return user;
  })
  .map((user) => {
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
