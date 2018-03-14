<a name="0.5.0"></a>
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



<a name="0.4.4"></a>
## [0.4.4](https://github.com/Ephigenia/mite-cli/compare/v0.4.3...v0.4.4) (2018-02-16)


### Bug Fixes

* **list:** use checkmark instead of lock due to char width ([3d88cfc](https://github.com/Ephigenia/mite-cli/commit/3d88cfc))
* migrates cli-table2 to table package ([acf59ac](https://github.com/Ephigenia/mite-cli/commit/acf59ac))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/Ephigenia/mite-cli/compare/v0.4.2...v0.4.3) (2018-02-16)


### Bug Fixes

* using mite-api fork for updated npm packages ([c83b1af](https://github.com/Ephigenia/mite-cli/commit/c83b1af))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/Ephigenia/mite-cli/compare/v0.4.1...v0.4.2) (2018-02-13)


### Bug Fixes

* **new:** show error message when creation fails ([ab4a895](https://github.com/Ephigenia/mite-cli/commit/ab4a895))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/Ephigenia/mite-cli/compare/v0.4.0...v0.4.1) (2018-01-08)


### Bug Fixes

* adds alias "ls" for "list" and "create" for "new" ([1072252](https://github.com/Ephigenia/mite-cli/commit/1072252))
* **budgets:** adds duration column to table output ([0d1b5b1](https://github.com/Ephigenia/mite-cli/commit/0d1b5b1))
* **open:** also open mite url when time entry id not given ([b4f21c9](https://github.com/Ephigenia/mite-cli/commit/b4f21c9))
* **open:** alternate message when no id given ([b68377d](https://github.com/Ephigenia/mite-cli/commit/b68377d))
* **start:** adds verbose error message when entry not found ([b8637ea](https://github.com/Ephigenia/mite-cli/commit/b8637ea))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/Ephigenia/mite-cli/compare/v0.3.0...v0.4.0) (2017-09-19)


### Bug Fixes

* **list:** set default limit to 100 to return not-billable entries ([fb9c476](https://github.com/Ephigenia/mite-cli/commit/fb9c476))


### Features

* **list:** adds billable argument ([6f743a4](https://github.com/Ephigenia/mite-cli/commit/6f743a4))
* mite open to open specific entries in browser ([8ac7edb](https://github.com/Ephigenia/mite-cli/commit/8ac7edb))



<a name="0.3.0"></a>
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



<a name="0.2.0"></a>
# [0.2.0](https://github.com/Ephigenia/mite-cli/compare/v0.0.0...v0.2.0) (2017-08-01)


### Bug Fixes

* **config:** use bin-relative config paths ([682441f](https://github.com/Ephigenia/mite-cli/commit/682441f))
* --help command for budget & list ([ffdfe7b](https://github.com/Ephigenia/mite-cli/commit/ffdfe7b))


### Features

* add project_id, customer_id for list & budget ([bd94fbd](https://github.com/Ephigenia/mite-cli/commit/bd94fbd))
* **list:** add search query filter ([f7e96cf](https://github.com/Ephigenia/mite-cli/commit/f7e96cf))



<a name="0.0.0"></a>
# 0.0.0 (2017-08-01)



