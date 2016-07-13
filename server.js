var config = require('./config')
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: config.port });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // ws.send('something');
  });
});

wss.broadcast = function(data) {
  wss.clients.forEach(function(client) {
    client.send(data);
  });
};

module.exports = wss
