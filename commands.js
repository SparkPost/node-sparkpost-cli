'use strict';

module.exports = [
  require('./commands/config'),
  require('./commands/launchpad'),
  {
    command: 'inbound-domains',
    default: true,
    commands: [
      {
        command: 'create',
        options: {
          domain: { demand: true }
        }
      }
    ]
  },
  {
    command: 'inbound-domains',
    default: true,
  },
  {
    command: 'message-events',
    default: true,
  },
  {
    command: 'recipient-lists',
    default: true,
  },
  {
    command: 'relay-webhooks',
    default: true,
  },
  {
    command: 'sending-domains',
    default: true,
  },
  {
    command: 'subaccounts',
    default: true,
  },
  {
    command: 'suppression-list',
    default: true,
  },
  {
    command: 'templates',
    default: true,
  },
  {
    command: 'transmissions',
    default: true,
  },
  {
    command: 'webhooks',
    default: true,
  },
];