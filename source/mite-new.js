#!/usr/bin/env node
'use strict'

const program = require('commander')
const inquirer = require('inquirer')
const parallel = require('async/parallel')
const chalk = require('chalk')
const miteApi = require('mite-api')

const pkg = require('./../package.json')
const config = require('./config.js')
const mite = miteApi(config.get())
const miteTracker = require('./lib/mite-tracker')(config.get())

program
  .version(pkg.version)
  .description('interactively create a new time entry')
  .parse(process.argv)

parallel({
  projects: mite.getProjects,
  services: mite.getServices
}, (err, results) => {
  if (err) {
    throw err;
  }

  const questions = [
    {
      type: 'list',
      name: 'project_id',
      message: 'Choose Project',
      choices: results.projects
        .map(function(data) {
          var nameParts = [data.project.name];
          if (data.project.customer_name) {
            nameParts.push('(' + data.project.customer_name + ')')
          }
          return {
            name: nameParts.join(' '),
            value: data.project.id
          };
        })
        .sort()
    },
    {
      type: 'input',
      name: 'note',
      message: 'What was done?'
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
      choices: results.services
        .map((data) => {
          let name = data.service.name;
          if (data.service.billable) {
            name += chalk.yellow.bold('$')
          }
          return {
            name: name,
            value: data.service.id
          };
        })
        .sort()
    },
    {
      type: 'input',
      name: 'date_at',
      message: 'Date?',
      default: (new Date()).toISOString().slice(0,10)
    }
  ];

  inquirer.prompt(questions).then((entry) => {
    // do not create an entry when project_id or minutes are empty
    if (!entry.project_id || !entry.minutes) {
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
      console.log('Successfully created new time entry')
      if (startTracker) {
        miteTracker.start(data.time_entry.id).then(() => {
          console.log('Successfully started tracker for time entry')
        })
      }
    })
  }) // inquirer
}) // parallel
