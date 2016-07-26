var _ = require('lodash');
var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');

module.exports = function(vorpal, config) {
  // TODO: Check if provided with a websocket connection
  // TODO: Handle logging, reconnecting, etc?
  // TODO: Perhaps this module is the thing that should be wrapped, not the individual commands?
  // TODO: Keep track of party here
  var websocket = config.websocket;

  var CONFIG_MESSAGE = 'config';
  var EVENT_MESSAGE = 'event';

  var defaults = {
    file: 'data/party.json',
    topics: ['party']
  }

  var party = [];

  // TODO: Send timestamp?
  var send = function(data) {
    return websocket.send(JSON.stringify(data));
  }

  vorpal
    .command('party load [filepath]', 'Load party from JSON file')
    .autocomplete(fsAutocomplete())
    .action(function(args, callback) {
      var filepath = args.filepath || defaults.file;
      var fsParty = fs.readFileSync(filepath, {encoding: 'utf8'});
      var jsParty = JSON.parse(fsParty);
      party = _.clone(jsParty);

      send({
        "type":   CONFIG_MESSAGE,
        "topics": defaults.topics,
        "party":  party
      });
      callback();
    });

  vorpal
    .command('party save [filepath]', 'Save party to JSON')
    .action(function(args, callback) {
      var filepath = args.filepath || defaults.file;
      fs.writeFileSync(filepath, JSON.stringify(party, null, 2));
      callback();
    });

  vorpal
    .command('party edit [id]', 'Take actions on the party')
    // .allowUnknownOptions() – Not released yet
    .option('-s, --status <status>', 'Out-of-game status', ['asleep', ''])
    .option('-a, --active', 'On-stream; if not present, assumed to be off-stream')
    .option('-n, --name <name>', 'Displayed name')
    .option('-o, --group <group>', 'Displayed org')
    .option('-c, --contact <contact>', 'Displayed contact')
    .action(function(args, callback) {
      args.options.active = args.options.active || false;

      var target = (args.id) ? [_.find(party, {'id': args.id})] : party;
      target.forEach(function(member) {
        Object.assign(member, args.options);
      });

      send({
        "type":   EVENT_MESSAGE,
        "topics": defaults.topics,
        "party":  target
      });
      callback();
    });
};
