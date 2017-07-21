var fs = require('fs');

var readJsonFile = function(path) {
  var data = fs.readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(data);
};

var writeJsonFile = function(path, data) {
  var prettyData = JSON.stringify(data, null, 2)
  fs.writeFileSync(path, prettyData);
}

// https://github.com/helion3/lodash-addons/blob/master/src/lodash-addons.js#L803
var slugify = function (string) {
  return string.toString().trim().toLowerCase().replace(/ /g, '-').replace(/([^a-zA-Z0-9\._-]+)/, '');
}

module.exports = {
  readJsonFile: readJsonFile,
  writeJsonFile: writeJsonFile,
  slugify: slugify
};
