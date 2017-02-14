const _ = require('lodash');
const moment = require('moment');
const wrapFunction = require('../lib/helpers').wrapFunction;
const isJSON = require('../lib/helpers').isJSON;

module.exports = function(sparkpost) {
  return function(yargs) {
    // add yargs reference to object
    this.yargs = yargs;

    // add sparkpost reference to object
    this.sparkpost = sparkpost;

    handleCustomTypes.apply(this);

    // add in the options
    if (_.has(this, 'options')) {
      yargs.options(this.options);
    }

    // add in the coercion of options
    if (_.has(this, 'coerce')) {
      yargs.coerce(this.coerce);
    }

    // add in the usage
    if (_.has(this, 'usage')) {
      yargs.usage(this.usage);
    }
  };
};


const BASE_OPTION_TYPES = ['array', 'boolean', 'count', 'number', 'string'];
const CUSTOM_TYPES = {
  json: function(value) {
    return [ isJSON(value) ? JSON.parse(value) : value ];
  },
  date: function(value) {
    return [ moment(Date.parse(value)).format('YYYY-MM-DDTHH:mm') ];
  },
  full_date: function(value) {
    return [ moment(Date.parse(value)).format('YYYY-MM-DDTHH:mm:ssz') ];
  },
  file: function(value) {
    return [ require('fs').readFileSync(value, 'utf8') ];
  },
  number: function(value) {
    return [ !isNaN(Number(value)) ? Number(value) : value ];
  }
};
const defaultCoerceFunction = (val) => val;

function handleCustomTypes() {
  _.each(this.options || {}, (option, key) => {
    if (!_.includes(BASE_OPTION_TYPES, option.type)) {
      option.describe += `  [${option.type}]`
    }

    // add in the coercion for the custom types
    if (_.includes(_.keys(CUSTOM_TYPES), option.type)) {
      this.coerce = this.coerce || {};

      this.coerce[key] = wrapFunction(this.coerce[key] || defaultCoerceFunction, CUSTOM_TYPES[option.type]);
    }      
  });
}