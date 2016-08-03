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

  // TODO: Send timestamp?
  var send = function(data) {
    return websocket.send(JSON.stringify(data));
  }

  // TODO: tie into achievements? Difference?
  // Log named event
  // Log unnamed event
  // Save progress
  // Load progress
  // Configure

  // Very similar to achievements...

  vorpal
    .command('log [name]', 'Log an event in time')
    .autocomplete(_.map(events, 'id'))
    .action(function(args, callback) {
      var event = _.find(events, {id: args.name});
      send(_.merge(event, {'type': EVENT_MESSAGE}));
      callback();
    });
};
