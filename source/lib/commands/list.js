'use strict';

const weekNumber = require('weeknumber');
const chalk = require('chalk');

const formater = require('./../formater');

module.exports.sort = {
  default: 'date',
  options: [
    'customer',
    'date',
    'minutes',
    'note',
    'project',
    'revenue',
    'service',
    'user',
  ]
};

module.exports.groupBy = {
  // list of valid options taken from
  // https://mite.yo.lk/en/api/time-entries.html#list-grouped
  options: [
    'customer',
    'day',
    'month',
    'project',
    'service',
    'user',
    'week',
    'year',
  ]
};

module.exports.columns = {
  default: 'id,date,user,project,duration,revenue,service,note',
  options: {
    billable: {
      label: 'Billable',
      attribute: 'billable',
      format: formater.booleanToHumanvalue,
    },
    created: {
      label: 'Created',
      attribute: 'created_at',
    },
    customer: {
      label: 'Customer',
      attribute: 'customer_name',
      format: function(value, timeEntry) {
        if (!value) {
          return timeEntry.customer_id;
        }
        return value;
      }
    },
    customer_id: {
      label: 'Customer ID',
      attribute: 'customer_id',
    },
    date: {
      label: 'Date',
      attribute: 'date_at',
      width: 10,
      alignment: 'right'
    },
    duration: {
      label: 'Duration',
      attribute: 'minutes',
      width: 10,
      alignment: 'right',
      format: (value, timeEntry) => {
        if (timeEntry && timeEntry.tracking) {
          value = timeEntry.tracking.minutes;
        }
        let duration = formater.minutesToDuration(value);
        // format the durations in orange or red if they are larger than
        // some maximums to indicate possibly wrong entries
        if (value > 60 * 12) {
          duration = chalk.red(duration);
        } else if (value > 60 * 8) {
          duration = chalk.yellow(duration);
        }
        if (timeEntry && timeEntry.locked) {
          duration = chalk.green('✔') + ' ' + duration;
        }
        if (timeEntry && timeEntry.tracking) {
          duration = '▶ ' + duration;
        }
        return duration;
      },
      reducer: (sum, cur) => {
        if (!sum) sum = 0;
        return sum + cur.minutes;
      }
    },
    hours: {
      label: 'Hours',
      attribute: 'minutes',
      alignment: 'right',
      format: (value, timeEntry) => {
        if (!value) return undefined;
        if (timeEntry && timeEntry.tracking) {
          value = timeEntry.tracking.minutes;
        }
        return formater.number(formater.minutesToIndustryHours(value), 2);
      },
      reducer: (sum, cur) => sum + cur.minutes,
    },
    hourly_rate: {
      label: 'Rate',
      attribute: 'hourly_rate',
    },
    id: {
      label: 'ID',
      attribute: 'id',
      width: 10,
      alignment: 'right',
    },
    locked: {
      label: 'Locked',
      attribute: 'locked',
      format: formater.booleanToHumanvalue,
    },
    minutes: {
      label: 'Minutes',
      attribute: 'minutes',
      reducer: (sum, cur) => {
        return sum + cur.minutes;
      }
    },
    note: {
      label: 'Note',
      attribute: 'note',
      width: 70,
      wrapWord: true,
      alignment: 'left',
      format: formater.note,
    },
    project: {
      label: 'Project',
      attribute: 'project_name',
      width: 20,
      alignment: 'right',
      wrapWord: true,
      format: (value, timeEntry) => {
        if (!value) return timeEntry.project_id;
        return value;
      }
    },
    project_id: {
      label: 'Project ID',
      attribute: 'project_id',
    },
    revenue: {
      label: 'Revenue',
      attribute: 'revenue',
      width: 10,
      alignment: 'right',
      format: (value) => {
        if (!value) {
          return undefined;
        }
        return formater.budget(formater.BUDGET_TYPE.CENTS, value || 0);
      },
      reducer: (sum, cur) => {
        if (!sum) sum = 0;
        return sum + cur.revenue;
      }
    },
    service: {
      label: 'Service',
      attribute: 'service_name',
      width: 20,
      alignment: 'right',
      format: (value, timeEntry) => {
        if (!value) return timeEntry.service_id;
        return value;
      }
    },
    service_id: {
      label: 'Service ID',
      attribute: 'service_id',
    },
    tracking: {
      label: 'Tracked',
      attribute: 'tracking',
      format: formater.booleanToHumanvalue,
    },
    updated: {
      label: 'Updated',
      attribute: 'updated',
    },
    user: {
      attribute: 'user_name',
      label: 'User',
    },
    user_id: {
      label: 'User ID',
      attribute: 'user_id',
    },

    week: {
      label: 'Week',
      attribute: 'week',
      format: function(value, column) {
        if (column.week) return column.week;
        if (column.created_at) {
          const date = new Date(column.created_at);
          return column.created_at.substr(0, 4) + '' + weekNumber.weekNumber(date);
        }
        return undefined;
      }
    },
    year: {
      label: 'Year',
      attribute: 'year',
      format: function(value, column) {
        if (column.year) return column.year;
        if (column.created_at) return column.created_at.substr(0, 4);
        return undefined;
      }
    },
    month: {
      label: 'Month',
      attribute: 'month',
      format: function(value, column) {
        if (column.month) return column.month;
        if (column.created_at) return column.created_at.substr(5, 2);
        return undefined;
      }
    },
    day: {
      label: 'Day',
      attribute: 'day',
      format: function(value, column) {
        if (column.day) return column.day.substr(-2);
        if (column.created_at) return column.created_at.substr(8, 2);
        return undefined;
      }
    },
  }
}; // list
