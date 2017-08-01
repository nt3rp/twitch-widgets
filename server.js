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

app.get('/cli', function (request, response) {
  msg = {
    type: "CLI",
    command: request.query.cmd
  };
  wss.broadcast(JSON.stringify(msg))
  response.send(msg)
})

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
    // TODO: Should this just be another app that connects to the server?
    wss.broadcast(e)
  });

  // TODO: Send relevant event information to everything (e.g. start and end times)
  // Config options?
  // ws.send('something');
});

server.on('request', app);
server.listen(port, "0.0.0.0", function () { console.log('Listening on ' + server.address().port) });
