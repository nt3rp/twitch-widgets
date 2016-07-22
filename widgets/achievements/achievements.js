// TODO: How to know what to connect to?
// If accessed elsewhere on the network, won't be 'localhost'
var connection = window.connection = new WebSocket('ws://localhost:3000/events');

connection.onopen = function () {
  // Do nothing for now... maybe send something to the server?
};

connection.onerror = function (error) {
  console.log('error');
  console.log(error);
};

connection.onmessage = function (e) {
  console.log('message');

  var data = JSON.parse(e.data);
  console.log(data);
};
