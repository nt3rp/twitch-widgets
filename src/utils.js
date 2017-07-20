var fs = require('fs');

var readJsonFile = function(path) {
  var data = fs.readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(data);
};

var writeJsonFile = function(path, data) {
  var prettyData = JSON.stringify(data, null, 2)
  fs.writeFileSync(path, prettyData);
}

module.exports = {
  readJsonFile: readJsonFile,
  writeJsonFile: writeJsonFile,
};
