var _ = require('lodash')
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/history.log' });
winston.remove(winston.transports.Console);

var achievements = require('./achievements');
var vorpal = require('vorpal')();
var WebSocket = require('ws');

// TODO: Is there something like a procfile for Nodejs?
// TODO: Don't hardcode this
var ws = new WebSocket('ws://localhost:3000/events');

// TODO: Handle server stoppage / errors / reconnect

// TODO: Make pretty
// TODO: Auto-serve widgets somehow? (i.e. each different endpoint automatically gets a thing)
// TODO: Search achievements by tag
// TODO: Colorize prompts?
// TODO: Universal 'event' interface? I.e. search for 'events' in the same way?
vorpal
  .command('achievement [name]', 'Trigger a named achievement') // .option('-l, --list')
  .autocomplete(_.map(achievements, 'id'))
  .action(function(args, callback) {
    var achievement = _.find(achievements, {id: args.name});
    ws.send(JSON.stringify(achievement));
    callback();
  });

// TODO: Progress events
// TODO: Generic event

vorpal.on('client_command_executed', function(cmd) {
  winston.info(cmd.command);
})

vorpal
  .delimiter('twitch-widgets >')
  .history('twitch-widgets')
  .show();
