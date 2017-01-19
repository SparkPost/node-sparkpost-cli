#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const store = require('./lib/store');
const SPARKPOST_API_KEY = _.get(store.get('config'), 'key');
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

runCLI();

function runCLI() {
  const yargs = require('yargs');

  let customCommands = getCustomCommands();
  customCommands = defaultFromSparkPost(sparkpost, customCommands);

  _.each(customCommands, (module) => {
    yargs.command(subbable(module, (module) => {
      module = setOptionDefaults(module);
      module = setCommandDefaults(module);

      return module;
    }));
  });

  yargs.recommendCommands().help('help').wrap(null).argv;

  // show help if nothing is called
  if (yargs.argv._.length < 1) {
    yargs.showHelp();
  }
}

function getCustomCommands() {
  return require('./commands');
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