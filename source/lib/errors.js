'use strict';

const DEFAULT_EXIT_CODE = 1;
const DEFAULT_NODE_ENV = 'production';

class GeneralError extends Error {
  constructor(message) {
    super(message || 'General Error');
    this.exitCode = 1;
  }
}

class MissingRequiredArgumentError extends GeneralError {
  constructor(message) {
    super(message || 'Missing required argument');
    this.exitCode = 4;
  }
}
class InvalidOptionValue extends GeneralError {
  constructor(message) {
    super(message || 'Invalid or not parsable option value');
    this.exitCode = 2;
  }
}
class MissingRequiredOptionError extends GeneralError {
  constructor(message) {
    super(message || 'missing required option');
    this.exitCode = 3;
  }
}

/**
 * Handles the given error according to the current NODE_ENV.
 *
 * Handles the given error according to the current NODE_ENV.  Dependant on the
 * current NODE_ENV value the given error is shown with or without stack trace.
 *
 * @param  {Error} error [description]
 * @throws Error
 */
function handleError(error) {
  const NODE_ENV = String(process.env.NODE_ENV || DEFAULT_NODE_ENV).toLowerCase();
  const exitCode = error.exitCode || DEFAULT_EXIT_CODE;

  if (NODE_ENV === 'production') {
    console.error(error.message || error);
    process.exit(exitCode);
  } else {
    throw error;
  }
}

module.exports = {
  GeneralError,
  MissingRequiredOptionError,
  MissingRequiredArgumentError,
  InvalidOptionValue,
  handleError,
};
