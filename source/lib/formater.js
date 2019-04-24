'use strict';

const chalk = require('chalk');

const { USER_ROLES, BUDGET_TYPE } = require('./constants');

// @TODO should that also be configurable?
const DEFAULT_CURRENCY = '€';

module.exports = {
  BUDGET_TYPE: BUDGET_TYPE,
  CURRENCY: DEFAULT_CURRENCY,

  note(
    note,
    stripNewLines = true,
    highlight = true
  ) {
    let result = (note || '');
    if (stripNewLines) {
      result = result.replace(/\r?\n/g, ' ');
    }
    if (highlight) {
      // @TODO resolve circular dependency
      const config = require('./../config');
      const highlightRegexp = new RegExp(config.get().noteHighlightRegexp, 'g');
      const matches = result.match(highlightRegexp) || [];
      matches.forEach((str) => {
        result = result.replace(str, chalk.bold(chalk.blue(str)));
      });
    }
    return result;
  },

  username: (username, item) => {
    switch(item.role) {
      case USER_ROLES.ADMIN:
        return chalk.yellow(username);
      case USER_ROLES.OWNER:
        return chalk.red(username);
      default:
        return username;
    }
  },

  booleanToHumanvalue(value) {
    return value ? 'yes' : 'no';
  },

  minutesToWorkDays(minutes) {
    return this.number(minutes / 8 / 60, 2);
  },

  durationToMinutes(minutes) {
    const parts = minutes.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  },

  minutesToDuration(minutes) {
    if (typeof minutes !== 'number') {
      throw new TypeError('Expected minutes to be a of type Number');
    } else if (isNaN(minutes)) {
      throw new Error('Expected minutes to be a valid Number not NaN');
    } else if (!isFinite(minutes)) {
      throw new Error('Expecte minutes not to be a finite value.');
    }
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = Math.round(minutes - hours * 60);
    if (String(remainingMinutes).length === 1) {
      return hours + ':0' + remainingMinutes;
    }
    return hours + ':' + remainingMinutes;
  },

  number(value, precision) {
    if (typeof value !== 'number') {
      throw new TypeError('Expected value to be a of type Number');
    } else if (isNaN(value)) {
      throw new Error('Expected value to be a valid Number not NaN');
    } else if (!isFinite(value)) {
      throw new Error('Expecte value not to be a finite value.');
    }
    precision = precision || 2;
    return String(value.toFixed(precision));
  },

  price(value, precision) {
    precision = precision || 2;
    return String(value.toFixed(precision));
  },

  budget(type, value) {
    switch(type) {
      case BUDGET_TYPE.MINUTES_PER_MONTH:
        return this.minutesToDuration(value) + ' h/m';
      case BUDGET_TYPE.MINUTES:
        return this.minutesToDuration(value) + ' h';
      case BUDGET_TYPE.CENTS:
        return this.price(value / 100) + ' ' + this.CURRENCY;
      case BUDGET_TYPE.CENTS_PER_MONTH:
        return this.price(value / 100) + ' ' + this.CURRENCY + '/m';
      default:
        throw new Error(`Unknown budget format type: "${type}"`);
    }
  }
};
