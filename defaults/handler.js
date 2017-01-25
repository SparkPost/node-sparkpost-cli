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

  let keys = getOptionKeys(_.get(this, 'options') || {});
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
  optionsKeys = _.uniq(_.map(optionsKeys, (key) => {
      return key.split('.')[0];
    }));

  let givenOptions = [];

  _.each(optionsKeys, (key) => {
    let value = _.get(argv, key) || null;
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
  let optionsArray = _.map(options, (option, name) => {
    option.name = name;
    return option;
  });

  return _.map(_.sortBy(optionsArray, 'index'), 'name');
}