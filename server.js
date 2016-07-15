var http = require('http')
var WebSocketServer = require('ws').Server;

// TODO: obtain config
var server = http.createServer();
var wss = new WebSocketServer({server: server, path: '/events'});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // TODO: Special action if message is 'rebroadcast'
    console.log('received: %s', message);
  });
});

server.listen(3000);
//
// WebSocketServer.prototype.broadcast = function(e) {
//   this.wss.clients.forEach(function(client) {
//     client.send(e);
//   });
// }
