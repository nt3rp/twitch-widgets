var server = window.location.hostname + ':' + window.location.port;
var connection = window.connection = new WebSocket('ws://'+server+'/events');
var topic = 'party';

var msToTime = function(ms) {
  var seconds = ms / 1000;
  var date = new Date(null);
  date.setSeconds(seconds);
  var hours = Math.floor(seconds / 3600);
  var dateStr = hours + date.toISOString().substr(13, 6);
  return (hours < 10 ? "0" : "") + dateStr;
};

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
      initialize(msg.data);
      break;
    case "style":
      break;
  }
};

var partyList = document.querySelector('#party');
var templateStr = document.querySelector('#template-player').innerHTML.trim();
var template = _.template(templateStr, {variable: 'data', time: msToTime});
var interval;

var strToHtml = function(html) {
  var parser = new DOMParser()
    , doc = parser.parseFromString(html, "text/html");
  return doc.querySelector('body').firstChild;
}

var reset = function() {
  document.querySelectorAll('.player').forEach(function(node) {node.parentNode.removeChild(node)});
  clearInterval(interval);
};

var initialize = function(party) {
  reset();

  party.forEach(function(player){
    var html = template(player)
    partyList.appendChild(strToHtml(html));
  });

  interval = setInterval(tick, 1000);
}

var tick = function() {
  document.querySelectorAll('.player:not(.inactive) .playtime').forEach(function(node) {
    var playtime = parseInt(node.dataset.playtime, 10);
    node.innerHTML = msToTime(playtime);
    playtime += 1000;
    node.dataset.playtime = playtime;
  });
}


// var MENU_STYLES = ['default', 'green', 'blue']
