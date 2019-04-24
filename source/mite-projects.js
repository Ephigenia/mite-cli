#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const DataOutput = require('./lib/data-output');
const pkg = require('./../package.json');
const config = require('./config');
const projectsCommand = require('./lib/commands/projects');

program
  .version(pkg.version)
  .description('list, filter & search for projects')
  .option(
    '-a, --archived <true|false|all>',
    'When used will filter the users using their archived state',
    ((val) => {
      if (val === 'all') return 'all';
      return ['true', 'yes', 'ja', 'ok', '1'].indexOf(val.toLowerCase()) > -1
    }),
    false
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
    'custom list of columns to use in the output, pass in a comma-separated ' +
    'list of attribute names: ' + Object.keys(projectsCommand.columns.options).join(', '),
    (str) => str.split(',').filter(v => v).join(','),
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
    `optional column the results should be case-insensitive ordered by `+
    `(default: "${projectsCommand.sort.default}"), ` +
    `valid values: ${projectsCommand.sort.options.join(', ')}`,
    (value) => {
      if (projectsCommand.sort.options.indexOf(value) === -1) {
        console.error(
          'Invalid value for sort option: "%s", valid values are: ',
          value,
          projectsCommand.sort.options.join(', ')
        );
        process.exit(2);
      }
      return value;
    },
    projectsCommand.sort.default
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

  show all projects by a specific customer
    mite projects --customer Client1

  export the resulting list as csv
    mite projects --format=csv > my-projects.csv

  use the resulting projects in another command to archive the listed projects
    mite projects --columns=id --format=text | xargs -n1 mite project update --archived false
`);
  })
  .parse(process.argv);

const opts = {
  limit: 10000,
  name: program.search,
  customer_id: program.customer_id
};

const miteApi = require('./lib/mite-api')(config.get());

miteApi.getProjects(opts)
  .then(projects => projects
    .filter((p) => program.archived === 'all' && true || p.archived === program.archived)
    .filter((p) => {
      // filter by customer regexp, skip if no cli argument was given
      if (!program.customer) {
        return true;
      }
      const regexp = new RegExp(program.customer, 'i');
      return (
        p.customer_name === program.customer ||
        regexp.exec(p.customer_name) ||
        regexp.exec(String(p.customer_id)
      ));
    })
  )
  .then(items => miteApi.sort(items, program.sort, { customer: 'customer_name' }))
  .then(items => {
    // validate columns options
    const columns = program.columns
      .split(',')
      .map(attrName => {
        const columnDefinition = projectsCommand.columns.options[attrName];
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
        if (typeof columnDefinition.format === 'function') {
          return columnDefinition.format(value, item);
        }
        return value;
      });
      // show archived items in grey
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
  });;
