var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({
      server: server
    , path: '/events'
  }) // TODO: Other config?
  , express = require('express')
  , app = express()
  , port = 3000;

app.use(express.static('widgets'));


wss.broadcast = function (data) {
  wss.clients.forEach(function (client) {
    client.send(data);
  });
};

wss.on('connection', function (ws) {
  // var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function (e) {
    // TODO: Do things conditionally based on message type
    console.log(e);
    wss.broadcast(e)
  });

  // ws.send('something');
});

server.on('request', app);
server.listen(port, "0.0.0.0", function () { console.log('Listening on ' + server.address().port) });
