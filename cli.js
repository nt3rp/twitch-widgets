var _ = require('lodash');
var fs = require('fs');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/history.log' });
winston.remove(winston.transports.Console);

var vorpal = require('vorpal')();
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:3000/events');

vorpal.use(require('./src/eventlog'), {websocket: ws})
vorpal.use(require('./src/party'), {websocket: ws})

vorpal.on('client_command_executed', function(cmd) {
  winston.info(cmd.command);
})

vorpal
  .delimiter('twitch-widgets >')
  .history('twitch-widgets')
  .show();
