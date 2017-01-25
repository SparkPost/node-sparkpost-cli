const useArguments = require('../lib/helpers').useArguments;

module.exports = {
  default: true,
  commands: {
    create: useArguments({
      usage: 'Usage: $0 inbound-domains create <domain> [options]',
      arguments: ['domain'],
      options: {},
      map: function(keys, values, argv) {
        let domain = values[0];
        return [{ domain }];
      }
    }),
    delete: useArguments({
      options: {},
      usage: 'Usage: $0 inbound-domains delete <domain> [options]',
      arguments: ['domain'],
    }),
    get: useArguments({
      options: {},
      usage: 'Usage: $0 inbound-domains get <domain> [options]',
      arguments: ['domain'],
    })
  }
};