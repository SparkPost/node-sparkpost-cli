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
        options: ['bounce_classes', 'campaign_ids', 'delimiter', 'events', 'friendly_froms', 'from', 'message_ids', 'page', 'per_page', 'reason', 'recipients', 'subaccounts', 'template_ids', 'timezone', 'to', 'transmission_ids'],
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
    options: ['domain', 'tracking_domain', 'dkim.signing_domain', 'dkim.private', 'dkim.public', 'dkim.selector', 'dkim.headers', 'generate_dkim', 'dkim_key_length', 'shared_with_subaccounts'],
    verify_options: { 'dkim_verify': { type: 'boolean' }, 'spf_verify': { type: 'boolean' }, 'postmaster_at_verify': { type: 'boolean' }, 'abuse_at_verify': { type: 'boolean' }, 'postmaster_at_token': {}, 'abuse_at_token': {} }
  }, { default: true }),

  'subaccounts': crudSubcommands({
    command: 'subaccounts',
    commands: ['create', 'update', 'get'],
    create_options: { 'name': {}, 'key_label': {}, 'key_grants': { type: 'array' }, 'key_valid_ips': { type: 'array' }, 'ip_pool': {} },
    update_options: ['name', 'status', 'ip_pool']
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

  'suppression-list': crudSubcommands({
    command: 'suppression-list',
    id: 'recipient',
    commands: ['upsert', 'get', 'delete', 'list'],
    options: {'recipients': { describe: 'A JSON array of recipients' } },
    filters: ['to', 'from', 'domain', 'cursor', 'limit', 'per_page', 'page', 'sources', 'types', 'description'],
    get_filters: []
  }, {
    default: true,
    commands: {
      upsert: {
        map: (keys, values) => values
      }
    }
  }),

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

// TODO: recipient-lists, templates, transmissions
// CUSTOM COMMANDS: bounce-domains, ip-pools, metrics, sending-ips, tracking-domains
