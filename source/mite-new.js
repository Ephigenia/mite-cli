#!/usr/bin/env node
'use strict'

const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const miteApi = require('mite-api')
const bluebird = require('bluebird');

const pkg = require('./../package.json')
const config = require('./config.js')
const mite = miteApi(config.get())
const miteTracker = require('./lib/mite-tracker')(config.get())

program
  .version(pkg.version)
  .description('interactively create a new time entry')
  .arguments('<note>')
  .action((note) => {
    main(note);
  })
  .parse(process.argv);

if (process.argv.length <= 2) {
  main(null);
}

function getProjectChoices() {
  return bluebird.promisify(mite.getProjects)()
    .then(response => response.map(d => d.project))
    .then(projects => projects.map(project => {
      const nameParts = [project.name];
      if (project.customer_name) {
        nameParts.push('(' + project.customer_name + ')')
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
      })
      return projects;
    });
}

function getServiceChoices() {
  return bluebird.promisify(mite.getServices)()
    .then(response => response.map(d => d.service))
    .then(services => config.get().whitelistedServices != null 
        ? services.filter(service => config.get().whitelistedServices.includes(service.name))
        : services)
    .then(services => services.map(service => {
      const nameParts = [service.name];
      if (service.billable) {
        nameParts.push(chalk.yellow.bold('$'));
      }
      return { name: nameParts.join(' '), value: service.id};
    }))
    .then(services => {
      services.push({
        name: '– (no service)',
        value: null,
      })
      return services;
    });
}

function main(note) {
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
    ]
  })
  .then((questions) => inquirer.prompt(questions))
  .then((entry) => {
    entry.note = entry.note || note;

    // do not create an entry when minutes are invalid
    if (!entry.minutes) {
      console.log('no time entry created due to empty project id or empty minutes')
      return;
    }

    // detect the "+" at the duration value and start a tracker for the time
    // entry
    let startTracker = false
    if (entry.minutes.substr(-1, 1) === '+') {
      startTracker = true
      entry.minutes = entry.minutes.substr(0, entry.minutes.length - 1)
    }

    // http://mite.yo.lk/en/api/time-entries.html#create
    mite.addTimeEntry({ time_entry: entry }, (response) => {
      var data = JSON.parse(response);
      if (data.error) {
        console.error('Error while creating new time entry:', data.error)
        process.exit(1)
        return
      }
      const timeEntryId = data.time_entry.id;
      console.log('Successfully created new time entry (id: %s)', timeEntryId);
      if (startTracker) {
        miteTracker.start(timeEntryId)
          .then(() => {
            console.log('Successfully started the time entry (id: %s)', timeEntryId);
          })
          .catch((err) => {
            console.log('Unable to start the time entry (id: %s): %s', timeEntryId, err.message);
            process.exit(1);
          })
      }
    });
  }) // inquirer
}
