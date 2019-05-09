#!/usr/bin/env node
'use strict';

const program = require('commander');
const util = require('util');

const pkg = require('./../package.json');
const miteApi = require('mite-api');
const config = require('./config');
const commandOptions = require('./lib/options');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[projectId]')
  .description(
    'Updates a specific project',
    // arguments description
    {
      projectId: 'Id of the project of which the note should be altered Cupidatat enim dolore anim culpa ullamco laborum. Ut do quis aliqua et in sit ex irure in elit aliquip in. Anim exercitation ut commodo deserunt non aute et ad occaecat ut magna laborum mollit.'
    }
  )
  .option.apply(program, commandOptions.toArgs(commandOptions.archived, 'define the new archived state of the project'))
  .option.apply(program, commandOptions.toArgs(commandOptions.budget))
  .option.apply(program, commandOptions.toArgs(commandOptions.budgetType))
  .option.apply(program, commandOptions.toArgs(commandOptions.hourlyRate))
  .option(
    '--name <name>',
    'Alters the name of the project to the given value',
  )
  .option(
    '--note <note>',
    'Alters the note of the project to the given value',
  )
  .option(
    '--update-entries',
    'will update also the associated time-entries when changing archived ' +
    'stat or, hourly rate',
  )
  .on('--help', () => console.log(`
Examples:

Put a project into the archive:
  mite project update --archived true 123456

Unarchive a single project
  mite project update --archived false 123456

Change the name and note of a project
  mite project update --name "new name" --note="my new note" 123456

Unarchive all archived projects
  mite projects --archived false --columns id --format text | xargs -n1 mite project update --archived true

Update the hourly_rate and update all time-entries
  mite project update --hourly-rate 9000 --update-entries 1234
`));

function main(projectId) {
  if (!projectId) {
    throw new MissingRequiredArgumentError('Missing required <projectId>');
  }
  const mite = miteApi(config.get());
  const data = {
    ...(typeof program.archived === 'boolean' && { archived: program.archived }),
    ...(program.budgetType && { budget_type: program.budgetType }),
    ...(program.budget && { budget: program.budget }),
    ...(typeof program.hourlyRate === 'number' && { hourly_rate: program.hourlyRate }),
    ...(typeof program.name === 'string' && { name: program.name }),
    ...(typeof program.note === 'string' && { note: program.note }),
    ...(typeof program.updateEntries === 'boolean' && { update_hourly_rate_on_time_entries: true }),
  };

  return util.promisify(mite.updateProject)(projectId, data)
    .then(() => console.log(`Successfully updated project (id: ${projectId})`))
    .catch(err => {
      throw new Error(`Error while updating project (id: ${projectId}):` + err && err.message || err);
    })
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
