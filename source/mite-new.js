#!/usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const pkg = require('./../package.json');
const config = require('./config');
const miteApi = require('./lib/mite-api')(config.get());
const miteTracker = require('./lib/mite-tracker')(config.get());
const formater = require('./lib/formater');
const { handleError } = require('./lib/errors');

program
  .version(pkg.version)
  .description(
    `Creates a new time entry` + "\n" +
    `When no note or just the note is given it will run in interactive mode ` +
    `where every other required parameter can be chosen from displayed ` +
    `options.` + "\n" +
    `If there are also project name, service name, minutes and optional data ` +
    `passed the time entry is created right away.`,
    {
      note: 'optional given pre-filled value for the time-entry content',
      project: 'optional name or id of the project for which the time entry should be created, note that this must be a case-insensitive match',
      service: 'optional name of id of the service which should be set for the new time entry, note that this must be a case-insensitive match',
      minutes: 'optional number of minutes or a duration string in the format HH:MM which should be set for the time entry, add a "+" at the end to start the time entry',
      date: 'optional date for which the time entry should be created in the format YYYY-MM-DD'
    }
  )
  .arguments('[note] [project] [service] [minutes] [date]')
  .addHelpText('after', `

Examples:

  Create a new time entry interactively:
    mite new

  Create a new time entry with a pre-composed note interactively:
    mite new "created new designs for customer"

  Create a complete time entry non-interactively that has 30 minutes and also starts the timer:
    mite new "example entry note" project-name1 programming 30+

  Create a complete time entry non-interactively that has 2 hours and 4 minutes
    mite new "example entry note" project-name1 programming 2:04

  You can also pipe in the value for the note
    echo "created a new service class" | mite new project1 servicename 0:02

  Create a note from the last git commit message
    git log -1 --pretty=%B | xargs echo -n | mite new projectx communication 30
`)
  .action(function(note) {
    let args = Array.prototype.slice.call(arguments);
    args = args.slice(0, -1);

    // get not from stdin when piping note into the command
    if (process.stdin.isTTY === undefined) {
      // shift the other arguments one to the left so that the order is correct
      const fs = require("fs");
      note = fs.readFileSync("/dev/stdin", "utf-8");
      args.unshift(note);
    }
    main.apply(main, args).catch(handleError)
      .catch(err => {
        console.error('Error while creating time entry:', err.message || err);
        process.exit(1);
      });
  })
  .parse();

// show help message when number of arguments is to much
if (process.argv.length > 7)  {
  program.help();
}

function getProjectChoices(pretty = true) {
  return miteApi.getProjects({archived: false})
    .then(projects => projects.map(project => {
      const nameParts = [project.name];
      if (pretty) {
        if (project.customer_name) {
          nameParts.push('(' + project.customer_name + ')');
        }
      }
      return {
        name: nameParts.join(' '),
        value: project.id
      };
    }))
    .then(projects => {
      projects.push({
        name: '– (no project)',
        value: null,
      });
      return projects;
    });
}

function getServiceChoices(pretty = true) {
  return miteApi.getServices({archived: false})
    .then(services => services.map(service => {
      const nameParts = [service.name];
      if (pretty) {
        if (service.billable) {
          nameParts.push(chalk.yellow.bold('$'));
        }
      }
      return { name: nameParts.join(' '), value: service.id};
    }))
    .then(services => {
      services.push({
        name: '– (no service)',
        value: null,
      });
      return services;
    });
}

function getSearchResults(options, query) {
  return options.filter(result => {
    return result.name &&
      (
        // case-insensitive match or ID match
        (result.name === query) ||
        // exact id match
        (result.value == query)
      );
  });
}

function checkResults(options, query, type) {
  // first try to find an exact match of id or name
  let searchResults = getSearchResults(options, query);

  // then try to find partial matches
  if (!searchResults.length) {
    searchResults = options.filter(result => {
      return result.name && (result.name.toUpperCase().indexOf(query.toUpperCase()) > -1);
    });
  }

  switch (searchResults.length) {
    case 0:
      console.log(`No ${type}s found that match "${query}".`);
      break;
    case 1:
      return searchResults;
    default:
      console.log(`Found multiple ${type}s matching  "${query}":`);
      searchResults.forEach(current => console.log(`- ${current.name}`));
      break;
  }
  console.log(
    `Use the exact name of an existing ${type}s. List available ${type}s `+
    `using "mite ${type}s"`
  );
  process.exit(1);
}

function interactiveMode(note) {
  return Promise.all([
    getProjectChoices(),
    getServiceChoices(),
  ]).then(([projectChoices, serviceChoices]) => {
    return [
      {
        type: 'list',
        name: 'project_id',
        message: 'Choose Project',
        choices: projectChoices
      },
      {
        type: 'input',
        name: 'note',
        message: 'What was done?',
        when: !note,
      },
      {
        type: 'input',
        name: 'minutes',
        message: 'How long did it take in minutes?'
      },
      {
        type: 'list',
        name: 'service_id',
        message: 'What service?',
        choices: serviceChoices,
      },
      {
        type: 'input',
        name: 'date_at',
        message: 'Date?',
        default: (new Date()).toISOString().slice(0,10)
      }
    ];
  })
  .then((questions) => inquirer.prompt(questions));
}

function cliMode(note, project, service, minutes, date) {
  return Promise.all([
    getProjectChoices(false),
    getServiceChoices(false),
  ]).then(([projects, services]) => {
    projects = checkResults(projects, project, 'project');
    services = checkResults(services, service, 'service');
    let entry = {
      project_id: projects[0].value,
      note: note,
      minutes: minutes,
      service_id: services[0].value,
      date_at: date || (new Date()).toISOString().slice(0, 10)
    };
    return entry;
  });
}

let startTracker = false;

async function main(note, project, service, minutes, date) {
  let promise;
  if (!project) {
    if (process.stdin.isTTY === undefined) {
      throw new Error('Unable to start interactive mode as there’s not TTY');
    }
    promise = interactiveMode(note);
  } else {
    promise = cliMode(note, project, service, minutes, date);
  }

  return promise.then((entry) => {
    entry.note = entry.note || note;
    // do not create an entry when minutes are invalid
    if (!entry.minutes) {
      throw new Error('no time entry created due to empty minutes');
    } else if (entry.minutes.substr(-1, 1) === '+') {
      // detect the "+" at the duration value and start a tracker for the time
      // entry
      startTracker = true;
      // remove the + sign
      entry.minutes = entry.minutes.substr(0, entry.minutes.length - 1);
    }
    // convert duraion notation from HH:MM to minutes value
    if (/^\d+:\d+?$/.test(entry.minutes)) {
      entry.minutes = formater.durationToMinutes(entry.minutes);
      if (isNaN(entry.minutes)) {
        throw new Error(
          'unable to convert the given duration to minutes, please check the ' +
          'correct format is "HH:MM"'
        );
      }
    }

    return miteApi.addTimeEntry(entry);
  })
  .then((data) => data.time_entry.id)
  .then((timeEntryId) => {
    // output the id of the entry which was started for piping
    if (startTracker) {
      return miteTracker.start(timeEntryId)
        .then(() => {
          console.log(timeEntryId);
          process.exit(0);
        });
    }
    console.log(timeEntryId);
    process.exit(0);
  })
  .catch(handleError);
}
