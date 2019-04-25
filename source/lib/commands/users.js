'use strict';

const formater = require('./../formater');

module.exports.sort = {
  default: 'name',
  options: [
    'archived',
    'created_at',
    'email',
    'id',
    'language',
    'name',
    'note',
    'role',
    'updated_at',
  ],
};

module.exports.columns = {
  default: 'id,role,name,email,note',
  options: {
    archived: {
      label: 'Archived',
      attribute: 'archived',
      format: formater.booleanToHumanvalue,
    },
    created_at: {
      label: 'Created At',
      attribute: 'created_at',
    },
    email: {
      label: 'Email',
      attribute: 'email'
    },
    id: {
      label: 'ID',
      attribute: 'id',
      width: 10,
      alignment: 'right'
    },
    language: {
      label: 'Language',
      attribute: 'language',
    },
    name: {
      label: 'Name',
      attribute: 'name',
      format: formater.username,
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
      label: 'User Role',
      attribute: 'role',
    },
    updated_at: {
      label: 'Updated At',
      attribute: 'updated_at',
    }
  }
};
