'use strict';

const options = {
  archived: require('./archived'),
  billable: require('./billable'),
  budget: require('./budget'),
  budgetType: require('./budget-type'),
  columns: require('./columns'),
  format: require('./format'),
  hourlyRate: require('./hourly-rate'),
  sort: require('./sort'),
  tracking: require('./tracking'),
};

module.exports = {
  ...options,

  /**
   * @typedef CommandOption
   * @property {string} definition
   * @property {function} description
   * @property {function} parse
   */

  /**
   * Returns an array of arguments which can be used in commander.option
   *
   * @param {CommandOption} commandOption required command option that should
   *   be used to create the array
   * @param {string} alternateDescription optional alternate description for
   *   the argument
   * @param {string} defaultValue optional default Value that should be used
   * @return {Array<function|string>}
   */
  toArgs: (commandOption, alternateDescription, defaultValue) => {
    return [
      commandOption.definition,
      alternateDescription ? alternateDescription : commandOption.description(),
      commandOption.parse,
      defaultValue
    ];
  }
};
