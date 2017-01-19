const _ = require('lodash');

module.exports = function(module) {
  let originalBuilder = _.has(module, 'builder') ? module.builder : null;

  return function(yargs) {

    // add yargs reference to object
    this.yargs = yargs;

    // add in the options
    if (_.has(module, 'options')) {
      yargs.options(this.options);
    }

    // call the original builder
    if (_.isPlainObject(originalBuilder)) {
      yargs.options(originalBuilder);
    }
    else if (_.isFunction(originalBuilder)) {
      return originalBuilder.apply(module, arguments);
    }
  };
};