var http = require('http')
var wss = require('ws').Server;

function WebSocketServer() {
  this.server = http.createServer();
  this.wss = new wss({server: this.server, path: '/events'});

  this.wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
  });

}

WebSocketServer.prototype.listen = function() {
  this.server.listen(3000);
}

WebSocketServer.prototype.broadcast = function(e) {
  this.wss.clients.forEach(function(client) {
    client.send(e);
  });
}

module.exports = WebSocketServer
