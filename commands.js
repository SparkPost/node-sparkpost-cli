'use strict';

module.exports = {
  config: require('./commands/config'),
  'inbound-domains': {
    default: true,
    commands: {
      create: {
        options: {
          domain: { demand: true }
        },
        map: function(keys, values) {
          let domain = values[0];
          return [ { domain } ];
        }
      }
    }
  },
  'message-events': {
    default: true,
    commands: {
      search: {
        options: {
          bounce_classes: {},
          campaign_ids: {},
          delimiter: {},
          events: {},
          friendly_froms: {},
          from: {},
          message_ids: {},
          page: {},
          per_page: {},
          reason: {},
          recipients: {},
          subaccounts: {},
          template_ids: {},
          timezone: {},
          to: {},
          transmission_ids: {},
        },
      }
    }
  },
  'relay-webhooks': {
    default: true,
    commands: {
      create: {
        options: {
          name: {},
          target: {},
          auth_token: {},
          'match.protocol': {},
          'match.domain': {},
          'match.esme_address': {}
        },
        map: (keys, values, argv) => {
          return [{
            name: values[0],
            target: values[1],
            auth_token: values[2],
            match: values[3],
          }];
        }
      },
    }
  },
  'sending-domains': {
    default: true,
  },
  'subaccounts': {
    default: true,
  },
  'suppression-list': {
    default: true,
  },
  'templates': {
    default: true,
  },
  'transmissions': {
    default: true,
  },
  'webhooks': {
    default: true
  },
};

// TODO: recipient-lists