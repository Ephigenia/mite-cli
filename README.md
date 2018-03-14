Simple CLI tool for creating, listing, starting and stopping time tracking entries in [Mite](https://mite.yo.lk).

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/mite-cli.svg)](https://www.npmjs.com/package/mite-cli)
[![NPM Downloads](https://img.shields.io/npm/dt/mite-cli.svg)](https://www.npmjs.com/package/mite-cli)
[![CircleCI](https://circleci.com/gh/Ephigenia/mite-cli.svg?style=svg&circle-token=8a00e2583881798bec3a3062c4fbb531c5b7fa1a)](https://circleci.com/gh/Ephigenia/mite-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/mite-cli/badge.svg)](https://snyk.io/test/github/ephigenia/mite-cli)
[![Maintainability](https://api.codeclimate.com/v1/badges/791e0126615bcd34a0e5/maintainability)](https://codeclimate.com/github/Ephigenia/mite-cli/maintainability)

# Install

    npm install -g mite-cli



# Configuration

Before you can start you’ll have to setup your mite account and api key which you can find in your mite "Account" tab.

    mite config set account <name>
    mite config set apiKey <key>


# Features

- Create and start new Entries with interactive survey-like cli interface
- Show & filter time entries to show reports for last month, current week etc.
- Delete single entries by id

Other ideas & planned features can be found in the [wiki](./wiki). If something doesn’t work please [create a new issue](https://github.com/Ephigenia/mite-cli/issues).


# Usage

## Budgets

By default this command will list the time entries duration and revenue sums grouped by the active projects during the current month (`this_month`). You can specify other time-frames as second parameter:

    mite budgets last_month

    ┌─────────┬──────────┬──────────┬──────┬─────────┐
    │      id │ project  │ duration | days │ revenue │
    ├─────────┼──────────┼──────────┼──────┼─────────┤
    │ 1234567 │ abc      │     8:00 | 1.00 │    5.33 │
    ├─────────┼──────────┼──────────┼──────┼─────────┤
    │ 1234568 │ mite-cli │     1:27 | 0.18 │    0.00 │
    ├─────────┼──────────┼──────────┼──────┼─────────┤
    │         │          │     8:27 │ 1.13 │    5.33 │
    └─────────┴──────────┴──────────┴──────┴─────────┘

The supported time-frames are documented in the [Time Entries API](https://mite.yo.lk/en/api/time-entries.html)

## List

By default lists today’s time-entries including id, date, project name, revenue, service and the entries note.

When an entry is currently active and tracked it will be yellow and indicated with a little play icon "▶". Also locked entries are greyed out and indicated with a green checkmark "✔" symbol.

    mite list

    ┌───┬──────────┬────────────┬────────────┬──────────┬─────────┬───────────────────┬──────────────────────────────────────────────────┐
    │ # │       id │ date       │    project │ duration │ revenue │ service           │ note                                             │
    ├───┼──────────┼────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 1 │ 73628791 │ 2017-09-13 │ carservice │  ▶ 01:36 │    0.00 │ Programming       │ open in browser                                  │
    ├───┼──────────┼────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 2 │ 73628761 │ 2017-09-13 │        ABC │    00:07 │    9.33 │ Communication     │ lorem ipsum dolor                                │
    ├───┼──────────┼────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 3 │ 73627950 │ 2017-09-13 │ sp support │    00:04 │    4.84 │ Programming       │ JIRA-123 Lorem ipsum dolor sit amet, consetetur  │
    │   │          │            │            │          │         │                   │ sadipscing.                                      │
    ├───┼──────────┼────────────┼────────────┼──────────┼─────────┼───────────────────┼──────────────────────────────────────────────────┤
    │ 4 │ 73627919 │ 2017-09-13 │        XYZ │    00:10 │   13.33 │ Communication     │ Lorem ipsum dolor sit amet, consetetur           │
    │   │          │            │            │          │         │                   │ sadipscing elitr, sed diam nonumy eirmod         │
    │   │          │            │            │          │         │                   │ tempor invidunt ut labore et dolore              │
    ├───┼──────────┼────────────┼────────────┼──────────┼─────────┼───────────────────┴──────────────────────────────────────────────────┤
    │   │          │            │            │    00:21 │   27.50 │                                                                      │
    └───┴──────────┴────────────┴────────────┴──────────┴─────────┴──────────────────────────────────────────────────────────────────────┘

You also can request longer time frames by using the first argument which is bascially the [`at` parameter](https://mite.yo.lk/en/api/time-entries.html#list-all) of the time entries api:

    mite list this_month

    mite list last_month

Or Specific dates:

    mite list 2017-01-02

Or search for specific entries in all time-entries from the current year

    mite list this_year --search JIRA-123

There are also a bunch of other options available, just check `mite list --help`.

## New

Interactive cli-based multi-step form for creating / starting new time entries. It will read and show a list of projects, services.

    mite new

## Open

Opens a specific time entry in your browser

    mite open 1234567

If you don’t specify a time entry id the index page of your mite client account will be opened.

## Tracker

Start a specific tracker

    mite start <id>

## Stop Tracker

Stops any tracked time tracker.

    mite stop

## Delete entry

Delete a single entry

    mite delete 18472721


# Other Projects

- [Mitey](https://github.com/lionralfs/mitey)
- [mite.cmd](https://github.com/Overbryd/mite.cmd/tree/master)
