var achievements = require('./achievements');
var vorpal = require('vorpal')();

// TODO: Should this be started separately?
var WebSocketServer = require('./server')
var wss = new WebSocketServer();
wss.listen();

// TODO: Make pretty

vorpal
  .command('achievement [name]', 'Trigger a named achievement') // .option('-l, --list')
  .autocomplete(Object.keys(achievements))
  .action(function(args, callback) {
    var achievement = achievements[args.name];
    wss.broadcast(achievement);
    callback();
  });

// TODO: Progress events
// TODO: Generic event
// TODO: Bake event recording into the server

vorpal
  .delimiter('twitch-widgets >')
  .show();

// TODO: Connect to Server
// TODO: Send events to all clients
