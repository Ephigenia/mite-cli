'use strict';

const chalk = require('chalk');

const { USER_ROLES, BUDGET_TYPE } = require('./constants');

module.exports = {
  BUDGET_TYPE: BUDGET_TYPE,

  percentChart(percentage, width = 10, chars = {}) {
    chars = Object.assign({ on: '█', off: '░'}, chars);
    // limit percentage between 1 and 0
    percentage = Math.min(1, Math.max(0, percentage));
    const onWidth = Math.round(width * percentage);
    const offWidth = Math.round(width - (width * percentage)) || 0;
    return chars.on.repeat(onWidth) + chars.off.repeat(offWidth);
  },

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

  booleanToHuman(value) {
    return value ? 'yes' : 'no';
  },

  minutesToWorkDays(minutes) {
    return this.number(minutes / 8 / 60, 2);
  },

  /**
   * Converts a string containing a duration like "2:21" to minutes
   *
   * @param {string|number} minutes
   * @return {number}
   */
  durationToMinutes(minutes) {
    if (typeof minutes === 'number') return minutes;
    if (typeof minutes === 'string') {
      if (minutes.match(/^\d+$/)) {
        return parseInt(minutes, 10);
      }
      const parts = minutes.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
  },

  getDurationColor(minutes) {
    // format the durations in orange or red if they are larger than
    // some maximums to indicate possibly wrong entries
    if (minutes > 60 * 12) {
      return chalk.red;
    } else if (minutes > 60 * 8) {
      return chalk.yellow;
    }
    return v => v;
  },

  minutesToIndustryHours(minutes) {
    return minutes / 3 * 5 / 100;
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

  number(value, precision = 2) {
    if (typeof value !== 'number') {
      throw new TypeError('Expected value to be a of type Number');
    } else if (isNaN(value)) {
      throw new Error('Expected value to be a valid Number not NaN');
    } else if (!isFinite(value)) {
      throw new Error('Expecte value not to be a finite value.');
    }
    const options = {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    };
    const locale = 'en-EN';
    return value.toLocaleString(locale, options);
  },

  price(value, precision = 2) {
    precision = precision || 2;
    return this.number(value, precision);
  },

  budget(type, value) {
    // @TODO resolve circular dependency
    const config = require('./../config');
    const CURRENCY = config.get().currency;
    switch(type) {
      case BUDGET_TYPE.MINUTES_PER_MONTH:
        return this.minutesToDuration(value) + ' h/m';
      case BUDGET_TYPE.MINUTES:
        return this.minutesToDuration(value) + ' h';
      case BUDGET_TYPE.CENTS:
        return this.price(value / 100) + ' ' + CURRENCY;
      case BUDGET_TYPE.CENTS_PER_MONTH:
        return this.price(value / 100) + ' ' + CURRENCY + '/m';
      default:
        throw new Error(`Unknown budget format type: "${type}"`);
    }
  }
};
