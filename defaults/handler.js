'use strict';

const _ = require('lodash');
const isJSON = require('../lib/helpers').isJSON;

/**
 * the default handler for the cli command
 *
 * @param {object} arg
 * @param {string} command - the command this is for
 */
module.exports = function(argv) {
  if (this.commandNotFound) {
    return console.log(`Unknown subcommand: ${this.commandNotFound}`);
  }

  const keys = getOptionKeys(_.get(this, 'options') || {});
  let values = getOptionValues(keys, argv);

  values = this.map(keys, values, argv);

  values.push(this.callback);
  this.action.apply(this, values);
};

/**
 * gets the option values given from the argv
 *
 * @param {Array} optionsKeys - the options asked for
 * @params {object} argv - the given values from clis
 * @returns {array} givenOptions - the values that were asked for - null if not given
 */
function getOptionValues(optionsKeys, argv) {
  optionsKeys = _.uniq(_.map(optionsKeys, (key) => key.split('.')[0]));

  const givenOptions = [];

  _.each(optionsKeys, (key) => {
    const value = _.get(argv, key) || null;
    givenOptions.push(isJSON(value) ? JSON.parse(value) : value);
  });

  return givenOptions;
}


/**
 * gets the option keys in the order they were originally given
 *
 * @param {Object} options - the option object from the module
 * @return {Array} keys - the keys of the options
 */
function getOptionKeys(options) {
  const optionsArray = _.map(options, (option, name) => {
    option.name = name;
    return option;
  });

  return _.map(_.sortBy(optionsArray, 'index'), 'name');
}
