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
  .option.apply(program, commandOptions.toArgs(
    commandOptions.columns,
    commandOptions.columns.description(servicesCommand.columns.options),
    config.get().servicesColumns
  ))
  .option.apply(program, commandOptions.toArgs(commandOptions.json))
  .option.apply(program, commandOptions.toArgs(commandOptions.plain))
  .option.apply(program, commandOptions.toArgs(commandOptions.pretty))
  .option.apply(program, commandOptions.toArgs(
    commandOptions.sort,
    commandOptions.sort.description(servicesCommand.sort.options),
    servicesCommand.sort.default
  ))
  .option(
    '--search <regexp>',
    'optional case-insensitive regular expression matching on the name'
  )
  .addHelpText('after', `

Examples:

  show all services
    mite service list

  show all archived services
    mite service list --archived true

  search for services
    mite service list --search "programming|coding"

  show archived services with custom columns
    mite service list --columns name,hourly_rate,created_at

  export all archived services as json
    mite service list --columns id,name,hourly_rate,billable --archived true --json > all_services.csv
  `);

async function main() {
  const opts = program.opts();
  const miteApi = require('./lib/mite-api')(config.get());
  const options = {
    limit: 1000,
    offset: 0,
    ...(opts.search && { query: opts.search }),
  };

  return miteApi.getServices(options)
    .then(services => services
      .filter(({ archived }) => opts.archived === 'all' ? true : archived === opts.archived)
      .filter(({ billable }) => opts.billable === 'all' ? true : billable === opts.billable)
    )
    .then(items => miteApi.sort(
      items,
      commandOptions.sort.resolve(opts.sort, servicesCommand.sort.options),
    ))
    .then(items => {
      const format = DataOutput.getFormatFromOptions(opts, config);
      const columns = commandOptions.columns.resolve(opts.columns, servicesCommand.columns.options);
      const tableData = DataOutput.compileTableData(items, columns, format);
      console.log(DataOutput.formatData(tableData, format, columns));
    })
    .catch(handleError);
} // main

try {
  program.action(main).parse();
} catch (err) {
  handleError(err);
}
