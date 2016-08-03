var _ = require('lodash');
var fs = require('fs');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/history.log' });
winston.remove(winston.transports.Console);

var achievements = require('./data/achievements');
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

vorpal.use(require('./src/eventlog'), {websocket: ws})
vorpal.use(require('./src/party'), {websocket: ws})

vorpal.on('client_command_executed', function(cmd) {
  winston.info(cmd.command);
})

vorpal
  .delimiter('twitch-widgets >')
  .history('twitch-widgets')
  .show();
