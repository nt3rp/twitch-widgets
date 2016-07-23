var server = window.location.hostname + ':' + window.location.port;

var connection = window.connection = new WebSocket('ws://'+server+'/events');

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

var MENU_STYLES = ['default', 'green', 'blue']

var showAchievement = function(achievement, data) {
  var image = achievement.querySelector('.image');
  var name = achievement.querySelector('.name');
  var description = achievement.querySelector('.description');
  var border = achievement.querySelector('.border');

  var style = data.style;

  name.innerText = data.name;
  description.innerText = data.description;

  MENU_STYLES.forEach(function(style) {
      border.classList.remove(style);
  })

  border.classList.add(style);
  achievement.classList.add('show');

  setTimeout(function() {
    achievement.classList.remove('show');
    achievement.classList.add('hide');
  }, 5000)
};

// TODO: Handle achievement stacking
var showAchievements = function(data) {
  var achievements = document.querySelectorAll('.achievement');
  achievements.forEach(function(element) {
    setTimeout(function() {
      showAchievement(element, data);
    }, 3000)
  });
};
