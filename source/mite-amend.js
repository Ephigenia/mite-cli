#!/usr/bin/env node
'use strict';

const fs = require('fs');
const program = require('commander');
const miteApi = require('mite-api');
const util = require('util');
const inquirer = require('inquirer');
const ExternalEditor = require('external-editor');

const pkg = require('./../package.json');
const config = require('./config');
const tracker = require('./lib/mite-tracker');
const {
  handleError,
  MissingRequiredArgumentError,
  GeneralError
} = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId] [note]')
  .description(
    `Updates the note of the currently tracked time entry (when no id is given) \
or the one specified in the first argument. The content of the note can be \
second argument or piped into the program. See the examples for the different \
usages.

Also the project id and service id of a time entry can be altered if the user \
has the required permissions to do it.`,
    {
      timeEntryId:
        'optional id of the time entry that should be altered, if not given ' +
        'the currently running entry is used',
      note: 'optional value to which the time entries note should be set'
    }
  )
  .option(
    '-e, --editor',
    'open preferred $EDITOR for editing'
  )
  .option(
    '--project-id <id>',
    'the project id which should be set'
  )
  .option(
    '--service-id <id>',
    'the service id which should be set'
  )
  .on('--help', () => console.log(`
Examples:

  Interactively change the note of the given entry:
    mite amend 123716

  Open the $EDITOR or $VISUAL to edit the note, as soon as the editor is closed the note will be saved
    mite amend --editor 127361

  Change the note using pipes:
    cat myVerLongNote.txt | mite amend 1234567

  Change the note via command line argument:
    mite amend 12345678 "created a programmable list of items"

  If you leave out the id the currently tracked note will be changed
    mite amend "created a programmable list of items"

  Change project and service
    mite amend 12345678 --service-id 918772 --project-id 129379
  `));

const mite = miteApi(config.get());
const miteTracker = tracker(config.get());
const getTimeEntry = util.promisify(mite.getTimeEntry);
const updateTimeEntry = util.promisify(mite.updateTimeEntry);
const openEditor = util.promisify(ExternalEditor.editAsync);

function main(timeEntryId, note) {
  // when first argument is not a number use it as note
  if (!note && timeEntryId && !timeEntryId.match(/^\d+/)) {
    note = timeEntryId;
    timeEntryId = undefined;
  }

  // detect if there’s any input piped into the program and use this input
  // as note
  if (process.stdin.isTTY === undefined) {
    // shift the other arguments one to the left so that the order is correct
    note = fs.readFileSync('/dev/stdin', 'utf-8');
  }

  let promise = null;

  if (!timeEntryId) {
    promise = miteTracker.get()
      .then(timeEntryId => {
        if (!timeEntryId) {
          throw new MissingRequiredArgumentError(
            'Either there was no id given or no running time-tracker found.'
          );
        }
        return getTimeEntry(timeEntryId);
      });
  } else {
    promise = getTimeEntry(timeEntryId);
  }

  // prepare an object which contains the data for the time entrywhich will
  // be updated
  let updateData = {
    ...(program.projectId && { project_id: program.projectId }),
    ...(program.serviceId && { service_id: program.serviceId }),
  };

  return promise
    .then(data => {
      if (!data) {
        throw new GeneralError('Unable to find time entry with the given ID');
      }
      return data.time_entry;
    })
    /**
     * @return {Object.<string>}
     * @return {string} entry.note new note
     */
    .then(timeEntry => {
      timeEntryId = timeEntry.id;

      // if only service and project should be changed (no note given)
      if (typeof note === 'undefined' && updateData !== {}) {
        return updateData;
      } else if (typeof note !== 'undefined') {
        // note passed over via pipe or argument
        return { note };
      } else if (program.editor) {
        // use $EDITOR and return content
        return openEditor(timeEntry.note).then((editorContent) => {
          return { note: editorContent };
        });
      } else {
        // use interactive mode (inquirer)
        const questions = [
          {
            type: 'input',
            name: 'note',
            message: 'Note',
            default: timeEntry.note,
          },
        ];
        return inquirer.prompt(questions);
      }
    })
    .then(entry => updateTimeEntry(timeEntryId, entry))
    .then(() => console.log(`Successfully modified note of time entry (id: ${timeEntryId})`))
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
