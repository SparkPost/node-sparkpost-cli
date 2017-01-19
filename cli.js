#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const store = require('./lib/store');
const SPARKPOST_API_KEY = _.get(store.get('config'), 'key') || process.env.SPARKPOST_API_KEY || null;
const SparkPost = require('sparkpost');
const sparkpost = new SparkPost(SPARKPOST_API_KEY || 'noop');
const subbable = require('./lib/subbable');
const defaultFromSparkPost = require('./lib/default-from-sparkpost');

// get defaults
const defaultHandler = require('./defaults/handler');
const defaultMap = require('./defaults/map');
const defaultAction = require('./defaults/action');
const defaultCallback = require('./defaults/callback');
const generateBuilder = require('./defaults/generate-builder');

const yargs = require('yargs');
buildCLI();
yargs.recommendCommands().showHelpOnFail(false).help('help').wrap(null).argv;


/**
 * Build out all the commands from sparkpost and the commands.js
 */
function buildCLI() {
  let customCommands = getCustomCommands();
  customCommands = defaultFromSparkPost(sparkpost, customCommands);

  _.each(customCommands, (module, key) => {

    yargs.command(subbable(module, (module) => {
      module = setOptionDefaults(module);
      module = setCommandDefaults(module);

      return module;
    }));
  });

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

/** 
 * Get the custom commands
 */
function getCustomCommands() {
  return keysToCommand(require('./commands'));
}

/**
 * converts the commands container into an array and moves the key into the commands param in each object
 * if it doesn't already have one
 */
function keysToCommand(commands) {
  return _.map(commands, (module, key) => {
    
    module.command = _.get(module, 'command') || key;

    if (_.isPlainObject(module.commands)) {
      module.commands = keysToCommand(module.commands);
    }

    return module;
  })
}

/**
 * Add defaults on options
 */
function setOptionDefaults(module) {
  let optionKeys = _.keys(module.options || {});

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
  let defaultedModule = {};

  _.defaults(defaultedModule, module, {
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

  defaultedModule.builder = generateBuilder(defaultedModule);

  return defaultedModule;
}