#!/usr/bin/env node
'use strict';

const program = require('commander');

const DataOutput = require('./lib/data-output');
const pkg = require('./../package.json');
const config = require('./config');
const projectsCommand = require('./lib/commands/projects');
const columnOptions = require('./lib/options/columns');
const sortOption = require('./lib/options/sort');

program
  .version(pkg.version)
  .description('list, filter & search for projects')
  .option(
    '-a, --archived <true|false|all>',
    'When used will filter the users using their archived state',
    ((val) => {
      if (val === 'all') return 'all';
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1;
    }),
    false // default list only not-archived projects
  )
  .option(
    '--customer_id <id>',
    'optional id of a customer (use mite customer) to filter the projects by'
  )
  .option(
    '--customer <regexp>',
    'optional regular expression which matches on id and customer_name, case-insensitive'
  )
  .option(
    '--columns <columns>',
    columnOptions.description(projectsCommand.columns.options),
    columnOptions.parse,
    config.get().projectsColumns
  )
  .option(
    '-f, --format <format>',
    'defines the output format, valid options are ' + DataOutput.FORMATS.join(', '),
    config.get('outputFormat')
  )
  .option(
    '--search <query>',
    'optional search string which must be somewhere in the project’s name ' +
    '(case insensitive)'
  )
  .option(
    '--sort <column>',
    sortOption.description(projectsCommand.sort.options),
    sortOption.parse,
  )
  .on('--help', function() {
    console.log(`
Examples:

  list all projects
    mite projects

  list all projects (including archived)
    mite projects --archived all

  list projects while setting different columns and export to csv
    mite projects --columns=id,customer_id,customer_name --format=csv > projects_export.csv

  show all projects ordered by their budget while only showing their names and bugets
    mite projects --sort=budget

  show all projects while not archived on top and ordered by their highes budget
    mite projects --archived all --sort=-archived,-budget

  show all projects by a specific customer
    mite projects --customer Client1

  export the resulting list as csv
    mite projects --format=csv > my-projects.csv

  use the resulting projects in another command to archive the listed projects
    mite projects --columns=id --format=text | xargs -n1 mite project update --archived false
`);
  })
  .action(() => {
    return main().catch(err => {
      console.log(err && err.message || err);
      process.exit(1);
    });
  })
  .parse(process.argv);

async function main() {
  const miteApi = require('./lib/mite-api')(config.get());
  const opts = {
    limit: 10000,
    ...(program.search && { name: program.search }),
    ...(program.customer_id && { customer_id: program.customer_id }),
  };

  return miteApi.getProjects(opts)
    .then(projects => projects
      .filter(({ archived }) => program.archived === 'all' ? true : archived === program.archived)
      .filter(({ customer_name, customer_id }) => {
        // filter by customer regexp, skip if no cli argument was given
        if (!program.customer) {
          return true;
        }
        const regexp = new RegExp(program.customer, 'i');
        return (
          customer_name === program.customer ||
          regexp.exec(customer_name) ||
          regexp.exec(String(customer_id)
        ));
      })
    )
    .then(items => miteApi.sort(
      items,
      sortOption.resolve(program.sort, projectsCommand.sort.options),
      { customer: 'customer_name' }
    ))
    .then(items => {
      const columns = columnOptions.resolve(program.columns, projectsCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns);
      console.log(DataOutput.formatData(tableData, program.format, columns));
    });
} // main
