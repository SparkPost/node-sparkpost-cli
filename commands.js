'use strict';

const _ = require('lodash');
const crudSubcommands = require('./lib/helpers').crudSubcommands;
const crudMap = require('./lib/helpers').crudMap;
const checkAPIKey = require('./lib/helpers').checkAPIKey;

module.exports = {
  'config': require('./commands/config'),

  'inbound-domains': require('./commands/inbound-domains'),

  'message-events': {
    default: true,
    commands: {
      search: {
        options: {'bounce_classes': {type: 'array'}, 'campaign_ids': {type: 'array'}, 'delimiter': {}, 'events': {type: 'array'}, 'friendly_froms': {type: 'array'}, 'from': {type: 'date'}, 'message_ids': {type: 'array'}, 'page': {type: 'number'}, 'per_page': {type: 'number'}, 'reason': {}, 'recipients': {type: 'array'}, 'subaccounts': {type: 'array'}, 'template_ids': {type:'array'}, 'timezone': {}, 'to': {type: 'date'}, 'transmission_ids': {type: 'array'}},
        map: crudMap
      }
    }
  },

  'relay-webhooks': crudSubcommands({
    command: 'relay-webhooks',
    commands: ['create', 'update', 'get', 'delete'],
    options: ['name', 'target', 'auth_token', 'match.protocol', 'match.domain', 'match.esme_address']
  }, { default: true }),

  'sending-domains': crudSubcommands({
    command: 'sending-domains',
    id: 'domain',
    commands: ['create', 'update', 'verify', 'get', 'delete'],
    options: {'domain': {}, 'tracking_domain': {}, 'dkim.signing_domain': {}, 'dkim.private': {}, 'dkim.public': {}, 'dkim.selector': {}, 'dkim.headers': {}, 'generate_dkim': {type: 'boolean'}, 'dkim_key_length': {type: 'number'}, 'shared_with_subaccounts': {type: 'boolean'}},
    verify_options: { 'dkim_verify': { type: 'boolean' }, 'spf_verify': { type: 'boolean' }, 'postmaster_at_verify': { type: 'boolean' }, 'abuse_at_verify': { type: 'boolean' }, 'postmaster_at_token': {}, 'abuse_at_token': {} }
  }, { default: true }),

  'subaccounts': crudSubcommands({
    command: 'subaccounts',
    commands: ['create', 'update', 'get'],
    create_options: { 'name': {}, 'key_label': {}, 'key_grants': { type: 'array' }, 'key_valid_ips': { type: 'array' }, 'ip_pool': {} },
    update_options: {'name': {}, 'status': {choices: ['active', 'suspended', 'terminated']}, 'ip_pool': {}}
  }, { default: true }),

  'webhooks': crudSubcommands({
    command: 'webhooks',
    commands: ['create', 'update', 'get', 'delete', 'list', 'validate', 'get-batch-status', 'get-documentation', 'get-samples'],
    options: { 'name': {}, 'target': {}, 'events': { type: 'array' }, 'auth_type': {}, 'auth_request_details': {}, 'auth_credentials': {}, 'auth_token': {} },
    validate_options: ['message'],
    filters: ['timezone'],
    'get-batch-status_filters': ['limit'],
    'get-samples_filters': ['events'],
  }, { default: true }),

  'account': {
    describe: 'Get account information',
    action: function(callback) {
      if (checkAPIKey(this.sparkpost)) {
        this.sparkpost.request({
          uri: 'account'
        }, callback);
      }
    }
  },
};

// TODO: recipient-lists, suppression-list, templates, transmissions
// CUSTOM COMMANDS: bounce-domains, ip-pools, metrics, sending-ips, tracking-domains
