'use strict';

const chalk = require('chalk');
const _ = require('lodash');
const prettyjson = require('prettyjson');
const prettyOptions = {
  emptyArrayMsg: '[]'
};
const isJSON = require('../lib/helpers').isJSON;

module.exports = function(err, results) {
  if (isJSON(results))
    results = JSON.parse(results);

  if (err) {
    if (err.name === 'SparkPostError') {
      console.log(chalk.red(`Error ${err.statusCode}`));
      if (_.has(err, 'errors') && !_.isUndefined(err.errors)) {
        if (err.errors.length === 1)
          err.errors = err.errors[0];

        console.log(prettyjson.render(err.errors, prettyOptions));
      }
    }
    else {
      console.log(chalk.red('Error'));
      console.log(err.message);
    }
  }
  else {
    if (!_.isEmpty(results)) {
      results = _.defaultTo(_.get(results, 'results'), results);

      if (_.isArray(results)) {
        results = flatten(results);
      }

      console.log(prettyjson.render(results, prettyOptions));
    }
    else {
      console.log(chalk.green('Success'));
    }
  }
};


/**
 * takes an array and flattens it to simplify the output
 */
function flatten(results) {
  let flattenedResults = [];

  let successfullyFlattened = true;

  _.each(results, (result) => {
    if (_.isPlainObject(result) && _.keys(result).length == 1) {
      flattenedResults.push(_.first(_.toArray(result)));
    }
    else {
      successfullyFlattened = false;
    }
  })

  return successfullyFlattened ? flattenedResults : results;
}