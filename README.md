Ease to use CLI tool for creating, listing, starting and stopping time tracking entries in [Mite](https://mite.yo.lk) and other things using the [mite-api](https://www.npmjs.com/package/mite-api) npm package which is using the [official mite api](https://mite.yo.lk/api/index.html)

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/mite-cli.svg)](https://www.npmjs.com/package/mite-cli)
[![NPM Downloads](https://img.shields.io/npm/dt/mite-cli.svg)](https://www.npmjs.com/package/mite-cli)
[![CircleCI](https://circleci.com/gh/Ephigenia/mite-cli.svg?style=svg&circle-token=8a00e2583881798bec3a3062c4fbb531c5b7fa1a)](https://circleci.com/gh/Ephigenia/mite-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/mite-cli/badge.svg)](https://snyk.io/test/github/ephigenia/mite-cli)
[![Maintainability](https://api.codeclimate.com/v1/badges/791e0126615bcd34a0e5/maintainability)](https://codeclimate.com/github/Ephigenia/mite-cli/maintainability)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FEphigenia%2Fmite-cli.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FEphigenia%2Fmite-cli?ref=badge_shield)

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
    - [Configuration Options](#configuration-options)
    - [Auto-Completion](#auto-completion)
- [Usage](#usage)
    - [Time Entries](#time-entries)
        - [List](#list)
            - [Filter by time](#filter-by-time)
            - [Other Filters](#other-filters)
            - [Grouping / Reports](#grouping--reports)
            - [Advanced Examples](#advanced-examples)
        - [Create Time-Entries](#create-time-entries)
            - [Interactive](#interactive)
            - [Non-Interactive](#non-interactive)
            - [Advanced Usage](#advanced-usage)
        - [Tracker](#tracker)
            - [Start Tracking](#start-tracking)
            - [Stop Tracking](#stop-tracking)
        - [Modify Time-Entries](#modifiy-time-entries)
            - [Change Note](#change-note)
            - [Un-/Lock Entry](#un-lock-entry)
        - [Delete entry](#delete-entry)
        - [Open](#open)
    - [Users](#users)
    - [Projects](#projects)
        - [Update Project](#update-project)
        - [Delete Project](#delete-project)
    - [Customers](#customers)
        - [Update Customer](#update-customer)
        - [Delete Customer](#delete-customer)
    - [Services](#services)
        - [Update Service](#update-service)
        - [Delete Service](#delete-service)
- [Advanced Topics](#advanced-topics)
    - [Columns](#columns)
    - [Alternate Output formats](#alternate-output-formats)
- [Other Projects](#other-projects)
- [License](#license)


Features
===============================================================================

- Create and start new Entries with interactive survey-like cli interface
- Delete, lock, unlock single time entries
- Edit the currently running entries text for fast updating the work log
- Show, filter, group time entries to show reports for last month, current week etc.
- Delete single entries by id
- List, sort, filter, update & delete user accounts, customers, projects & services using variable columns and cli-tables, csv or tsv data
- Highlight JIRA identifiers and github numeral hashtags in time entry’s notes (can be customized)
- optional installable auto-completions for most of the sub-commands, options and option values

Other ideas & planned features can be found in the [wiki](./wiki). If something doesn’t work please [create a new issue](https://github.com/Ephigenia/mite-cli/issues).

```
Usage: mite [options] [command]

_______ _____ _______ _______     _______        _____
|  |  |   |      |    |______ ___ |       |        |
|  |  | __|__    |    |______     |_____  |_____ __|__

command line tool for time tracking service mite.yo.lk
https://github.com/Ephigenia/mite-cli/


Options:
  -V, --version      output the version number
  -h, --help         output usage information

Commands:
  amend|reword       edit the text for a specific time entry or the currently runnning entry
  autocomplete       install/uninstall autocompletion
  config             show or set configuration settings
  customer           update/delete single customer
  customers|clients  list, filter & search customers
  delete|rm          delete a specific time entry
  list|st            list time entries
  lock               lock single time entry
  new|create         create a new time entry
  open               open the given time entry in browser
  project            update/delete a single project
  projects           list, filter, archive/unarchive & search projects
  service            update/delete single service
  services           list, filter & search services
  start              start the tracker for the given id, will also stop allready running entry
  stop               stop any running counter
  unlock             unlock single time entry
  users              list, filter & search for users
  help [cmd]         display help for [cmd]

```


Installation
===============================================================================

    npm install -g mite-cli

Or use it directly using `npx`:

    npx mite-cli

Please note that all examples in this README.md assume that you have installed mite-cli globally. If not, just replace the `mite` call with `npx mite-cli` and you’re fine.



Configuration
===============================================================================

Before you can start you’ll have to setup your mite account and api key which you can find in your mite "Account" tab.

    mite config set account <name>
    mite config set apiKey <key>

The configuration is stored in a file which is only writable and readable by you in your home directory: `~/.config/mite-cli/config.json`. (Or whatever you defined in `XDG_CONFIG_HOME`).

In case you want to use multiple mite accounts please open up a [change request](https://github.com/Ephigenia/mite-cli/issues)

Configuration Options
--------------------------------------------------------------------------------

- `currency`  
    defines the currency used for displaying money values
- `customersColumns`  
    defines the default columns to be used when running `mite customers list`.
- `listColumns`  
    defines the default columns to be used when running `mite list`.
- `noteHighlightRegexp`
    defines a single regular expression which can contain a single capturing group which will get hightlighted. By default this is set to highlight github hashtag notation (f.e. #218) and jira story identifiers (f.e. CRYO-1281). When you change this note that the beginning and trailing slashes must be omitted and the regexp is case-sensitive and modfieres cannot be changed.
- `outputFormat`  
    defines the default output format for the list commands, defaults to `table`
- `projectsColumns`  
    defines the default columns to be used when running `mite projects list`.
- `servicesColumns`  
    defines the default columns to be used when running `mite services list`.
- `usersColumns`  
    defines the default columns to be used when running `mite users`.

Configuration options can always be resetted to their default by leaving out the value, like: `mite config set listColumns`.

Auto-Completion
--------------------------------------------------------------------------------

Since version 0.9.0 mite-cli supports auto-completions for most of the sub-commands arguments, options and option values which make it much easier to use the cli tool. No need to remember user ids or service names anymore as they are suggested when hitting TAB.

- Right now auto-completion is only supported and tested on -nix-systems and with the following bash environments: bash, fish and zsh
- mite-cli must be installed globally and must be in `$PATH`

Before auto-completions can be used you need to install them using the `autocomplete` command:

    mite autocomplete install

When you think you had enough you can uninstall it with

    mite autocomplete uninstall


Usage
===============================================================================

Time Entries
--------------------------------------------------------------------------------

### List

By default lists today’s time-entries including id, date, project name, revenue, service and the entries note. You can modify this by changing the `listColumns` in the config. (can be changed `mite config set listColumns id,user,project)`

When an entry is currently active and tracked it will be yellow and indicated with a little play icon "▶". Also locked entries are greyed out and indicated with a green checkmark "✔" symbol.

    mite list

    ┌──────────┬────────────┬─────────────────┬────────────┬──────────┬─────────┬───────────────────┬──────────────────────────────────────────────────┐
    │       ID │ Date       │ User            │    Project │ Duration │ Revenue │ Service           │ Note                                             │
    ├──────────┼────────────┼─────────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 73628791 │ 2017-09-13 │ Marcel Eichner  │ carservice │  ▶ 01:36 │       - │ Programming       │ open in browser                                  │
    ├──────────┼────────────┼─────────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 73628761 │ 2017-09-13 │ Marcel Eichner  │        ABC │    00:07 │    9.33 │ Communication     │ lorem ipsum dolor                                │
    ├──────────┼────────────┼─────────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 73627950 │ 2017-09-13 │ Marcel Eichner  │ sp support │    00:04 │    4.84 │ Programming       │ JIRA-123 Lorem ipsum dolor sit amet, consetetur  │
    │          │            │                 │            │          │         │                   │ sadipscing.                                      │
    ├──────────┼────────────┼─────────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 73627919 │ 2017-09-13 │ Marcel Eichner  │        XYZ │    00:10 │   13.33 │ Communication     │ Lorem ipsum dolor sit amet, consetetur           │
    │          │            │                 │            │          │         │                   │ sadipscing elitr, sed diam nonumy eirmod         │
    │          │            │                 │            │          │         │                   │ tempor invidunt ut labore et dolore              │
    ├──────────┼────────────┼─────────────────┼────────────┼──────────┼─────────┼───────────────────┴──────────────────────────────────────────────────┤
    │          │            │                 │            │    00:21 │   27.50 │                                                                      │
    └──────────┴────────────┴─────────────────┴────────────┴──────────┴─────────┴──────────────────────────────────────────────────────────────────────┘

#### Filter by time

You also can request longer time frames by using the first argument which is bascially the [`at` parameter](https://mite.yo.lk/en/api/time-entries.html#list-all) of the time entries api:

    mite list this_month

Or Specific dates:

    mite list 2017-01-02

Or Custom periods of time

    mite list --from 2018-04-01 --to 2018-04-15

Or search for specific entries in all time-entries from the current year

    mite list this_year --search JIRA-123

#### Other Filters

There are various filters to limit the entries shown:

- `--from` & `--to` show entries only between two dates
- `--billable` show only (not-)billable entries
- `--tracking` show only tracking/currently running entries
- `--customer-id` show entries from a one or more customer(s)
- `--service-id` show entries from a one or more service(s)
- `--project-id` show entries from a one or more project(s)
- `--locked` show only locked or unlocked entries
- `--user-id` show entries from one or more user(s)

It can be hard to remember ids, that’s why I recommend using [auto-completion](#auto-completion) which makes it way easier to filter time entries.

#### Grouping / Reports

For getting a rough overview of the monthly project or services distribution you can use the `--group-by` argument which will group the time entries. This could also be helpful for creating bills.

    mite list last_month --group-by=service

    ┌────────────────────┬────────┬────────────┐
    │ Communication      │  13:03 │   994.98 € │
    ├────────────────────┼────────┼────────────┤
    │ Programming        │ 109:27 │  9387.11 € │
    ├────────────────────┼────────┼────────────┤
    │ Project Management │  15:43 │  1484.48 € │
    ├────────────────────┼────────┼────────────┤
    │                    │ 138:13 │ 11866.57 € │
    └────────────────────┴────────┴────────────┘

Or even more groups which also allows splitting between customers:

    mite list last_month --group-by=customer,service

    ┌─────────────────┬───────────────────┬────────┬────────────┐
    │ Soup Inc.       │ Communication     │   3:48 │   361.00 € │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Soup Inc.       │ Programming       │  88:15 │  1383.75 € │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Soup Inc.       │ ProjectManagement │  15:20 │   456.67 € │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Musterman Corp. │ Communication     │   0:47 │          - │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Musterman Corp. │ Programming       │   7:35 │          - │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Beans Gmbh      │ Communication     │   8:28 │   133.98 € │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Beans Gmbh      │ Programming       │  13:37 │   203.36 € │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │ Beans Gmbh      │ ProjectManagement │   0:23 │    97.81 € │
    ├─────────────────┼───────────────────┼────────┼────────────┤
    │                 │                   │ 138:13 │  2635.15 € │
    └─────────────────┴───────────────────┴────────┴────────────┘

#### Advanced Examples

When creating a bill for a project create a list of all services worked on in a month on a specific project:

    mite list last_month --project-id 2681601 --group-by service

    ┌────────────────────┬────────┬────────────┐
    │ Communication      │  13:03 │   994.98 € │
    ├────────────────────┼────────┼────────────┤
    │ Programming        │ 109:27 │  9387.11 € │
    ├────────────────────┼────────┼────────────┤
    │ Project Management │  15:43 │  1484.48 € │
    ├────────────────────┼────────┼────────────┤
    │                    │ 138:13 │ 11866.57 € │
    └────────────────────┴────────┴────────────┘

In order to fill the details of the services you’ll need all the notes from that specific service. Get the notes for one specific service, project for the last month to put them on a bill or similar:

    mite list last_month --project-id 2681601 --service-id 325329 --columns note --format text | sort -u

### Create Time-Entries

#### Interactive

When no arguments or just the "note" is given `mite new` asks for more details of the time-entry that should be created. Project, service and duration can be entered in an interactive survey.

    mite new

You can also start by providing a precomposed note

    mite new "started working on new features"

#### Non-Interactive

You can also start by passing over the content’s of the new time entry or even the project’s name, service, minutes or the date. The following example will create a 35 minutes entry for the Project "myProject1"

    mite new "created some new nice code" myProject1 programming 35

The duration values can be the number of minutes or a duration string. When you add a plus sign at the end "+", f.e. "3:12+" the time entry is created and emidiently started.

    mite new "researching colors for project" myProject1 programming 0:05+

#### Advanced Usage

Create a time entrie’s note from the last git commit message:

    git log -1 --pretty=%B | xargs echo -n | mite new projectx communication 30

Read note content von stdin / pipe in note:

    echo "my new note" | mite new projectx programming 60+

### Tracker

#### Start Tracking

Start tracking of a specific time entry.

    mite start <timeEntryId>

#### Stop Tracking

Stops any currently running time entry.

    mite stop

### Modify Time-Entries

#### Change Note

When there’s a tracker running you may want to update the note without opening the browser and enter the new details. You can use `amend` or `reword` command which will load the time entry and you can enter the new note.

    mite amend

You can also add the `--editor` option so that your favorite editor opens up with the current note prefilled. Make sure your `$EDITOR` is correctly set.

    mite amend --editor

You can also alter the notes of other time entries when you specify their id

    mite amend 1847132

#### Un-/Lock Entry

Lock a single time entry

    mite lock 1289736

Unlock a single time entry

    mite lock 128721

Locking all entries from the last month from a specific customer using `mite list` and `xargs`:

    mite list last_month --customer-id 128171 --columns id --format text | xargs -n1 mite lock

### Delete entry

Delete a single entry

    mite delete 18472721

Deleting a set of entries filtered using `mite list` and `xargs`:

    mite list this_month --project-id 128717 --columns id --format text | xargs -n1 mite delete

### Open

Opens the organization’s mite homepage in the systems default browser.

    mite open

When a time-entry id is provided opens up the edit form of that entry.

    mite open 1234567


Users
--------------------------------------------------------------------------------

List user accounts while client-side search in name, email & note, sort by email and list only time_trackers and admins. Archived users will be grey.

    mite user --search frank --role admin,time_tracker --sort email

    ┌────────────┬──────────────┬─────────────────┬─────────────────────────────┬────────────────────────────────────────────────────┐
    │         ID │ User Role    │ Name            │ Email                       │ Note                                               │
    ├────────────┼──────────────┼─────────────────┼─────────────────────────────┼────────────────────────────────────────────────────┤
    │     123456 │ admin        │ Frank Abergnale │ email@host.com              │ Lorem ipsum dolor sit amet, consectetur adipisicin │
    │            │              │                 │                             │ g elit, sed do eiusmod tempor incididunt ut labore │
    │            │              │                 │                             │ et dolore magna aliqua. Ut enim ad minim veniam, q │
    │            │              │                 │                             │ uis nostrud exercitation ullamco laboris nisi ut a │
    │            │              │                 │                             │ liquip ex ea commodo consequat. Duis aute irure do │
    │            │              │                 │                             │ lor in reprehenderit in voluptate velit esse cillu │
    │            │              │                 │                             │ m dolore eu fugiat nulla pariatur. Excepteur sint  │
    │            │              │                 │                             │ occaecat cupidatat non proident, sunt in culpa qui │
    │            │              │                 │                             │ officia deserunt mollit anim id est laborum.       │
    ├────────────┼──────────────┼─────────────────┼─────────────────────────────┼────────────────────────────────────────────────────┤
    │      12345 │ time_tracker │ Heinz Frankfurt │ email2@host.com             │                                                    │
    └────────────┴──────────────┴─────────────────┴─────────────────────────────┴────────────────────────────────────────────────────┘

List archived user accounts

    mite user --archived

    ┌────────────┬──────────────┬─────────────────┬─────────────────────────────┬────────────────────────────────────────────────────┐
    │         ID │ User Role    │ Name            │ Email                       │ Note                                               │
    ├────────────┼──────────────┼─────────────────┼─────────────────────────────┼────────────────────────────────────────────────────┤
    │       1234 │ time_tracker │ James Howlett   │ email3@host.com             │                                                    │
    └────────────┴──────────────┴─────────────────┴─────────────────────────────┴────────────────────────────────────────────────────┘

show all time tracking users from a company (all have a ephigenia.de email address)

    mite users --role time_tracker --email ephigenia.de

export all users to a csv file

    mite users --columns id,role,name,email,archived,language --format csv > users.csv

Show a report for all users showing the revenues and times per service for all users matching a query

    mite users --search marc --columns id --format text | xargs mite list last_month --group-by service --user-id


Projects
--------------------------------------------------------------------------------

List, filter and search for projects. Example showing only archived projects ordered by customer-id in ascending order

    mite project list --archived yes --sort customer-id

    ┌─────────┬───────────────┬──────────────────────────┬─────────────┬─────────┬──────────────────────────────────────────────────────────────────────────────────┐
    │ ID      │ Name          │ Customer                 │      Budget │    Rate │ Note                                                                             │
    ├─────────┼───────────────┼──────────────────────────┼─────────────┼─────────┼──────────────────────────────────────────────────────────────────────────────────┤
    │ 1234567 │ Alpha X       │ WebCompany (1234)        │   96:00 h/m │ 12.34 € │ lorem ipsum, multiline note example                                              │
    │         │               │                          │             │         │ dolor text                                                                       │
    ├─────────┼───────────────┼──────────────────────────┼─────────────┼─────────┼──────────────────────────────────────────────────────────────────────────────────┤
    │ 1234568 │ Beta-Test     │ WebCompany (1234)        │           - │       - │                                                                                  │
    ├─────────┼───────────────┼──────────────────────────┼─────────────┼─────────┼──────────────────────────────────────────────────────────────────────────────────┤
    │ 1234568 │ App-Review    │ WebCompany (1234)        │ 5000.00 €/m │ 12.34 € │                                                                                  │
    ├─────────┼───────────────┼──────────────────────────┼─────────────┼─────────┼──────────────────────────────────────────────────────────────────────────────────┤
    │  827261 │ Deployment    │ Example ltd. (73625)     │  24000.00 € │       - │                                                                                  │
    └─────────┴───────────────┴──────────────────────────┴─────────────┴─────────┴──────────────────────────────────────────────────────────────────────────────────┘

Export all projects using other columns as CSV:

    mite project list --columns id,customer-id,customer_name --format csv > projects_export.csv

Unarchive all archived projects from a specific customer using `xargs`:

    mite project list --customer-id 123456 --columns id --format text | xargs -n1 mite project update --archived false

### Update Project

The `mite project` command can update the details like budget-type, archived state, hourly-rate, name or note of a project.

Archive a single project

    mite project update --archived false 1238127

Set the note and name of a project

    mite project update --name "js prototype" --note="prototype development" 12344567

Update hourly rate of a project while updating all already associated time entries:

    mite project update --hourly-rate 9000 --update-entries 1234567

Archive multiple projects using xargs:

    mite project list --columns id --format text | xargs -n1 mite project update --archived false

### Create Project

Use `mite project new` subcommand to create new projects. There’s currently no support for complicated hourly rates per service. To find out the `customer_id` use either [Auto-Completion](#auto-completion) or copy the id from the `mite project list` list.

The following example will create a new Project with a overall budget of 5000 and a hourly rate of 80:

    mite project new --customer-id 123456 \
        --name "Side Project B" \
        --hourly-rate 80.00 \
        --budget 5000 \
        --budget-type cents

### Delete Project

Delete a project:

    mite project delete 123456

Delete all archived projects:

    mite project list --columns id --archived yes --format text | xargs -n1 mite project delete


Customers
--------------------------------------------------------------------------------

List, filter and search for customers. Archived customers will be shown in grey.

    mite customers list --search web --sort id

    ┌────────┬─────────────────┬─────────┬─────────────────────────────────────┐
    │ ID     │ Name            │ Rate    │ Note                                │
    ├────────┼─────────────────┼─────────┼─────────────────────────────────────┤
    │ 123456 │ WebCompany Ltd. │ 12.34 € │ client’s note                       │
    ├────────┼─────────────────┼─────────┼─────────────────────────────────────┤
    │ 827361 │ Solutions Web   │ 80.00 € │ Multiline lorem ipsum               │
    │        │                 │         │ Note content                        │
    ├────────┼─────────────────┼─────────┼─────────────────────────────────────┤
    │ 927361 │ Mite-Cli        │ -       │ open source project                 │
    └────────┴─────────────────┴─────────┴─────────────────────────────────────┘

Use different columns

    mite customers --colums name,hourly_rate

Export all archived customers

    mite customers --archived true --format csv > archived_customers.csv

### Update Customer

This command can update a customer’s name, note, hourly rate and archived state.

Archive a single customer

    mite project update --archived false 1238127

Archive multiple customers using xargs:

    mite customers --columns id --format text | xargs -n1 mite customer update --archived false

### Delete Customer

Delete a single customer

    mite customer delete 123456

Delete a whole set of customers

    mite customers --columns id --archived yes --format text | xargs -n1 mite customer delete

Services
--------------------------------------------------------------------------------

List, filter and search for services. Archived services will be grey.

    mite services

    ┌────────┬───────────────────┬──────────┬──────────┬──────────────────────────────────────────────────────────────────────────────┐
    │ ID     │ Name              │ Rate     │ Billable │ Note                                                                         │
    ├────────┼───────────────────┼──────────┼──────────┼──────────────────────────────────────────────────────────────────────────────┤
    │ 123456 │ Programming       │  20.00 € |      yes │ General Programming                                                          │
    ├────────┼───────────────────┼──────────┼──────────┼──────────────────────────────────────────────────────────────────────────────┤
    │ 123457 │ Consulting        │  30.00 € │      yes │                                                                              │
    ├────────┼───────────────────┼──────────┼──────────┼──────────────────────────────────────────────────────────────────────────────┤
    │ 736251 │ Accounting        │        - │       no │ Accounting, invoices etc.                                                    │
    └────────┴───────────────────┴──────────┴──────────┴──────────────────────────────────────────────────────────────────────────────┘

### Update Service

This command can update a service’s name, note, hourly rate and archived state.

Change the hourly rate of a service:

    mite service update --hourly-rate 8500 123456

Archive a single service:

    mite service update --archived false 1238127

### Delete Service

Delete a single service

    mite service delete 123456



Advanced Topics
===============================================================================

Columns
--------------------------------------------------------------------------------

Every command that produces a tabular output uses a default set of columns per command. You can specify which columns should be shown using the `--columns` option or use `--columns all` to show all available columns.

The default column set can be changed per command using the config options that end with `*Columns`.

The following example will only show the user and his durations from last week including the sum of the durations:

    mite list last_week --billable false --columns user,duration

    ┌────────────────┬────────────┐
    │ User           │   Duration │
    ├────────────────┼────────────┤
    │ Marcel Eichner │       0:45 │
    ├────────────────┼────────────┤
    │ Marcel Eichner │       0:20 │
    ├────────────────┼────────────┤
    │ Marcel Eichner │     ✔ 0:13 │
    ├────────────────┼────────────┤
    │ Marcel Eichner │     ✔ 1:34 │
    ├────────────────┼────────────┤
    │ Marcel Eichner │     ✔ 0:06 │
    ├────────────────┼────────────┤
    │                │       2:58 │
    └────────────────┴────────────┘

Specifying the columns is important when you want to use the ids of items in other commands with xargs.

The following example uses the ids of all time entries to lock them:

    mite list last_month --columns id --format text | xargs -n1 mite lock

Alternate Output formats
--------------------------------------------------------------------------------

The output of program is designed to look good to a human and shows the results in tabular style using box drawing characters.

The following formats are supported:

- csv (comma-seperated)
- json, *ignores ansi-colors & table headers*
- md (markdown)
- table (cli-table)
- text (line-seperated), *doesn’t show table headers*
- tsv (tab-separated)

There are alternative output formats which may be useful when you automatically process the results such as `json`, `csv`, `text`:

    mite list last_week --format csv --columns user,id

    Date,User,Duration
    2018-11-02,Marcel Eichner,1:10
    2018-11-01,Marcel Eichner,2:30
    2018-10-31,Marcel Eichner,✔ 2:47
    2018-10-30,Marcel Eichner,✔ 0:43
    2018-10-30,Marcel Eichner,✔ 0:10
    2018-10-30,Marcel Eichner,✔ 0:09
    2018-10-29,Marcel Eichner,✔ 1:35
    2018-10-29,Marcel Eichner,✔ 1:21
    ,,10:25

This makes it very easy to further process the data, transform it into a HTML page or PDF.   

Creating a time-sheet for your clients can be done like this:

    mite list last_month --format csv --columns date,service,note,duration

Using Ids from the output for further processing using `xargs`:

    mite list --columns id --format text | xargs -n1 mite lock

Showing all notes from all entries from a specific service, to put them into a bill:

    mite list last_month --service-id 123 --project-id 456 --format text --columns note


Other Projects
===============================================================================

- [Mitey](https://github.com/lionralfs/mitey)
- [mite.cmd](https://github.com/Overbryd/mite.cmd/tree/master)
- [mite-go](https://github.com/leanovate/mite-go)


License
===============================================================================
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FEphigenia%2Fmite-cli.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FEphigenia%2Fmite-cli?ref=badge_large)
