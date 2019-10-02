'use strict';

const formater = require('./../formater');
const { BUDGET_TYPE } = require('./../../lib/constants');
const supportsExtendedFormat = require('./../data-output').supportsExtendedFormat;

function getBudgetUsage(project) {
  if (!project.used_budget) return undefined;
  let percentage = 0;
  switch (project.budget_type) {
    case BUDGET_TYPE.MINUTES_PER_MONTH:
    case BUDGET_TYPE.MINUTES:
      percentage = project.used_budget.minutes / project.budget;
      break;
    case BUDGET_TYPE.CENTS_PER_MONTH:
    case BUDGET_TYPE.CENTS:
      percentage = (project.used_budget.revenue || 0) / project.budget;
      break;
  }
  return percentage;
}

module.exports.sort = {
  default: 'name',
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
  default: 'name,customer,budget,budget_used,budget_used_chart,hourly_rate',
  options: {
    archived: {
      label: 'Archived',
      attribute: 'archived',
      format: formater.booleanToHumanvalue,
    },
    budget: {
      label: 'Budget',
      attribute: 'budget',
      width: 12,
      alignment: 'right',
      format: (value, item, format) => {
        if (!value && supportsExtendedFormat(format)) {
          return '-';
        }
        return formater.budget(item.budget_type, value);
      },
    },
    // shows the relative usage of the budget defined, requires the "project"
    // item to have information about the total budget
    budget_usage: {
      label: 'Budget' + "\n" + 'Used',
      attribute: 'budget',
      width: 6,
      alignment: 'right',
      format: (value, item) => {
        if (!value || !item.used_budget) return;
        let percentage = getBudgetUsage(item);
        return formater.getBudgetPercentageColor(percentage)(`${formater.number(percentage * 100, 0)}%`);
      }
    },
    budget_used_chart: {
      label: 'Budget\nUsed',
      attribute: 'budget',
      width: 10,
      alignment: 'left',
      format: (value, item) => {
        if (!value || !item.used_budget) return;
        let percentage = getBudgetUsage(item);
        return formater.getBudgetPercentageColor(percentage)(formater.percentChart(percentage, 10));
      }
    },
    budget_used: {
      label: 'Budget' + "\n" + 'Used',
      attribute: 'budget',
      width: 12,
      alignment: 'right',
      format: (value, item) => {
        if (!item.used_budget || !value) return '';
        switch (item.budget_type) {
          case BUDGET_TYPE.MINUTES_PER_MONTH:
          case BUDGET_TYPE.MINUTES:
            return formater.budget(BUDGET_TYPE.MINUTES, item.used_budget.minutes);
          case BUDGET_TYPE.CENTS_PER_MONTH:
          case BUDGET_TYPE.CENTS:
            return formater.budget(BUDGET_TYPE.CENTS, item.used_budget.revenue);
        }
      }
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
        if (!value) return '';
        return item.customer_name;
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
      format: (value, item, format) => {
        if (!value && supportsExtendedFormat(format)) {
          return '-';
        }
        return formater.budget(formater.BUDGET_TYPE.CENTS, value || 0);
      },
    },
    revenue: {
      label: 'Revenue',
      attribute: 'revenue',
      width: 12,
      alignment: 'right',
      format: (value) => {
        return formater.budget(formater.BUDGET_TYPE.CENTS, value || 0);
      }
    },
    updated_at: {
      label: 'Updated At',
      attribute: 'updated_at',
    }
  }
};
