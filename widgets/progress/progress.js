var server = window.location.hostname + ':' + window.location.port;
var connection = window.connection = new WebSocket('ws://'+server+'/events');
var topic = 'timeline';
var refreshRate = 5*60*1000;
var $chart = $('.chart')
var $curr = $('#current')
var zindex = 1;
var interval;
var start;
var end;

connection.onopen = function () {
  // Do nothing for now... maybe send something to the server?
};

connection.onerror = function (error) {
  console.log('error');
  console.log(error);
};

connection.onmessage = function (e) {
  console.log('message');

  var msg = JSON.parse(e.data);

  if (!msg.topics.includes(topic)) {
    return
  }

  switch (msg.type) {
    case "data":
      logProgress(msg.history);
      break;
    case "style":
      break;
  }
};

var calculatePosition = function(now) {
  if (!now) {
    now = new Date();
  }

  if (typeof now === "string") {
    now = new Date(now);
  }
  return ((now - start)*100) / (end-start) + '%'
}

var clearIndicators = function () {
  $('.marker:not(.tick)').remove();
};

var createIndicator = function (config) {
  var position = config.position || (config.time && calculatePosition(config.time)) || '0%';
  var icon = config.icon || false;
  var label = config.label || false;
  var id = config.id

  if (!(label || icon)) {
    return;
  }

  var $content = $('<div>', {class: 'contents'});
  if (icon) {
    $content.append($('<span />', {class: 'icon ' + icon}));
  }
  if (label) {
    $content.append($('<span />', {class: 'label', text: label}))
  }

  var $indicator = $('<div />', {class: 'marker', id: id});
  $indicator.append($content);

  $indicator.css('visibility', 'hidden')

  zindex += 1;
  $indicator.css('z-index', zindex);

  $chart.append($indicator);

  // Bug: Need to calculate image size properly
  // for now, assume all images are 48px wide... and fix later
  var containerWidth = $indicator.width() || 0;
  var width = Math.ceil(containerWidth/2) || 0;
  $indicator.css({left: 'calc(' + position + ' - ' + width + 'px)'})

  $indicator.css('visibility', 'visible')
};

var drawTicks = function() {
  // TODO: Make configurable
  [0, 4, 8, 12, 16, 20, 24].forEach(function(number){
    var position = (number*100/24) + '%';
    var $tick = $('<div />', {'class': 'marker tick', 'text': number});
    $tick.css('visibility', 'hidden');
    $chart.append($tick);
    var containerWidth = $tick.width() || 0;
    var width = Math.ceil(containerWidth/2) || 0;
    $tick.css('left', 'calc(' + position + ' - ' + width + 'px)')
    $tick.css('visibility', 'visible');
  });
};

var drawProgress = function() {
  $('#current').remove();
  createIndicator({
    position: calculatePosition()
    , icon: 'current'
    , id: 'current'
  });
};

var logProgress = function (history) {
  if (!start) {
    start = new Date();
    end = new Date();
    end.setDate(start.getDate() + 1);
  }

  clearInterval(interval);
  clearIndicators();

  history.forEach(function(event) {
    var icon = '', label = '';

    // Either icon OR label
    if (event.icon) {
      icon = event.icon;
    } else {
      label = event.name;
    }

    createIndicator({
      time: event.triggered.slice(-1)[0]
      , label: label
      , icon: icon
    });
  })

  drawProgress();

  interval = setInterval(function() {
    drawProgress();
  }, refreshRate)
};

drawTicks();
