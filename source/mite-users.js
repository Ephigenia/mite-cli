#!/usr/bin/env node
'use strict';

const program = require('commander');

const pkg = require('./../package.json');
const config = require('./config');
const DataOutput = require('./lib/data-output');
const usersCommand = require('./lib/commands/users');
const commandOptions = require('./lib/options');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .description(`Shows a list of user accounts which can be filtered, searched, \
sorted.

Note that users with the role time-tracker will not be able to list users!
  `)
  .option.apply(program, commandOptions.toArgs(
    commandOptions.archived,
    'filter for archived or unarchived customers only',
    'all'
  ))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(usersCommand.columns.options),
    config.get().usersColumns
  ))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.format,
    undefined,
    config.get('outputFormat')
  ))
  .option(
    '--name <query>',
    'Optional case-sensitive query for names'
  )
  .option(
    '--email <query>',
    'Optional case-sensitive search for users emails'
  )
  .option(
    '--role <role>',
    'Optional user role to filter, multiple arguments comma-separated',
    ((val) => {
      if (typeof val === 'string') {
        return val.split(/\s*,\s*/);
      }
      return val;
    })
  )
  .option(
    '--search <regexp>',
    'Optional cient-side regexp searching in user name, email and note.'
  )
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(usersCommand.sort.options),
    usersCommand.sort.default
  ))
  .on('--help', () => console.log(`
Examples:

  list all users
    mite users

  search for a specific user
    mite users --search marc

  show all time tracking users from a company (all have a ephigenia.de email address)
    mite users --role time_tracker --email ephigenia.de

  show all users while using all columns
    mite users --columns all

  export all users to a csv file
    mite users --columns id,role,name,email,archived,language --format csv > users.csv
  `));

/**
 * Filter function for matching a user against a search query which searches
 * in email, name and note
 *
 * @param {String} query
 * @param {Object} user
 * @param {String} user.email
 * @param {String} user.name
 * @param {String} user.note
 * @return {Boolean}
 */
function filterUsersByQuery(query, user) {
  // no query given pass all projects as there’s probably no "search"
  // argument given to the CLI
  if (!query) {
    return true;
  }
  const regexp = new RegExp(program.search, 'i');
  const target = [user.name, user.email, user.note].join('');
  return target.match(regexp);
}

async function main() {
  const miteApi = require('./lib/mite-api')(config.get());

  const opts = {
    limit: 1000,
    offset: 0,
    ...(program.email && { email: program.email }),
    ...(program.name && { name: program.name }),
  };

  return miteApi.getUsers(opts)
    .then((users) => users
      .filter(({ archived }) => program.archived === 'all' && true || archived === program.archived)
      .filter(({ role }) => !program.role && true || program.role.indexOf(role) > -1)
      .filter(filterUsersByQuery.bind(this, program.search))
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(program.sort, usersCommand.sort.options),
    ))
    .then((items) => {
      const columns = commandOptions.columns.resolve(program.columns, usersCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns);
      console.log(DataOutput.formatData(tableData, program.format, columns));
    })
    .catch(handleError);
} // main


try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
