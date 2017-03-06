'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const defaultMap = require('../defaults/map');
const TAKES_ID = ['get', 'update', 'delete', 'verify', 'validate', 'get-batch-status'];
const TAKES_OPTIONS = ['create', 'update', 'verify', 'validate'];
const TAKES_FILTERS = ['get', 'list', 'get-samples', 'get-batch-status'];

/**
 * Storage for CLI
 */
const Configstore = require('configstore');
const store = new Configstore(require('../package.json').name, {config: {}});


/**
 * Calls the added function and the original function
 */
function wrapFunction(originalFunc, addedFunc) {
  return function() {
    // call the added function
    let modifiedArgs = addedFunc.apply(this, arguments);
    modifiedArgs = modifiedArgs || arguments;

    // call the original function second
    if (_.isFunction(originalFunc)) {
      return originalFunc.apply(this, modifiedArgs);
    }
  };
}

/**
 * add a key of "arguments" for using commands as options
 *
 * Example "sparkpost inbound-domains create --domain=asdf.com" can become "sparkpost inbound-domains create asdf.com"
 * @param {Object} module - the module with the added arguments
 */
function useArguments(module) {
  let args = module.arguments || [];

  if (args.length === 0) {
    return module;
  }

  // override the builder to demand the args
  module.builder = wrapFunction(module.builder, function(yargs) {
    let message = `Missing required argument: ${_.first(args)}`;
    if (args.length > 1) {
      message = `Missing a required argument in: ${args.join(', ')}`;
    }

    yargs.demandCommand(args.length, message);
  });

  // // override the map function to add in thar args
  module.map = wrapFunction(module.map || defaultMap, function(keys, values, argv) {

    keys = _.concat(args, keys);
    values = _.concat(_.slice(argv._, argv._.length - args.length), values);

    return [keys, values, argv];
  });

  return module;
}

/**
 * A generic map function for crud operations that take an object on create, an id and object on update, and an id delete and get
 */
function crudMap (keys, values, argv) {
  let mappedValues = [];

  // add in the arguments as their own values
  if (this.arguments && this.arguments.length > 0) {
    mappedValues = values.slice(0, this.arguments.length);
  }

  if (this.options && !_.isEmpty(this.options)) {
    // get the top-level options
    let options = _.uniq(_.map(this.options, (rules, option) => {
      return option.split('.')[0];
    }));

    let optionValues = {};
    // add in the options as a combined object
    _.each(options, (option) => {
      optionValues[option] = _.get(argv, option);
    })

    mappedValues.push(optionValues);
  }

  return mappedValues;
}

/**
 * Defaults the module options, map, and usage settings
 */
function crudSubcommands(crudOptions, module) {
  crudOptions = _.defaults(crudOptions || {}, {
    id: 'id',
  });

  module = _.defaults(module || {}, {
    command: crudOptions.command,
    commands: {},
  });

  _.each(crudOptions.commands || [], (command) => {
    let defaultCommand = {
      usage: `Usage: $0 ${crudOptions.command} ${command}`,
      map: crudMap
    };

    if (_.includes(TAKES_ID, command)) {
      defaultCommand.arguments = [crudOptions.id];
      defaultCommand.usage += ` <${crudOptions.id}>`;
    }

    if (_.includes(TAKES_OPTIONS, command)) {
      defaultCommand.options = crudOptions[`${command}_options`] || crudOptions.options || undefined;
    }
    else {
      defaultCommand.options = {};
    }

    if (_.includes(TAKES_FILTERS, command)) {
      defaultCommand.options = crudOptions[`${command}_filters`] || crudOptions.filters || undefined;
    }

    defaultCommand.usage += ' [options]';

    module.commands[command] = useArguments(_.defaults(module.commands[command] || {}, defaultCommand));
  });

  return module;
}

/**
 * checks if var is valid json or an object
 */
function isJSON(check) {
  try {
    return !!JSON.parse(check);
  }
  catch(e) {
    return false;
  }
}

function checkAPIKey(sparkpost) {
  if (!('_cliAPIKey' in sparkpost) || typeof(sparkpost._cliAPIKey) !== 'string' ||
      sparkpost._cliAPIKey.length === 0 || sparkpost._cliAPIKey === 'noop') {
    console.log(`${chalk.red('Error')}: A SparkPost API key is required.\nEither ${chalk.yellow('export SPARKPOST_API_KEY=\'your API key\'')} or use ${chalk.yellow('sparkpost config --key=\'your API key\'')}.`);
    return false;
  }
  return true;
}

module.exports = { store, wrapFunction, useArguments, crudMap, crudSubcommands, isJSON, checkAPIKey };
