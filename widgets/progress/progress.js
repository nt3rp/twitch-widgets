// TODO: Augment base widget 'class'?

var ProgressWidget = (function(w, $, _) {
  var me = {}
    , topic = 'progress'
    , $chart = $('.chart')
    , $curr = $('#current')
    , start = new Date(2016, 6, 24, 10, 0, 0)
    , end = new Date(2016, 6, 24, 15, 0, 0);

  me.getWSHost = function() {
    return w.location.hostname + ':' + w.location.port;
  };

  me.getWebSocketConnection = function () {
    // TODO: What about existing connection;
    var host = this.getWSHost();
    return new WebSocket('ws://'+host+'/events');
  };

  me.onError = function() {
    // TODO: Send the error back to the server for logging?
  };
  me.onOpen = function() {};

  me.onMessage = function(msg) {
    var data = JSON.parse(msg.data);

    if (_.isEmpty(data) || !_.includes(data.topics, topic)) {
      return
    }

    // Deal with configuration message, especially for setting up progress bar

    this.logProgress(data);
  };



  // TODO: Clear / change / track symbols
  me.logProgress = function (data) {
    var icon = ''
      , label = ''
      , now = new Date()
      , position = ((now - start)*100) / (end-start) + '%';

    // This should probably be managed by classes,
    // but for now, we only have a small set of icons to handle
    if (data.tags) {
      if (!_.includes(data.tags, 'game')) {
        label = data.name
      } else if (_.includes(data.tags, 'boss')) {
        icon = data.id
      }
    }

    this.createIndicator({
      position: position
      , label: label
      , icon: icon
    });
  };

  me.createIndicator = function (config) {
    var position = config.position || '0%';
    var icon = config.icon || false;
    var label = config.label || false;

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
  };

  me.drawTicks = function() {
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

  me.init = function() {
    this.connection = this.getWebSocketConnection();
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);

    this.drawTicks();
  };

  me.init();

  return me;
}(window, jQuery, lodash));

// TODO: Handle overlapping events / grouping
// TODO: Use spritesheet
// TODO: Preload all images / indicators
// TODO: Handle connection failures
// TODO: Handle animation
// TODO: Use ':after' to show arrow to point at line
