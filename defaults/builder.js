'use strict';

const _ = require('lodash');

module.exports = function(sparkpost) {
  return function(yargs) {
    // add yargs reference to object
    this.yargs = yargs;

    // yargs help for the commands
    yargs.help('help');

    // add sparkpost reference to object
    this.sparkpost = sparkpost;

    // add in the options
    if (_.has(this, 'options')) {
      yargs.options(this.options);
    }

    // add in the usage
    if (_.has(this, 'usage')) {
      yargs.usage(this.usage);
    }
  };
};
