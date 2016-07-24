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

// TODO: Unhardcode start and end times
var $chart = $('.chart');
var start = new Date(2016, 6, 24, 10, 0, 0);
var end = new Date(2016, 6, 24, 15, 0, 0);

// TODO: Clear / change / track symbols
var logProgress = function(data) {
  var icon = '';
  var label = '';
  var now = new Date();
  var position = ((now - start)*100) / (end-start) + '%'

  // This should probably be managed by classes, but for now, we only have a small set of icons to handle

  if (data.tags) {
    if (!data.tags.includes('game')) {
      label = data.name
    } else if (data.tags.includes('ending')) {
      icon = 'lavos.png'
    } else if (data.tags.includes('game')) {
      icon = 'nu.png'
    }
  }

  createIndicator({
    position: position,
    label: label,
    icon: icon
  });
};

var createIndicator = function(config) {
  var position = config.position || '0%';
  var icon = config.icon || false;
  var label = config.label || false;

  if (!(label || icon)) {
    return;
  }

  var $content = $('<div>', {class: 'contents'});
  if (icon) {
    $content.append($('<img />', {src: icon, class: 'icon'}));
  }
  if (label) {
    $content.append($('<span />', {class: 'label', text: label}))
  }

  var $indicator = $('<div />', {class: 'marker'});
  $indicator.append($content);

  $indicator.css('visibility', 'hidden')
  $chart.append($indicator);

  // Bug: Need to calculate image size properly
  // for now, assume all images are 48px wide... and fix later
  var containerWidth = $indicator.width() || 0;
  if (icon) {
    containerWidth += 48;
  }
  var width = Math.ceil(containerWidth/2) || 0;
  $indicator.css({left: 'calc(' + position + ' - ' + width + 'px)'})

  $indicator.css('visibility', 'visible')
}

// TODO: Handle overlapping events / grouping
// TODO: Use spritesheet
// TODO: Preload all images / indicators
// TODO: Handle connection failures
// TODO: Handle animation
// TODO: Use ':after' to show arrow to point at line
