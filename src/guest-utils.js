var _ = require('lodash');
var utils = require('./utils');

var GuestManager = function(config) {
  var options = config || {};
  this._guests = [];
  this._defaults = options.defaults || {
    file: 'data/guests.json',
    topics: ['guest']
  };
  this._websocket = options.websocket;
};

GuestManager.prototype.load = function(path) {
  var newEvents = utils.readJsonFile(path || this._defaults.file);
  this._guests = newEvents;
};

// TODO: timestamp revisions
GuestManager.prototype.save = function(path) {
  utils.writeJsonFile(path || this._defaults.file, this._guests);
}

GuestManager.prototype.log = function(args) {
  var event = this.find(args.id);
  if (!event) {
    event = {
      id: utils.slugify(args.name || args.id),
      name: args.name || '',
      twitter: args.twitter || '',
      website: args.website || ''
    }
    this._guests.push(event);
  }

  this.emit({data: event});
}

GuestManager.prototype.find = function (id) {
  return _.find(this._guests, {id: id});
}

GuestManager.prototype.autocomplete = function() {
  return _.map(this._guests, 'id');
}

GuestManager.prototype.emit = function(event) {
  var mergedEvent = Object.assign({
    type: 'data',
    topics: this._defaults.topics
  }, event);
  var wsEvent = JSON.stringify(mergedEvent);
  return this._websocket.send(wsEvent);
}

module.exports = GuestManager;
