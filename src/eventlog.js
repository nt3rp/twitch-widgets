var _ = require('lodash');
var moment = require('moment');
var fs = require('fs');
var events = require('../data/events')

module.exports = function(vorpal, config) {
  // TODO: Check if provided with a websocket connection
  // TODO: Handle logging, reconnecting, etc?
  // TODO: Perhaps this module is the thing that should be wrapped, not the individual commands?
  var websocket = config.websocket;

  var CONFIG_MESSAGE = 'config';
  var EVENT_MESSAGE = 'event';

  var defaults = {
    topics: ['eventlog']
  };

  // TODO: Send timestamp?
  var send = function(data) {
    return websocket.send(JSON.stringify(data));
  }

  // Save progress
  // Load progress
  // Configure

  // TODO: timestamp
  // TODO: Fix description
  // TODO: Show in progress or achievement (either, or, both)

  vorpal
    .command('log [name]', 'Log an event in time')
    .autocomplete(_.map(events, 'id'))
    .option('-n, --name <name>', 'Name of event')
    .option('-d, --description <description>', 'Description of event')
    .option('-t, --tags <tags...>', 'Tags of event')
    .action(function(args, callback) {
      var event = _.find(events, {id: args.name});

      // Must be a custom event
      if (!event) {
        event = {
          name: args.options.name || '',
          description: args.options.description || '',
          tags: args.options.tags || []
        };
      }

      send(_.merge({type: EVENT_MESSAGE, topics: defaults.topics}, event));
      callback();
    });
};
