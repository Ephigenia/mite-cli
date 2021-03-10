Found a Bug?
===============================================================================
If you find a bug in the source code, you can help by
[submitting an issue](https://github.com/Ephigenia/mite-cli/issues) to our [GitHub Repository][https://github.com/Ephigenia/mite-cli]. Even better, you can [submit a Pull Request](https://github.com/Ephigenia/mite-cli/pulls) with a fix.


Branching
===============================================================================

Not defined yet, probably going for "gitlab flow", see: https://medium.com/@patrickporto/4-branching-workflows-for-git-30d0aaee7bf

New code should always be reviewed in a Merge Request aka Pull-Request.


Code-Style
===============================================================================
The project uses [Eslint](eslint.org) to check the code formatting of the javascript files. It uses a slightly modified version of the `eslint:recommend` standard.

Code style can be checked while editing by using an editor which can read the `.eslintrc` file (f.e. [atom](https://atom.io), [VSCode](https://code.visualstudio.com/)) or by running `npm run lint`.

In addition to that the rules for other file formats are defined in `.editorconfig`.

Linting can be checked with

    npm run lint

And fixed

    npm run lint:fix


Code-Tags
===============================================================================

It’s quite common to leave inline comments in the sources to mark places of importantness, todos, or questions for review or places of interest.

Read more about them: https://www.python.org/dev/peps/pep-0350/#what-are-codetags

There are several most common tags: `TODO`, `FIXME`, `BUG`, `HACK`, `TODOC`, `FAQ`, `GLOSS`.


Commit Messages
===============================================================================
Please follow the very common [angular commit messages guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).


Testing
===============================================================================

The project has low coverage of tests right now. Some of the helper functions and api methods are covered by test. The project has preconfigured [mocha](https://mochajs.org/) test runner using [chaijs](https://www.chaijs.com/) for asserting.

### Run all Tests

    npm run test -s

### TDD

    npm run tdd -s

### Run specific tests

Use `grep` to run only those tests where the describe and/or it blocks are matching.

    npm run tdd -s -- --grep="period"


Releasing
===============================================================================

### Check the new version recommended according to the git log:

  npm run version:recommend

### Check changelog output for next version

  npm run changelog:preview

### Create new Release & Publish:

  npm version minor;
  npm publish;
