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
  ]
};

module.exports.columns = {
  default: 'id,name,hourly_rate,note',
  options: {
    archived: {
      label: 'Archived',
      attribute: 'archived',
      width: 10,
      alignment: 'right',
      format: formater.booleanToHumanvalue
    },
    created_at: {
      label: 'Created At',
      attribute: 'created_at',
    },
    id: {
      label: 'ID',
      attribute: 'id',
      width: 10,
      alignment: 'right'
    },
    name: {
      label: 'Name',
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
    hourly_rate: {
      label: 'Rate',
      attribute: 'hourly_rate',
      width: 10,
      alignment: 'right',
      format: (value) => {
        if (!value) {
          return '-';
        }
        return formater.budget(formater.BUDGET_TYPE.CENTS, value);
      },
    },
    updated_at: {
      label: 'Updated At',
      attribute: 'updated_at',
    }
  },
};
