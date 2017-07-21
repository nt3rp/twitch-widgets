var _ = require('lodash');
var utils = require('./utils');

var EventManager = function(config) {
  var options = config || {};
  this._events = [];
  this._defaults = options.defaults || {
    file: 'data/events.json',
    topics: ['party']
  };
  this._websocket = options.websocket;
};

EventManager.prototype.load = function(path) {
  var newEvents = utils.readJsonFile(path || this._defaults.file);
  this._events = newEvents;
};

// TODO: timestamp revisions
EventManager.prototype.save = function() {
  utils.writeJsonFile(args.filepath || defaults.file, this._party);
}

EventManager.prototype.log = function(args) {
  var prevEvent = this.find(args.id);
  if (prevEvent) {
    this.emit(prevEvent);
    return;
  }

  var newEvent = {
    id: utils.slugify(args.name),
    name: args.name || '',
    description: args.name || '',
    tags: (args.tags || '').split(' ') || []
  }
  this._events.push(newEvent);
  this.emit(newEvent);
}

EventManager.prototype.find = function (id) {
  return _.find(this._events, {id: id});
}

EventManager.prototype.autocomplete = function() {
  return _.map(this._events, 'id');
}

// TODO: Add timestamp
EventManager.prototype.emit = function(event) {
  return this._websocket.send(JSON.stringify({
    type: 'event',
    topics: this._defaults.topics,
    data: event
  }));
}

module.exports = EventManager;
