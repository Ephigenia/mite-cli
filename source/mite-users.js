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
  .description('list, filter & search for users')
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'filter for archived or unarchived customers only', 'all'))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(usersCommand.columns.options),
    config.get().usersColumns
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.format, undefined, config.get('outputFormat')))
  .option(
    '--name <query>',
    'optional case-sensitive query for names'
  )
  .option(
    '--email <query>',
    'optional case-sensitive search for users emails'
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
    'optional cient-side regexp searching in user name, email and note.'
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
      .filter((user) => {
        if (!program.search) {
          return user;
        }
        const regexp = new RegExp(program.search, 'i');
        const target = [user.name, user.email, user.note].join('');
        return target.match(regexp);
      })
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
