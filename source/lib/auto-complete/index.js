'use strict';

const tabtab = require('tabtab');

const completions = require('./completions');

/**
 * Wrapper for autocompletion logic
 */
const autoComplete = {

  name: 'mite',

  parseEnv: function(processEnv) {
    processEnv = processEnv || process.env;
    return tabtab.parseEnv(processEnv);
  },

  completion: function(env, program) {
    // for debugging purposes
    // return tabtab.log(
    //   Object.keys(env).map(k => {
    //     return `${k}=${env[k]}`;
    //   })
    // );

    // completion on the first argument
    if (env.words === 1) {
      // use program’s collection of commands to create a nice looking list
      // of autocompletions for tabtab
      const subCommands = program.commands.map((command) =>
        ({
          name: command._name,
          description: command._description
        })
      );
      return tabtab.log(subCommands);
    }

    // find out which command was called
    const subCommand = env.line.split(/\s/)[1];
    if (subCommand) {
      return this.completionForSubcommand(subCommand, env);
    }
  },

  /**
   *
   * @param {string} subCommand - sucommand beeing used
   * @param {string} env.prev - last given argument value, or previously
   *                            completed value
   * @param {string} env.words - the number of argument currently active
   * @param {string} env.line - the current complete input line in the cli
   * @returns {Promise<Array<string>>}
   */
  completionForSubcommand: async function(subCommand, env) {
    const completer = completions[subCommand];
    if (!completer) return [];

    return completer(env).then((r) => {
      if (r) tabtab.log(r);
    });
  },

  /**
   * Installs autocompletion function
   * @returns {Promise<boolean>}
   */
  install: async function() {
    return tabtab.install({
      name: this.name,
      completer: this.name
    });
  },

  /**
   * Installs autocompletion function
   * @returns {Promise<boolean>}
   */
  uninstall: async function() {
    return tabtab.uninstall({ name: this.name });
  },
};


module.exports = autoComplete;
