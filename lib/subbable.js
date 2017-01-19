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
function subbable(module, filter, level) {
  module = _.isFunction(filter) ? filter(module) : module;
  level = level || 1;
  let subcommands = _.toArray(module.commands || []);
  let hasChildren = subcommands.length > 0;

  let self = {};
  return _.assign(self, module, {
    hasChildren, level,
    builder: function(yargs) {
      _.each(subcommands, (subcommandModule) => {
        yargs.command(subbable(subcommandModule, filter, level+1));
      });

      if (_.has(module, 'builder')) {
        if (_.isPlainObject(module.builder)) {
          yargs.options(module.builder);
        }
        else if (_.isFunction(module.builder)) {
          return module.builder.apply(self, arguments);
        }
      }

      return yargs;
    },
    handler: function(argv) {
      // skip if its calling a child command
      if (argv._.length > level && hasChildren) {
        let directChild = argv._[level];
        
        let commandExists = _.filter(self.commands, {command: directChild}).length > 0;

        if (commandExists) {
          return;
        }
        else {
          self.commandNotFound = directChild;
        }
      }

      if (_.has(module, 'handler')) {
        module.handler.apply(self, arguments);
      }
    }
  });
}

module.exports = subbable;