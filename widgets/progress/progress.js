var server = window.location.hostname + ':' + window.location.port;
var connection = window.connection = new WebSocket('ws://'+server+'/events');
var topic = 'progress';

connection.onopen = function () {};

connection.onerror = function (error) {
  console.log('error');
  console.log(error);
};

connection.onmessage = function (e) {
  console.log('message');

  // TODO: Check if data!
  var data = JSON.parse(e.data);

  // check if event is in list of subscribed topics
  // for now, only allow subscribing to one topic
  if (!data.topics.includes(topic)) {
    return
  }

  logProgress(data);
};


var $chart = $('.chart');

// TODO: Unhardcode start and end times
// TODO: Clear / change / track symbols
var logProgress = function(data) {
  // Put an indicator on a line
  // Position = (now - start) / (end-start)
  // switch on message type. If config message, do that
  var location = Math.ceil(Math.random()*100) + '%';
  console.log(location);
  createIndicator(location, 'cursor.png');
};

var createIndicator = function(location, image, tags) {
  tags = tags || [];

  var $content = $('<div>', {
    class: 'contents'
  });
  $content.html('testing')

  var $indicator = $('<div />', {
    class: 'marker'
  });

  $indicator.append($content);

  // TODO: Better way of handling image positioning here?
  // TODO: Doesn't work as well with divs :/
  var containerWidth = $indicator.get(0).width || $indicator.width() || 0;
  var imageWidth = Math.ceil(containerWidth/2) || 0;
  $indicator.css({left: 'calc(' + location + ' - ' + imageWidth + 'px)'})
  $indicator.addClass(tags.join(' '));

  $chart.append($indicator);
}

// TODO: Handle overlapping events / grouping
// TODO: Use spritesheet
// TODO: Preload all images / indicators
// TODO: Handle connection failures
// TODO: Handle animation
// TODO: Use ':after' to show arrow to point at line
