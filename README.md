__WIP__ CLI tool for [Mite](https://mite.yo.lk)

# Install

    npm install -g mite-cli

# Configuration

Before you can start you’ll have to setup your mite account and api key which you can find in your mite "Account" tab.

    mite config set account <name>
    mite config set apiKey <key>

# Usage

## Budgets

By default this command will list the time entries duration and revenue sums grouped by the active projects during the current month. You can specify other time-frames as second parameter:

    mite budgets last_month

    ┌─────────┬──────────┬──────┬─────────┐
    │      id │ project  │ days │ revenue │
    ├─────────┼──────────┼──────┼─────────┤
    │ 1234567 │ abc      │ 1.00 │    5.33 │
    ├─────────┼──────────┼──────┼─────────┤
    │ 1234568 │ mite-cli │ 0.13 │    0.00 │
    ├─────────┼──────────┼──────┼─────────┤
    │         │          │ 1.13 │    5.33 │
    └─────────┴──────────┴──────┴─────────┘

The supported time-frames are documented in the [Time Entries API](https://mite.yo.lk/en/api/time-entries.html)

## List

By default lists all time-entries including duration, reveneu, locked state, tracking status from "today".

    mite list

## New

Interactive questionaire to create a new entry

    mite new

## Tracker

Start a specific tracker

    mite start <id>

## Stop Tracker

    mite stop

# Alternative CLI Interfaces

- https://github.com/lionralfs/mitey
