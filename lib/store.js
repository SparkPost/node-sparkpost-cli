const Configstore = require('configstore');
const store = new Configstore(require('../package.json').name, {config: {}});

module.exports = store;