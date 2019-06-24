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
  .arguments('[timeEntryId] [note]')
  .description(
    'Rewrite the note for the given time entry id or use the currently ' +
    'running time entry and edit it’s note',
    {
      timeEntryId: 'optional id of the time entry that should be altered, ' +
        'if not given the currently running entry is used',
      note: 'optional value to which the time entries note should be set'
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

  Change the note using pipes:
    cat myVerLongNote.txt | mite amend 1234567

  Change the note via command line argument:
    mite amend 12345678 "created a programmable list of items"
    `));

function main(timeEntryId, note) {
  const mite = miteApi(config.get());
  const miteTracker = tracker(config.get());
  const getTimeEntry = util.promisify(mite.getTimeEntry);
  const updateTimeEntry = util.promisify(mite.updateTimeEntry);
  const openEditor = util.promisify(ExternalEditor.editAsync);

  // use note from pipe
  let args = Array.prototype.slice.call(arguments);
  args = args.slice(0, -1);
  if (process.stdin.isTTY === undefined) {
    // shift the other arguments one to the left so that the order is correct
    const fs = require("fs");
    note = fs.readFileSync("/dev/stdin", "utf-8");
    args.unshift(note);
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

  return promise
    .then(data => {
      if (!data) {
        throw new Error('Unable to find time entry with the given ID');
      }
      return data.time_entry;
    })
    .then(timeEntry => {
      timeEntryId = timeEntry.id;

      // only ask for updated note entered via editor or inquirer if it’s
      // not been set before
      if (typeof note !== 'undefined') {
        // use note passed over via pipe
        return { note };
      } else if (program.editor) {
        // use $EDITOR and return content
        return openEditor(timeEntry.note).then((editedText) => {
          return { note: editedText };
        });
      } else {
        // use interactive mode (inquirer)
        const questions = [
          {
            type: program.editor ? 'editor' : 'input',
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
