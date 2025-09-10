#!/usr/bin/env node
'use strict';

const { program } = require('commander');

const DataOutput = require('./lib/data-output');
const pkg = require('./../package.json');
const config = require('./config');
const projectsCommand = require('./lib/commands/projects');
const commandOptions = require('./lib/options');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .description('list, filter & search for projects')
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'filter for archived or unarchived customers only', false))
  .option(
    '--customer-id <id>',
    'optional id of a customer (use mite customer) to filter the projects by'
  )
  .option(
    '--customer <regexp>',
    'optional regular expression which matches on id and customer_name, case-insensitive'
  )
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(projectsCommand.columns.options),
    config.get().projectsColumns
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.json))
  .option(
    '--search <regexp>',
    'optional case-insensitive regular expression matching on the name'
  )
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(projectsCommand.sort.options),
    projectsCommand.sort.default
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.plain))
  .option.apply(program, commandOptions.toArgs(commandOptions.pretty))
  .addHelpText('after', `

Examples:

  list all projects
    mite projects list

  list all projects (including archived)
    mite projects list --archived all

  search for project(s) using regexp
    mite projects list --search "customer\\d+|other-name"

  list projects while setting different columns and export to csv
    mite projects list --columns id,customer_id,customer_name --plain > projects_export.csv

  show all projects ordered by their budget while only showing their names and bugets
    mite projects list --sort budget

  show all projects while not archived on top and ordered by their highes budget
    mite projects list --archived all --sort="-archived,-budget"

  show all projects by a specific customer
    mite projects list --customer Client1

  export the resulting list as json
    mite projects list --plain > my-projects.json

  use the resulting projects in another command to archive the listed projects
    mite projects list --columns id --plain | xargs -n1 mite project update --archived false
  `);

/**
 * Filter function which searches for the given query in the project’s
 * customer name or ID
 *
 * @param {String} query customer name or ID
 * @param {Object} project
 * @param {String} project.customer_name
 * @param {Number} project.customer_id
 * @return {Boolean}
 */
function filterProjectsByCustomerName(query, project) {
  // no query given pass all projects as there’s probably no "customer"
  // argument given to the CLI
  if (!query) {
    return true;
  }
  const { customer_name, customer_id } = project;
  const regexp = new RegExp(query, 'i');
  return (
    customer_name === query ||
    regexp.exec(customer_name) ||
    regexp.exec(String(customer_id)
  ));
}

async function main() {
  const opts = program.opts();
  const miteApi = require('./lib/mite-api')(config.get());

  const options = {
    limit: 10000,
    // ...(program.search && { name: program.search }),
    ...(opts.search && { query: opts.search }),
    ...(opts.customerId && { customer_id: opts.customerId }),
  };

  return miteApi.getProjects(options)
    .then(projects => projects
      .filter(({ archived }) => opts.archived === 'all' ? true : archived === opts.archived)
      .filter(filterProjectsByCustomerName.bind(null, opts.customer))
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(opts.sort, projectsCommand.sort.options),
      { customer: 'customer_name' }
    ))
    .then(items => miteApi.getUsedProjectBudgets(items))
    .then(items => miteApi.getProjectsTotalRevenue(items))
    .then(items => {
      const format = DataOutput.getFormatFromOptions(opts, config);
      const columns = commandOptions.columns.resolve(opts.columns, projectsCommand.columns.options);
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
