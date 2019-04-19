# [0.9.0](https://github.com/Ephigenia/mite-cli/compare/v0.8.1...v0.9.0) (2019-04-19)


### Bug Fixes

* mistakenly changed alias for customers ([7d02c0a](https://github.com/Ephigenia/mite-cli/commit/7d02c0a))
* **amend:** more precise error message with no tracker or invalid id ([dd47fde](https://github.com/Ephigenia/mite-cli/commit/dd47fde))
* **config:** prevent setting of undefined variable ([5eaa01d](https://github.com/Ephigenia/mite-cli/commit/5eaa01d))
* typo in auto-completion name in lock and unlock ([8620b2e](https://github.com/Ephigenia/mite-cli/commit/8620b2e))
* typo in mite autocomplete uninstall ([697b6ed](https://github.com/Ephigenia/mite-cli/commit/697b6ed))
* **config:** re-enable resetting values to their default ([2248b48](https://github.com/Ephigenia/mite-cli/commit/2248b48))
* **mite:** accidential dublicate parsing of argv ([93ad79e](https://github.com/Ephigenia/mite-cli/commit/93ad79e))
* **projects:** customer_name exact matches ([45ef317](https://github.com/Ephigenia/mite-cli/commit/45ef317))


### Features

* adds --help to all the auto-completions ([ff40cf5](https://github.com/Ephigenia/mite-cli/commit/ff40cf5))
* **unlock:** adds sub-command to unlock single time entries ([47db187](https://github.com/Ephigenia/mite-cli/commit/47db187))
* adds base for auto-completion for all mite subcommands ([96e7f44](https://github.com/Ephigenia/mite-cli/commit/96e7f44))
* **lock:** adds sub-command to lock single time entries ([38ec3e0](https://github.com/Ephigenia/mite-cli/commit/38ec3e0))
* adds outputFormat to config to define global output format ([c95eac4](https://github.com/Ephigenia/mite-cli/commit/c95eac4))
* **amend:** auto-completed provides list of 5 last entries of the user ([87309f4](https://github.com/Ephigenia/mite-cli/commit/87309f4))
* **customer-update:** adds auto-completion for customer list and archived state ([eefb1b9](https://github.com/Ephigenia/mite-cli/commit/eefb1b9))
* **customer-update:** adds command for updating single customer ([8733b12](https://github.com/Ephigenia/mite-cli/commit/8733b12))
* **customer-update:** auto-comple list depends on archived option ([c44e29e](https://github.com/Ephigenia/mite-cli/commit/c44e29e))
* **customer-update:** change name and note of a customer ([42f4090](https://github.com/Ephigenia/mite-cli/commit/42f4090))
* **customers:** adds --column option ([33df7a5](https://github.com/Ephigenia/mite-cli/commit/33df7a5))
* **customers:** adds --columns option to define which colums are shown ([bd734c8](https://github.com/Ephigenia/mite-cli/commit/bd734c8))
* **customers:** adds auto-completion for options and option values ([60bff36](https://github.com/Ephigenia/mite-cli/commit/60bff36))
* **delete:** adds autocompletion which shows last 5 entries ([26edb09](https://github.com/Ephigenia/mite-cli/commit/26edb09))
* **formater:** adds durationToMinutes helper function ([1f249d9](https://github.com/Ephigenia/mite-cli/commit/1f249d9))
* **list:** --user_id auto-completion shows you at the current user ([d527e06](https://github.com/Ephigenia/mite-cli/commit/d527e06))
* **list:** adds auto-completion for options and option values ([a3906bd](https://github.com/Ephigenia/mite-cli/commit/a3906bd))
* **list:** adds text as output format ([31be856](https://github.com/Ephigenia/mite-cli/commit/31be856))
* **list:** adds time period completion when date is started to enter ([6b4ddee](https://github.com/Ephigenia/mite-cli/commit/6b4ddee))
* **list:** services auto-completion shows billable services with dollar sign ([8ab0340](https://github.com/Ephigenia/mite-cli/commit/8ab0340))
* **lock:** adds auto-completion for options ([9d6469e](https://github.com/Ephigenia/mite-cli/commit/9d6469e))
* **lock:** adds auto-completion for options ([c410ab2](https://github.com/Ephigenia/mite-cli/commit/c410ab2))
* **new:** accepts minutes in duration format HH:MM ([2b14588](https://github.com/Ephigenia/mite-cli/commit/2b14588))
* **new:** adds auto-completion for project, services, minutes and date ([4e8ac36](https://github.com/Ephigenia/mite-cli/commit/4e8ac36))
* **new:** create new time entries using project or service ids ([afa2830](https://github.com/Ephigenia/mite-cli/commit/afa2830))
* **project:** update a project f.e. archive/unarchive it ([d5342c6](https://github.com/Ephigenia/mite-cli/commit/d5342c6))
* **project-update:** adds auto-completion for argument and project ids ([a36923d](https://github.com/Ephigenia/mite-cli/commit/a36923d))
* **project-update:** auto-comple list depends on archived option ([cb37578](https://github.com/Ephigenia/mite-cli/commit/cb37578))
* **project-update:** change name and note of a project ([1a8a76a](https://github.com/Ephigenia/mite-cli/commit/1a8a76a))
* **projects:** adds auto-completion for options and option values ([06e4c4b](https://github.com/Ephigenia/mite-cli/commit/06e4c4b))
* **services:** adds --columns option ([0736812](https://github.com/Ephigenia/mite-cli/commit/0736812))
* **services:** adds auto-completion for options and option values ([29f44bb](https://github.com/Ephigenia/mite-cli/commit/29f44bb))
* **start:** adds auto-completion which shows latest 5 entries ([25201d0](https://github.com/Ephigenia/mite-cli/commit/25201d0))
* **users:** adds auto-completion options and option values ([12b325f](https://github.com/Ephigenia/mite-cli/commit/12b325f))



## [0.8.1](https://github.com/Ephigenia/mite-cli/compare/v0.8.0...v0.8.1) (2019-03-17)


### Bug Fixes

* use master of mite-api to fix package security warnings ([26bae84](https://github.com/Ephigenia/mite-cli/commit/26bae84))



# [0.8.0](https://github.com/Ephigenia/mite-cli/compare/v0.7.0...v0.8.0) (2019-03-17)


### Features

* **list:** adds capability to read display column names from config ([6d8f946](https://github.com/Ephigenia/mite-cli/commit/6d8f946))
* **mite-new:** accept all inputs via optional arguments ([e1d549e](https://github.com/Ephigenia/mite-cli/commit/e1d549e))
* adds descriptions for cli arguments ([4c28876](https://github.com/Ephigenia/mite-cli/commit/4c28876))
* adds example to almost all help  messages ([7c5084d](https://github.com/Ephigenia/mite-cli/commit/7c5084d))



# [0.7.0](https://github.com/Ephigenia/mite-cli/compare/v0.6.4...v0.7.0) (2018-12-14)


### Bug Fixes

* **list:** correct revenue reduction for correct sum ([6f24c46](https://github.com/Ephigenia/mite-cli/commit/6f24c46))
* **list:** default sort option using constant ([e833a2d](https://github.com/Ephigenia/mite-cli/commit/e833a2d))
* wrongly increased version number ([106a152](https://github.com/Ephigenia/mite-cli/commit/106a152))


### Features

* **budgets:** adds format option ([831be4b](https://github.com/Ephigenia/mite-cli/commit/831be4b))
* **list:** adds markdown table output ([cc7f93c](https://github.com/Ephigenia/mite-cli/commit/cc7f93c))
* **list:** adds optional csv, tsv or table output format ([0c76b6f](https://github.com/Ephigenia/mite-cli/commit/0c76b6f))
* **list:** highlight numeral hashtags (github) ([921bba3](https://github.com/Ephigenia/mite-cli/commit/921bba3))
* **list:** option to define the columns shown ([c3e9085](https://github.com/Ephigenia/mite-cli/commit/c3e9085))
* **projects:** adds format option ([85d4e81](https://github.com/Ephigenia/mite-cli/commit/85d4e81))
* **services:** adds format option ([db474cd](https://github.com/Ephigenia/mite-cli/commit/db474cd))
* **user:** adds format option ([f180ea7](https://github.com/Ephigenia/mite-cli/commit/f180ea7))



## [0.6.4](https://github.com/Ephigenia/mite-cli/compare/v0.6.3...v0.6.4) (2018-11-05)


### Bug Fixes

* **list:** adds missing user column ([bae35b5](https://github.com/Ephigenia/mite-cli/commit/bae35b5))



## [0.6.3](https://github.com/Ephigenia/mite-cli/compare/v0.6.2...v0.6.3) (2018-11-02)


### Bug Fixes

* **config:** config file stored securely in home directory ([f17e448](https://github.com/Ephigenia/mite-cli/commit/f17e448)), closes [#2](https://github.com/Ephigenia/mite-cli/issues/2)
* **config:** removes ENV injectable account, apiKey and application ([af4268a](https://github.com/Ephigenia/mite-cli/commit/af4268a))



## [0.6.2](https://github.com/Ephigenia/mite-cli/compare/v0.6.1...v0.6.2) (2018-10-09)



## [0.6.1](https://github.com/Ephigenia/mite-cli/compare/v0.6.0...v0.6.1) (2018-09-22)


### Bug Fixes

* **new:** use of note argument ([0d598f2](https://github.com/Ephigenia/mite-cli/commit/0d598f2))


### Features

* **new:** first arguments used as note ([e478dd1](https://github.com/Ephigenia/mite-cli/commit/e478dd1))
* **projects:** making archived true the default option ([0ed2510](https://github.com/Ephigenia/mite-cli/commit/0ed2510))



# [0.6.0](https://github.com/Ephigenia/mite-cli/compare/v0.5.0...v0.6.0) (2018-04-06)


### Bug Fixes

* **list:** empty service & project names displayed as "-" ([89add52](https://github.com/Ephigenia/mite-cli/commit/89add52))
* **list:** notes with line-breaks ([687384f](https://github.com/Ephigenia/mite-cli/commit/687384f))
* **list:** null revenues shown as "-" ([0d9d074](https://github.com/Ephigenia/mite-cli/commit/0d9d074))
* **projects:** empty customer displayed as "-" ([ae515d1](https://github.com/Ephigenia/mite-cli/commit/ae515d1))
* **service:** rate displayed as "-" when null ([f380878](https://github.com/Ephigenia/mite-cli/commit/f380878))


### Features

* **amend:** adds inline or editor-edit currently tracked entry’s note ([ad435c7](https://github.com/Ephigenia/mite-cli/commit/ad435c7))
* **customers:** adds list of customers ([9f634c5](https://github.com/Ephigenia/mite-cli/commit/9f634c5))
* **customers:** sort by rate / hourly_rate ([dd82769](https://github.com/Ephigenia/mite-cli/commit/dd82769))
* **list:** adds "sort" options for api-side ordering the results ([ffbd738](https://github.com/Ephigenia/mite-cli/commit/ffbd738))
* **list:** adds group_by argument and alternate table output format ([541d0f3](https://github.com/Ephigenia/mite-cli/commit/541d0f3))
* **list:** highlight jira identifiers ([cabd423](https://github.com/Ephigenia/mite-cli/commit/cabd423))
* **project:** show archived & not archived in one list ([185c876](https://github.com/Ephigenia/mite-cli/commit/185c876))
* **project:** sort by budgets & hourly_rate ([0609b91](https://github.com/Ephigenia/mite-cli/commit/0609b91))
* **projects:** list projects ([0a32f3a](https://github.com/Ephigenia/mite-cli/commit/0a32f3a))
* **projects:** order by customer_name & id ([59103c3](https://github.com/Ephigenia/mite-cli/commit/59103c3))
* **projects:** search for customer names ([15a9c0d](https://github.com/Ephigenia/mite-cli/commit/15a9c0d))
* **services:** adds list of services ([c0464f5](https://github.com/Ephigenia/mite-cli/commit/c0464f5))
* **services:** show archived & not archived in one list ([0b4556f](https://github.com/Ephigenia/mite-cli/commit/0b4556f))
* **users:** shows archived & not archived users in one list ([a1f721d](https://github.com/Ephigenia/mite-cli/commit/a1f721d))



# [0.5.0](https://github.com/Ephigenia/mite-cli/compare/v0.4.4...v0.5.0) (2018-03-14)


### Bug Fixes

* **new:** errors while starting time entry are shown ([abf2869](https://github.com/Ephigenia/mite-cli/commit/abf2869))
* **new:** newly create time entry id is shown in output ([3967f29](https://github.com/Ephigenia/mite-cli/commit/3967f29))
* **new:** start tracker ([312a0fc](https://github.com/Ephigenia/mite-cli/commit/312a0fc))
* **new:** start tracker ([3fcd425](https://github.com/Ephigenia/mite-cli/commit/3fcd425))


### Features

* **delete:** introduces mite delete <id> command ([75aa6ed](https://github.com/Ephigenia/mite-cli/commit/75aa6ed))
* **list:** adds from & to options ([47fcd37](https://github.com/Ephigenia/mite-cli/commit/47fcd37))
* **list:** adds tracking option ([83e208c](https://github.com/Ephigenia/mite-cli/commit/83e208c))
* **list:** filter using user_id ([5866a75](https://github.com/Ephigenia/mite-cli/commit/5866a75))
* **new:** optional leave service & project empty ([d4ec166](https://github.com/Ephigenia/mite-cli/commit/d4ec166))
* **user:** adds first index column ([e8fd2fe](https://github.com/Ephigenia/mite-cli/commit/e8fd2fe))
* **user:** adds user list & archived user list ([bcc015c](https://github.com/Ephigenia/mite-cli/commit/bcc015c))
* **user:** client-side search in email, name & note with regexp ([2bde83c](https://github.com/Ephigenia/mite-cli/commit/2bde83c))
* **user:** filter by user roles ([8b83154](https://github.com/Ephigenia/mite-cli/commit/8b83154))
* **user:** sort by column name ([de3e471](https://github.com/Ephigenia/mite-cli/commit/de3e471))



## [0.4.4](https://github.com/Ephigenia/mite-cli/compare/v0.4.3...v0.4.4) (2018-02-16)


### Bug Fixes

* **list:** use checkmark instead of lock due to char width ([3d88cfc](https://github.com/Ephigenia/mite-cli/commit/3d88cfc))
* migrates cli-table2 to table package ([acf59ac](https://github.com/Ephigenia/mite-cli/commit/acf59ac))



## [0.4.3](https://github.com/Ephigenia/mite-cli/compare/v0.4.2...v0.4.3) (2018-02-16)


### Bug Fixes

* using mite-api fork for updated npm packages ([c83b1af](https://github.com/Ephigenia/mite-cli/commit/c83b1af))



## [0.4.2](https://github.com/Ephigenia/mite-cli/compare/v0.4.1...v0.4.2) (2018-02-13)


### Bug Fixes

* **new:** show error message when creation fails ([ab4a895](https://github.com/Ephigenia/mite-cli/commit/ab4a895))



## [0.4.1](https://github.com/Ephigenia/mite-cli/compare/v0.4.0...v0.4.1) (2018-01-08)


### Bug Fixes

* adds alias "ls" for "list" and "create" for "new" ([1072252](https://github.com/Ephigenia/mite-cli/commit/1072252))
* **budgets:** adds duration column to table output ([0d1b5b1](https://github.com/Ephigenia/mite-cli/commit/0d1b5b1))
* **open:** also open mite url when time entry id not given ([b4f21c9](https://github.com/Ephigenia/mite-cli/commit/b4f21c9))
* **open:** alternate message when no id given ([b68377d](https://github.com/Ephigenia/mite-cli/commit/b68377d))
* **start:** adds verbose error message when entry not found ([b8637ea](https://github.com/Ephigenia/mite-cli/commit/b8637ea))



# [0.4.0](https://github.com/Ephigenia/mite-cli/compare/v0.3.0...v0.4.0) (2017-09-19)


### Bug Fixes

* **list:** set default limit to 100 to return not-billable entries ([fb9c476](https://github.com/Ephigenia/mite-cli/commit/fb9c476))


### Features

* **list:** adds billable argument ([6f743a4](https://github.com/Ephigenia/mite-cli/commit/6f743a4))
* mite open to open specific entries in browser ([8ac7edb](https://github.com/Ephigenia/mite-cli/commit/8ac7edb))



# [0.3.0](https://github.com/Ephigenia/mite-cli/compare/v0.2.0...v0.3.0) (2017-08-24)


### Bug Fixes

* removes padding ([ed4d859](https://github.com/Ephigenia/mite-cli/commit/ed4d859))
* right-badding in budget and list table ([bb8d218](https://github.com/Ephigenia/mite-cli/commit/bb8d218))
* **list:** index column right aligment ([7dab9e2](https://github.com/Ephigenia/mite-cli/commit/7dab9e2))
* **list:** revenue & duration order ([b2ef56d](https://github.com/Ephigenia/mite-cli/commit/b2ef56d))


### Features

* running time entry indicated with unicode triangle "▶" ([e9879f6](https://github.com/Ephigenia/mite-cli/commit/e9879f6))
* **list:** show time entry id ([a2babbb](https://github.com/Ephigenia/mite-cli/commit/a2babbb))
* start time entry by id ([ded7161](https://github.com/Ephigenia/mite-cli/commit/ded7161))
* stop any running entry ([4eab9e6](https://github.com/Ephigenia/mite-cli/commit/4eab9e6))



# [0.2.0](https://github.com/Ephigenia/mite-cli/compare/v0.0.0...v0.2.0) (2017-08-01)


### Bug Fixes

* **config:** use bin-relative config paths ([682441f](https://github.com/Ephigenia/mite-cli/commit/682441f))
* --help command for budget & list ([ffdfe7b](https://github.com/Ephigenia/mite-cli/commit/ffdfe7b))


### Features

* add project_id, customer_id for list & budget ([bd94fbd](https://github.com/Ephigenia/mite-cli/commit/bd94fbd))
* **list:** add search query filter ([f7e96cf](https://github.com/Ephigenia/mite-cli/commit/f7e96cf))



# 0.0.0 (2017-08-01)



