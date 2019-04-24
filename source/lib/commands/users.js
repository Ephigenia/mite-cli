'use strict';

const formater = require('./../formater');
const chalk = require('chalk');

module.exports.USER_ROLES = [
  'admin',
  'owner',
  'time_tracker',
  'coworker'
];

module.exports.sort = {
  default: 'name',
  options: [
    'id',
    'name',
    'email',
    'role',
    'note',
    'updated_at',
    'created_at',
  ],
};

module.exports.columns = {
  default: 'id,role,name,email,note',
  options: {
    archived: {
      label: 'Archived',
      attribute: 'archived',
      format: (value) => {
        return value ? 'yes' : 'no';
      },
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
    email: {
      label: 'Email',
      attribute: 'email'
    },
    language: {
      label: 'Language',
      attribute: 'language',
    },
    name: {
      label: 'name',
      attribute: 'name',
      format: (value, item) => {
        switch(item.role) {
          case 'admin':
            return chalk.yellow(value);
          case 'owner':
            return chalk.red(value);
          default:
            return value;
        }
      }
    },
    note: {
      label: 'Note',
      attribute: 'note',
      width: 50,
      wrapWord: true,
      alignment: 'left',
      format: formater.note,
    },
    role: {
      width: 10,
      align: 'right',
      label: 'Role',
      attribute: 'role',
    },
    updated_at: {
      label: 'Updated At',
      attribute: 'updated_at',
    }
  }
}
