'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const open = require('open');
const checkAPIKey = require('../lib/helpers').checkAPIKey;

module.exports = function(sparkpost, customCommands) {

  return _.map(customCommands, (module, endpoint) => {

    // default from sparkpost if the endpoint exists and we want to default it
    if (_.has(sparkpost, _.camelCase(endpoint)) && module.default) {
      let subcommands = generateSubcommands(sparkpost, module.command);

      module = setEndpointDefaults(module);
      module = setSubcommandDefaults(module, subcommands);
    }

    return module;
  });
};

function setEndpointDefaults(module) {
  return _.defaults({}, module, {
    describe: `Call the ${module.command} endpoint`,
    commands: [],
    usage: `Usage: $0 ${module.command} <command> [options]`,
    options: {
      docs: {
        type: 'boolean',
        demand: false,
        describe: 'Open documentation'
      }
    },
    action: function(docs) {
      if (docs) {
        console.log(`Opening ${module.command} docs...`);
        open(`https://developers.sparkpost.com/api/${module.command}.html`);
      }
      else {
        this.showMessage();
      }
    }
  });
}

function generateSubcommands(sparkpost, endpoint) {
  let endpointCamel = _.camelCase(endpoint);

  let sparkpostCommands = _.keys(sparkpost[endpointCamel]);

  return _.keyBy(_.map(sparkpostCommands, (command) => {
    let commandCamel = command;

    command = _.kebabCase(command);
    let describe = generateSubcommandDescription(endpoint, command);
    let options = generateSubcommandOptions(sparkpost[endpointCamel][commandCamel]);
    let action = addAPIKeyCheck(sparkpost, endpointCamel, commandCamel);
    let usage = `usage: $0 ${endpoint} ${command} [options]`;

    return { command, describe, usage, options, action };
  }), 'command');
}

function generateSubcommandDescription(endpoint, command) {
  let describe = `a ${_.lowerCase(pluralize.singular(endpoint))}`;
    
  if (_.includes(['list', 'search'], command))
    describe = `${_.lowerCase(endpoint)}`;

  // like get-batch-status
  let splitCommand = command.split('-');
  if (splitCommand[0] === 'get' && splitCommand.length > 1) {
    describe = ''; 
  }

  return `${_.lowerCase(command)} ${describe}`;
}

function generateSubcommandOptions(func) {
  let args = getFunctionArguments(func);
  args.pop(); // remove callback option
  
  return _.keyBy(_.map(args, (option, index) => {
    return { name: option, index }
  }), 'name');
}

function setSubcommandDefaults(module, subcommandDefaults) {
  module.commands = _.map(module.commands, (module) => {
    let command = module.command;

    if (_.has(subcommandDefaults, command)) {
      _.defaults(module, subcommandDefaults[command]);

      delete subcommandDefaults[command];
    }

    return module;
  });

  // merge the remaining defaults in
  module.commands = _.concat(module.commands, _.toArray(subcommandDefaults));

  return module;
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

function addAPIKeyCheck(sparkpost, endpt, cmd) {
  return function() {
    if (checkAPIKey(sparkpost)) {
      return sparkpost[endpt][cmd].apply(sparkpost, arguments);
    }
  }
}

