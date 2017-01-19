'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const open = require('open');

module.exports = function(sparkpost, customCommands) {
  let commandsToDefault = _.filter(customCommands, { default: true });

  _.each(commandsToDefault, (module) => {
    let endpoint = module.command;

    // stop if the endpoint doesn't exist
    if (!_.has(sparkpost, _.camelCase(endpoint)))
      return;

    defaultEndpoint(module);
    
    let subcommands = _.keyBy(generateSubcommands(sparkpost, module), 'command');


    // default the values in
    module.commands = _.map(module.commands, (module) => {
      let command = module.command;
      if (_.has(subcommands, command)) {
        _.defaults(module, subcommands[command]);

        delete subcommands[command];
      }

      return module;
    });

    // merge everything else in
    module.commands = _.concat(module.commands, _.toArray(subcommands));
  });

  return customCommands;
};

function defaultEndpoint(module) {
  _.defaults(module, {
    describe: `Interact with the ${module.command} API`,
    commands: [],
    options: {
      docs: {
        type: 'boolean',
        demand: false,
        describe: 'Open documentation'
      }
    },
    action: function(docs) {
      if (docs) {
        open(`https://developers.sparkpost.com/api/${module.command}.html`)
      }
      else {
        this.showMessage();
      }
    }
  });
}

function generateSubcommands(sparkpost, module) {
  let endpoint = module.command;
  let endpointCamel = _.camelCase(endpoint);

  let commands = _.keys(sparkpost[endpointCamel]);

  return _.map(commands, (command) => {
    let commandCamel = command;

    command = _.kebabCase(command);
    let describe = generateSubcommandDescription(endpoint, command);
    let options = generateSubcommandOptions(sparkpost[endpointCamel][commandCamel]);
    let action = sparkpost[endpointCamel][commandCamel];

    return { command, describe, options, action };
  });
}

function generateSubcommandDescription(endpoint, command) {
  let describe = `${command} a ${_.lowerCase(pluralize.singular(endpoint))}`;
    
  if (command == 'list')
    describe = `${command} ${_.lowerCase(endpoint)}`;

  return describe;
}

function generateSubcommandOptions(func) {
  let args = getFunctionArguments(func);
  args.pop(); // remove callback option
  
  return _.keyBy(_.map(args, (option, index) => {
    return { name: option, index }
  }), 'name');
}

function getFunctionArguments(func) {
    // First match everything inside the function argument parens.
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
   
    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(arg) {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
      // Ensure no undefined values are added.
      return arg;
    });
  }