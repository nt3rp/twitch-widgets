var server = window.location.hostname + ':' + window.location.port;

var connection = window.connection = new WebSocket('ws://'+server+'/events');

connection.onopen = function () {};

connection.onerror = function (error) {
  console.log('error');
  console.log(error);
};

connection.onmessage = function (e) {
  console.log('message');

  var data = JSON.parse(e.data);
  logProgress(data);
};


var $chart = $('.chart');

// TODO: Unhardcode start and end times
// TODO: Clear / change / track symbols
var logProgress = function(data) {
  // Put an indicator on a line
  // Position = (now - start) / (end-start)

  // switch on message type. If config message, do that
};

var createIndicator = function(location, image) {
  var $indicator = $('<img />', {
    src  : image,
    class: 'indicator'
  });

  // TODO: Better way of handling image positioning here?
  var imageWidth = Math.ceil($indicator.get(0).width/2);
  $indicator.css({left: 'calc(' + location + ' - ' + imageWidth + 'px)'})

  $chart.append($indicator);
}

// TODO: Preload all images / indicators
// TODO: Handle connection failures
// TODO: Handle animation
// TODO: Use ':after' to show arrow to point at line
