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
  .option(
    '--name <query>',
    'Optional case-sensitive query for names'
  )
  .option(
    '--email <query>',
    'Optional case-sensitive search for users emails'
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.json))
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
  .option.apply(program, commandOptions.toArgs(commandOptions.plain))
  .option.apply(program, commandOptions.toArgs(commandOptions.pretty))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(usersCommand.sort.options),
    usersCommand.sort.default
  ))
  .addHelpText('after', `

Examples:

  list all users
    mite users

  search for a specific user that exactly matches
    mite users --search "^marc$"

  search for a users that somewhat match the regexp
    mite users --search "steph"

  show all time tracking users from a company (all have a ephigenia.de email address)
    mite users --role time_tracker --email ephigenia.de

  show all users while using all columns
    mite users --columns all

  export all users to json
    mite users --columns id,role,name,email,archived,language --json > users.json
  `);

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
  const opts = program.opts();
  const miteApi = require('./lib/mite-api')(config.get());

  const options = {
    limit: 1000,
    offset: 0,
    ...(opts.email && { email: opts.email }),
    ...(opts.search && { query: opts.search }),
  };

  return miteApi.getUsers(options)
    .then((users) => users
      .filter(({ archived }) => opts.archived === 'all' && true || archived === opts.archived)
      .filter(({ role }) => !opts.role && true || opts.role.indexOf(role) > -1)
      .filter(filterUsersByQuery.bind(this, opts.search))
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(opts.sort, usersCommand.sort.options),
    ))
    .then((items) => {
      const format = DataOutput.getFormatFromOptions(opts, config);
      const columns = commandOptions.columns.resolve(opts.columns, usersCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns, format);
      process.stdout.write(DataOutput.formatData(tableData, format, columns) + '\n');
    })
    .catch(handleError);
} // main


try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
