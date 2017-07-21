var fsAutocomplete = require('vorpal-autocomplete-fs');
var Party = require('./party-utils');

module.exports = function(vorpal, config) {
  var websocket = config.websocket;
  var log = config.log;
  var party = new Party({websocket: websocket});

  vorpal
    .command('party load [filepath]', 'Load party from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      party.load(args.filepath);
      callback();
    });

  vorpal
    .command('party save [filepath]', 'Save party to JSON')
    .action(function(args, callback) {
      party.save(args.filepath);
      callback();
    });

  vorpal
    .command('party show [id]', 'Show details of a player')
    .autocomplete({data: function() { return party.autocomplete() } })
    .action(function(args, callback) {
      var that = this;
      party.findPlayers(args.id).forEach(function(player) {
        that.log(player.repr());
      })
      callback();
    });

  vorpal
    .command('party edit [id]', 'Take actions on the party')
    // .allowUnknownOptions() – Not released yet
    .option('--animate', 'Enable animations')
    .option('--deanimate', 'Disable animations')
    .option('-s, --status <status>', 'Out-of-game status', ['asleep', 'confused'])
    .option('-a, --active', 'On stream')
    .option('-i, --inactive', 'Off stream')
    .option('-n, --name <name>', 'Displayed name')
    .option('-o, --group <group>', 'Displayed org')
    .option('-c, --contact <contact>', 'Displayed contact')
    .option('--resetPlaytime', 'Reset playtime')
    .autocomplete({data: function() { return party.autocomplete() } })
    .validate(function(args) {
      if (Object.keys(args.options).length === 0) {
        return "You must provide details about your changes. Try --help"
      }
    })
    .action(function(args, callback) {
      if (args.options.inactive) {
        args.options.active = false;
        delete args.options.inactive;
      }

      if (args.options.deanimate) {
        args.options.animate = false;
        delete args.options.deanimate;
      }

      party.editPlayer(args.id, args.options);

      log.info({
        'command': 'party edit [id]',
        'args': args,
        'party': party.repr()
      });

      callback();
    });
};
