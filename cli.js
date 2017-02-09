#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const store = require('./lib/helpers').store;
const wrapFunction = require('./lib/helpers').wrapFunction;
const SPARKPOST_API_KEY = _.get(store.get('config'), 'key') || process.env.SPARKPOST_API_KEY || 'noop';
const SparkPost = require('sparkpost');
const sparkpost = new SparkPost(SPARKPOST_API_KEY);
const subbable = require('./lib/subbable');
const defaultFromSparkPost = require('./lib/default-from-sparkpost');

// get defaults
const defaultHandler = require('./defaults/handler');
const defaultMap = require('./defaults/map');
const defaultAction = require('./defaults/action');
const defaultCallback = require('./defaults/callback');
const defaultBuilder = require('./defaults/builder')(sparkpost);

sparkpost._cliAPIKey = SPARKPOST_API_KEY;

const yargs = require('yargs');
buildCLI(yargs);
let customCommands = buildCommands(yargs);
showHelpMessages(yargs, customCommands);
run(yargs);


/**
 * Set the CLI options
 */
function buildCLI(yargs) {
  yargs
   .version(function() {
    return require('./package.json').version;
  })
  .usage('Usage: $0 <command> [options] \n A command-line interface to SparkPost.')
  .help('help')
  .wrap(null);
}

/**
 * Build out all the commands from sparkpost and the commands.js
 */
function buildCommands(yargs) {
  let customCommands = getCustomCommands();

  customCommands = defaultFromSparkPost(sparkpost, customCommands);

  _.each(customCommands, (module) => {
    yargs.command(subbable(module, (module) => {
      module = setOptionDefaults(module);
      module = setCommandDefaults(module);

      return module;
    }));
  });

  return customCommands;
}

/**
 * Run the CLI
 */
function run(yargs) {
  yargs.recommendCommands().showHelpOnFail(false).argv;
}

/** 
 * Get the custom commands
 */
function getCustomCommands() {
  return keysToCommand(require('./commands'));
}

/**
 * sets the command names from the keys
 */
function keysToCommand(customCommands) {
  _.each(customCommands, (module, key) => {
    
    module.command = module.command || key;

    if (_.isPlainObject(module.commands)) {
      module.commands = keysToCommand(module.commands);
    }
  });

  return customCommands;
}

/**
 * Add defaults on options
 */
function setOptionDefaults(module) {
  module.options = module.options || {};

  // if its an array, turn it into an object
  if (_.isArray(module.options)) {
    let optionsObject = {};
    _.each(module.options, (option) => {
      optionsObject[option] = {};
    });

    module.options = optionsObject;
  }

  let optionKeys = _.keys(module.options);

  for (var i = 0; i < optionKeys.length; i++) {
    let key = optionKeys[i];

    _.defaults(module.options[key], {
      describe: key,
      demand: false,
      type: 'string',
      index: i
    });
  }

  return module;
}

/**
 * set defaults on modules
 */
function setCommandDefaults(module) {
  let self = {};

  _.defaults(self, module, {
    options: {},
    describe: `${module.command} command`,
    handler: defaultHandler,
    map: defaultMap,
    action: defaultAction,
    callback: defaultCallback,
    showMessage: function() {
      if (this.message) {
        return console.log(this.message);
      }
      
      return this.yargs.showHelp();
    }
  });

  // override the builder
  self.builder = wrapFunction(module.builder, defaultBuilder);

  return self;
}

/**
 * Shows help messages if needed
 */
function showHelpMessages(yargs, customCommands) {
  // they ran a non-existent top level command
  let keys = _.map(customCommands, 'command');
  let ranCommand = _.first(yargs.argv._);
  if (!_.includes(keys, ranCommand) && !_.isUndefined(ranCommand)) {
    console.log(`${ranCommand} is not a sparkpost command. See 'sparkpost --help'.`);
  }

  // show help if no command is given
  if (yargs.argv._.length < 1) {
    yargs.showHelp();
  }
}
