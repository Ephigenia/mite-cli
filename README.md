Simple CLI tool for creating, listing, starting and stopping time tracking entries in[Mite](https://mite.yo.lk).


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

By default lists today’s time-entries including id, date, project name, revenue, service and the entries note. When an entry is currently active and tracked it will be yellow and indicated with a little play icon. Also locked entries are greyed out and indicated with a lock symbol.

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

You also can request longer time frames by using the first argument

    mite list this_month

Or search for specific entries

    mite list --search JIRA-123

There are also a bunch of other options available, just check `mite list --help`.

## New

Interactive multi-step questionaire to create a new entry:

    mite new

## Open

Opens a specific time entry in your browser

    mite open 1234567

## Tracker

Start a specific tracker

    mite start <id>

## Stop Tracker

Stops any tracked time tracker.

    mite stop


# Other Projects

- [Mitey](https://github.com/lionralfs/)
- [mite.cmd](https://github.com/Overbryd/mite.cmd/tree/master)
