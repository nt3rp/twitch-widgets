var server = window.location.hostname + ':' + window.location.port;
var connection = window.connection = new WebSocket('ws://'+server+'/events');
var topic = 'guest';

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

  if (!msg.topics || !msg.topics.includes(topic)) {
    return
  }

  switch (msg.type) {
    case "data":
      showGuest(msg.data);
      break;
    case "style":
      break;
  }
};

var MENU_STYLES = ['default', 'green', 'blue']

var showGuest = function(data) {
  var guest = document.querySelector('.guest');
  var name = guest.querySelector('.name');
  var twitter = guest.querySelector('.twitter');
  var website = guest.querySelector('.website');
  var border = guest.querySelector('.border');

  var style = data.style;

  name.innerText = data.name;
  twitter.innerText = data.twitter;
  website.innerText = data.website;

  MENU_STYLES.forEach(function(style) {
      border.classList.remove(style);
  })

  if (style) {
    border.classList.add(style);
  }

  generateStats(guest);
};

var generateStats = function(guest) {
  guest.querySelectorAll('.stats > div').forEach(function(element) {
    element.querySelector('.value').innerText = generateStat();
  });
}

var generateStat = function() {
  var result = Math.floor(1+Math.random()*25);
  if (result > 20) {
    return "**";
  }
  return result;
}
