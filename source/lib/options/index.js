'use strict';

const options = {
  archived: require('./archived'),
  billable: require('./billable'),
  budget: require('./budget'),
  budgetType: require('./budget-type'),
  columns: require('./columns'),
  hourlyRate: require('./hourly-rate'),
  sort: require('./sort'),
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
   * @return {Array<function|string>}
   */
  toArgs: (commandOption, alternateDescription) => {
    return [
      commandOption.definition,
      alternateDescription ? alternateDescription : commandOption.description(),
      commandOption.parse
    ];
  }
};
