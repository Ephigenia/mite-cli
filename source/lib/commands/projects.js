'use strict';

const formater = require('./../formater');

module.exports.sort = {
  default: '',
  options: [
    'archived',
    'budget',
    'created_at',
    'customer_id',
    'customer_name',
    'customer',
    'hourly_rate',
    'id',
    'name',
    'updated_at',
  ]
};

module.exports.columns = {
  default: 'id,name,customer,budget,hourly_rate,note',
  options: {
    archived: {
      label: 'Archived',
      attribute: 'archived',
      format: formater.booleanToHumanvalue,
    },
    budget: {
      label: 'Budget',
      attribute: 'budget',
      width: 10,
      alignment: 'right',
      format: (value, item) => {
        if (!value) {
          return '-';
        }
        return formater.budget(item.budget_type, value);
      },
    },
    budget_type: {
      label: 'Budget Type',
      attribute: 'budget_type',
    },
    created_at: {
      label: 'Created At',
      attribute: 'created_at',
    },
    customer_id: {
      label: 'Customer ID',
      attribute: 'customer_id'
    },
    customer_name: {
      label: 'Customer Name',
      attribute: 'customer_name'
    },
    customer: {
      label: 'Customer',
      attribute: 'customer_name',
      format: (value, item) => {
        return `${item.customer_name} (${item.customer_id})`;
      }
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
        return formater.budget(formater.BUDGET_TYPE.CENTS, value || 0);
      },
    },
    updated_at: {
      label: 'Updated At',
      attribute: 'updated_at',
    }
  }
};
