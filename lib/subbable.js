'use strict';

const _ = require('lodash');

/**
 * creates command module with subcommmands from the commands key on the original module
 * note: works recursively
 *
 * @params {object} module - a yargs module
 * @params {function} [filter] - a function to filter the given module and all children - must return the modified module
 * @returns {object} module - a modified yargs module
 */
function subbable(module, filter) {
  module = _.isFunction(filter) ? filter(module) : module;
  let subcommands = _.toArray(module.commands || []);

  delete module.commands;

  return _.assign({}, module, {
    builder: (yargs) => {
      _.each(subcommands, (subcommandModule) => {
        yargs.command(subbable(subcommandModule, filter));
      });

      if (_.has(module, 'builder')) {
        if (_.isPlainObject(module.builder)) {
          yargs.options(module.builder);
        }
        else if (_.isFunction(module.builder)) {
          return module.builder(yargs);
        }
      }

      return yargs;
    },
    handler: (argv) => {
      if (_.has(module, 'handler')) {
        module.handler(argv);
      }
    }
  });
}

module.exports = subbable;