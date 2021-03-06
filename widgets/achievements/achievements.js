var server = window.location.hostname + ':' + window.location.port;
var connection = window.connection = new WebSocket('ws://'+server+'/events');
var topic = 'achievement';

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
      showAchievements(msg.data);
      break;
    case "style":
      break;
  }
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

  image.className = 'image';
  if (data.icon) {
    image.classList.add(data.icon);
  }

  if (style) {
    border.classList.add(style);
  }
  achievement.classList.add('show');

  setTimeout(function() {
    achievement.classList.remove('show');
    achievement.classList.add('hide');
  }, 5000)
};

var showAchievements = function(data) {
  var achievements = document.querySelectorAll('.achievement');
  achievements.forEach(function(element) {
    setTimeout(function() {
      showAchievement(element, data);
    }, 3000)
  });
};
