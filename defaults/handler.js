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
  let keys = getOptionKeys(this.options || {});
  let values = getGivenOptions(keys, argv);
  values = this.map(keys, values);
  
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

  _.each(optionsKeys, (key) => {
    let value = argv[key] || null;
    givenOptions.push(isJSON(value) ? JSON.parse(value) : value);
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