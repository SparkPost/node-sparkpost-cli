'use strict';

const store = require('../lib/helpers').store;
const _ = require('lodash');

module.exports = {
  command: 'config',
  describe: 'Set up the SparkPost configuration',
  options: {
    key: {},
    origin: {},
    clear: { type: 'boolean' }
  },
  action: function(key, origin, clear, callback) {
    let config, updated = false;

    _.each({ key, origin }, (val, prop) => {
      if (val) {
        store.set(`config.${prop}`, val);
        updated = true;
      }
    });

    if (clear) {
      store.set('config', {});
    }

    if (updated) {
      console.log('Successfully updated');
    }

    config = store.get('config');

    if (config.key) {
      config.key = config.key.substring(0, 4) + config.key.substring(4).replace(/./g, '*');
    }

    if (_.isEmpty(config)) {
      config = 'No Configuration';
    }

    callback(null, config);
  }
};
