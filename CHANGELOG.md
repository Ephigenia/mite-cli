# [1.5.0](https://github.com/Ephigenia/mite-cli/compare/v1.4.0...v1.5.0) (2020-05-26)


### Bug Fixes

* **customer-update:** fix archived flag for completion ([225b586](https://github.com/Ephigenia/mite-cli/commit/225b5865b90a223c7d6fb09f02398dfc2951d26c))
* artifact for logging in mite-api ([1ed50e2](https://github.com/Ephigenia/mite-cli/commit/1ed50e2870a7b2cf14e07adfe1917e34cc0d389c))
* different list commands use regexp for matching for items ([140d41a](https://github.com/Ephigenia/mite-cli/commit/140d41aba2c0555640058d2ca93a302b7b61bca9))
* **deps:** update dependency chalk to v4 ([675945a](https://github.com/Ephigenia/mite-cli/commit/675945a519047e32534d691bee5b7422632fe9f1))
* **deps:** update dependency csv-string to v4 ([67206da](https://github.com/Ephigenia/mite-cli/commit/67206da1030e59792bcc2c275562fa49ffee6a38))
* **users:** search query used correctly ([33680ed](https://github.com/Ephigenia/mite-cli/commit/33680eda8830db170061360c73b11c663c1056aa))


### Features

* **ammend:** set new date to move time-entry ([2fbd816](https://github.com/Ephigenia/mite-cli/commit/2fbd8162a98eaa893864b584a34ba747e8575cd9))
* disable enhanced unicode columns with NO_COLOR ([0486127](https://github.com/Ephigenia/mite-cli/commit/0486127909d1eec7a3c52c84baee41c8a12aa60a))



# [1.4.0](https://github.com/Ephigenia/mite-cli/compare/v1.3.0...v1.4.0) (2020-03-21)


### Features

* adds gitlab branch & merge-request tags as default highlight ([581e08e](https://github.com/Ephigenia/mite-cli/commit/581e08ee9bb9c4becf065d9008ff0ed7b727eb9c))



# [1.3.0](https://github.com/Ephigenia/mite-cli/compare/v1.2.1...v1.3.0) (2019-12-21)


### Bug Fixes

* **mite-list:** bug in recognizing relative periods ([4dc7adf](https://github.com/Ephigenia/mite-cli/commit/4dc7adff73b7c6f21596f9dd5c566f5e3c1799b9))
* **mite-list:** wrongly accepted weekday ([243d3e2](https://github.com/Ephigenia/mite-cli/commit/243d3e29d332a6a5e0e39546a7b5e70e32b30246))


### Features

* **mite-list:** pass relative durations like 2d or 3w ([8f6c85a](https://github.com/Ephigenia/mite-cli/commit/8f6c85af4db34ac7769022cb10d189872451f210))
* **mite-list:** period can be a weekday name ([60c18fb](https://github.com/Ephigenia/mite-cli/commit/60c18fbc272579bf94645b17635c5d2ff20ab445))



## [1.2.1](https://github.com/Ephigenia/mite-cli/compare/v1.2.0...v1.2.1) (2019-10-03)


### Bug Fixes

* **helpers:** getMySelf mispelling ([fecb888](https://github.com/Ephigenia/mite-cli/commit/fecb8889a8b84e4b07530c5fc14b4535d081eca0))
* **mite-list:** accept also underscored time period’s like "this_month" ([34edfcd](https://github.com/Ephigenia/mite-cli/commit/34edfcd9ddcc4371e2d5a59883f5af94df62464c))
* **mite-list:** allow passing of exact dates without replacing underscores ([646f81b](https://github.com/Ephigenia/mite-cli/commit/646f81b7ccc41152fb0d0dbf77437ec776c10c24))
* **mite-list:** fix replacement of period hyphens ([f5b7cb1](https://github.com/Ephigenia/mite-cli/commit/f5b7cb1bc8ea54299552891718b1dfdf2c484d4f))
* **mite-list:** no coloring and utf8 chars in some formats ([9fbb5df](https://github.com/Ephigenia/mite-cli/commit/9fbb5df7646cd7a7641a459f95c7d4b6b0ac6a1d))
* **mite-services:** fixes call to mite services ([66166c4](https://github.com/Ephigenia/mite-cli/commit/66166c4274eb2023b83872747d17fff5f8765b14))



# [1.2.0](https://github.com/Ephigenia/mite-cli/compare/v1.1.2...v1.2.0) (2019-08-28)


### Bug Fixes

* **mite-list:** adds thousand seperators to numbers ([b65c03e](https://github.com/Ephigenia/mite-cli/commit/b65c03eebb1121e942397f30e3cae42a497b26fc))
* **mite-list:** adds thousand seperators to revenue values ([c9f0a34](https://github.com/Ephigenia/mite-cli/commit/c9f0a3471860fa6acfb941b65310bb47be2ae975))
* **mite-list:** changes note highlight regexp for highlighting durations ([949cd47](https://github.com/Ephigenia/mite-cli/commit/949cd47fb3487ba9fb32419e66311484f76efdba))
* **mite-list:** coloring of minutes & hours ([807095a](https://github.com/Ephigenia/mite-cli/commit/807095ac98775508ca1226b1a76473b93b59949e))
* **mite-list:** defaults to today fixed ([addcc7b](https://github.com/Ephigenia/mite-cli/commit/addcc7b77d9939eb22a31091c0044723a6624af0))
* **mite-list:** show all entries when no period is set ([52779ff](https://github.com/Ephigenia/mite-cli/commit/52779ffab09fe49a0a801014a84e6d30e215392e))


### Features

* **mite-list:** adds hours column which shows industry hours ([68a9d26](https://github.com/Ephigenia/mite-cli/commit/68a9d26a142e24312e22bccc1bb13aed1f5f5732))
* **project-list:** adds revenue column for showing total revenue per project ([4cfb9d6](https://github.com/Ephigenia/mite-cli/commit/4cfb9d64f19a94eead9b5723f516b639412d7f1f))
* **project-list:** budget chart and percentage orange or red ([4e80e3e](https://github.com/Ephigenia/mite-cli/commit/4e80e3e61025c5889656954639340658eba4445d))
* **project-list:** last month actively used monthly budget shown ([fa31eef](https://github.com/Ephigenia/mite-cli/commit/fa31eef5d442095c1bfe000426f474852ac5da7e))
* **project-list:** optional display of budget used as chart or value(s) ([a2b0977](https://github.com/Ephigenia/mite-cli/commit/a2b0977047e28a2fe17de7ff004f02cf7ddd98bf))



## [1.1.2](https://github.com/Ephigenia/mite-cli/compare/v1.1.1...v1.1.2) (2019-07-29)


### Bug Fixes

* **mite-list:** typo in filters breaking whole list ([6161089](https://github.com/Ephigenia/mite-cli/commit/6161089a59528f6c351c8c6c25b3db2bfe0cfbbe))



## [1.1.1](https://github.com/Ephigenia/mite-cli/compare/v1.1.0...v1.1.1) (2019-07-29)


### Bug Fixes

* **mie-list:** duration coloring with existing yellow instead of orange ([2acfcef](https://github.com/Ephigenia/mite-cli/commit/2acfceffd44196f7ff458f1452877eb15c38eb08))
* **mite-list:** 0-value columns are not filtered in grouped reports ([b8c1922](https://github.com/Ephigenia/mite-cli/commit/b8c19220b33a4ae88dfca0a16064dc0ee280c09d))
* **mite-list:** apply min/max-duration also to grouped reports ([4e1a7db](https://github.com/Ephigenia/mite-cli/commit/4e1a7db5f47fdd0bb17580bcc6008c9ddb61079a))
* **mite-list:** different default columns when groupBy is used ([66afe00](https://github.com/Ephigenia/mite-cli/commit/66afe00284ebae347f156cd4e2bd8164c9873c0e))
* **mite-list:** fix json output ansi color stripping ([e0c4385](https://github.com/Ephigenia/mite-cli/commit/e0c4385cee398687fa4e01e92e0a6943b396137d))
* **mite-list:** no colored undefined revenue anymore ([31d46d9](https://github.com/Ephigenia/mite-cli/commit/31d46d9ac259dcc6e0633273f45c43c037d04359))
* **mite-list:** removes additional line-break when using TSV format ([e3511f8](https://github.com/Ephigenia/mite-cli/commit/e3511f8e2920d6cd0228f9e30cad5010616fcf70))
* **mite-list:** using dataformater for grouped output too ([c532dcc](https://github.com/Ephigenia/mite-cli/commit/c532dcc90e7a89cb849580685c5456da2ee0dd56))
* **mite-new:** auto-completion escape space service or customer ([913f3a2](https://github.com/Ephigenia/mite-cli/commit/913f3a2c51ee3aad48c6029adcc08c2c10930964))



# [1.1.0](https://github.com/Ephigenia/mite-cli/compare/v1.0.1...v1.1.0) (2019-07-12)


### Bug Fixes

* **list:** adds missing limit and locked to autocompletion ([d8222e6](https://github.com/Ephigenia/mite-cli/commit/d8222e68d02cb995c6b70497bbcfc558bf32a0f7))
* **list:** autocompletion works again ([a2ec467](https://github.com/Ephigenia/mite-cli/commit/a2ec467e7a834124c860dcd9694f6f4361f5e4a5))
* **mite-list:** error handling upon errs in getTimeEntries call ([b681f71](https://github.com/Ephigenia/mite-cli/commit/b681f7197f42faeba664518fa0813311fce74232))


### Features

* **list:** adds max-duration and min-duration ([932e4cb](https://github.com/Ephigenia/mite-cli/commit/932e4cb7258219d8b5e2ceba67e73999e6fc51ad))
* **list:** highlight durations above 8 (orange) or 12 hours (red) ([18241a6](https://github.com/Ephigenia/mite-cli/commit/18241a6a4c0e9904d12ef40decee693ddcdf3a97))
* **mite-amend:** set/add/remove minutes of time-entry ([10864f4](https://github.com/Ephigenia/mite-cli/commit/10864f40d7dd212e3b005f893bc2d57ca88a08b1))



## [1.0.1](https://github.com/Ephigenia/mite-cli/compare/v1.0.0...v1.0.1) (2019-06-27)


### Bug Fixes

* **customer:** new now accepts the name ([3207b62](https://github.com/Ephigenia/mite-cli/commit/3207b62bd4ef84c82eef2d72cb079453017171b6))
* **customer-new:** show server error messages correctly ([f76b3e2](https://github.com/Ephigenia/mite-cli/commit/f76b3e2353eacd608213b378a1f64df8ee94f486))
* **errors:** check for lowercased NODE_ENV ([658e6ca](https://github.com/Ephigenia/mite-cli/commit/658e6caa9ec2b5aca68f3253687c1aa404d8ed18))
* **list:** table footer not empty anymore ([5a3d727](https://github.com/Ephigenia/mite-cli/commit/5a3d727887d0e99df8d66fa97b2a7676d1f86f8a))
* **mite-amend:** only match timeEntryId when it’s truish ([895857d](https://github.com/Ephigenia/mite-cli/commit/895857dce496fd5cf30ac0b626c7a56f8454c9a5))
* **mite-api:** addTimeEntry callback argument order ([03ec43c](https://github.com/Ephigenia/mite-cli/commit/03ec43ca8a6c51a1390cdc9097a327cf26780c7a))
* **project:** new now accepts the name ([e3bb65d](https://github.com/Ephigenia/mite-cli/commit/e3bb65d3bfcf28b707226cbc8cb5666bda862c5a))
* **project-new:** correct default for budgetType ([bd7fd58](https://github.com/Ephigenia/mite-cli/commit/bd7fd58d9ce75acfb13a6b26214bf13648faba49))
* **project-new:** show server error messages correctly ([97f2534](https://github.com/Ephigenia/mite-cli/commit/97f253442c7f204bb45dbc26e7b3d3cdf144c4ad))
* **start:** correct error message shown ([d7510a7](https://github.com/Ephigenia/mite-cli/commit/d7510a7ce2d91fdb369e57e01872fe3ceee1138f))



# [1.0.0](https://github.com/Ephigenia/mite-cli/compare/v0.10.0...v1.0.0) (2019-06-24)


### Bug Fixes

* **mite-new:** different response format from mite-api package ([24a99dd](https://github.com/Ephigenia/mite-cli/commit/24a99ddea1393f34ca70cd8c31807df1c6714316))
* **projects-list:** projects with no customer show blank value ([bdba7ef](https://github.com/Ephigenia/mite-cli/commit/bdba7ef796c256165e44f68e869e84089a1187bd))
* correct description for --hourly-rate option ([1cf1c56](https://github.com/Ephigenia/mite-cli/commit/1cf1c56e6dfad1b89bada5df87e1f089762cbe68))
* only use update_entries when flag is set ([e59d1eb](https://github.com/Ephigenia/mite-cli/commit/e59d1ebed01fb50d8f6e2e0c41721566b006ee9b))
* removes custom error code as mite-api lib covers most of the cases ([677e1d6](https://github.com/Ephigenia/mite-cli/commit/677e1d6e71e2681065cea35806e21092958df48f))
* **customer-update:** typo in success message ([75f81fd](https://github.com/Ephigenia/mite-cli/commit/75f81fd12b77dc95f9efd4d77d78ea2e31157a0f))
* **list:** service and project id & date-completion improvment ([7c7a355](https://github.com/Ephigenia/mite-cli/commit/7c7a355ae97ec6039d10a5741a1b8eebba5dfb08))
* **mite-list:** empty table headers in grouped output ([c38628e](https://github.com/Ephigenia/mite-cli/commit/c38628e7ef606e8916b34cb53a4fd796b28308f8))
* **mite-list:** no default limit value ([01a96f5](https://github.com/Ephigenia/mite-cli/commit/01a96f5d72640db0b4c359a86df60794840dc269))
* **sort:** string or array parameter ([2eef4a6](https://github.com/Ephigenia/mite-cli/commit/2eef4a6758031a71c1bfa519dfc9f030eeb308c7))
* err or err.message output upon errors in most of sub commands ([b888702](https://github.com/Ephigenia/mite-cli/commit/b888702e5049c37abbe10079438f74d4f6f2033e))


### Code Refactoring

* all underscore options use minus now ([ebfe6be](https://github.com/Ephigenia/mite-cli/commit/ebfe6be5c99c5807d948049847539a285c2573ce))


### Features

* **config:** adds currency code as config option ([a50046b](https://github.com/Ephigenia/mite-cli/commit/a50046bcecd6f8b910681440c2288248ccdb476b))
* **list:** adds tracking column ([b770e5f](https://github.com/Ephigenia/mite-cli/commit/b770e5fca1fe736ba68f4f7e5ac0d9ac07d98217))
* **list:** sort by multiple fields in asc and desc order ([861332c](https://github.com/Ephigenia/mite-cli/commit/861332c1faccb938a8eb2cb0acaece3bfb84cbae))
* **mite-amend:** pass note as argument or pipe-in ([e699c8e](https://github.com/Ephigenia/mite-cli/commit/e699c8eb22e98160fc88b17cf563540c478c1576))
* **mite-amend:** use first argument as note if it’s not numeric ([97efeac](https://github.com/Ephigenia/mite-cli/commit/97efeac0fef254e00df5dc327402c85059fd42e4))
* **project-new:** adds ability to create new customers ([e21107b](https://github.com/Ephigenia/mite-cli/commit/e21107b446ea179c6112297bcaec6668ce54ad60))
* **project-new:** adds ability to create new projects ([0605e6c](https://github.com/Ephigenia/mite-cli/commit/0605e6cfef8387d3d095fc319ef9ea28a425bf05))
* adds config customizable columns for all listing commands ([84ca387](https://github.com/Ephigenia/mite-cli/commit/84ca387d222faf67dfb65835d06379f8cde73c0d))
* adds JSON output format ([fe95bd3](https://github.com/Ephigenia/mite-cli/commit/fe95bd3bf7f31e29d85447c6f92d61cdf97ccd24))
* adds JSON output format ([5b054a0](https://github.com/Ephigenia/mite-cli/commit/5b054a0a2bff8b40489f44fb396d78af5afb97cb))
* **project-update:** adds budget & budget_type options ([3c94dd4](https://github.com/Ephigenia/mite-cli/commit/3c94dd48c40e8dced5b7f71239c7f628aeb4d028))
* update hourly_rate and update entries in customer, project and service ([c213cf0](https://github.com/Ephigenia/mite-cli/commit/c213cf04f83f0a48bf5e5e43b56f3ec1f7848bce))
* **config:** adds ability to modify note hightlighting pattern ([e8f4dc1](https://github.com/Ephigenia/mite-cli/commit/e8f4dc177c0f9ea54f4147d5d582686cc83d96d2))
* **customer:** adds auto-completion for delete & update ([e56457d](https://github.com/Ephigenia/mite-cli/commit/e56457dcf2c24d22db94b1d5ad1e2b1a1388621c))
* **list:** adds "all" as option for columns which show all colums available ([7d1fc5c](https://github.com/Ephigenia/mite-cli/commit/7d1fc5c924cbad11808c2f0889816c05e9fcfff9))
* **project:** adds ability to delete ([60dd072](https://github.com/Ephigenia/mite-cli/commit/60dd072ef16a3735aba95cd27226b7cd135e994c))
* **project-delete:** adds auto-completion ([cb9fe8d](https://github.com/Ephigenia/mite-cli/commit/cb9fe8ddf382aaa7095382c253d381b940a8c039))
* **projects-list:** adds archived column ([d52af59](https://github.com/Ephigenia/mite-cli/commit/d52af59abe26826c313dd1c6c7f6033eee20c628))
* **service:** adds ability to update service’s properties ([bc893b9](https://github.com/Ephigenia/mite-cli/commit/bc893b9b64c66ce917da8927ac966727d96ee720))
* **service:** adds auto-completion for delete & update ([ca92479](https://github.com/Ephigenia/mite-cli/commit/ca92479f87a8b142926792bd2ce2077a4008b761))
* adds archived column and option can be set to "all" ([d1e2ad0](https://github.com/Ephigenia/mite-cli/commit/d1e2ad0c21af64ce0a8c4a630e39f844219ec79b))
* adds customer-delete ([aa1a31b](https://github.com/Ephigenia/mite-cli/commit/aa1a31b92a0e153a99a7e97c11cf4c14989134c8))


### BREAKING CHANGES

* all options containing an underscore are changed to have a minus instead so that it aligns with the other options which contain multiple words. F.e. `--customer_id` becomes `--customer-id`.



# [0.10.0](https://github.com/Ephigenia/mite-cli/compare/v0.9.0...v0.10.0) (2019-04-20)


### Bug Fixes

* adds -n1 argument to each example that contains xargs ([cb9c728](https://github.com/Ephigenia/mite-cli/commit/cb9c72896fc44fc0ed02f6fe52781cb2a27a86b6))
* **new:** showing error message when is no TTY ([5afa795](https://github.com/Ephigenia/mite-cli/commit/5afa795585e91b6fed48d44f7bf594ad2e8a2909))


### Features

* **list:** adds locked filter ([6c9511b](https://github.com/Ephigenia/mite-cli/commit/6c9511bdfa5c29c9308c8fe4e8d0003b58e23294))
* **new:** accepting content for node through tsdin ([ee41af7](https://github.com/Ephigenia/mite-cli/commit/ee41af748fade527260552f729d5068dab41f65f))
* **users:** adds columns option ([b6152b7](https://github.com/Ephigenia/mite-cli/commit/b6152b76f7ce8490be28b1bc737c941ba78c0442))



# [0.9.0](https://github.com/Ephigenia/mite-cli/compare/v0.8.1...v0.9.0) (2019-04-19)


### Bug Fixes

* **config:** re-enable resetting values to their default ([2248b48](https://github.com/Ephigenia/mite-cli/commit/2248b48c4bc248e2dbdd44e6938da2e258355636))
* typo in auto-completion name in lock and unlock ([8620b2e](https://github.com/Ephigenia/mite-cli/commit/8620b2ea23c3f05d4c07938a2e7839e14d34e187))
* **mite:** accidential dublicate parsing of argv ([93ad79e](https://github.com/Ephigenia/mite-cli/commit/93ad79e86c9d33ae4d3feb45b3100de32f19d237))
* typo in mite autocomplete uninstall ([697b6ed](https://github.com/Ephigenia/mite-cli/commit/697b6edc821b04e03def7fa8e7ab282f5eb37b0a))
* **amend:** more precise error message with no tracker or invalid id ([dd47fde](https://github.com/Ephigenia/mite-cli/commit/dd47fde96b5c0bffb0936398785a837b685715b0))
* **config:** prevent setting of undefined variable ([5eaa01d](https://github.com/Ephigenia/mite-cli/commit/5eaa01d4cc48f8f763b2b7aa84420e62d0884ea4))
* mistakenly changed alias for customers ([7d02c0a](https://github.com/Ephigenia/mite-cli/commit/7d02c0aaca40675999e1694b4a4f81a610c7714c))
* **projects:** customer_name exact matches ([45ef317](https://github.com/Ephigenia/mite-cli/commit/45ef317f50065d08822f900a5f72337fe5f319f9))


### Features

* adds outputFormat to config to define global output format ([c95eac4](https://github.com/Ephigenia/mite-cli/commit/c95eac498ae307db151a4d1c6f38d19043b85c44))
* **amend:** auto-completed provides list of 5 last entries of the user ([87309f4](https://github.com/Ephigenia/mite-cli/commit/87309f460416cf50dd4183a40dd9c289d8412f3f))
* **customer-update:** adds auto-completion for customer list and archived state ([eefb1b9](https://github.com/Ephigenia/mite-cli/commit/eefb1b9d169ee6ee9364da095ff093fe91e07d65))
* **customer-update:** adds command for updating single customer ([8733b12](https://github.com/Ephigenia/mite-cli/commit/8733b12565886b6842a7de6a4fc6d8da7472de7d))
* **customer-update:** auto-comple list depends on archived option ([c44e29e](https://github.com/Ephigenia/mite-cli/commit/c44e29e59db37cc2a3d5bf7ac8d8ccda7465146d))
* **customer-update:** change name and note of a customer ([42f4090](https://github.com/Ephigenia/mite-cli/commit/42f4090c37ec53372898f48ad70d5103d220ddb2))
* **customers:** adds --column option ([33df7a5](https://github.com/Ephigenia/mite-cli/commit/33df7a52165cd39d7eec653b5f67fc9bc7c490d4))
* **customers:** adds --columns option to define which colums are shown ([bd734c8](https://github.com/Ephigenia/mite-cli/commit/bd734c84c0aab2965acbba18b018523d2ba8861e))
* **customers:** adds auto-completion for options and option values ([60bff36](https://github.com/Ephigenia/mite-cli/commit/60bff363708afe34f30f608d1250e57973592028))
* **delete:** adds autocompletion which shows last 5 entries ([26edb09](https://github.com/Ephigenia/mite-cli/commit/26edb0977c54de8764ca0c6dc8b7aec01d6198ee))
* **formater:** adds durationToMinutes helper function ([1f249d9](https://github.com/Ephigenia/mite-cli/commit/1f249d950b7ea486bf8b792c886a424cf947b3a3))
* **list:** --user_id auto-completion shows you at the current user ([d527e06](https://github.com/Ephigenia/mite-cli/commit/d527e06f81ddc531c88024ca4eea23c9efefb441))
* **list:** adds auto-completion for options and option values ([a3906bd](https://github.com/Ephigenia/mite-cli/commit/a3906bd825a1166d78b4be5f0dcd36bdc64c12bb))
* **list:** adds text as output format ([31be856](https://github.com/Ephigenia/mite-cli/commit/31be856bffa5b5c92ef02ba283a88aed4be333ef))
* **list:** adds time period completion when date is started to enter ([6b4ddee](https://github.com/Ephigenia/mite-cli/commit/6b4ddee7cad30722f931cfc10e3730d25b7456d1))
* **list:** services auto-completion shows billable services with dollar sign ([8ab0340](https://github.com/Ephigenia/mite-cli/commit/8ab034078759413d0864277ad3c270947288b9ff))
* **lock:** adds auto-completion for options ([c410ab2](https://github.com/Ephigenia/mite-cli/commit/c410ab263bfcac30edaeeea148b6e27fecb7af66))
* **lock:** adds auto-completion for options ([9d6469e](https://github.com/Ephigenia/mite-cli/commit/9d6469ea7554a7b71c44c5f5db2b63700ee9629a))
* **lock:** adds sub-command to lock single time entries ([38ec3e0](https://github.com/Ephigenia/mite-cli/commit/38ec3e0a67263746a7f73c8b0725cfe4ad61caa8))
* **new:** accepts minutes in duration format HH:MM ([2b14588](https://github.com/Ephigenia/mite-cli/commit/2b1458823e888df21fa7a30ae8d6eefe7cba43ad))
* **new:** adds auto-completion for project, services, minutes and date ([4e8ac36](https://github.com/Ephigenia/mite-cli/commit/4e8ac366aff9ccc54fe1470814487e499dafc65a))
* **new:** create new time entries using project or service ids ([afa2830](https://github.com/Ephigenia/mite-cli/commit/afa2830e1f016333f239c7ecf9667c17c86cde29))
* **project:** update a project f.e. archive/unarchive it ([d5342c6](https://github.com/Ephigenia/mite-cli/commit/d5342c645e82e284028ed6258ff6a4631487705b))
* **project-update:** adds auto-completion for argument and project ids ([a36923d](https://github.com/Ephigenia/mite-cli/commit/a36923d63fc74d77f416c3350b90ac1727512dfa))
* **project-update:** auto-comple list depends on archived option ([cb37578](https://github.com/Ephigenia/mite-cli/commit/cb37578b83714fb4d1e29b2c2634f20a25268412))
* **project-update:** change name and note of a project ([1a8a76a](https://github.com/Ephigenia/mite-cli/commit/1a8a76ac5f508271d3adca3c52d8eacce61af4a4))
* **projects:** adds auto-completion for options and option values ([06e4c4b](https://github.com/Ephigenia/mite-cli/commit/06e4c4b2b27ecc01b4ed1aaef68c339a2fdec7fb))
* **services:** adds --columns option ([0736812](https://github.com/Ephigenia/mite-cli/commit/073681235c9409dab642c3c3da8fde5cb22591a8))
* **services:** adds auto-completion for options and option values ([29f44bb](https://github.com/Ephigenia/mite-cli/commit/29f44bb2a812a9cec7413d49bd0a4bf1f3be1881))
* **start:** adds auto-completion which shows latest 5 entries ([25201d0](https://github.com/Ephigenia/mite-cli/commit/25201d041d3d6156eec84483d387704c1597cd31))
* **unlock:** adds sub-command to unlock single time entries ([47db187](https://github.com/Ephigenia/mite-cli/commit/47db1879db4db82bc9aa666032f1fd3de943f178))
* adds --help to all the auto-completions ([ff40cf5](https://github.com/Ephigenia/mite-cli/commit/ff40cf524d81a0ac3f43612000a90ab3775576f6))
* **users:** adds auto-completion options and option values ([12b325f](https://github.com/Ephigenia/mite-cli/commit/12b325f2a38bcf6f862dbc6e4e17ea134d85e3df))
* adds base for auto-completion for all mite subcommands ([96e7f44](https://github.com/Ephigenia/mite-cli/commit/96e7f445582b2cbcc19e81cc45bfcf16c7abb176))



## [0.8.1](https://github.com/Ephigenia/mite-cli/compare/v0.8.0...v0.8.1) (2019-03-17)


### Bug Fixes

* use master of mite-api to fix package security warnings ([26bae84](https://github.com/Ephigenia/mite-cli/commit/26bae84e1c13c0c4ac178d39d62efa6fe0d0c5c7))



# [0.8.0](https://github.com/Ephigenia/mite-cli/compare/v0.7.0...v0.8.0) (2019-03-17)


### Features

* adds descriptions for cli arguments ([4c28876](https://github.com/Ephigenia/mite-cli/commit/4c288766d6ba9eaff37b55a2d657e557d616a315))
* adds example to almost all help  messages ([7c5084d](https://github.com/Ephigenia/mite-cli/commit/7c5084d65ef11396b71aec9ed2cd656a8a9ad871))
* **list:** adds capability to read display column names from config ([6d8f946](https://github.com/Ephigenia/mite-cli/commit/6d8f94650eec557efc729cee6518e2b0fc9f6e9b))
* **mite-new:** accept all inputs via optional arguments ([e1d549e](https://github.com/Ephigenia/mite-cli/commit/e1d549ea158478adb93490445c243dd5e248362e))



# [0.7.0](https://github.com/Ephigenia/mite-cli/compare/v0.6.4...v0.7.0) (2018-12-14)


### Bug Fixes

* wrongly increased version number ([106a152](https://github.com/Ephigenia/mite-cli/commit/106a15202e4c6e160455c2282eecf87f8b1d1e90))
* **list:** correct revenue reduction for correct sum ([6f24c46](https://github.com/Ephigenia/mite-cli/commit/6f24c46eae752a6baf28102490ed831dfbae100f))
* **list:** default sort option using constant ([e833a2d](https://github.com/Ephigenia/mite-cli/commit/e833a2dc1788d671587f42afc7ef14fe587d1299))


### Features

* **budgets:** adds format option ([831be4b](https://github.com/Ephigenia/mite-cli/commit/831be4b14fde6dfacf4851ca03fb276ae0f978ee))
* **list:** adds markdown table output ([cc7f93c](https://github.com/Ephigenia/mite-cli/commit/cc7f93c64d9dc869e0cc2d0ec7b66b066b0c1e02))
* **list:** adds optional csv, tsv or table output format ([0c76b6f](https://github.com/Ephigenia/mite-cli/commit/0c76b6f0cb6e23b09ecd61fe16cda9594daf5025))
* **list:** highlight numeral hashtags (github) ([921bba3](https://github.com/Ephigenia/mite-cli/commit/921bba3eea7658163d9bec2161e6722ec02ced9f))
* **list:** option to define the columns shown ([c3e9085](https://github.com/Ephigenia/mite-cli/commit/c3e9085be370201ed96deec26b535d07383405e6))
* **projects:** adds format option ([85d4e81](https://github.com/Ephigenia/mite-cli/commit/85d4e817adc50526d641192a00e9ee8a14d446a4))
* **services:** adds format option ([db474cd](https://github.com/Ephigenia/mite-cli/commit/db474cd07975c1aeaa46d221b656df41692eb349))
* **user:** adds format option ([f180ea7](https://github.com/Ephigenia/mite-cli/commit/f180ea75b150692ce01567c3daedea867c4b1aeb))



## [0.6.4](https://github.com/Ephigenia/mite-cli/compare/v0.6.3...v0.6.4) (2018-11-05)


### Bug Fixes

* **list:** adds missing user column ([bae35b5](https://github.com/Ephigenia/mite-cli/commit/bae35b5563b7c7ba9cfb1eda4de869f034ede5a9))



## [0.6.3](https://github.com/Ephigenia/mite-cli/compare/v0.6.2...v0.6.3) (2018-11-02)


### Bug Fixes

* **config:** config file stored securely in home directory ([f17e448](https://github.com/Ephigenia/mite-cli/commit/f17e448f3827c51a2ce44ef85d4da26e14c6abdc)), closes [#2](https://github.com/Ephigenia/mite-cli/issues/2)
* **config:** removes ENV injectable account, apiKey and application ([af4268a](https://github.com/Ephigenia/mite-cli/commit/af4268ad339bec8357de2e000568b6fc3454f9ad))



## [0.6.2](https://github.com/Ephigenia/mite-cli/compare/v0.6.1...v0.6.2) (2018-10-09)



## [0.6.1](https://github.com/Ephigenia/mite-cli/compare/v0.6.0...v0.6.1) (2018-09-22)


### Bug Fixes

* **new:** use of note argument ([0d598f2](https://github.com/Ephigenia/mite-cli/commit/0d598f264ceaa3d23287f557c9b4ae21af5eed3e))


### Features

* **new:** first arguments used as note ([e478dd1](https://github.com/Ephigenia/mite-cli/commit/e478dd15ced0da863aa214fe21ac3dcc2a4d1322))
* **projects:** making archived true the default option ([0ed2510](https://github.com/Ephigenia/mite-cli/commit/0ed2510c831cbe30abd1b90d0cf6c76e7af5fbf5))



# [0.6.0](https://github.com/Ephigenia/mite-cli/compare/v0.5.0...v0.6.0) (2018-04-06)


### Bug Fixes

* **list:** empty service & project names displayed as "-" ([89add52](https://github.com/Ephigenia/mite-cli/commit/89add52d701b0b94284ab92ed8852fda849efa85))
* **list:** notes with line-breaks ([687384f](https://github.com/Ephigenia/mite-cli/commit/687384fd675fa68e80d0cac6378e909b37cfa309))
* **list:** null revenues shown as "-" ([0d9d074](https://github.com/Ephigenia/mite-cli/commit/0d9d074be1dd240a5d4f6b6def2d4f8babebd6c6))
* **projects:** empty customer displayed as "-" ([ae515d1](https://github.com/Ephigenia/mite-cli/commit/ae515d1c130e7a5be7be1995c4ca68caf2272b4a))
* **service:** rate displayed as "-" when null ([f380878](https://github.com/Ephigenia/mite-cli/commit/f38087864daf9ede289c20a0e9c42f572a14ce53))


### Features

* **amend:** adds inline or editor-edit currently tracked entry’s note ([ad435c7](https://github.com/Ephigenia/mite-cli/commit/ad435c748df897fb928d3fabff1b3080fd43f3b7))
* **customers:** adds list of customers ([9f634c5](https://github.com/Ephigenia/mite-cli/commit/9f634c537b13de8d8f6c9832b110b7b6c12ec8e7))
* **customers:** sort by rate / hourly_rate ([dd82769](https://github.com/Ephigenia/mite-cli/commit/dd8276952bceb1c4b9b7731b3639ed4c8c9b9123))
* **list:** adds "sort" options for api-side ordering the results ([ffbd738](https://github.com/Ephigenia/mite-cli/commit/ffbd738ea51eba1047d06b64f41f2cd364ef5aa2))
* **list:** adds group_by argument and alternate table output format ([541d0f3](https://github.com/Ephigenia/mite-cli/commit/541d0f343f48c76b6ecda3075d0385aaf370aca2))
* **list:** highlight jira identifiers ([cabd423](https://github.com/Ephigenia/mite-cli/commit/cabd4235f90442335e14a7bf5b96f42de063465c))
* **project:** show archived & not archived in one list ([185c876](https://github.com/Ephigenia/mite-cli/commit/185c876f6e34b72c2c1aa0e522044ae92faa87d4))
* **project:** sort by budgets & hourly_rate ([0609b91](https://github.com/Ephigenia/mite-cli/commit/0609b918abcd4a3969d99dae646a44ae202466f2))
* **projects:** list projects ([0a32f3a](https://github.com/Ephigenia/mite-cli/commit/0a32f3a72c635f1df8e219b1e6484a8b646e49df))
* **projects:** order by customer_name & id ([59103c3](https://github.com/Ephigenia/mite-cli/commit/59103c3ec8db24fe9b14728fa54b419104a0ef5d))
* **projects:** search for customer names ([15a9c0d](https://github.com/Ephigenia/mite-cli/commit/15a9c0d92f67295064bc5d8c27736df8ff4b402b))
* **services:** adds list of services ([c0464f5](https://github.com/Ephigenia/mite-cli/commit/c0464f5956fa4b585a642abe231db8513c985309))
* **services:** show archived & not archived in one list ([0b4556f](https://github.com/Ephigenia/mite-cli/commit/0b4556f25147f7f2ad7381889c5571a8859a1cb6))
* **users:** shows archived & not archived users in one list ([a1f721d](https://github.com/Ephigenia/mite-cli/commit/a1f721dcfe3ba30383c878c374565dee881d2474))



# [0.5.0](https://github.com/Ephigenia/mite-cli/compare/v0.4.4...v0.5.0) (2018-03-14)


### Bug Fixes

* **new:** errors while starting time entry are shown ([abf2869](https://github.com/Ephigenia/mite-cli/commit/abf2869b0386b6da34b50587923319d6e215aa29))
* **new:** newly create time entry id is shown in output ([3967f29](https://github.com/Ephigenia/mite-cli/commit/3967f29b2eb976f08bb39bb707adb77e693020ce))
* **new:** start tracker ([312a0fc](https://github.com/Ephigenia/mite-cli/commit/312a0fcdf613dfa852c65631b6bfe9628b54645f))
* **new:** start tracker ([3fcd425](https://github.com/Ephigenia/mite-cli/commit/3fcd4255719c195eb7f665309965e2a5b652a49e))


### Features

* **delete:** introduces mite delete <id> command ([75aa6ed](https://github.com/Ephigenia/mite-cli/commit/75aa6ed2b27889200d72fd78a66db98d580e703f))
* **list:** adds from & to options ([47fcd37](https://github.com/Ephigenia/mite-cli/commit/47fcd37b95aaa82919e81f2826bf148ddf410f8c))
* **list:** adds tracking option ([83e208c](https://github.com/Ephigenia/mite-cli/commit/83e208cdf65951588c130092a901afb3654f25d6))
* **list:** filter using user_id ([5866a75](https://github.com/Ephigenia/mite-cli/commit/5866a75bb4c40f5b57886f217beb6fb93cdcaced))
* **new:** optional leave service & project empty ([d4ec166](https://github.com/Ephigenia/mite-cli/commit/d4ec166a11eb4f885eac39c33bf52a2f1139abb9))
* **user:** adds first index column ([e8fd2fe](https://github.com/Ephigenia/mite-cli/commit/e8fd2fee5d2662b24983c9dcf7bce2bbc9d40356))
* **user:** adds user list & archived user list ([bcc015c](https://github.com/Ephigenia/mite-cli/commit/bcc015c212a3cba447ff26f798354b8ca2419ad5))
* **user:** client-side search in email, name & note with regexp ([2bde83c](https://github.com/Ephigenia/mite-cli/commit/2bde83cb1aa3dafbe494c78f0918d8c73f5c5160))
* **user:** filter by user roles ([8b83154](https://github.com/Ephigenia/mite-cli/commit/8b83154a71850b17369fbc1a89c1ca1d16d17776))
* **user:** sort by column name ([de3e471](https://github.com/Ephigenia/mite-cli/commit/de3e47114289c355cdfe338642af21579efec2ae))



## [0.4.4](https://github.com/Ephigenia/mite-cli/compare/v0.4.3...v0.4.4) (2018-02-16)


### Bug Fixes

* migrates cli-table2 to table package ([acf59ac](https://github.com/Ephigenia/mite-cli/commit/acf59acdcd74f886dd3f508afd6bf12d5d5ff367))
* **list:** use checkmark instead of lock due to char width ([3d88cfc](https://github.com/Ephigenia/mite-cli/commit/3d88cfcd85c489ff1db3cbe425f95e4003bc35f2))



## [0.4.3](https://github.com/Ephigenia/mite-cli/compare/v0.4.2...v0.4.3) (2018-02-16)


### Bug Fixes

* using mite-api fork for updated npm packages ([c83b1af](https://github.com/Ephigenia/mite-cli/commit/c83b1af15de037af2fd7250f7765b0e77b6cd1b8))



## [0.4.2](https://github.com/Ephigenia/mite-cli/compare/v0.4.1...v0.4.2) (2018-02-13)


### Bug Fixes

* **new:** show error message when creation fails ([ab4a895](https://github.com/Ephigenia/mite-cli/commit/ab4a8955bc531eea6b6ae97256d223889592d6cf))



## [0.4.1](https://github.com/Ephigenia/mite-cli/compare/v0.4.0...v0.4.1) (2018-01-08)


### Bug Fixes

* **budgets:** adds duration column to table output ([0d1b5b1](https://github.com/Ephigenia/mite-cli/commit/0d1b5b10c7b1624f01e03d42d17266073f7cea91))
* **open:** also open mite url when time entry id not given ([b4f21c9](https://github.com/Ephigenia/mite-cli/commit/b4f21c9da6307df77d7f266aa15204e7a6fef29e))
* **open:** alternate message when no id given ([b68377d](https://github.com/Ephigenia/mite-cli/commit/b68377d26438279ce9a980b8ff19fbb1bf849096))
* adds alias "ls" for "list" and "create" for "new" ([1072252](https://github.com/Ephigenia/mite-cli/commit/1072252cb794d69b4f61cdeaa70fd51cacdeb128))
* **start:** adds verbose error message when entry not found ([b8637ea](https://github.com/Ephigenia/mite-cli/commit/b8637ea6eee909397b795b6bf5cf596d726f100c))



# [0.4.0](https://github.com/Ephigenia/mite-cli/compare/v0.3.0...v0.4.0) (2017-09-19)


### Bug Fixes

* **list:** set default limit to 100 to return not-billable entries ([fb9c476](https://github.com/Ephigenia/mite-cli/commit/fb9c4761a5a326af418e434f3f79eb9629e4a0b0))


### Features

* mite open to open specific entries in browser ([8ac7edb](https://github.com/Ephigenia/mite-cli/commit/8ac7edbcb14cf8ff9134d0e5a5dbcc072d317ec4))
* **list:** adds billable argument ([6f743a4](https://github.com/Ephigenia/mite-cli/commit/6f743a48ca681163f299597d5964cdac60ee4301))



# [0.3.0](https://github.com/Ephigenia/mite-cli/compare/v0.2.0...v0.3.0) (2017-08-24)


### Bug Fixes

* **list:** index column right aligment ([7dab9e2](https://github.com/Ephigenia/mite-cli/commit/7dab9e2a554b88b2cd93a7c7cf92a996c399a1d4))
* **list:** revenue & duration order ([b2ef56d](https://github.com/Ephigenia/mite-cli/commit/b2ef56de4e28ff738f6476a0708f597eae84fb33))
* removes padding ([ed4d859](https://github.com/Ephigenia/mite-cli/commit/ed4d859355162038f039a5aea1bf01b38d2a38cf))
* right-badding in budget and list table ([bb8d218](https://github.com/Ephigenia/mite-cli/commit/bb8d2183675136bc7c2d13ff2aec71bbca5c2187))


### Features

* start time entry by id ([ded7161](https://github.com/Ephigenia/mite-cli/commit/ded716155d821eb43c94a3dc9cb02b34764389e6))
* **list:** show time entry id ([a2babbb](https://github.com/Ephigenia/mite-cli/commit/a2babbbc989b736de50d6a91b43646e06418be15))
* running time entry indicated with unicode triangle "▶" ([e9879f6](https://github.com/Ephigenia/mite-cli/commit/e9879f6ef398b881d75abaff9c76258f3d0b3034))
* stop any running entry ([4eab9e6](https://github.com/Ephigenia/mite-cli/commit/4eab9e6ba6a601801054aa22c4a0e7d86dd233ed))



# [0.2.0](https://github.com/Ephigenia/mite-cli/compare/v0.0.0...v0.2.0) (2017-08-01)


### Bug Fixes

* --help command for budget & list ([ffdfe7b](https://github.com/Ephigenia/mite-cli/commit/ffdfe7bb4887690cc147cc26ceb79dc4e6fbf8d8))
* **config:** use bin-relative config paths ([682441f](https://github.com/Ephigenia/mite-cli/commit/682441f236fdd879b8951ebfcbfcdf87d2259508))


### Features

* **list:** add search query filter ([f7e96cf](https://github.com/Ephigenia/mite-cli/commit/f7e96cf2eef5ba06eae35a9eb94c7d8594a1c01c))
* add project_id, customer_id for list & budget ([bd94fbd](https://github.com/Ephigenia/mite-cli/commit/bd94fbd985e9984d220f99d477caace88304f576))



# 0.0.0 (2017-08-01)



