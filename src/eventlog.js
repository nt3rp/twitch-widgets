var fsAutocomplete = require('vorpal-autocomplete-fs');
var EventManager = require('./event-utils');

module.exports = function(vorpal, config) {
  var websocket = config.websocket;
  var log = config.log;
  var events = new EventManager({websocket: websocket});
  events.load();

  vorpal
    .command('events save [filepath]', 'Load events from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      events.save(args.filepath);
      callback();
    });

  vorpal
    .command('events load [filepath]', 'Load events from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      events.load(args.filepath);
      callback();
    });

  vorpal
    .command('events show [id]', 'Show details of an event')
    .autocomplete({data: function() { return events.autocomplete() } })
    .action(function(args, callback) {
      this.log(events.find(args.id))
      callback();
    });

  // TODO: timestamp
  // TODO: Show in progress or achievement (either, or, both)
  // TODO: Toggle show / hide of different timeline events

  vorpal
    .command('events log [id]', 'Log an event in time')
    .autocomplete({data: function() {return events.autocomplete();}})
    .option('-n, --name <name>', 'Name of event')
    .option('-d, --description <description>', 'Description of event')
    .option('-t, --tags <tags>', 'Tags of event. Space-separated string.')  // Variadic args not supported on tags
    .validate(function(args) {
      if (!args.id && Object.keys(args.options).length === 0) {
        return "You must specify an 'id' or provide details. Try --help";
      }

      if(!args.id && !args.options.name) {
        return "Must specify a name if creating an event";
      }
    })
    .action(function(args, callback) {
      events.log(Object.assign(args, args.options));
      log.info({
        'command': 'log [id]',
        'args': args
      });
      callback();
    });
};
