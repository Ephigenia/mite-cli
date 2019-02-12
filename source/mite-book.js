#!/usr/bin/env node
'use strict'

const program = require('commander')
const miteApi = require('mite-api')
const bluebird = require('bluebird');

const pkg = require('./../package.json')
const config = require('./config.js')
const mite = miteApi(config.get())
const miteTracker = require('./lib/mite-tracker')(config.get())

program
  .version(pkg.version)
  .description('create a new time entry via command line. use <note> with quotation marks.')
  .arguments('<project> <service> <minutes> <note> [date]')
  .action((project, service, minutes, note, date) => {
    main(project, service, minutes, note, date);
  })
  .parse(process.argv);

if (process.argv.length < 6 || process.argv.length > 7) {
  program.help();
}

function dumpNames(objects, arg, name) {
 console.log("Found multiple matches for "+name+" <"+arg+">:");
 console.log("---------------------------------------------------------------");
 objects.forEach(current => console.log(current.name));
 console.log("---------------------------------------------------------------");
 console.log("Please be more precise!\n");
}

function getProjectChoices(projectArg) {
  return bluebird.promisify(mite.getProjects)()
    .then(response => response.map(d => d.project))
    .then(projects => projects.filter(project => {
      return (project.name && (project.name.toUpperCase().indexOf(projectArg.toUpperCase()) > -1));
    }))
    .then(projects => {
      if (projects.length > 1) {
        dumpNames(projects, projectArg, "project");
      }
      return projects;
    });
}

function getServiceChoices(serviceArg) {
  return bluebird.promisify(mite.getServices)()
    .then(response => response.map(d => d.service))
    .then(services => services.filter(service => {
      return (service.name && (service.name.toUpperCase().indexOf(serviceArg.toUpperCase()) > -1));
    }))
    .then(services => {
      if (services.length > 1) {
        dumpNames(services, serviceArg, "service");
      }
      return services;
    });
}

function main(project, service, minutes, note, date) {
  return Promise.all([
    getProjectChoices(project),
    getServiceChoices(service),
  ]).then(([projects, services]) => {
    if (projects.length == 1 && services.length == 1) {
      let entry = {project_id: projects[0].id, note: note, minutes: minutes, service_id: services[0].id};
      entry.date_at = date || (new Date()).toISOString().slice(0,10); 

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
      });
    } else {
      process.exit(1)
      return
    }
  }) 
}
