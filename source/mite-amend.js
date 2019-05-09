#!/usr/bin/env node
'use strict';

const program = require('commander');
const miteApi = require('mite-api');
const util = require('util');
const inquirer = require('inquirer');
const ExternalEditor = require('external-editor');

const pkg = require('./../package.json');
const config = require('./config');
const tracker = require('./lib/mite-tracker');
const { handleError, MissingRequiredArgumentError } = require('./lib/errors');

program
  .version(pkg.version)
  .arguments('[timeEntryId]')
  .description(
    'Rewrite the note for the given time entry id or use the currently ' +
    'running time entry and edit it’s note',
    {
      timeEntryId: 'optional id of the time entry that should be altered, ' +
        'if not given the currently running entry is used'
    }
  )
  .option(
    '-e, --editor',
    'open preferred $EDITOR for editing'
  )
  .on('--help', () => console.log(`
Examples:

  Interactively change the note of the given entry:
    mite amend 123716

  Open the $EDITOR or $VISUAL to edit the note, as soon as the editor is closed the note will be saved
    mite amend --editor 127361
    `));

function main(timeEntryId) {
  const mite = miteApi(config.get());
  const miteTracker = tracker(config.get());
  const getTimeEntry = util.promisify(mite.getTimeEntry);
  const updateTimeEntry = util.promisify(mite.updateTimeEntry);
  const edit = util.promisify(ExternalEditor.editAsync);

  let promise = null;

  if (!timeEntryId) {
    promise = miteTracker.get()
      .then(result => {
        if (!result || !result.tracker || !result.tracker.tracking_time_entry) {
          throw new MissingRequiredArgumentError(
            'Either there was no id given or no running time-tracker found.'
          );
        }
        return getTimeEntry(result.tracker.tracking_time_entry.id);
      });
  } else {
    promise = getTimeEntry(timeEntryId);
  }

  return promise
    .then(data => {
      if (!data) {
        throw new Error('Unable to find time entry with the given ID');
      }
      return data;
    })
    .then(data => data.time_entry)
    .then(timeEntry => {
      timeEntryId = timeEntry.id;
      if (program.editor) {
        return edit(timeEntry.note).then((editedText) => {
          return { note: editedText };
        });
      }
      const questions = [
        {
          type: program.editor ? 'editor' : 'input',
          name: 'note',
          message: 'Note',
          default: timeEntry.note,
        },
      ];
      return inquirer.prompt(questions);
    })
    .then(entry => updateTimeEntry(timeEntryId, entry))
    .then(() => console.log(`Successfully modified note of time entry (id: ${timeEntryId})`))
    .catch(err => {
      throw new Error(`Error while updating time-entry (id: ${timeEntryId}: ` + (err && err.message || err));
    })
    .catch(handleError);
}

try {
  program.action(main).parse(process.argv);
} catch (err) {
  handleError(err);
}
