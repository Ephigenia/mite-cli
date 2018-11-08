#!/usr/bin/env node
'use strict'

const program = require('commander');
const miteApi = require('mite-api');
const chalk = require('chalk');
const async = require('async');

const pkg = require('./../package.json');
const config = require('./config.js');
const DataOutput = require('./lib/data-output');

const SORT_OPTIONS = [
  'id',
  'name',
  'email',
  'role',
  'note',
  'updated_at',
  'created_at',
];
const SORT_OPTIONS_DEFAULT = 'name';

program
  .version(pkg.version)
  .description('list, filter & search for users')
  .option(
    '--sort <column>',
    `optional column the results should be case-insensitive ordered by `+
    `(default: "${SORT_OPTIONS_DEFAULT}"), ` +
    `valid values: ${SORT_OPTIONS.join(', ')}`,
    (value) => {
      if (SORT_OPTIONS.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          SORT_OPTIONS.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    'name' // default sor
  )
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
    '-a, --archived <true|false>',
    'When used will only show either archived users or not archived users',
    ((val) => {
      if (typeof val !== 'string') {
        return val;
      }
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    null
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    'table',
  )
  .parse(process.argv);

const mite = miteApi(config.get());
const opts = {
  limit: 1000,
  offset: 0
};
if (program.email) {
  opts.email = program.email;
}
if (program.name) {
  opts.name = program.name;
}

async.parallel([
  async.apply(mite.getUsers, opts),
  async.apply(mite.getArchivedUsers, opts),
], (err, results) => {
  if (err) {
    throw err;
  }

  const allUsers = [].concat(results[0], results[1]);
  const tableData = allUsers
    .map((row) => row.user)
    // filter by archived or not
    .filter((user) => {
      if (program.archived === null) {
        return true;
      }
      return user.archived === program.archived;
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
    // optional sort
    .sort((u1, u2) => {
      if (!program.sort) return 0;
      const sortByAttributeName = program.sort;
      var val1 = String(u1[sortByAttributeName]).toLowerCase();
      var val2 = String(u2[sortByAttributeName]).toLowerCase();
      if (val1 > val2) {
        return 1;
      } else if (val1 < val2) {
        return -1;
      } else {
        return 0;
      }
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
        user.note.replace(/\r?\n/g, ' ')
      ].map((v) => {
        // make archived users grey
        if (user.archived) {
          return chalk.grey(v);
        }
        return v;
      });
    });

  // table header
  tableData.unshift([
    'id',
    'role',
    'name',
    'email',
    'note',
  ].map(v => chalk.bold(v)));

  const columns = {
    0: {
      alignment: 'right',
    },
    1: {
      width: 10,
      alignment: 'right',
    },
    5: {
      width: 50,
      alignment: 'left',
    }
  };
  console.log(DataOutput.formatData(tableData, program.format, columns));

});
