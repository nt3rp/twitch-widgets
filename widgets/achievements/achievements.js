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
  showAchievements(data);
};

var showAchievement = function(achievement, data) {
  var image = achievement.querySelector('.image');
  var title = achievement.querySelector('.name');

  title.innerText = data.name;
  achievement.classList.add('show');

  setTimeout(function() {
    achievement.classList.remove('show');
  }, 5000)
};

// TODO: Handle achievement stacking
var showAchievements = function(data) {
  var achievements = document.querySelectorAll('.achievement');
  achievements.forEach(function(element) {
    showAchievement(element, data);
  });
};
