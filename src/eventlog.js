var _ = require('lodash');
var moment = require('moment');
var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');
var utils = require('./utils');

module.exports = function(vorpal, config) {
  var websocket = config.websocket;
  var log = config.log;

  var CONFIG_MESSAGE = 'config';
  var EVENT_MESSAGE = 'event';

  var defaults = {
    file: 'data/events',
  }

  var events = [];

  // TODO: Send timestamp?
  var send = function(data) {
    return websocket.send(JSON.stringify(data));
  }

  // https://github.com/helion3/lodash-addons/blob/master/src/lodash-addons.js#L803
  var slugify = function (string) {
    return _(string).toString().trim().toLowerCase().replace(/ /g, '-').replace(/([^a-zA-Z0-9\._-]+)/, '');
  }

  var reloadEvents = function(filepath) {
    var jsEvents = utils.readJsonFile(filepath || `${defaults.file}.json`);
    events = _.clone(jsEvents);
  };

  reloadEvents();

  vorpal
    .command('save-events [filepath]', 'Load events from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      utils.writeJsonFile(args.filepath || `${defaults.file}-${(new Date()).getTime()}.json`, events)
      callback();
    });

  vorpal
    .command('reload-events [filepath]', 'Load events from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      reloadEvents();
      callback();
    });

  // Save progress
  // Load progress
  // Configure

  // TODO: timestamp
  // TODO: Show in progress or achievement (either, or, both)
  // TODO: Toggle show / hide of different timeline events

  vorpal
    .command('log [event]', 'Log an event in time')
    .autocomplete({data: function() {return _.map(events, 'id');}})
    .option('-n, --name <name>', 'Name of event')
    .option('-d, --description <description>', 'Description of event')
    .option('-t, --tags <tags>', 'Tags of event. Space-separated string.')  // Variadic args not supported on tags
    .validate(function(args) {
      if (_.isEmpty(args.event) && _.isEmpty(args.options)) {
        return "You must specify an 'event' or provide details. Try --help";
      }

      if(_.isEmpty(args.event) && !args.options.name) {
        return "Must specify a name if creating an event";
      }
    })
    .action(function(args, callback) {
      var event = _.find(events, {id: args.event});

      // Must be a custom event
      if (!event) {
        event = {
          id: slugify(args.options.name),
          name: args.options.name || '',
          description: args.options.description || '',
          tags: (args.options.tags || '').split(' ') || []
        };
        events.push(event);
      }

      log.info({
        'command': 'log [event]',
        'args': args
      });

      send(_.merge({type: EVENT_MESSAGE}, event));
      callback();
    });
};
