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

  var msg = JSON.parse(e.data);

  if (!msg.topics.includes(topic)) {
    return
  }

  switch (msg.type) {
    default:
      initialize(msg.data);
  }
};

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

// var MENU_STYLES = ['default', 'green', 'blue']
