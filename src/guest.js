var fsAutocomplete = require('vorpal-autocomplete-fs');
var GuestManager = require('./guest-utils');

module.exports = function(vorpal, config) {
  var websocket = config.websocket;
  var log = config.log;
  var guests = new GuestManager({websocket: websocket});
  guests.load();

  vorpal
    .command('guests save [filepath]', 'Load guests from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      guests.save(args.filepath);
      callback();
    });

  vorpal
    .command('guests load [filepath]', 'Load guests from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      guests.load(args.filepath);
      callback();
    });

  vorpal
    .command('guests show [id]', 'Show details of an event')
    .autocomplete({data: function() { return guests.autocomplete() } })
    .action(function(args, callback) {
      this.log(guests.find(args.id))
      callback();
    });

  vorpal
    .command('guests log [id]', 'Log an guest in time')
    .autocomplete({data: function() {return guests.autocomplete();}})
    .option('-n, --name <name>', 'Name of event')
    .option('-t, --twitter <twitter>', 'Twitter handle')
    .option('-w, --website <website>', 'Website')
    .validate(function(args) {
      if (!args.id && Object.keys(args.options).length === 0) {
        return "You must specify an 'id' or provide details. Try --help";
      }

      if(!args.id && !args.options.name) {
        return "Must specify a name if creating an event";
      }
    })
    .action(function(args, callback) {
      guests.log(Object.assign(args, args.options));
      log.info({
        'command': 'log [id]',
        'args': args
      });
      callback();
    });
};
