var server = window.location.hostname + ':' + window.location.port;
var connection = window.connection = new WebSocket('ws://'+server+'/events');
var topic = 'party';

connection.onopen = function () {
  // Do nothing for now... maybe send something to the server?
};

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

  // TODO: Probably need more distinction between things...
  switch (data.type) {
    case 'config':
      initialize(data.party);
    break;
    default:
      change(data.party);
  }
};

var partyData = {};
var partyList = document.querySelector('#party');
var templateStr = document.querySelector('#template-player').innerHTML.trim();
var template = _.template(templateStr, {'variable': 'data'});

var strToHtml = function(html) {
  var parser = new DOMParser()
    , doc = parser.parseFromString(html, "text/html");
  return doc.querySelector('body').firstChild;
}

var reset = function() {
  document.querySelectorAll('.player').forEach(function(node) {node.parentNode.removeChild(node)});
};

var initialize = function(party) {
  reset();

  party.forEach(function(player){
    var html = template(player)
    partyList.appendChild(strToHtml(html));
  });
}

var change = function(party) {
  party.forEach(function(player){
    updatePlayer(player);
  });
};

// TODO: Need to handle adds + removes, not just changes
// TODO: Add actual playtime clock
var updatePlayer = function(changes) {
  // Stop any existing ticking
  // Update the playtime to the server value
  // start the ticker again, if active
  var html = template(changes)
  var ui = document.querySelector('#' + changes.id);
  if (ui) {
    ui.parentNode.replaceChild(strToHtml(html), ui);
  }
};

// var MENU_STYLES = ['default', 'green', 'blue']
