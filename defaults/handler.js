'use strict';

const _ = require('lodash');
const isJSON = require('is-json');

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
  let values = getGivenOptions(keys, argv);
  values = this.map(keys, values, argv);

  values.push(this.callback);
  this.action.apply(this, values);
};

/**
 * gets the options given from the argv
 *
 * @param {Array} optionsKeys - the options asked for
 * @params {object} argv - the given values from clis
 * @returns {array} givenOptions - the values that were asked for - null if not given
 */
function getGivenOptions(optionsKeys, argv) {
  let givenOptions = [];

  let usedKeys = []

  _.each(optionsKeys, (key) => {
    let topKey = _.first(_.split(key, '.'));

    if (_.includes(usedKeys, topKey))
      return;

    let value = _.get(argv, topKey) || null;
    givenOptions.push(isJSON(value) ? JSON.parse(value) : value);
    usedKeys.push(topKey);
  });

  return givenOptions;
}

function getOptionKeys(options) {
  let optionsArray = _.map(options, (option, name) => {
    option.name = name;
    return option;
  });

  return _.map(_.sortBy(optionsArray, 'index'), 'name');
}