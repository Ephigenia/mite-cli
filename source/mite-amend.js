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

  Pipe content of the note into the program:
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
const getTimeEntryPromise = util.promisify(mite.getTimeEntry);
const updateTimeEntry = util.promisify(mite.updateTimeEntry);
const openEditor = util.promisify(ExternalEditor.editAsync);

async function getTimeEntryData(timeEntryId) {
  if (!timeEntryId) {
    timeEntryId = await miteTracker.get();
    if (!timeEntryId) {
      throw new MissingRequiredArgumentError(
        'Either there was no id given or no running time-tracker found.'
      );
    }
  }
  return getTimeEntryPromise(timeEntryId)
    .then(data => {
      if (!data) {
        throw new GeneralError('Unable to find time entry with the given ID');
      }
      return data.time_entry;
    });
}

function inquireNote(updateData, note) {
  // use interactive mode (inquirer)
  const questions = [
    {
      type: 'input',
      name: 'note',
      message: 'Note',
      default: note,
    },
  ];
  return inquirer.prompt(questions).then((answers) => {
    updateData.note = answers.note;
    return updateData;
  });
}

async function getUpdatedTimeEntryData(program, note, timeEntry) {
  // prepare an object which contains the data for the time entrywhich will
  // be updated
  let updateData = {
    id: timeEntry.id,
    ...(typeof note === 'string' && { note }),
    ...(program.projectId && { project_id: program.projectId }),
    ...(program.serviceId && { service_id: program.serviceId }),
  };

  if (program.editor) {
    // always open up editor when --editor argument was used
    return openEditor(updateData.note || timeEntry.note).then((editorContent) => {
      updateData.note = editorContent;
      return updateData;
    });
  } else if (!note && !program.projectId && !program.serviceId) {
    // ask for note only when no note was passed to cli
    return inquireNote(updateData, updateData.note || timeEntry.note);
  }

  return updateData;
}

function main(timeEntryId, note) {
  // when first argument is not a number use it as note
  if (!note && timeEntryId && !timeEntryId.match(/^\d+/)) {
    note = timeEntryId;
    timeEntryId = undefined;
  }

  // detect if there’s any input piped into the program and use this input
  // as note
  if (process.stdin.isTTY === undefined) {
    note = fs.readFileSync('/dev/stdin', 'utf-8');
  }

  return getTimeEntryData(timeEntryId)
    .then(getUpdatedTimeEntryData.bind(this, program, note))
    .then(entry => updateTimeEntry(entry.id, entry).then(() => entry))
    .then(entry => console.log(`Successfully modified note of time entry (id: ${entry.id})`))
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse(process.argv);
} catch (err) {
  handleError(err);
}
