#!/usr/bin/env node
'use strict';

const program = require('commander');

const DataOutput = require('./lib/data-output');
const pkg = require('./../package.json');
const config = require('./config');
const servicesCommand = require('./lib/commands/services');
const commandOptions = require('./lib/options');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .description('list, filter & search for services')
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'filter for archived or unarchived services only', 'all'))
  .option.apply(program, commandOptions.toArgs(commandOptions.billable, 'filter for billable or not-billable services only', 'all'))
  .option.apply(program, commandOptions.toArgs(commandOptions.format, undefined, config.get('outputFormat')))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(servicesCommand.columns.options),
    config.get().servicesColumns
  ))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(servicesCommand.sort.options),
    servicesCommand.sort.default
  ))
  .option(
    '--search <regexp>',
    'optional case-insensitive regular expression matching on the name'
  )
  .on('--help', () => console.log(`
Examples:

  show all services
    mite service list

  show all archived services
    mite service list --archived true

  search for services
    mite service list --search "programming|coding"

  show archived services with custom columns
    mite service list --columns name,hourly_rate,created_at

  export all archived services as csv
    mite service list --columns id,name,hourly_rate,billable --archived true --format csv > all_services.csv
  `));

async function main() {
  const miteApi = require('./lib/mite-api')(config.get());

  const opts = {
    limit: 1000,
    offset: 0,
    ...(program.search && { query: program.search }),
  };

  return miteApi.getServices(opts)
    .then(services => services
      .filter(({ archived }) => program.archived === 'all' ? true : archived === program.archived)
      .filter(({ billable }) => program.billable === 'all' ? true : billable === program.billable)
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(program.sort, servicesCommand.sort.options),
    ))
    .then(items => {
      const columns = commandOptions.columns.resolve(program.columns, servicesCommand.columns.options);
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
