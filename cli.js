var achievements = require('./achievements');
var vorpal = require('vorpal')();
var WebSocket = require('ws');

// TODO: Is there something like a procfile for Nodejs?
// TODO: Don't hardcode this
var ws = new WebSocket('ws://localhost:3000/events');

// TODO: Handle server stoppage / errors / reconnect

// TODO: Make pretty

// TODO: Auto-serve widgets somehow? (i.e. each different endpoint automatically gets a thing)

// TODO: Search achievements by tag
// TODO: list all achievements
// TODO: Fix bug where not specifying name doesn't show help information
// TODO: Add history
vorpal
  .command('achievement [name]', 'Trigger a named achievement') // .option('-l, --list')
  .autocomplete(Object.keys(achievements))
  .action(function(args, callback) {
    var achievement = achievements[args.name];

    // Have to send string data.
    // TODO: Any way to avoid?
    ws.send(JSON.stringify(achievement));
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
