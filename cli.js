var _ = require('lodash');
var fs = require('fs');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/history.log' });
winston.remove(winston.transports.Console);

var vorpal = require('vorpal')();
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:3000/events');

ws.on('message', function(data) {
  var msg = JSON.parse(data);
  if (msg.type !== "CLI") return;
  vorpal.log("Received command from web: " + msg.command);
  vorpal.execSync(msg.command);
})

vorpal.use(require('./src/eventlog'), {websocket: ws, log: winston});
vorpal.use(require('./src/party'), {websocket: ws, log: winston});
vorpal.use(require('./src/guest'), {websocket: ws, log: winston});

vorpal
  .delimiter('twitch-widgets >')
  .history('twitch-widgets')
  .show();
