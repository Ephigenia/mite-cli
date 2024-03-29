#!/usr/bin/env node
'use strict';

const fs = require('fs');
const program = require('commander');
const util = require('util');
const inquirer = require('inquirer');
const formater = require('./lib/formater');
const ExternalEditor = require('external-editor');

const pkg = require('./../package.json');
const config = require('./config');
const mite = require('./lib/mite-api')(config.get());
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
    '--append',
    'appends the given text to the currently running entry'
  )
  .option(
    '-e, --editor',
    'open preferred $EDITOR for editing'
  )
  .option(
    '--date <date>',
    'move the time entry to the given date in the format YYYY-MM-DD',
  )
  .option(
    '--duration <value>',
    `set the duration/tracked time directly in HH:MM format or minutes or add \
("+2:12") or substract ("-12") some minutes`
  )
  .option(
    '--project-id <id>',
    'the project id which should be set'
  )
  .option(
    '--service-id <id>',
    'the service id which should be set'
  )
  .option(
    '--user-id <id>',
    'change the user who owns the time-entry (requires admin account)'
  )
  .addHelpText('after', `

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

  Append a text to the currently running entry (while you’re working on it)
    mite amend --apend "added some other stuff"

  Change project and service
    mite amend 12345678 --service-id 918772 --project-id 129379

  Move the entry to another date:
    mite amend 12345678 --date 2020-05-03

  Change the tracked time to 4 hours and 12 minutes
    mite amend 12345678 --duration 4:12

  Change the user of entry 81713
    mite amend --user-id 128731 81713

  Change the time and add 20 minutes
    mite amend 12345678 --duration +4:12

  Change the note for the recently created entry
    mite amend last
  `);

const miteTracker = tracker(config.get());
const getTimeEntryPromise = util.promisify(mite.mite.getTimeEntry);
const updateTimeEntry = util.promisify(mite.mite.updateTimeEntry);
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

async function getUpdatedTimeEntryData(opts, note, timeEntry) {

  // append the given text to the already existing note when there’s one
  if (opts.append && note) {
    note = [timeEntry.note, note]
      .join(timeEntry.note ? ', ' : '');
  }

  // prepare an object which contains the data for the time entrywhich will
  // be updated
  let updateData = {
    id: timeEntry.id,
    ...(typeof note === 'string' && { note }),
    ...(opts.date && { date_at: opts.date }),
    ...(opts.projectId && { project_id: opts.projectId }),
    ...(opts.serviceId && { service_id: opts.serviceId }),
    ...(opts.userId && { user_id: opts.userId }),
  };

  // substract, add or set minutes directly using the --duration option
  if (opts.duration) {
    const durationValueStr = opts.duration.replace(/[\s+-]/, '');
    const minutes = formater.durationToMinutes(durationValueStr);
    switch(opts.duration.substr(0, 1)) {
      case '+':
        updateData.minutes = timeEntry.minutes + minutes;
        break;
      case '-':
        updateData.minutes = timeEntry.minutes - minutes;
        break;
      default:
        updateData.minutes = minutes;
    }
  }

  if (opts.editor) {
    // always open up editor when --editor argument was used
    return openEditor(updateData.note || timeEntry.note).then((editorContent) => {
      updateData.note = editorContent;
      return updateData;
    });
  } else if (
    !note &&
    !opts.projectId &&
    !opts.serviceId &&
    !opts.duration &&
    !opts.userId
  ) {
    // ask for note only when no note was passed to cli
    return inquireNote(updateData, updateData.note || timeEntry.note);
  }

  return updateData;
}

async function main(timeEntryId, note) {
  if (String(timeEntryId).toLowerCase() === 'last') {
    timeEntryId = (await mite.getMyRecentTimeEntry() || {}).id;
  }
  // when first argument is not a number use it as note
  if (!note && timeEntryId && !String(timeEntryId).match(/^\d+/)) {
    note = timeEntryId;
    timeEntryId = undefined;
  }

  // detect if there’s any input piped into the program and use this input
  // as note
  if (process.stdin.isTTY === undefined) {
    note = fs.readFileSync('/dev/stdin', 'utf-8');
  }

  return getTimeEntryData(timeEntryId)
    .then(getUpdatedTimeEntryData.bind(this, program.opts(), note))
    .then(entry => updateTimeEntry(entry.id, entry).then(() => entry))
    .then(entry => process.stdout.write(`Successfully modified note of time entry (id: ${entry.id})\n`))
    .catch(handleError);
}

try {
  program
    .action(main)
    .parse();
} catch (err) {
  handleError(err);
}
