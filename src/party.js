var _ = require('lodash');
var moment = require('moment');
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
      var now = new Date();
      jsParty.forEach(function(member) {
        member.playtimes = member.playtimes || [];
        member.playtimes = member.playtimes.map(function(playtime) {
          return new Date(playtime);
        });
      });
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
    .command('party show [id]', 'Show details of a player')
    .action(function(args, callback) {
      var that = this;
      var target = (args.id) ? [_.find(party, {'id': args.id})] : party;
      target.forEach(function(member) {
        that.log(member);
      });
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
    .option('--reset-airtimes', 'Reset airtimes')
    .action(function(args, callback) {
      if (args.options.inactive) {
        args.options.active = false;
        delete args.options.inactive;
      }

      if (args.options.deanimate) {
        args.options.animate = false;
        delete args.options.deanimate;
      }

      var now = new Date();
      var target = (args.id) ? [_.find(party, {'id': args.id})] : party;
      target.forEach(function(member) {
        if (args.options['reset-airtimes']) {
          member.playtimes = [now];
        }

        if ((args.options.active === false && member.active === true) ||
            (args.options.active === true && !member.active)) {
          member.playtimes.push(now)
        }
        Object.assign(member, args.options);
      });

      send({
        "type":   EVENT_MESSAGE,
        "topics": defaults.topics,
        "party":  target
      });
      callback();
    });

  vorpal
    .command('party airtime [id]', 'Find the airtime of a player')
    .action(function(args, callback) {
      var that = this;
      var target = (args.id) ? [_.find(party, {'id': args.id})] : party;

      target.forEach(function(member) {
        var airtime = _(member.playtimes).chunk(2).map(function(pair) {
          var end = _.nth(pair, 1) || new Date();
          var start = _.first(pair);
          return end - start;
        }).sum()
        that.log(`${member.name}: ${moment.utc(airtime).format('HH:mm:ss.SSS')}`);
      });
      callback();
    });
};
