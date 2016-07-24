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

  switch (data.type) {
    case 'config':
      initialize(data.party);
    break;
    default:
      //do something
  }
};

var partyList = document.querySelector('#party');
var templateStr = document.querySelector('#template-player').innerHTML.trim();
var template = _.template(templateStr);

var strToHtml = function(html) {
  var parser = new DOMParser()
    , doc = parser.parseFromString(html, "text/html");
  return doc.querySelector('body').firstChild;
}

var initialize = function(party) {


  party.forEach(function(player){
    var html = template(player)
    partyList.appendChild(strToHtml(html));
  });
}

// var MENU_STYLES = ['default', 'green', 'blue']
