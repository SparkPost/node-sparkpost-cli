'use strict';

const chalk = require('chalk');
const _ = require('lodash');
const line = chalk.white('-------------------');

module.exports = function(err, results) {
  if (_.isString(results))
    results = JSON.parse(results);

  // before all
  console.log();
  console.log(line);

  if (err) {
    if (err.name === 'SparkPostError') {
      console.log(chalk.red(`Error ${err.statusCode}`));
      console.log(line);
      if (_.has(err, 'errors') && !_.isUndefined(err.errors)) {
        console.log(JSON.stringify(err.errors, null, 2));
      }
    }
    else {
      console.log(chalk.red('Error'));
      console.log(line);
      console.log(err.message);
    }
  }
  else {
    console.log(chalk.green('Results'));
    console.log(line);
    console.log(JSON.stringify(_.defaultTo(_.get(results, 'results'), results), null, 2));
  }

  // after all
  console.log();
};
