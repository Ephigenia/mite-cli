'use strict';

const formater = require('./../formater');

module.exports.sort = {
  default: 'name',
  options: [
    'id',
    'name',
    'updated_at',
    'created_at',
    'hourly_rate',
    'rate' // alias for hourly_rate
  ],
};

module.exports.columns = {
  default: 'id,name,billable,rate,note',
  options: {
    billable: {
      label: 'billable',
      attribute: 'billable',
      width: 10,
      alignment: 'right',
      format: (value) => {
        return value ? 'yes' : 'no';
      },
    },
    created_at: {
      label: 'created at',
      attribute: 'created_at',
    },
    id: {
      label: 'id',
      attribute: 'id',
      width: 10,
      alignment: 'right'
    },
    name: {
      label: 'name',
      attribute: 'name',
    },
    note: {
      label: 'Note',
      attribute: 'note',
      width: 50,
      wrapWord: true,
      alignment: 'left',
      format: formater.note,
    },
    rate: {
      label: 'rate',
      attribute: 'hourly_rate',
      width: 10,
      alignment: 'right',
      format: (value) => {
        if (!value) {
          return '-';
        }
        return formater.budget(formater.BUDGET_TYPE.CENTS, value || 0);
      },
    },
    updated_at: {
      label: 'updated at',
      attribute: 'updated_at',
    }
  },
};
