'use strict';

const chalk = require('chalk');
const _ = require('lodash');

module.exports = function(err, results) {
  if (_.isString(results))
    results = JSON.parse(results);

  if (err) {
    if (err.name === 'SparkPostError') {
      console.log(chalk.red(`Error ${err.statusCode}`));
      if (_.has(err, 'errors') && !_.isUndefined(err.errors)) {
        console.log(JSON.stringify(err.errors, null, 2));
      }
    }
    else {
      console.log(chalk.red('Error'));
      console.log(err.message);
    }

    return;
  }

  console.log(chalk.green('Results:'));
  console.log(JSON.stringify(_.defaultTo(_.get(results, 'results'), results), null, 2));
};
