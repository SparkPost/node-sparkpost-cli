'use strict';

module.exports = function() {
  let callback = arguments[arguments.length - 1];
  
  callback(new Error(`Functionality needed for the "${this.command}" command`));
};