var _ = require('lodash');
var fs = require('fs');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/history.log' });
winston.remove(winston.transports.Console);

var achievements = require('./data/achievements');
var milestones = require('./data/milestones');
var vorpal = require('vorpal')();
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:3000/events');

vorpal
  .command('achievement [name]', 'Trigger a named achievement') // .option('-l, --list')
  .autocomplete(_.map(achievements, 'id'))
  .action(function(args, callback) {
    var achievement = _.find(achievements, {id: args.name});
    ws.send(JSON.stringify(achievement));
    callback();
  });

vorpal
  .command('progress [milestone]', 'Trigger a named milestone') // .option('-l, --list')
  .autocomplete(_.map(milestones, 'id'))
  .action(function(args, callback) {
    var milestone = _.find(milestones, {id: args.milestone});
    ws.send(JSON.stringify(milestone));
    callback();
  });

  vorpal
    .command('party load', 'Load the party from a file') // .option('-l, --list')
    .action(function(args, callback) {
      // TODO: Is there a way to read a file as JSON?
      // TODO: Keep a record of the actual party somewhere so that we can autocomplete
      var party = fs.readFileSync(__dirname + '/data/party.json', {encoding: 'utf8'});
      ws.send(JSON.stringify({
        "type":   "config",
        "topics": ["party"],
        "party":   JSON.parse(party)
      }));
      callback();
    });

vorpal
  .command('party remove <id>', 'Take actions on the party') // .option('-l, --list')
  .action(function(args, callback) {
    ws.send(JSON.stringify({
      "type":   "event",
      "topics": ["party"],
      "party":  [{id: args.id, 'active': false}]
    }));
    callback();
  });

vorpal
  .command('party add <id>', 'Take actions on the party') // .option('-l, --list')
  .action(function(args, callback) {
    ws.send(JSON.stringify({
      "type":   "event",
      "topics": ["party"],
      "party":  [{id: args.id, 'active': true}]
    }));
    callback();
  });

vorpal.on('client_command_executed', function(cmd) {
  winston.info(cmd.command);
})

vorpal
  .delimiter('twitch-widgets >')
  .history('twitch-widgets')
  .show();
