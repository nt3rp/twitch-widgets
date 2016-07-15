var vorpal = require('vorpal')();

// TODO: Get achievements from JSON file

vorpal
  .command('achievement [name]', 'Trigger a named achievement') // .option('-l, --list')
  .autocomplete(['ending-1', 'ending-2'])
  .action(function(args, callback) {
    this.log(args);
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
