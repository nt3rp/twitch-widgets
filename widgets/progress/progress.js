var server = window.location.hostname + ':' + window.location.port;

var connection = window.connection = new WebSocket('ws://'+server+'/events');

connection.onopen = function () {
  // Get start and end time on connection maybe?
  // Do nothing for now... maybe send something to the server?
};

connection.onerror = function (error) {
  console.log('error');
  console.log(error);
};

connection.onmessage = function (e) {
  console.log('message');

  var data = JSON.parse(e.data);
  logProgress(data);
};


// TODO: Unhardcode start and end times
var logProgress = function(data) {
  // Put an indicator on a line
  // Position = (now - start) / (end-start)
};

// TODO: Clear / change / track symbols
// Location assumed to be a percentage value
var createIndicator = function(location) {
  return draw.line(location, 0, location, 10).stroke({width: 2})
}
