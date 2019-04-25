'use strict';

const formater = require('./../formater');
const chalk = require('chalk');

module.exports.sort = {
  default: 'date',
  options: [
    'date',
    'user',
    'customer',
    'project',
    'service',
    'note',
    'minutes',
    'revenue',
  ]
};

module.exports.groupBy = {
  options: [
    'user',
    'customer',
    'project',
    'service',
    'day',
    'week',
    'month',
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
          return '-';
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
  }
}; // list
