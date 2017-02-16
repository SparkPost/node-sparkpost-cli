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
  const subcommands = _.toArray(module.commands || []);
  const hasChildren = subcommands.length > 0;

  const newModule = {};
  return _.assign(newModule, module, {
    hasChildren, level,
    builder: function(yargs) {
      _.each(subcommands, (subcommandModule) => {
        yargs.command(subbable(subcommandModule, filter, level + 1));
      });

      if (_.has(module, 'builder')) {
        if (_.isPlainObject(module.builder)) {
          yargs.options(module.builder);
        } else if (_.isFunction(module.builder)) {
          return module.builder.apply(newModule, arguments);
        }
      }

      return yargs;
    },
    handler: function(argv) {
      // skip if its calling a child command
      if (argv._.length > level && hasChildren) {
        const childCommand = argv._[level];

        const commandExists = _.filter(newModule.commands, { command: childCommand }).length > 0;

        if (commandExists) {
          return;
        } else {
          newModule.commandNotFound = childCommand;
        }
      }

      if (_.has(module, 'handler')) {
        module.handler.apply(newModule, arguments);
      }
    }
  });
}

module.exports = subbable;
