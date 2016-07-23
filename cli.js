// TODO: CLEAN THIS SHIT UP
// TODO: Move all these todos into one file, prioritize
// TODO: SVG.js is too low level

var _ = require('lodash')
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/history.log' });
winston.remove(winston.transports.Console);

var achievements = require('./achievements');
var milestones = require('./milestones');
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
// TODO: with universal events, maybe have the first instance of something trigger an achievement? 'is_achievable'?
// TODO: How to do options with arguments (not just flags)

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
    // TODO: Dollar amount progres? Probably easier
    // TODO: Could possibly automatically pull in these values
    // TODO: Flag to toggle view between cash and game progress... or several different states
    // TODO: Flag to change 'in progress' cursor
    // TODO: Flag for up vs down
    var milestone = _.find(milestones, {id: args.name});
    ws.send(JSON.stringify(milestone));
    callback();
  });

// TODO: Generic event

vorpal.on('client_command_executed', function(cmd) {
  winston.info(cmd.command);
})

vorpal
  .delimiter('twitch-widgets >')
  .history('twitch-widgets')
  .show();
