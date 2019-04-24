#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const pkg = require('./../package.json');
const config = require('./config.js');
const DataOutput = require('./lib/data-output');
const usersCommand = require('./lib/commands/users');

program
  .version(pkg.version)
  .description('list, filter & search for users')
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
    '--columns <columns>',
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(usersCommand.columns.options).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
    usersCommand.columns.default
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
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
        return val.split(/\s*,\s*/);
      }
      return val;
    })
  )
  .option(
    '--search <regexp>',
    'optional cient-side case-insensitive search in user name, email and note.'
  )
  .option(
    '--sort <column>',
    `optional column the results should be case-insensitive ordered by `+
    `(default: "${usersCommand.sort.default}"), ` +
    `valid values: ${usersCommand.sort.options.join(', ')}`,
    (value) => {
      if (usersCommand.sort.options.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          usersCommand.sort.options.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    'name' // default sor
  )
  .on('--help', function() {
    console.log(`
Examples:

  list all users
    mite users

  search for a specific user
    mite users --search marc

  show all time tracking users from a company (all have a ephigenia.de email address)
    mite users --role time_tracker --email ephigenia.de

  export all users to a csv file
    mite users --columns=id,role,name,email,archived,language --format=csv > users.csv
`);
  })
  .parse(process.argv);

const miteApi = require('./lib/mite-api')(config.get());
const opts = {
  limit: 1000,
  offset: 0,
  ...(program.email && { email: program.email }),
  ...(program.name && { name: program.name }),
};

miteApi.getUsers(opts)
  .then((users) => users
    .filter((user) => {
      // filter by archived or not
      if (program.archived === null) {
        return true;
      }
      return user.archived === program.archived;
    })
    .filter((user) => {
      // filter by user roles
      if (!program.role) {
        return user;
      }
      return program.role.indexOf(user.role) > -1;
    })
    .filter((user) => {
      // filter users when "search" was used
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
  ).then((items) => {
    // validate columns options
    const columns = program.columns
      .split(',')
      .map(attrName => {
        const columnDefinition = usersCommand.columns.options[attrName];
        if (!columnDefinition) {
          console.error(`Invalid column name "${attrName}"`);
          process.exit(2);
        }
        return columnDefinition;
      });

    // create final array of table data
    const tableData = items.map((item) => {
      let row = columns.map(columnDefinition => {
        const value = item[columnDefinition.attribute];
        if (columnDefinition.format) {
          return columnDefinition.format(value, item);
        }
        return value;
      });
      // grey out archived items
      if (item.archived) {
        row = row.map(v => chalk.grey(v));
      }
      return row;
    });

    // Table header
    tableData.unshift(
      columns
        .map(columnDefinition => columnDefinition.label)
        .map(v => chalk.bold(v))
    );

    console.log(DataOutput.formatData(tableData, program.format, columns));
  })
  .catch(err => {
    console.log(err && err.message || err);
    process.exit(1);
  });
